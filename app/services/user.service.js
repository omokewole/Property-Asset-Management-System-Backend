import ErrorWithStatus from "../exceptions/errorWithStatus.js";
import { generateJWT } from "../utils/generateToken.js";
import UserModel from "../models/user.model.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import NotificationModel from "../models/notification.model.js";
import SettingModel from "../models/settings.model.js";
import PropertyModel from "../models/property.model.js";
import TenantModel from "../models/tenant.model.js";
import MaintenanceModel from "../models/maintenance.model.js";
import cloudinary from "../configs/cloudinary.js";

export async function createUser(newUser) {
	try {
		const userExist = await UserModel.findOne({ email: newUser.email });

		if (userExist) {
			throw new ErrorWithStatus("user with email exist", 400);
		}

		newUser.password = await bcrypt.hash(newUser.password, 10);
		newUser.email_token = crypto.randomBytes(64).toString("hex");
		newUser.email_token_expires = new Date(Date.now() + 10 * 60 * 1000);

		const user = new UserModel(newUser);
		const savedUser = await user.save();

		const userObj = savedUser.toObject();

		const defaultSettings = await new SettingModel({ user_id: userObj._id });

		await defaultSettings.save();

		delete userObj.__v;
		delete userObj.password;
		delete userObj.email_token_expires;

		return {
			user: userObj,
		};
	} catch (error) {
		throw new ErrorWithStatus(error.message, error.status || 500);
	}
}

export async function loginUser(user) {
	try {
		const userData = await UserModel.findOne({ email: user.email }).populate(
			"current_support_session"
		);

		if (!userData) {
			throw new ErrorWithStatus("Incorrect email or password", 401);
		}

		if (!userData.verified_at) {
			throw new ErrorWithStatus("Kindly verify your email", 400);
		}

		const passwordMatch = await bcrypt.compare(
			user.password,
			userData.password
		);

		if (!passwordMatch) {
			throw new ErrorWithStatus("Incorrect email or password", 401);
		}

		const { accessToken, refreshToken } = generateJWT(userData);

		const stats = await userStats(userData._id);

		const userObj = userData.toObject();

		const userSettings = await SettingModel.find({ user_id: userObj._id });

		delete userObj.password;
		delete userObj.__v;
		delete userObj.email_token;
		delete userObj.email_token_expires;

		userObj.settinga = userSettings;

		return {
			access_token: accessToken,
			refresh_token: refreshToken,
			user: userObj,
			stats,
		};
	} catch (error) {
		throw new ErrorWithStatus(error.message, error.status || 500);
	}
}

export async function user(id) {
	try {
		const userData = await UserModel.findById(id).populate(
			"current_support_session"
		);

		if (!userData) {
			throw new ErrorWithStatus("User not found", 404);
		}

		const userObj = userData.toObject();

		const stats = await userStats(userData._id);

		const unreadNotificationsCount = await NotificationModel.countDocuments({
			user_id: userObj._id,
			is_read: false,
		});

		const userSettings = await SettingModel.findOne({ user_id: userObj._id });

		delete userObj.__v;
		delete userObj.password;
		delete userObj.email_token;
		delete userObj.email_token_expires;

		userObj.settings = userSettings;
		userObj.unread_notifications = unreadNotificationsCount > 0;

		return { user: userObj, stats };
	} catch (error) {
		console.log(error);
		throw new ErrorWithStatus(error.message, error.status || 500);
	}
}

export async function verifyUserEmail(emailToken) {
	try {
		const user = await UserModel.findOne({ email_token: emailToken });

		if (!user) {
			throw new ErrorWithStatus("Invalid  token", 400);
		}

		if (user.email_token_expires < Date.now()) {
			throw new ErrorWithStatus(`Token has expired for: ${user.email}`, 400);
		}

		user.verified_at = new Date();
		user.email_token = null;
		user.email_token_expires = null;

		const userObj = await user.save();

		const stats = await userStats(userObj._id);

		const userSettings = await SettingModel.find({ user_id: userObj._id });

		const { accessToken, refreshToken } = generateJWT(user);

		delete userObj.password;
		delete userObj.__v;
		delete userObj.email_token;
		delete userObj.email_token_expires;

		userObj.settings = userSettings;

		return {
			access_token: accessToken,
			refresh_token: refreshToken,
			user: userObj,
			stats,
		};
	} catch (error) {
		throw new ErrorWithStatus(error.message, error.status || 500);
	}
}

export async function updateUser(userInfo, userId) {
	try {
		const user = await UserModel.findById(userId);

		if (!user) {
			throw new ErrorWithStatus("User not found", 404);
		}

		if (userInfo.email && userInfo.email !== user.email) {
			const existingUser = await UserModel.findOne({ email: userInfo.email });

			if (existingUser) {
				throw new ErrorWithStatus("Email already exists", 400);
			}
		}

		const updatedUser = await UserModel.findOneAndUpdate(
			{ _id: userId },
			userInfo,
			{ new: true }
		);

		return updatedUser;
	} catch (error) {
		throw new ErrorWithStatus(error.message, error.status || 500);
	}
}

export async function changePassword({ currentPassword, newPassword, userId }) {
	try {
		const user = await UserModel.findById(userId);

		if (!user) {
			throw new ErrorWithStatus("User not found", 404);
		}

		const isTheSamePassword = await bcrypt.compare(newPassword, user.password);

		if (isTheSamePassword) {
			throw new ErrorWithStatus(
				"Please use difference password from your current password"
			);
		}

		const isPasswordCorrect = await bcrypt.compare(
			currentPassword,
			user.password
		);

		if (!isPasswordCorrect) {
			throw new ErrorWithStatus("Current password is incorrect", 401);
		}

		const newHashedPassword = await bcrypt.hash(newPassword, 10);

		user.password = newHashedPassword;

		await user.save();

		return user;
	} catch (error) {
		throw new ErrorWithStatus(
			error.message || "An error occured",
			error.status || 500
		);
	}
}

export async function updatedSettings({ key, value, userId }) {
	try {
		const user = await UserModel.findById(userId);

		if (!user) {
			throw new ErrorWithStatus("User not found", 404);
		}
		const settings = await SettingModel.findOneAndUpdate(
			{
				user_id: userId,
			},
			{ [key]: value },
			{ new: true, runValidators: true }
		);

		if (!settings) {
			throw new Error(`Settings for user ID ${userId} not found.`);
		}

		return { [key]: settings[key] };
	} catch (error) {
		throw new ErrorWithStatus(
			error.message || "An error occured",
			error.status || 500
		);
	}
}

export default async function userStats(id) {
	try {
		const [
			tenantCount,
			propertyCount,
			maintenanceCount,
			overdueMaintenance,
			completedMaintenance,
			scheduleMaintenance,
			totalUnitsResult,
			totalMaintenanceCost,
		] = await Promise.all([
			TenantModel.countDocuments({ owner_id: id }),
			PropertyModel.countDocuments({ owner_id: id }),
			MaintenanceModel.countDocuments({ owner_id: id }),
			MaintenanceModel.countDocuments({ owner_id: id, status: "overdue" }),
			MaintenanceModel.countDocuments({ owner_id: id, status: "completed" }),
			MaintenanceModel.countDocuments({ owner_id: id, status: "schedule" }),
			PropertyModel.aggregate([
				{ $match: { owner_id: id } },
				{ $group: { _id: null, totalUnits: { $sum: "$unit_number" } } },
			]),
			MaintenanceModel.aggregate([
				{ $match: { owner_id: id } },
				{
					$group: {
						_id: null,
						totalMaintenanceCost: { $sum: "$maintenance_fee" },
					},
				},
			]),
		]);

		const totalUnits = totalUnitsResult[0]?.totalUnits || 0;
		const empty_units = totalUnits - tenantCount;
		const total_maintenance_cost =
			totalMaintenanceCost[0]?.totalMaintenanceCost || 0;

		const occupancyRate = `${(totalUnits > 0
			? (tenantCount / totalUnits) * 100
			: 0
		).toFixed(1)}%`;

		const stats = {
			total_tenants: tenantCount,
			total_properties: propertyCount,
			occupied_units: tenantCount,
			total_maintenance: maintenanceCount,
			overdue_maintenance: overdueMaintenance,
			completed_maintenance: completedMaintenance,
			schedule_maintenance: scheduleMaintenance,
			total_maintenance_cost,
			empty_units,
			occupancy_rate: occupancyRate,
		};

		return stats;
	} catch (error) {
		throw new ErrorWithStatus(
			error.message || "An error occured",
			error.status || 500
		);
	}
}

export async function userPropertyPerformanceReport(userId) {
	try {
		const allProperties = await PropertyModel.find({ owner_id: userId });

		const colors = ["#3498db", "#f1c40f", "#2ecc71", "#e74c3c"];
		const defaultColor = "#ccc";

		const reports = await Promise.all(
			allProperties.map(async (property) => {
				const tenants = await TenantModel.find({
					assigned_property: property._id,
				});

				const propertyRentPaid = tenants.reduce(
					(sum, tenant) => sum + tenant.rent_paid,
					0
				);

				return {
					label: property.title,
					value: propertyRentPaid,
					color: "",
				};
			})
		);

		const totalRentPaid = reports.reduce(
			(sum, report) => sum + report.value,
			0
		);

		if (totalRentPaid === 0) {
			return reports.map((report, index) => ({
				...report,
				percentage: "0.0",
				color: colors[index] || defaultColor,
			}));
		}

		const sortedReports = reports.sort((a, b) => b.value - a.value);
		const top5 = sortedReports.slice(0, 4);
		const others = sortedReports.slice(4);

		if (others.length > 0) {
			const othersValue = others.reduce((sum, item) => sum + item.value, 0);
			const othersPercentage = ((othersValue / totalRentPaid) * 100).toFixed(1);

			top5.push({
				label: "Others",
				value: othersValue,
				percentage: othersPercentage,
			});
		}

		return top5.map((item, index) => {
			const percentage = ((item.value / totalRentPaid) * 100).toFixed(1);
			return {
				...item,
				percentage,
				color: colors[index] || defaultColor,
			};
		});
	} catch (error) {
		throw new ErrorWithStatus(
			error.message || "An error occurred",
			error.status || 500
		);
	}
}

export async function resendVerificationEmail(email) {
	console.log(email);
	try {
		const user = await UserModel.findOne({ email });

		if (!user) {
			throw new ErrorWithStatus("User not found", 404);
		}

		if (user.verified_at) {
			throw new ErrorWithStatus("User is verified", 400);
		}

		const newToken = crypto.randomBytes(64).toString("hex");

		user.email_token = newToken;
		user.email_token_expires = new Date(Date.now() + 10 * 60 * 1000);

		await user.save();

		return user;
	} catch (error) {
		console.log(error);
		throw new ErrorWithStatus(
			error.message || "An error occurred",
			error.status || 500
		);
	}
}

export async function updateUserImage(image, user_id) {
	try {
		const user = await UserModel.findById(user_id);

		if (!user) {
			throw new ErrorWithStatus("User not found", 404);
		}

		if (user.image && user.image?.public_id !== image.public_id) {
			await cloudinary.uploader.destroy(user.image.public_id);
		}

		user.image = image;

		await user.save();

		const populatedUser = user.populate("current_support_session");

		return populatedUser;
	} catch (error) {
		throw new ErrorWithStatus(
			error.message || "An error occurred",
			error.status || 500
		);
	}
}

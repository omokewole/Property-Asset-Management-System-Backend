import ErrorWithStatus from "../exceptions/errorWithStatus.js";
import { generateJWT } from "../utils/generateToken.js";
import UserModel from "../models/user.model.js";
import generateStats from "../utils/getStats.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import NotificationModel from "../models/notification.model.js";
import SettingModel from "../models/settings.model.js";

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

		const { accessToken, refreshToken } = generateJWT(user);

		const userObj = savedUser.toObject();

		const defaultSettings = await new SettingModel({ user_id: userObj._id });

		await defaultSettings.save();

		delete userObj.__v;
		delete userObj.password;
		delete userObj.email_token_expires;

		const stats = await generateStats(userObj._id);

		userObj.settinga = defaultSettings;

		return {
			access_token: accessToken,
			refresh_token: refreshToken,
			stats,
			user: userObj,
		};
	} catch (error) {
		throw new ErrorWithStatus(error.message, error.status || 500);
	}
}

export async function loginUser(user) {
	try {
		const userData = await UserModel.findOne({ email: user.email });

		if (!userData) {
			throw new ErrorWithStatus("Incorrect email or password", 401);
		}

		const passwordMatch = await bcrypt.compare(
			user.password,
			userData.password
		);

		if (!passwordMatch) {
			throw new ErrorWithStatus("Incorrect email or password", 401);
		}

		const { accessToken, refreshToken } = generateJWT(userData);

		const stats = await generateStats(userData._id);

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
		const userData = await UserModel.findById(id);

		if (!userData) {
			throw new ErrorWithStatus("User not found", 404);
		}

		const userObj = userData.toObject();

		const stats = await generateStats(userData._id);

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
			throw new ErrorWithStatus("Invalid or expired token", 400);
		}

		if (user.email_token_expires < Date.now()) {
			throw new ErrorWithStatus("Token has expired", 400);
		}

		user.verified_at = new Date();
		user.email_token = null;
		user.email_token_expires = null;

		const userObj = await user.save();
		const { accessToken, refreshToken } = generateJWT(user);

		delete userObj.password;
		delete userObj.__v;
		delete userObj.email_token;
		delete userObj.email_token_expires;

		return { accessToken, refreshToken, user };
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

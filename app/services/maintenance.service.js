import MaintenanceModel from "../models/maintenance.model.js";
import ErrorWithStatus from "../exceptions/errorWithStatus.js";
import { addNotificationHandler } from "../controllers/notification.controller.js";
import { generateMaintenanceAddedEmail } from "../helper/htmlTemplate/newMaintenance.js";

export async function createMaintenance(newMaintenanceData) {
	try {
		const newMaintenance = new MaintenanceModel(newMaintenanceData);

		const populatedMaintenance = await newMaintenance.populate([
			{ path: "property" },
			{ path: "owner_id" },
		]);

		const html = generateMaintenanceAddedEmail(populatedMaintenance);

		const notificationSent = await addNotificationHandler({
			user_id: newMaintenanceData.owner_id,
			title: "New Maintenance Request Created",
			content: `A new maintenance request has been submitted for ${newMaintenance.property.title} regarding ${newMaintenance.facility}`,
			path: "maintenances",
			ref: newMaintenance._id,
			html,
		});

		if (!notificationSent) {
			throw new ErrorWithStatus(
				"An error occured when sending notification",
				400
			);
		}

		await newMaintenance.save();

		return populatedMaintenance;
	} catch (error) {
		throw new ErrorWithStatus(
			error.message || "An error occured",
			error.status || 500
		);
	}
}

export async function updateMaintenance(updatedMaintenanceData, maintenanceId) {
	try {
		const maintenanceInfo = await MaintenanceModel.findById(maintenanceId);

		if (!maintenanceInfo) {
			throw new ErrorWithStatus("Maintenance not found!", 404);
		}

		Object.assign(maintenanceInfo, updatedMaintenanceData);

		const updatedMaintenance = await maintenanceInfo.save();

		return updatedMaintenance;
	} catch (error) {
		throw new ErrorWithStatus(
			error.message || "An error occured",
			error.status || 500
		);
	}
}

export async function allMaintenances({
	owner_id,
	page = 1,
	limit = 5,
	order = "",
	sortBy = "createdAt",
	search = "",
}) {
	try {
		const filter = { owner_id };

		const sortOption = {};

		const skip = (page - 1) * limit;

		if (search) {
			filter.facility = { $regex: search, $options: "i" };
		}

		if (order && sortBy) {
			sortOption[sortBy] = order === "ascending" ? 1 : -1;
		}

		const maintenances = await MaintenanceModel.find(filter)
			.sort(sortOption)
			.skip(skip)
			.limit(limit)
			.populate("property");
		const total_items = await MaintenanceModel.countDocuments(filter);

		return {
			meta: {
				current_page: Number(page),
				total_page: Math.ceil(total_items / limit),
				total_items,
			},
			maintenances,
		};
	} catch (error) {
		throw new ErrorWithStatus(
			error.message || "An error occured",
			error.status || 500
		);
	}
}

export async function singleMaintenance(maintenanceId) {
	try {
		const maintenance = await MaintenanceModel.findById(maintenanceId);

		if (!maintenance) {
			throw new ErrorWithStatus("Maintenance not found", 404);
		}

		return maintenance;
	} catch (error) {
		throw new ErrorWithStatus(
			error.message || "An error occured",
			error.status || 500
		);
	}
}

export async function deleteMaintenance(maintenanceId) {
	try {
		const maintenance = await MaintenanceModel.findByIdAndDelete(maintenanceId);

		if (!maintenance) {
			throw new ErrorWithStatus("Maintenance not found", 404);
		}

		return maintenance;
	} catch (error) {
		throw new ErrorWithStatus(
			error.message || "An error occured",
			error.status || 500
		);
	}
}

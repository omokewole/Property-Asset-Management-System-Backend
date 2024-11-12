import MaintenanceModel from "../models/maintenance.model.js";
import ErrorWithStatus from "../exceptions/errorWithStatus.js";

export async function createMaintenance(newMaintenanceData) {
	try {
		const newMaintenance = new MaintenanceModel(newMaintenanceData);

		const maintenance_fee_str = newMaintenanceData.maintenance_fee;

		if (maintenance_fee_str && typeof maintenance_fee_str === "string") {
			const maintenance_fee = maintenance_fee_str.replace(/,/g, "");

			const feeValue = Number(maintenance_fee);

			if (isNaN(feeValue)) {
				throw new Error("Invalid maintenance fee value");
			}

			newMaintenance.maintenance_fee = feeValue;
		} else {
			throw new Error("Maintenance fee is required");
		}

		const savedMaintenance = await newMaintenance.save();

		return savedMaintenance;
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

		const maintenance_fee_str = updatedMaintenanceData.maintenance_fee;

		if (maintenance_fee_str && typeof maintenance_fee_str === "string") {
			const maintenance_fee = maintenance_fee_str.replace(/,/g, "");

			const feeValue = Number(maintenance_fee);

			if (isNaN(feeValue)) {
				throw new Error("Invalid maintenance fee value");
			}

			updatedMaintenanceData.maintenance_fee = feeValue;
		} else {
			throw new Error("Maintenance fee is required");
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
}) {
	try {
		const filter = { owner_id };

		const sortOption = {};

		const skip = (page - 1) * limit;

		if (order && sortBy) {
			sortOption[sortBy] = order === "ascending" ? 1 : -1;
		}

		const maintenances = await MaintenanceModel.find(filter)
			.sort(sortOption)
			.skip(skip)
			.limit(limit);
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

import ErrorWithStatus from "../exceptions/errorWithStatus.js";
import MaintenanceModel from "../models/maintenance.model.js";
import PropertyModel from "../models/property.model.js";
import TenantModel from "../models/tenant.model.js";

export default async function generateStats(id) {
	try {
		const [
			tenantCount,
			propertyCount,
			maintenanceCount,
			overdueMaintenance,
			completedMaintenance,
			scheduleMaintenance,
			totalUnitsResult,
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
		]);

		const totalUnits = totalUnitsResult[0]?.totalUnits || 0;
		const empty_units = totalUnits - tenantCount;

		const stats = {
			total_tenants: tenantCount,
			total_properties: propertyCount,
			occupied_units: tenantCount,
			total_maintenance: maintenanceCount,
			overdue_maintenance: overdueMaintenance,
			completed_maintenance: completedMaintenance,
			schedule_maintenance: scheduleMaintenance,
			empty_units,
		};

		return stats;
	} catch (error) {
		throw new ErrorWithStatus(
			error.message || "An error occured",
			error.status || 500
		);
	}
}

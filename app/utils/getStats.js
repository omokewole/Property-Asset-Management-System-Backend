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

		const occupancyRate = `${
			totalUnits > 0 ? (tenantCount / totalUnits).toFixed(4) * 100 : 0
		}%`;

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
		console.log(error);
		throw new ErrorWithStatus(
			error.message || "An error occured",
			error.status || 500
		);
	}
}

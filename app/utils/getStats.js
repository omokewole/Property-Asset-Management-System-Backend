import PropertyModel from "../models/property.model.js";
import TenantModel from "../models/tenant.model.js";

export default async function generateStats(id) {
  const [tenantCount, propertyCount, totalUnitsResult, occupiedUnitsResult] =
    await Promise.all([
      TenantModel.countDocuments({ owner_id: id }),
      PropertyModel.countDocuments({ owner_id: id }),
      PropertyModel.aggregate([
        { $match: { userId: id } },
        { $group: { _id: null, totalUnits: { $sum: "$unit_number" } } },
      ]),
      TenantModel.aggregate([
        { $match: { ownerId: id } },
        { $group: { _id: null, occupiedUnit: { $sum: "$unit_number" } } },
      ]),
    ]);

  const totalUnits = totalUnitsResult[0]?.totalUnits || 0;
  const occupied_units = occupiedUnitsResult[0]?.occupiedUnits || 0;
  const empty_units = totalUnits - occupied_units;

  const stats = {
    total_tenants: tenantCount,
    total_properties: propertyCount,
    occupied_units,
    empty_units,
  };

  return stats;
}

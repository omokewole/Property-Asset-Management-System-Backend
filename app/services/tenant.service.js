import TenantModel from "../models/tenant.model.js";
import ErrorWithStatus from "../exceptions/errorWithStatus.js";
import PropertyModel from "../models/property.model.js";
import { addNotificationHandler } from "../controllers/notification.controller.js";
import { generateTenantAddedEmail } from "../helper/htmlTemplate/newTenant.js";

export async function addTenant(newTenantData) {
	try {
		const [property, occupiedProperty] = await Promise.all([
			PropertyModel.findById(newTenantData.assigned_property),
			TenantModel.findOne({
				assigned_property: newTenantData.assigned_property,
				assigned_unit: newTenantData.assigned_unit,
			}),
		]);

		if (!property) {
			throw new ErrorWithStatus("Property not found", 404);
		}

		if (occupiedProperty) {
			throw new ErrorWithStatus(
				"Tenant already assigned to this property and unit",
				400
			);
		}

		if (
			Number(newTenantData.assigned_unit) < 1 ||
			Number(newTenantData.assigned_unit) > Number(property.unit_number)
		) {
			throw new ErrorWithStatus(
				`Assigned unit must be between 1 and ${property.unit_number}`,
				400
			);
		}

		const newTenant = new TenantModel(newTenantData);

		const newTenantObj = await newTenant.populate("assigned_property");

		const html = generateTenantAddedEmail(newTenant);

		const notificationSent = await addNotificationHandler({
			user_id: newTenantData.owner_id,
			title: "New Tenant Added",
			content: `${newTenantData.name} has been added to Unit ${newTenantData.assigned_unit} in ${newTenantObj.assigned_property.title}`,
			is_read: false,
			path: "tenants",
			ref: newTenant._id,
			html,
		});

		if (!notificationSent) {
			throw new ErrorWithStatus(
				`Error occured sending notification ${property.unit_number}`,
				400
			);
		}

		await newTenant.save();

		return newTenantObj;
	} catch (error) {
		console.log(error);
		throw new ErrorWithStatus(
			error.message || "An error occured",
			error.status || 500
		);
	}
}

export async function allTenants({
	owner_id,
	property_id,
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
			filter.name = { $regex: search, $options: "i" };
		}

		if (property_id) {
			filter.assigned_property = property_id;
		}

		if (order && sortBy) {
			sortOption[sortBy] = order === "ascending" ? 1 : -1;
		}

		const tenants = await TenantModel.find(filter)
			.sort(sortOption)
			.skip(skip)
			.limit(limit)
			.populate("assigned_property");

		const total_items = await TenantModel.countDocuments(filter);

		const tenantsWithPaymentStatus = tenants.map((tenant) => {
			let status;

			if (tenant.balance > 0 && tenant.end_date <= new Date()) {
				status = "overdue";
			} else if (tenant.balance > 0) {
				status = "pending";
			} else {
				status = "completed";
			}
			return { ...tenant.toObject(), status };
		});

		return {
			meta: {
				current_page: Number(page),
				total_page: Math.ceil(total_items / limit),
				total_items,
			},
			tenants: tenantsWithPaymentStatus,
		};
	} catch (error) {
		throw new ErrorWithStatus(
			error.message || "An error occured",
			error.status || 500
		);
	}
}

export async function editTenant(updatedTenantData, tenantId) {
	try {
		const tenant = await TenantModel.findById(tenantId);

		if (!tenant) {
			throw new ErrorWithStatus("Tenant not found", 404);
		}

		const isPropertyOrUnitChanged =
			tenant.assigned_property.toString() !==
				updatedTenantData.assigned_property ||
			tenant.assigned_unit !== updatedTenantData.assigned_unit;

		if (isPropertyOrUnitChanged) {
			const occupiedProperty = await TenantModel.findOne({
				assigned_property: updatedTenantData.assigned_property,
				assigned_unit: updatedTenantData.assigned_unit,
				_id: { $ne: tenantId },
			});

			const property = await PropertyModel.findById(
				updatedTenantData.assigned_property
			);
			if (!property) {
				throw new ErrorWithStatus("Assigned property not found", 404);
			}

			if (
				Number(updatedTenantData.assigned_unit) < 1 ||
				Number(updatedTenantData.assigned_unit) > Number(property.unit_number)
			) {
				throw new ErrorWithStatus(
					`Assigned unit must be between 1 and ${property.unit_number}`,
					400
				);
			}

			if (occupiedProperty) {
				throw new ErrorWithStatus(
					"This unit in the selected property is already occupied by another tenant",
					400
				);
			}
		}

		Object.assign(tenant, updatedTenantData);

		const editedTenant = await tenant.save();

		return editedTenant;
	} catch (error) {
		throw new ErrorWithStatus(
			error.message || "An error occured",
			error.status || 500
		);
	}
}

export async function singleTenant(tenantId) {
	try {
		const tenant = await TenantModel.findById(tenantId).populate(
			"assigned_property"
		);

		if (!tenant) {
			throw new ErrorWithStatus("Tenant not found", 404);
		}

		return tenant;
	} catch (error) {
		throw new ErrorWithStatus(
			error.message || "An error occured",
			error.status || 500
		);
	}
}

export async function deleteTenant(tenantId) {
	try {
		const tenant = await TenantModel.findByIdAndDelete(tenantId);

		if (!tenant) {
			throw new ErrorWithStatus("Tenant not found", 404);
		}

		return tenant;
	} catch (error) {
		throw new ErrorWithStatus(
			error.message || "An error occured",
			error.status || 500
		);
	}
}

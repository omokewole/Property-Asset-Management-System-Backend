import {
	addTenant,
	allTenants,
	editTenant,
	singleTenant,
	deleteTenant,
} from "../services/tenant.service.js";
import { responseModel } from "../utils/responseModel.js";
import { addNotificationHandler } from "./notification.controller.js";

export async function handleAddTenant(req, res) {
	try {
		const newTenantData = req.body;
		const owner_id = req.user._id;

		const newTenant = await addTenant({ ...newTenantData, owner_id });

		await addNotificationHandler({
			user_id: owner_id,
			title: "New Tenant Added",
			content: `${newTenant.name} has been added to Unit ${newTenant.assigned_unit} in ${newTenant.assigned_property.title}`,
			is_read: false,
			path: "tenants",
			ref: newTenant._id,
		});

		res
			.status(201)
			.json(responseModel(true, "Tenant added successfully", newTenant));
	} catch (error) {
		console.log(error)
		res
			.status(error.status || 500)
			.json(responseModel(false, error.message || "An error occured"));
	}
}

export async function handleAllTenant(req, res) {
	try {
		const owner_id = req.user._id;
		const { property_id, page, limit, order, sortBy } = req.query;

		const tenants = await allTenants({
			owner_id,
			property_id,
			page,
			limit,
			order,
			sortBy,
		});

		res
			.status(200)
			.json(responseModel(true, "Tenants fetched successfully", tenants));
	} catch (error) {
		res
			.status(error.status || 500)
			.json(responseModel(false, error.message || "An error occured"));
	}
}

export async function handleEditTenant(req, res) {
	try {
		const tenantId = req.params.tenant_id;
		const updatedTenantData = req.body;

		const updatedTenant = await editTenant(updatedTenantData, tenantId);

		return res
			.status(200)
			.json(responseModel(true, "Tenant updated successfully", updatedTenant));
	} catch (error) {
		res
			.status(error.status || 500)
			.json(responseModel(false, error.message || "An error occured"));
	}
}

export async function handleSingleTenant(req, res) {
	try {
		const tenantId = req.params.tenant_id;

		const tenant = await singleTenant(tenantId);

		res
			.status(200)
			.json(responseModel(true, "Tenant fetched successfully", tenant));
	} catch (error) {
		res
			.status(error.status || 500)
			.json(responseModel(false, error.message || "An error occured"));
	}
}

export async function handleDeleteTenant(req, res) {
	try {
		const tenandId = req.params.tenant_id;

		const result = await deleteTenant(tenandId);

		res
			.status(200)
			.json(responseModel(true, "Tenant deleted successfully", result));
	} catch (error) {
		res
			.status(error.status || 500)
			.json(responseModel(false, error.message || "An error occured"));
	}
}
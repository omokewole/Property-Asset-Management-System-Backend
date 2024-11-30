import {
	addProperty,
	allProperties,
	editProperty,
	deleteProperty,
	singleProperty,
	deletePropertyImage,
} from "../services/property.service.js";
import { responseModel } from "../utils/responseModel.js";
import cloudinary from "../configs/cloudinary.js";

export async function handleAddProperty(req, res) {
	const propertyData = req.body;
	const owner_id = req.user._id;

	try {
		const result = await addProperty({
			...propertyData,
			owner_id,
		});

		return res
			.status(201)
			.json(responseModel(true, "New property added suucessfully", result));
	} catch (error) {
		return res
			.status(error.status || 500)
			.json(
				responseModel(
					false,
					error.message || "An error occured. please try again!"
				)
			);
	}
}

export async function handleAllProperty(req, res) {
	const owner_id = req.user._id;
	const { page, limit, search } = req.query;
	try {
		const result = await allProperties({ owner_id, page, limit, search });

		return res
			.status(200)
			.json(responseModel(true, "User properties retrieved", result));
	} catch (error) {
		return res
			.status(error.status || 500)
			.json(
				responseModel(
					false,
					error.message || "An error occured. please try again!"
				)
			);
	}
}

export async function handleSingleProperty(req, res) {
	const { propertyId } = req.params;

	try {
		const result = await singleProperty(propertyId);

		return res
			.status(200)
			.json(
				responseModel(true, "Single Property retrieved successfully", result)
			);
	} catch (error) {
		return res
			.status(error.status || 500)
			.json(
				responseModel(
					false,
					error.message || "An error occured. please try again!"
				)
			);
	}
}

export async function handleEditProperty(req, res) {
	const { propertyId } = req.params;
	const propertyData = req.body;

	try {
		const result = await editProperty(propertyId, propertyData);

		return res
			.status(200)
			.json(responseModel(true, "Property updated successfully", result));
	} catch (error) {
		return res
			.status(error.status || 500)
			.json(
				responseModel(
					false,
					error.message || "An error occured. please try again!"
				)
			);
	}
}

export async function handleDeleteProperty(req, res) {
	const { propertyId } = req.params;

	try {
		await deleteProperty(propertyId);

		return res
			.status(203)
			.json(responseModel(true, "Property Deleted successfully"));
	} catch (error) {
		return res
			.status(error.status || 500)
			.json(
				responseModel(
					false,
					error.message || "An error occured. please try again!"
				)
			);
	}
}

export async function handleDeletePropertyImage(req, res) {
	try {
		const { publicId } = req.params;
		const { propertyId } = req.query;
		// const user_id = req.user._id;

		if (!publicId) {
			return res
				.status(400)
				.json(responseModel(false, "Public id params is required"));
		}

		if (!propertyId) {
			const cloudinaryResp = await cloudinary.uploader.destroy(publicId);

			return res
				.status(200)
				.json(
					responseModel(true, "image deleted successfully", cloudinaryResp)
				);
		}

		const result = await deletePropertyImage(publicId, propertyId);

		return res
			.status(200)
			.json(responseModel(true, "image deleted successfully", result));
	} catch (error) {
		return res
			.status(error.status || 500)
			.json(
				responseModel(
					false,
					error.message || "An error occured. please try again!"
				)
			);
	}
}

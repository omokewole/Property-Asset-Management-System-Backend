import PropertyModel from "../models/property.model.js";
import ErrorWithStatus from "../exceptions/errorWithStatus.js";
import { extractCloudinaryPublicId } from "../utils/extractCloudinaryPublicId.js";
import { addNotification } from "./notification.service.js";

export async function addProperty(propertyData) {
	try {
		const existerProperty = await PropertyModel.findOne({
			title: propertyData.title,
		});

		if (existerProperty) {
			throw new ErrorWithStatus("Property with title exist", 400);
		}

		const newProperty = new PropertyModel(propertyData);

		const propertyObj = await newProperty.save();

		delete propertyObj.__v;

		await addNotification({
			user_id: propertyData.owner_id,
			title: "New Property Added",
			content: `${propertyObj.title} with ${propertyObj.unit_number} units, have been added to your property list`,
			is_read: false,
		});

		return propertyObj;
	} catch (error) {
		throw new ErrorWithStatus(
			error.message || "An error occured",
			error.status || 400
		);
	}
}

export async function allProperties({
	owner_id,
	page = 1,
	limit = 12,
	search = "",
}) {
	try {
		const skip = (page - 1) * limit;

		const filter = {
			owner_id,
		};

		if (search) {
			filter.search = search;
		}

		const properties = await PropertyModel.find(filter).skip(skip).limit(limit);

		const total_items = (await PropertyModel.countDocuments(filter)) || 0;
		const total_page = Math.ceil(total_items / limit) || 0;
		const current_page = page;
		const has_more = current_page < total_page;

		const meta = {
			current_page,
			total_page,
			has_more,
		};

		return { properties, meta };
	} catch (error) {
		throw new ErrorWithStatus(
			error.message || "An error occured",
			error.status || 400
		);
	}
}

export async function singleProperty(propertyId) {
	try {
		const property = await PropertyModel.findById(propertyId);

		if (!property) {
			throw new ErrorWithStatus("Property not found", 404);
		}

		return property;
	} catch (error) {
		console.log(error);
		throw new ErrorWithStatus(
			error.message || "An error occured",
			error.status || 400
		);
	}
}

export async function editProperty(propertyId, propertyData) {
	try {
		const property = await PropertyModel.findById(propertyId);

		if (!property) {
			throw new ErrorWithStatus("Property not found", 404);
		}

		Object.assign(property, propertyData);

		await property.save();

		return property;
	} catch (error) {
		console.log(error);
		throw new ErrorWithStatus(
			error.message || "An error occured",
			error.status || 400
		);
	}
}

export async function deleteProperty(propertyId) {
	try {
		const property = await PropertyModel.findById(propertyId);

		if (!property) {
			throw new ErrorWithStatus("Property not found", 404);
		}

		if (property.images && property.images.length > 0) {
			for (const imageUrl of property.images) {
				const publicId = extractCloudinaryPublicId(imageUrl);
				Â;
				await cloudinary.uploader.destroy(publicId);
			}
		}

		await property.deleteOne({ _id: propertyId });
	} catch (error) {
		throw new ErrorWithStatus(
			error.message || "An error occured",
			error.status || 400
		);
	}
}

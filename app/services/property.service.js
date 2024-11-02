import PropertyModel from "../models/property.model.js";
import ErrorWithStatus from "../exceptions/errorWithStatus.js";
import { extractCloudinaryPublicId } from "../utils/extractCloudinaryPublicId.js";

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

    return propertyObj;
  } catch (error) {
    throw new ErrorWithStatus(
      error.message || "An error occured",
      error.status || 400
    );
  }
}

export async function allProperties(ownerId) {
  try {
    const properties = await PropertyModel.find({ owner_id: ownerId });

    return properties;
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

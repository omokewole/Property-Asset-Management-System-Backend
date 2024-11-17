import PropertyModel from "../models/property.model.js";
import ErrorWithStatus from "../exceptions/errorWithStatus.js";
import { extractCloudinaryPublicId } from "../utils/extractCloudinaryPublicId.js";
import { updateUnitAvailability } from "../utils/getUnits.js";
import TenantModel from "../models/tenant.model.js";
import { addNotificationHandler } from "../controllers/notification.controller.js";

export async function addProperty(propertyData) {
  try {
    const existerProperty = await PropertyModel.findOne({
      title: propertyData.title,
      owner_id: propertyData.owner_id,
    });

    if (existerProperty) {
      throw new ErrorWithStatus("Property with title exist", 400);
    }

    const unit_number_str = propertyData.unit_number;

    if (unit_number_str && typeof unit_number_str === "string") {
      const unitValue = Number(unit_number_str);

      if (isNaN(unitValue)) {
        throw new ErrorWithStatus("Invalid unit number", 400);
      }

      propertyData.unit_number = unitValue;
    }

    const newProperty = new PropertyModel(propertyData);

    const notificationSent = await addNotificationHandler({
      user_id: newProperty.owner_id,
      title: "New Property Added",
      content: `${newProperty.title} with ${newProperty.unit_number} units, have been added to your property list`,
      path: "properties",
      ref: newProperty._id,
    });

    if (!notificationSent) {
      throw new ErrorWithStatus(
        "An error occured when sending notification",
        400
      );
    }

    const savedProperty = await newProperty.save();

    const tenants = await TenantModel.find({ property_id: savedProperty._id });

    const occupied_units = tenants.map((tenant) => tenant.assigned_unit);

    const units = updateUnitAvailability(
      {
        unit_number: savedProperty.unit_number,
        occupied_units,
      },
      null
    );

    const property = {
      ...savedProperty.toObject(),
      avalable_units: units.available_units,
      occupied_units: units.occupied_units,
      all_units: units.all_units,
    };

    return property;
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
      filter.title = { $regex: search, $options: "i" };
    }

    const properties = await PropertyModel.find(filter).skip(skip).limit(limit);

    const total_items = (await PropertyModel.countDocuments(filter)) || 0;
    const total_page = Math.ceil(total_items / limit) || 0;
    const current_page = page;
    const has_more = current_page < total_page;

    const tenants = await TenantModel.find({
      assigned_property: { $in: properties.map((p) => p._id) },
    }).lean();

    const updatedProperties = await Promise.all(
      properties.map(async (property) => {
        const occupiedUnits = tenants
          .filter(
            (tenant) =>
              tenant.assigned_property.toString() === property._id.toString()
          )
          .map((tenant) => tenant.assigned_unit);

        const units = updateUnitAvailability({
          unit_number: property.unit_number,
          occupied_units: occupiedUnits,
        });

        const updatedProp = property.toObject();

        updatedProp.available_units = units.available_units;
        updatedProp.occupied_units = units.occupied_units;
        updatedProp.all_units = units.all_units;

        return updatedProp;
      })
    );

    const meta = {
      current_page,
      total_page,
      has_more,
    };

    return { properties: updatedProperties, meta };
  } catch (error) {
    console.log(error);
    throw new ErrorWithStatus(
      error.message || "An error occured",
      error.status || 400
    );
  }
}

export async function singleProperty(propertyId) {
  try {
    const savedProperty = await PropertyModel.findById(propertyId);

    if (!savedProperty) {
      throw new ErrorWithStatus("Property not found", 404);
    }

    const tenants = await TenantModel.find({
      assigned_property: savedProperty._id,
    });

    const occupied_units = tenants.map((tenant) => tenant.assigned_unit);

    const units = updateUnitAvailability({
      unit_number: savedProperty.unit_number,
      occupied_units,
    });

    const property = {
      ...savedProperty.toObject(),
      available_units: units.available_units,
      occupied_units: units.occupied_units,
      all_units: units.all_units,
    };

    return property;
  } catch (error) {
    console.log("Error fetching single property:", error);
    throw new ErrorWithStatus(
      error.message || "An error occurred while retrieving the property",
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

    const unit_number_str = propertyData.unit_number;

    if (unit_number_str && typeof unit_number_str === "string") {
      const unitValue = Number(unit_number_str);

      if (isNaN(unitValue)) {
        throw new ErrorWithStatus("Invalid unit number", 400);
      }

      propertyData.unit_number = unitValue;
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

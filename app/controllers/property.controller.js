import cloudinary from "../configs/cloudinary.js";
import {
  addProperty,
  allProperties,
  editProperty,
  deleteProperty,
  singleProperty,
} from "../services/property.service.js";
import { responseModel } from "../utils/responseModel.js";
import {
  propertySchema,
  editPropertySchema,
} from "../validations/property.validation.js";
import { promisify } from "util";
import fs from "fs";

const unlinkAsync = promisify(fs.unlink);

export async function handleAddProperty(req, res) {
  const propertyData = req.body;
  const owner_id = req.user._id;

  const validationResult = propertySchema.validate(propertyData);

  if (validationResult.error) {
    return res
      .status(422)
      .json(
        responseModel(
          false,
          "Validation failed",
          validationResult.error.details
        )
      );
  }

  try {
    const images_url = [];

    if (req.files.length >= 4 && req.files.length <= 12) {
      for (const file of req.files) {
        try {
          const uploadResult = await cloudinary.uploader.upload(file.path, {
            folder: "properties",
          });

          images_url.push(uploadResult.secure_url);
        } catch (error) {
          return res
            .status(500)
            .json(
              responseModel(
                false,
                "Image upload failed. Property not saved.",
                error
              )
            );
        } finally {
          await unlinkAsync(file.path);
        }
      }
    }

    const result = await addProperty({
      ...propertyData,
      owner_id,
      images_url,
    });

    res
      .status(201)
      .json(responseModel(true, "New property added suucessfully", result));
  } catch (error) {
    res
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
  try {
    const result = await allProperties(owner_id);

    res
      .status(200)
      .json(responseModel(true, "User properties retrieved", result));
  } catch (error) {
    res
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

    res
      .status(200)
      .json(
        responseModel(true, "Single Property retrieved successfully", result)
      );
  } catch (error) {
    res
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
  const files = req.files;

  const images_url = propertyData.images_uri || [];

  try {
    if (files && files.length > 0 && files.length < 12) {
      for (const file of req.files) {
        try {
          const uploadResult = await cloudinary.uploader.upload(file.path, {
            folder: "properties",
          });

          images_url.push(uploadResult.secure_url);
        } catch (error) {
          return res
            .status(500)
            .json(
              responseModel(
                false,
                "Image upload failed. Property not saved.",
                error
              )
            );
        } finally {
          await unlinkAsync(file.path);
        }
      }
    }

    propertyData.images_url = images_url;

    const result = await editProperty(propertyId, propertyData);

    res
      .status(200)
      .json(responseModel(true, "Property updated successfully", result));
  } catch (error) {
    res
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

    res.status(203).json(responseModel(true, "Property Deleted successfully"));
  } catch (error) {
    res
      .status(error.status || 500)
      .json(
        responseModel(
          false,
          error.message || "An error occured. please try again!"
        )
      );
  }
}

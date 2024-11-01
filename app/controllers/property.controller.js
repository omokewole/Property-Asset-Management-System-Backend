import { addProperty } from "../services/property.service.js";
import { responseModel } from "../utils/responseModel.js";
export async function handleAddProperty(req, res) {
  const propertyData = req.body;
  const owner_id = req.user._id;

  try {
    const result = await addProperty({ ...propertyData, owner_id });

    res
      .status(201)
      .json(responseModel(true, "New property added suucessfully", result));
  } catch (error) {
    console.log(error);
  }
}

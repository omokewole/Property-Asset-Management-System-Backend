import PropertyModel from "../models/property.model.js";
import ErrorWithStatus from "../exceptions/errorWithStatus.js";

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
    console.log(error);
  }
}

import Joi from "joi";

export const propertySchema = Joi.object({
  title: Joi.string().required(),
  street: Joi.string().required(),
  location: Joi.string().required(),
  attraction: Joi.string().empty().allow(""),
  unit_number: Joi.number().required(),
  description: Joi.string().required(),
  property_type: Joi.string().valid("Commercial", "Residential"),
});

export const editPropertySchema = Joi.object({
  title: Joi.string().required(),
  street: Joi.string().required(),
  location: Joi.string().required(),
  attraction: Joi.string().empty().allow(""),
  unit_number: Joi.number().required(),
  description: Joi.string().required(),
  property_type: Joi.string().valid("Commercial", "Residential"),
  images_url: Joi.array().items(Joi.string()).min(4).max(12).required(),
});

import Joi from "joi";

export const propertySchema = Joi.object({
  title: Joi.string().required(),
  street: Joi.string().required(),
  location: Joi.string().required(),
  attraction: Joi.string().optional(),
  unit_number: Joi.number().required(),
  description: Joi.string().required(),
  property_type: Joi.string().valid("Commercial", "Residential"),
  images: Joi.any().required().optional(),
});

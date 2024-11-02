import Joi from "joi";

export const propertySchema = Joi.object({
  title: Joi.string().required(),
  street: Joi.string().required(),
  location: Joi.string().required(),
  attraction: Joi.array().items(Joi.string()),
  unit_number: Joi.number().required(),
  description: Joi.string().required(),
  type: Joi.string().valid("Commercial", "Residential").required(),
  images: Joi.any().required(),
});

import Joi from "joi";

export const tenantValidationSchema = Joi.object({
	name: Joi.string().required(),
	assigned_property: Joi.string().required(),
	assigned_unit: Joi.number().required(),
	phone: Joi.string().required(),
	start_date: Joi.date().required(),
	end_date: Joi.date().required(),
});

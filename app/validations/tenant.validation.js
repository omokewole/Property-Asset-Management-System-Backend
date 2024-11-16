import Joi from "joi";

export const tenantValidationSchema = Joi.object({
	name: Joi.string().required(),
	assigned_property: Joi.string().required(),
	assigned_unit: Joi.number().required(),
	phone: Joi.string()
		.pattern(/^\d{11}$/)
		.required()
		.messages({
			"string.pattern.base": "Enter a valid phone number",
		}),
	start_date: Joi.date().required(),
	end_date: Joi.date().required(),
	rent_paid: Joi.number().required(),
	balance: Joi.number(),
});

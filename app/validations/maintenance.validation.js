import Joi from "joi";

export const maintenanceValidationSchema = Joi.object({
	status: Joi.string()
		.valid("completed", "overdue", "schedule")
		.required()
		.messages({
			"any.only": "Invalid status",
		}),
	facility: Joi.string().required(),
	technician: Joi.string().required(),
	schedule_date: Joi.date().required(),
	maintenance_fee: Joi.string()
		.pattern(/^(\d{1,3})(?:,\d{3})*(\.\d+)?$/, "Valid maintenance fee format")
		.required()
		.messages({
			"string.pattern.base":
				"Maintenance fee must be a valid number with commas and decimals",
		}),
	property: Joi.string().required(),
	unit: Joi.string().required(),
});

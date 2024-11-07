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
	maintenance_fee: Joi.number().required(),
});

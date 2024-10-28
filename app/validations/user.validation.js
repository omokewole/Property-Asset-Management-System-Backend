import Joi from "joi";

export const createUserSchema = Joi.object({
	name: Joi.string().required(),
	email: Joi.string().email().required(),
	company: Joi.string().allow(null).empty(""),
	phone: Joi.string().required(),
	password: Joi.string()
		.min(8)
		.required("password is required")
		.pattern(
			/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\[\]{};':"\\|,.<>?])[A-Za-z\d!@#$%^&*()_+\[\]{};':"\\|,.<>?]{8,}$/,
			"password requirements"
		)
		.messages({
			"string.pattern.base":
				"Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character.",
		}),
});
export const loginUserSchema = Joi.object({
	email: Joi.string().email().required(),
	password: Joi.string().min(8).required(),
});

export const refreshTokenSchema = Joi.object({
	refresh_token: Joi.string().required(),
});

export const verifyUserSchema = Joi.object({
	email_token: Joi.string().required(),
});

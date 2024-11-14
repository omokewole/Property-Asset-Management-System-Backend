import Joi from "joi";

export const createUserSchema = Joi.object({
	name: Joi.string().required(),
	email: Joi.string().email().required(),
	company: Joi.string().allow(null).empty(""),
	phone: Joi.string().allow(null).empty(""),
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

export const updateUserSchema = Joi.object({
	email: Joi.string().email().required(),
	name: Joi.string().required(),
	company: Joi.string().allow(null).empty(""),
	phone: Joi.string().allow(null).empty(""),
	image: Joi.any()
		.custom((value, helper) => {
			if (!value || !value.mimetype) {
				return true;
			}

			const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
			if (!allowedTypes.includes(value.mimetype)) {
				return helper.message("Only jpeg, png, and gif images are allowed");
			}

			if (value.size > 5 * 1024 * 1024) {
				return helper.message("Image size must be less than 5MB");
			}

			return value;
		})
		.optional(),
});

export const changePasswordSchema = Joi.object({
	new_password: Joi.string().required(),
	current_password: Joi.string().required(),
});

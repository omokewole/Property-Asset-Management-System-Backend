import Joi from "joi";
import { phoneValidation } from "../utils/validatePhone.js";

export const createUserSchema = Joi.object({
	name: Joi.string().required(),
	email: Joi.string().email().required(),
	company: Joi.string().allow(null).empty(""),
	phone: Joi.string()
		.allow(null)
		.empty("")
		.custom(phoneValidation, "Phone number validation")
		.messages({
			"string.empty": "Phone number is required!",
		}),
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
	company: Joi.string().required(),
	phone: Joi.string().allow(null).empty(""),
});

export const changePasswordSchema = Joi.object({
	new_password: Joi.string().required(),
	current_password: Joi.string().required(),
});

export const updateSettingsSchema = Joi.object({
	key: Joi.string()
		.valid(
			"notification",
			"property_management",
			"security_options",
			"product_update",
			"data_management"
		)
		.required()
		.messages({
			"any.only":
				"The key must be one of the following: notification, property_management",
			"any.required": "The key is required",
		}),
	value: Joi.boolean().required(), // Define this based on the expected type of value
});

export const resendVerificationSchema = Joi.object({
	email: Joi.string().email().required(),
});

export const updateImageSchema = Joi.object({
	image: Joi.object({
		url: Joi.string().uri().required(),
		public_id: Joi.string().required(),
	}).required(),
});

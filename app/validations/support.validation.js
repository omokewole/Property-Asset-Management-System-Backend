import Joi from "joi";

export const startChatSchema = Joi.object({
	message: Joi.string().optional().empty(""),
	img: Joi.object({
		url: Joi.string().uri().allow("").when("img", {
			is: Joi.exist(),
			then: Joi.required(),
			otherwise: Joi.optional(),
		}),
		public_id: Joi.string().allow("").when("img", {
			is: Joi.exist(),
			then: Joi.required(),
			otherwise: Joi.optional(),
		}),
	}).optional(),
}).or("message", "img");

export const supportMessageSchema = Joi.object({
	sender: Joi.string().required(),
	session_id: Joi.string().required(),
	img: Joi.object({
		url: Joi.string().uri().allow("").when("img", {
			is: Joi.exist(),
			then: Joi.required(),
			otherwise: Joi.optional(),
		}),
		public_id: Joi.string().allow("").when("img", {
			is: Joi.exist(),
			then: Joi.required(),
			otherwise: Joi.optional(),
		}),
	}).optional(),
	message: Joi.string().allow("").optional(),
}).or("message", "img");

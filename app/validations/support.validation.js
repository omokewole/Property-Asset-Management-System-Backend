import Joi from "joi";

export const startChatSchema = Joi.object({
	message: Joi.string().optional().empty(""),
	img: Joi.object({
		url: Joi.string().uri().required(),
		public_id: Joi.string().required(),
	}).optional(),
}).xor("message", "img");

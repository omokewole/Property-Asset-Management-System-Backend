import cloudinary from "../configs/cloudinary.js";
import {
	startChat,
	allMessages,
	endChat,
} from "../services/support.service.js";
import { responseModel } from "../utils/responseModel.js";

export async function handleStartChat(req, res) {
	try {
		const { message, img } = req.body;

		const user_id = req.user._id;

		const response = await startChat({
			user_id,
			message: message,
			image: img,
		});

		res
			.status(201)
			.json(responseModel(true, "Chat started successfully", response));
	} catch (error) {
		console.log(error);
		res
			.status(error.status || 500)
			.json(responseModel(false, error.message || "An error occured"));
	}
}

export async function handleAllMessages(req, res) {
	try {
		const { session_id } = req.params;
		const { page = 1, limit = 10 } = req.query;
		const user_id = req.user._id;

		if (!session_id) {
			return res
				.status(400)
				.json(responseModel(false, "Session ID Param is required"));
		}

		const messages = await allMessages({ user_id, session_id, page, limit });

		return res
			.status(200)
			.json(responseModel(true, "All messages", { data: messages }));
	} catch (error) {
		res
			.status(error.status || 500)
			.json(responseModel(false, error.message || "An error occured"));
	}
}

export async function handleDeleteSupportImage(req, res) {
	try {
		const { public_id } = req.params;

		if (!public_id) {
			res.status(400).json(responseModel(false, "Public ID Param is required"));
		}

		await cloudinary.uploader.destroy(public_id);

		return res
			.status(200)
			.json(responseModel(true, "image successfully deleted"));
	} catch (error) {
		console.log(error);
		return res
			.status(error.status || 500)
			.json(responseModel(false, error.message || "An error occurred"));
	}
}

export async function handleEndChat(req, res) {
	try {
		const user_id = req.user._id;
		const { session_id } = req.params;

		if (!session_id || session_id === undefined) {
			return res
				.status(400)
				.json(responseModel(false, "Session id is required"));
		}

		await endChat(user_id, session_id);

		return res.status(200).json(responseModel(true, "Chat ended successfully"));
	} catch (error) {
		return res
			.status(error.status || 500)
			.json(responseModel(false, error.message || "An error occured"));
	}
}

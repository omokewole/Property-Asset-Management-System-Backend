import mongoose from "mongoose";
import ErrorWithStatus from "../exceptions/errorWithStatus.js";
import { SupportModel, SupportSessionModel } from "../models/support.model.js";

export async function startChat({ user_id, message, image }) {
	try {
		const newSupportSession = await new SupportSessionModel({
			user: user_id,
		});

		if (!newSupportSession) {
			throw new ErrorWithStatus("Error occured creating new chat", 500);
		}

		const savedNewSupportSession = await newSupportSession.save();

		const newSupportMessage = await new SupportModel({
			sender: user_id,
			message,
			image,
			session_id: newSupportSession._id,
		});
		await newSupportMessage.save();

		return savedNewSupportSession.populate({
			path: "user",
			select: "role image_url name",
		});
	} catch (error) {
		throw new ErrorWithStatus(
			error.message || "An error occured",
			error.status || 500
		);
	}
}

export async function sendMessage({ user_id, message, image_url, session_id }) {
	try {
		const newMessage = await new SupportModel({
			user_id,
			message,
			image_url,
			session_id,
		});

		await newMessage.save();

		return newMessage;
	} catch (error) {
		console.log(error);
		throw new ErrorWithStatus(
			error.message || "An error occured",
			error.status || 500
		);
	}
}

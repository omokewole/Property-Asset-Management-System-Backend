import mongoose from "mongoose";
import ErrorWithStatus from "../exceptions/errorWithStatus.js";
import { SupportModel, SupportSessionModel } from "../models/support.model.js";
import UserModel from "../models/user.model.js";

export async function startChat({ user_id, message, image }) {
	try {
		const user = await UserModel.findById(user_id);

		if (!user) {
			throw new ErrorWithStatus("User not found", 404);
		}

		const newSupportSession = await new SupportSessionModel({
			user: user_id,
		});

		const savedNewSupportSession = await newSupportSession.save();

		if (!savedNewSupportSession) {
			throw new ErrorWithStatus("Error occured creating new chat", 500);
		}

		const newSupportMessage = new SupportModel({
			sender: user_id,
			message,
			image,
			session_id: newSupportSession._id,
		});

		const savedSupportMessage = await newSupportMessage.save();

		if (!savedSupportMessage) {
			throw new ErrorWithStatus("Error saving support message", 500);
		}

		user.current_support_session = newSupportSession._id;
		await user.save();

		return savedNewSupportSession.populate({
			path: "user",
			select: "role images name",
		});
	} catch (error) {
		throw new ErrorWithStatus(
			error.message || "An error occured",
			error.status || 500
		);
	}
}

export async function allMessages({
	user_id,
	session_id,
	page = 1,
	limit = 10,
}) {
	try {
		if (!user_id || !session_id) {
			throw new ErrorWithStatus("User ID and Session ID are required", 400);
		}

		const skip = (page - 1) * limit;

		const messages = await SupportModel.find({
			sender: user_id,
			session_id,
		})
			.sort({ createdAt: -1 })
			.skip(skip)
			.limit(limit)
			.populate("sender", "name email image role")
			.populate("session_id");

		const total_messages = await SupportModel.countDocuments({
			sender: user_id,
			session_id,
		});

		return {
			messages,
			total_messages,
			current_page: page,
			total_pages: Math.ceil(total_messages / limit),
		};
	} catch (error) {
		console.log(error);
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

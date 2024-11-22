import mongoose from "mongoose";
import ErrorWithStatus from "../exceptions/errorWithStatus.js";
import { SupportModel, SupportSessionModel } from "../models/support.model.js";

export async function startChat({ user_id, message, image_url }) {
	const session = await mongoose.startSession();
	session.startTransaction();

	try {
		const newSupportSession = await new SupportSessionModel({
			user_id,
		});
		await newSupportSession.save({ session });

		const newSupportMessage = await new SupportModel({
			user_id,
			message,
			image_url,
			session_id: newSupportSession._id,
		});
		await newSupportMessage.save({ session });

		await session.commitTransaction();
		session.endSession();

		const populatedMessage = await newSupportMessage.populate("session_id");
		return populatedMessage;
	} catch (error) {
		await session.abortTransaction();
		session.endSession();
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

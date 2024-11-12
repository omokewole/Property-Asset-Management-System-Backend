import ErrorWithStatus from "../exceptions/errorWithStatus.js";
import {
	allNotifications,
	addNotification,
	readNotification,
	readAllNotification,
} from "../services/notification.service.js";
import { responseModel } from "../utils/responseModel.js";

export async function addNotificationHandler({
	user_id,
	page,
	title,
	content,
	path,
	ref,
}) {
	try {
		const newNotification = await addNotification({
			user_id,
			page,
			title,
			content,
			path,
			ref,
		});
	} catch (error) {
		throw new ErrorWithStatus(
			error.message || "An error occured adding notificiation",
			error.status || 500
		);
	}
}

export async function allNotificationHandler(req, res) {
	try {
		const user_id = req.user._id;
		const { state, page, limit } = req.query;

		const notifications = await allNotifications({
			state,
			page,
			limit,
			user_id,
		});
		res
			.status(200)
			.json(responseModel(true, "All User notifications", notifications));
	} catch (error) {
		res
			.status(error.status || 500)
			.json(responseModel(false, error.message || "An error occured"));
	}
}

export async function readNotificationHanlder(req, res) {
	try {
		const user_id = req.user._id;
		const notification_id = req.params.id;

		const updatedNotification = await readNotification(
			notification_id,
			user_id
		);

		res
			.status(200)
			.json(responseModel(true, "Notification read", updatedNotification));
	} catch (error) {
		res
			.status(error.status || 500)
			.json(responseModel(false, error.message || "An error occured"));
	}
}

export async function readAllNotificationHandler(req, res) {
	try {
		const user_id = req.user._id;

		const modifiedCount = await readAllNotification(user_id);

		res
			.status(200)
			.json(
				responseModel(true, `Marked ${modifiedCount} notifications as read.`)
			);
	} catch (error) {
		res
			.status(error.status || 500)
			.json(responseModel(false, error.message || "An error occured"));
	}
}

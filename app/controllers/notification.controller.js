import {
	allNotifications,
	addNotification,
} from "../services/notification.service.js";
import { responseModel } from "../utils/responseModel.js";

export async function addNotificationHandler({
	user_id,
	page,
	title,
	content,
}) {
	const newNotification = await addNotification({
		user_id,
		page,
		title,
		content,
	});

	console.log(newNotification);
}

export async function handleAllNotification(req, res) {
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

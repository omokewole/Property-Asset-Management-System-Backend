import NotificationModel from "../models/notification.model.js";
import ErrorWithStatus from "../exceptions/errorWithStatus.js";

export async function addNotification(newNotificationData) {
	try {
		const newNotification = new NotificationModel(newNotificationData);

		await newNotification.save();
		return newNotification;
	} catch (error) {
		console.log(error);
		throw new ErrorWithStatus("An error occured", 500);
	}
}

export async function allNotifications({
	user_id,
	state,
	page = 1,
	limit = 6,
}) {
	try {
		const skip = (page - 1) * limit;

		const filter = {
			user_id,
		};

		if (state == "unread") {
			filter.is_read = false;
		} else if (state === "read") {
			filter.is_read = true;
		}

		const notifications = await NotificationModel.find(filter)
			.skip(skip)
			.limit(limit);
		const total_items = await NotificationModel.countDocuments(filter);
		const total_page = total_items / page;
		const had_more = total_page > page;
		const unread = await NotificationModel.countDocuments({
			user_id,
			is_read: false,
		});

		const meta = {
			current_page: page,
			total_page,
			had_more,
			unread,
		};

		return { notifications, meta };
	} catch (error) {
		console.log(error);
		throw new ErrorWithStatus("An error occured", 500, error.message);
	}
}

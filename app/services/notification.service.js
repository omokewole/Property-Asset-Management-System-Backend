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
	limit = 10,
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
			.sort({ createdAt: -1 })
			.skip(skip)
			.limit(limit);

		const [total_items, unread_count] = await Promise.all([
			NotificationModel.countDocuments(filter),
			NotificationModel.countDocuments({ user_id, is_read: false }),
		]);

		const total_page = Math.ceil(total_items / limit);
		const had_more = page < total_page;

		const meta = {
			current_page: page,
			total_page,
			had_more,
			unread: unread_count,
		};

		return { notifications, meta };
	} catch (error) {
		throw new ErrorWithStatus("An error occured", 500);
	}
}

export async function readNotification(notificationId, user_id) {
	try {
		const updatedNotification = await NotificationModel.findOneAndUpdate(
			{ user_id: user_id, _id: notificationId },
			{ is_read: true },
			{ new: true }
		);

		if (!updatedNotification) {
			throw new ErrorWithStatus("Notification not found", 404);
		}

		return updatedNotification;
	} catch (error) {
		throw new ErrorWithStatus(
			error?.message || "An error occured",
			error.status || 500
		);
	}
}

export async function readAllNotification(user_id) {
	try {
		const result = await NotificationModel.updateMany(
			{ user_id: user_id, is_read: false },
			{ is_read: true },
			{ new: true }
		);

		return result.modifiedCount;
	} catch (error) {
		throw new ErrorWithStatus(
			error?.message || "An error occured",
			error.status || 500
		);
	}
}

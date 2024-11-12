import mongoose from "mongoose";

const notificationSchema = mongoose.Schema(
	{
		user_id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		title: {
			type: String,
			required: true,
			trim: true,
		},
		content: {
			type: String,
			required: true,
			trim: true,
		},
		path: {
			type: String,
			enum: ["properties", "tenants", "maintenances", "user"],
			required: true,
		},
		ref: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
		},
		is_read: {
			type: Boolean,
			default: false,
		},
	},
	{ timestamps: true }
);

const NotificationModel = mongoose.model("Notification", notificationSchema);

export default NotificationModel;

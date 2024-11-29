import mongoose from "mongoose";
import PropertyModel from "./property.model.js";
import TenantModel from "./tenant.model.js";
import MaintenanceModel from "./maintenance.model.js";
import NotificationModel from "./notification.model.js";
import SettingsModel from "./settings.model.js";

const userSchema = mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
		},
		email: {
			type: String,
			required: true,
			trim: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
		role: {
			type: String,
			enum: ["USER", "ADMIN"],
			default: "USER",
		},
		phone: {
			type: String,
			default: "",
		},
		company: {
			type: String,
			required: true,
			trim: true,
		},

		image: {
			type: Object,
			default: null,
		},
		verified_at: {
			type: Date,
			default: null,
		},
		email_token: {
			type: String,
			default: null,
		},
		email_token_expires: {
			type: Date,
			default: null,
		},
		current_support_session: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "SupportSession",
			default: null,
		},
	},
	{
		timestamps: true,
	}
);

userSchema.pre(
	"deleteOne",
	{ document: true, query: false },
	async function (next) {
		const userId = this._id;
		try {
			await PropertyModel.deleteMany({ owner_id: userId });

			await TenantModel.deleteMany({ owner_id: userId });

			await MaintenanceModel.deleteMany({ owner_id: userId });

			await NotificationModel.deleteMany({ user_id: userId });

			await SettingsModel.deleteMany({ user_id: userId });

			next();
		} catch (error) {
			next(error);
		}
	}
);

const UserModel = mongoose.model("User", userSchema);

export default UserModel;

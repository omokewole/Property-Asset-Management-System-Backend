import mongoose from "mongoose";
import PropertyModel from "./property.model.js";
import TenantModel from "./tenant.model.js";
import MaintenanceModel from "./maintenance.model.js";

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
			default: null,
		},

		image_url: {
			type: String,
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
	},
	{
		timestamps: true,
	}
);

userSchema.pre("remove", async function (next) {
	try {
		await PropertyModel.deleteMany({ owner_id: this._id });

		await TenantModel.deleteMany({ owner_id: this._id });

		await MaintenanceModel.deleteMany({ owner_id: this._id });
		
		next();
	} catch (error) {
		next(error);
	}
});

const UserModel = mongoose.model("User", userSchema);

export default UserModel;

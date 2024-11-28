import mongoose from "mongoose";

const supportSchema = mongoose.Schema(
	{
		sender: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: "User",
		},
		session_id: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: "Support_session",
		},
		message: {
			type: String,
			trim: true,
		},
		image: {
			type: Object,
			default: null,
		},
	},
	{
		timestamps: true,
	}
);

const supportSessionSchema = mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	admin: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
	},
	active: {
		type: Boolean,
		default: false,
	},
});

supportSessionSchema.pre("save", async function (next) {
	if (this.admin_id) {
		const user = await mongoose.model("User").findById(this.admin_id, "role");
		if (!user || user.role !== "ADMIN") {
			return next(new Error("Invalid admin_id: the user is not an admin"));
		}
	}
	next();
});

supportSessionSchema.pre("findOneAndUpdate", async function (next) {
	const update = this.getUpdate();

	const adminId = update.admin_id || (update.$set && update.$set.admin_id);

	if (adminId) {
		const user = await mongoose.model("User").findById(adminId, "role");
		if (!user || user.role !== "ADMIN") {
			return next(new Error("Invalid admin_id: the user is not an admin"));
		}
	}
	next();
});

export const SupportModel = mongoose.model("Support", supportSchema);
export const SupportSessionModel = mongoose.model(
	"Support_session",
	supportSessionSchema
);

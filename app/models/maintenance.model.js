import mongoose from "mongoose";

const maintenanceSchema = mongoose.Schema(
	{
		owner_id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},

		facility: {
			type: String,
			required: true,
		},

		property: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Property",
			required: true,
		},

		maintenance_fee: {
			type: Number,
			required: true,
			trim: true,
		},

		schedule_date: {
			type: Date,
			required: true,
			trim: true,
		},

		technician: {
			type: String,
			required: true,
			trim: true,
		},

		status: {
			type: String,
			required: true,
			enum: ["overdue", "completed", "schedule"],
		},
	},
	{ timestamps: true }
);

const MaintenanceModel = mongoose.model("Maintenance", maintenanceSchema);

export default MaintenanceModel;

import mongoose from "mongoose";

const tenantSchema = mongoose.Schema(
	{
		owner_id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		property_id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Property",
			required: true,
		},
		name: {
			type: String,
			required: true,
			trim: true,
		},
		unit: {
			type: Number,
			required: false,
		},
		unit_number: {
			type: Number,
			required: true,
		},
		contact: {
			type: String,
			required: true,
			trim: true,
		},
		move_in_date: {
			type: Date,
			required: true,
		},
	},
	{ timestamps: true }
);

const TenantModel = mongoose.model("Tenant", tenantSchema);

export default TenantModel;

import mongoose from "mongoose";

const tenantSchema = mongoose.Schema(
	{
		owner_id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},

		assigned_property: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Property",
			required: true,
		},

		name: {
			type: String,
			required: true,
			trim: true,
		},

		assigned_unit: {
			type: Number,
			required: true,
		},

		phone: {
			type: String,
			required: true,
			trim: true,
		},
		start_date: {
			type: Date,
			required: true,
		},
		end_date: {
			type: Date,
			required: true,
		},
	},
	{ timestamps: true }
);

const TenantModel = mongoose.model("Tenant", tenantSchema);

export default TenantModel;

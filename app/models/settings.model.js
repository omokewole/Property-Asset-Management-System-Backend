import mongoose from "mongoose";

const settingSchema = mongoose.Schema({
	user_id: {
		type: mongoose.Schema.Types.ObjectId,
		require: true,
	},
	notification: {
		type: Boolean,
		default: true,
	},
	security_options: {
		type: Boolean,
		default: true,
	},
	data_management: {
		type: Boolean,
		default: true,
	},
	property_management: {
		type: Boolean,
		default: true,
	},
	product_update: {
		type: Boolean,
		default: true,
	},
});

const SettingModel = mongoose.model("Setting", settingSchema);

export default SettingModel;

import mongoose from "mongoose";
import TenantModel from "./tenant.model.js";

const propertySchema = mongoose.Schema(
  {
    owner_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    street: {
      type: String,
      required: true,
      trim: true,
    },
    unit_number: {
      type: Number,
      required: true,
    },
    attraction: {
      type: Array,
      required: false,
    },
    images_url: {
      type: Array,
      required: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    property_type: {
      type: String,
      enum: ["Residential", "Commercial"],
    },
  },
  { timestamps: true }
);

propertySchema.pre("remove", async function (next) {
  try {
    await TenantModel.deleteMany({ property_id: this._id });
    next();
  } catch (error) {
    next(error);
  }
});

const PropertyModel = mongoose.model("Property", propertySchema);

export default PropertyModel;

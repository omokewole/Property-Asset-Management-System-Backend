import { Router } from "express";
import {
	handleAddProperty,
	handleAllProperty,
	handleEditProperty,
	handleDeleteProperty,
	handleSingleProperty,
	handleDeletePropertyImage,
} from "../controllers/property.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import validateMiddleware from "../middlewares/validation.middleware.js";
import { propertySchema } from "../validations/property.validation.js";

const PropertyRourter = Router();

PropertyRourter.use(authMiddleware);

PropertyRourter.post(
	"/",
	validateMiddleware(propertySchema),
	handleAddProperty
);
PropertyRourter.get("/", handleAllProperty);
PropertyRourter.get("/:propertyId", handleSingleProperty);
PropertyRourter.put(
	"/:propertyId",
	validateMiddleware(propertySchema),
	handleEditProperty
);
PropertyRourter.delete("/:propertyId", handleDeleteProperty);
PropertyRourter.delete(
	"/images/:publicId",
	handleDeletePropertyImage
);

export default PropertyRourter;

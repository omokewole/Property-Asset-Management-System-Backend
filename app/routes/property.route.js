import { Router } from "express";
import {
  handleAddProperty,
  handleAllProperty,
  handleEditProperty,
  handleDeleteProperty,
  handleSingleProperty,
} from "../controllers/property.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import upload from "../configs/multer.js";
import validateMiddleware from "../middlewares/validation.middleware.js";
import {
  editPropertySchema,
  propertySchema,
} from "../validations/property.validation.js";

const PropertyRourter = Router();

PropertyRourter.use(authMiddleware);

PropertyRourter.post(
  "/",
  upload.array("images", 12),
  validateMiddleware(propertySchema),
  handleAddProperty
);
PropertyRourter.get("/", handleAllProperty);
PropertyRourter.get("/:propertyId", handleSingleProperty);
PropertyRourter.put(
  "/:propertyId",
  upload.array("images", 12),
  validateMiddleware(editPropertySchema),
  handleEditProperty
);
PropertyRourter.delete("/:propertyId", handleDeleteProperty);

export default PropertyRourter;

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

const PropertyRourter = Router();

PropertyRourter.use(authMiddleware);

PropertyRourter.post("/", upload.array("images", 25), handleAddProperty);
PropertyRourter.get("/", handleAllProperty);
PropertyRourter.get("/:propertyId", handleSingleProperty);
PropertyRourter.put(
  "/:propertyId",
  upload.array("images", 25),
  handleEditProperty
);
PropertyRourter.delete("/:propertyId", handleDeleteProperty);

export default PropertyRourter;

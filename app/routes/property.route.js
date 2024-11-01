import { Router } from "express";
import { handleAddProperty } from "../controllers/property.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const PropertyRourter = Router();

PropertyRourter.use(authMiddleware);
PropertyRourter.post("/", handleAddProperty);

export default PropertyRourter;

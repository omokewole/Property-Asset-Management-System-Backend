import { Router } from "express";
import {
	handleCreateMaintenance,
	handleUpdateMaintenance,
	handleAllMaintenance,
	handleDeleteMaintenance,
	handleSingleMaintenance,
} from "../controllers/maintenance.controller.js";
import validateMiddleware from "../middlewares/validation.middleware.js";
import { maintenanceValidationSchema } from "../validations/maintenance.validation.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const MaintenanceRouter = Router();

MaintenanceRouter.use(authMiddleware);

MaintenanceRouter.get("/", handleAllMaintenance);
MaintenanceRouter.get("/:maintenance_id", handleSingleMaintenance);
MaintenanceRouter.delete("/:maintenance_id", handleDeleteMaintenance);
MaintenanceRouter.post(
	"/",
	validateMiddleware(maintenanceValidationSchema),
	handleCreateMaintenance
);
MaintenanceRouter.put(
	"/:maintenance_id",
	validateMiddleware(maintenanceValidationSchema),
	handleUpdateMaintenance
);

export default MaintenanceRouter;

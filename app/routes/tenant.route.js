import { Router } from "express";
import {
	handleAddTenant,
	handleAllTenant,
	handleEditTenant,
	handleSingleTenant,
	handleDeleteTenant,
} from "../controllers/tenant.controller.js";
import validateMiddleware from "../middlewares/validation.middleware.js";
import { tenantValidationSchema } from "../validations/tenant.validation.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const TenantRouter = Router();

TenantRouter.use(authMiddleware);
TenantRouter.post(
	"/",
	validateMiddleware(tenantValidationSchema),
	handleAddTenant
);
TenantRouter.get("/", handleAllTenant);
TenantRouter.get("/:tenant_id", handleSingleTenant);
TenantRouter.delete("/:tenant_id", handleDeleteTenant);
TenantRouter.put(
	"/:tenant_id",
	validateMiddleware(tenantValidationSchema),
	handleEditTenant
);

export default TenantRouter;

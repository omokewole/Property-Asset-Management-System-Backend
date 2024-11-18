import { Router } from "express";
import { handleStartChat } from "../controllers/support.controller.js";
import { adminMiddleware } from "../middlewares/admin.middleware.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const SupportRouter = Router();

SupportRouter.use(authMiddleware);
SupportRouter.post("start_chat", handleStartChat);

export default SupportRouter;

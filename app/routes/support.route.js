import { Router } from "express";
import {
	handleStartChat,
	handleSendMessage,
} from "../controllers/support.controller.js";
import { adminMiddleware } from "../middlewares/admin.middleware.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import validateMiddleware from "../middlewares/validation.middleware.js";
import { startChatSchema } from "../validations/support.validation.js";

const SupportRouter = Router();

SupportRouter.use(authMiddleware);
SupportRouter.post(
	"/start_chat",
	validateMiddleware(startChatSchema),
	handleStartChat
);
SupportRouter.post("/message", handleSendMessage);

export default SupportRouter;

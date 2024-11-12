import { Router } from "express";
import {
	allNotificationHandler,
	readNotificationHanlder,
	readAllNotificationHandler,
} from "../controllers/notification.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const NotificationRouter = Router();

NotificationRouter.use(authMiddleware);
NotificationRouter.get("/", allNotificationHandler);
NotificationRouter.get("/:id", readNotificationHanlder);
NotificationRouter.get("/:user_id/read", readAllNotificationHandler);

export default NotificationRouter;

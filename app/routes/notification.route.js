import { Router } from "express";
import { handleAllNotification } from "../controllers/notification.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const NotificationRouter = Router();

NotificationRouter.use(authMiddleware);
NotificationRouter.get("/", handleAllNotification);

export default NotificationRouter;

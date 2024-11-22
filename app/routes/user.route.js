import { Router } from "express";
import validateMiddleware from "../middlewares/validation.middleware.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import {
	handleCreateUser,
	handleLoginUser,
	handleUser,
	handleRefreshToken,
	handleVerifyUser,
	handleUpdateUser,
	handleChangePassword,
	handleUpdateSettings,
	handleUserPropertyPerformanceReport,
	handleResendVerificationEmail,
} from "../controllers/user.controller.js";
import {
	createUserSchema,
	loginUserSchema,
	refreshTokenSchema,
	verifyUserSchema,
	updateUserSchema,
	changePasswordSchema,
	updateSettingsSchema,
	resendVerificationSchema,
} from "../validations/user.validation.js";
import upload from "../configs/multer.js";

const userRouter = Router();

userRouter.post(
	"/create",
	validateMiddleware(createUserSchema),
	handleCreateUser
);
userRouter.post("/login", validateMiddleware(loginUserSchema), handleLoginUser);
userRouter.post(
	"/refresh_token",
	validateMiddleware(refreshTokenSchema),
	handleRefreshToken
);
userRouter.post(
	"/verify",
	validateMiddleware(verifyUserSchema),
	handleVerifyUser
);

userRouter.post(
	"/verify-resend",
	validateMiddleware(resendVerificationSchema),
	handleResendVerificationEmail
);

userRouter.get("/", authMiddleware, handleUser);
userRouter.put(
	"/update",
	authMiddleware,
	upload.single("image"),
	validateMiddleware(updateUserSchema),
	handleUpdateUser
);
userRouter.post(
	"/change_password",
	authMiddleware,
	validateMiddleware(changePasswordSchema),
	handleChangePassword
);
userRouter.patch(
	"/settings",
	authMiddleware,
	validateMiddleware(updateSettingsSchema),
	handleUpdateSettings
);
userRouter.get("/reports", authMiddleware, handleUserPropertyPerformanceReport);
export default userRouter;

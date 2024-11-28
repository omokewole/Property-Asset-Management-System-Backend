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
	handleUpdateUserImage,
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
	updateImageSchema,
} from "../validations/user.validation.js";

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
userRouter.patch(
	"/upload",
	authMiddleware,
	validateMiddleware(updateImageSchema),
	handleUpdateUserImage
);
export default userRouter;

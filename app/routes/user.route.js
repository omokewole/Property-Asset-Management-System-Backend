import { Router } from "express";
import validateMiddleware from "../middlewares/validation.middleware.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import {
	handleCreateUser,
	handleLoginUser,
	handleUser,
	handleRefreshToken,
	handleVerifyUser,
} from "../controllers/user.controller.js";
import {
	createUserSchema,
	loginUserSchema,
	refreshTokenSchema,
	verifyUserSchema,
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

// userRouter.use(authMiddleware);
userRouter.get("/", authMiddleware, handleUser);

export default userRouter;

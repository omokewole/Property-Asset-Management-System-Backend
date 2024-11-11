import {
	createUser,
	loginUser,
	user,
	verifyUserEmail,
} from "../services/user.service.js";
import { responseModel } from "../utils/responseModel.js";
import { refreshToken } from "../utils/generateToken.js";
import sendVerificationMail from "../helper/mails/sendVerificationMail.js";
import sendConfirmationMail from "../helper/mails/sendConfirmationMail.js";

export async function handleCreateUser(req, res) {
	try {
		const newUserData = req.body;

		const result = await createUser(newUserData);

		await sendVerificationMail(result.user);

		const user = result.user;

		delete user.email_token;

		result.user = user;

		res
			.status(201)
			.json(responseModel(true, "User created successfully", result));
	} catch (error) {
		res
			.status(error.status || 500)
			.json(responseModel(false, error.message || "An error occured"));
	}
}

export async function handleLoginUser(req, res) {
	try {
		const loginInfo = req.body;

		const result = await loginUser(loginInfo);

		res.status(200).json(responseModel(true, "Login succesffuly", result));
	} catch (error) {
		res
			.status(error.status || 500)
			.json(responseModel(false, error.message || "An error occured", null));
	}
}

export async function handleVerifyUser(req, res) {
	try {
		const { email_token } = req.body;

		const result = await verifyUserEmail(email_token);

		sendConfirmationMail(result.user);

		res
			.status(200)
			.json(responseModel(true, "User email verified successfully", result));
	} catch (error) {
		res
			.status(error.status || 500)
			.json(responseModel(false, error.message || "An error occured", null));
	}
}

export async function handleUser(req, res) {
	try {
		const authUser = req.user;

		const result = await user(authUser._id);

		res
			.status(200)
			.json(responseModel(true, "User fetched successfully", result));
	} catch (error) {
		res
			.status(error.status || 500)
			.json(responseModel(false, error.message || "An error occured", null));
	}
}

export async function handleRefreshToken(req, res) {
	try {
		const { refresh_token } = req.body;

		const { newAccessToken, newRefreshToken } = await refreshToken(
			refresh_token
		);

		res.status(201).json(
			responseModel(true, "New token generated successfull", {
				access_token: newAccessToken,
				refresh_token: newRefreshToken,
			})
		);
	} catch (error) {
		res
			.status(error.status || 500)
			.json(responseModel(false, error.message || "An error occured", null));
	}
}

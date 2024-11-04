import ErrorWithStatus from "../exceptions/errorWithStatus.js";
import { generateJWT } from "../utils/generateToken.js";
import UserModel from "../models/user.model.js";
import generateStats from "../utils/getStats.js";
import bcrypt from "bcrypt";
import crypto from "crypto";

export async function createUser(newUser) {
	try {
		const userExist = await UserModel.findOne({ email: newUser.email });

		if (userExist) {
			throw new ErrorWithStatus("user with email exist", 400);
		}

		newUser.password = await bcrypt.hash(newUser.password, 10);
		newUser.email_token = crypto.randomBytes(64).toString("hex");
		newUser.email_token_expires = new Date(Date.now() + 10 * 60 * 1000);

		const user = new UserModel(newUser);
		const savedUser = await user.save();

		const { accessToken, refreshToken } = generateJWT(user);

		const userObj = savedUser.toObject();

		delete userObj.__v;
		delete userObj.password;
		delete userObj.email_token_expires;

		const stats = await generateStats(userObj._id);

		return {
			access_token: accessToken,
			refresh_token: refreshToken,
			stats,
			user: userObj,
		};
	} catch (error) {
		throw new ErrorWithStatus(error.message, error.status || 500);
	}
}

export async function loginUser(user) {
	try {
		const userData = await UserModel.findOne({ email: user.email });

		if (!userData) {
			throw new ErrorWithStatus("Incorrect email or password", 401);
		}

		const passwordMatch = await bcrypt.compare(
			user.password,
			userData.password
		);

		if (!passwordMatch) {
			throw new ErrorWithStatus("Incorrect email or password", 401);
		}

		const { accessToken, refreshToken } = generateJWT(userData);

		const stats = await generateStats(userData._id);

		const userObj = userData.toObject();

		delete userObj.password;
		delete userObj.__v;
		delete userObj.email_token;
		delete userObj.email_token_expires;

		return {
			access_token: accessToken,
			refresh_token: refreshToken,
			user: userObj,
			stats,
		};
	} catch (error) {
		throw new ErrorWithStatus(error.message, error.status || 500);
	}
}

export async function user(id) {
	try {
		const userData = await UserModel.findById(id);

		if (!userData) {
			throw new ErrorWithStatus("User not found", 404);
		}

		const userObj = userData.toObject();

		const stats = await generateStats(userData._id);

		delete userObj.__v;
		delete userObj.password;
		delete userObj.email_token;
		delete userObj.email_token_expires;

		return { user: userObj, stats };
	} catch (error) {
		console.log(error);
		throw new ErrorWithStatus(error.message, error.status || 500);
	}
}

export async function verifyUserEmail(emailToken) {
	try {
		const user = await UserModel.findOne({ email_token: emailToken });

		if (!user) {
			throw new ErrorWithStatus("Invalid or expired token", 400);
		}

		if (user.email_token_expires < Date.now()) {
			throw new ErrorWithStatus("Token has expired", 400);
		}

		user.verified_at = new Date();
		user.email_token = null;
		user.email_token_expires = null;

		const userObj = await user.save();
		const { accessToken, refreshToken } = generateJWT(user);

		delete userObj.password;
		delete userObj.__v;
		delete userObj.email_token;
		delete userObj.email_token_expires;

		return { accessToken, refreshToken, user };
	} catch (error) {
		throw new ErrorWithStatus(error.message, error.status || 500);
	}
}

import Jwt from "jsonwebtoken";
import ErrorWithStatus from "../exceptions/errorWithStatus.js";

export function generateJWT(user) {
	const jwtSecret = process.env.JWT_SECRET;
	const refreshSecret = process.env.JWT_REFRESH_SECRET;

	const accessToken = Jwt.sign(
		{
			_id: user._id,
			role: user.role,
			sub: user.id,
		},
		jwtSecret,
		{
			expiresIn: "30d",
		}
	);

	const refreshToken = Jwt.sign(
		{
			_id: user._id,
			sub: user.id,
		},
		refreshSecret,
		{ expiresIn: "60d" }
	);

	return { accessToken, refreshToken };
}
export async function refreshToken(refreshToken) {
	try {
		const jwtSecret = process.env.JWT_SECRET;
		const refreshSecret = process.env.JWT_REFRESH_SECRET;

		const user = await new Promise((resolve, reject) => {
			Jwt.verify(refreshToken, refreshSecret, (err, decodedUser) => {
				if (err) {
					return reject(
						new ErrorWithStatus("Invalid or expired refresh token", 401)
					);
				}
				resolve(decodedUser);
			});
		});

		const newAccessToken = Jwt.sign(
			{ _id: user._id, role: user.role, sub: user.sub },
			jwtSecret,
			{ expiresIn: "1m" }
		);

		const newRefreshToken = Jwt.sign(
			{ _id: user._id, sub: user.sub },
			refreshSecret,
			{ expiresIn: "30d" }
		);

		return { newAccessToken, newRefreshToken };
	} catch (error) {
		throw new ErrorWithStatus(
			error.message || "An error occurred",
			error.status || 500
		);
	}
}

import createMaiTransporter from "./createEmailTransporter.js";
import ErrorWithStatus from "../../exceptions/errorWithStatus.js";
import { generateVerificationEmail } from "../htmlTemplate/verifyEmail.js";

export default async function sendVerificationMail(user) {
	const transporter = createMaiTransporter();

	if (!user.email) return;

	const mailOptions = {
		from: '"UpvilleHomes" <upvillehomes@gmail.com>',
		to: user.email,
		subject: "Verify your email...",
		html: generateVerificationEmail(user),
	};

	try {
		await transporter.sendMail(mailOptions);
		console.log("Verification email sent");
	} catch (err) {
		throw new ErrorWithStatus(
			err.message || "An error occured",
			err.status || 500
		);
	}
}

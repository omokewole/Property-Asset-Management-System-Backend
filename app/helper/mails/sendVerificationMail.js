import createMaiTransporter from "./createEmailTransporter.js";
import ErrorWithStatus from "../../exceptions/errorWithStatus.js";

export default async function sendVerificationMail(user) {
	const transporter = createMaiTransporter();

	if (!user.email) return;

	const mailOptions = {
		from: '"UpvilleHomes" <upvillehomes@gmail.com>',
		to: user.email,
		subject: "Verify your email...",
		html: ` <p>Hello  ${user.name}, verify your email by clicking on this link... <a href='${process.env.CLIENT_URL}/auth/verify-email?emailToken=${user.email_token}'>Verify your email</a> </p>`,
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

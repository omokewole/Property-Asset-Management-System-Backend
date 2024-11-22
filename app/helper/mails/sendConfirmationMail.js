import createMaiTransporter from "./createEmailTransporter.js";
import ErrorWithStatus from "../../exceptions/errorWithStatus.js";
import { generateConfirmationEmail } from "../htmlTemplate/confirmationEmail.js";

export default async function sendConfirmationMail(user) {
	const transporter = createMaiTransporter();

	if (!user.email) return;

	const mailOptions = {
		from: '"UpvilleHomes" <upvillehomes@gmail.com>',
		to: user.email,
		subject: "Email verified",
		html: generateConfirmationEmail(user),
		// html: `<p>Hello ${user.name}, your email has been successfully verified. You can now continue to the site. <a href='${process.env.CLIENT_URL}/auth/login'>Continue </a></p>`,
	};
	try {
		await transporter.sendMail(mailOptions);
		console.log("Confirmation email sent");
	} catch (err) {
		throw new ErrorWithStatus(
			err.message || "An error occured",
			err.status || 500
		);
	}
}

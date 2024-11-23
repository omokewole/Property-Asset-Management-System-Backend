import createMaiTransporter from "./createEmailTransporter.js";
import ErrorWithStatus from "../../exceptions/errorWithStatus.js";

export default async function sendNotificationMail(
	email,
	name,
	notification,
	html
) {
	const transporter = createMaiTransporter();

	if (!email || !name || !notification || !html)
		throw new ErrorWithStatus("Enough arguments not provided", 400);

	const mailOptions = {
		from: '"UpvilleHomes" <upvillehomes@gmail.com>',
		to: email,
		subject: notification.title,
		html,
	};

	try {
		await transporter.sendMail(mailOptions);

		return true;
	} catch (err) {
		throw new ErrorWithStatus(
			err.message || "An error occured",
			err.status || 500
		);
	}
}

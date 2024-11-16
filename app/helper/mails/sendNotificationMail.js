import createMaiTransporter from "./createEmailTransporter.js";
import ErrorWithStatus from "../../exceptions/errorWithStatus.js";

export default async function sendNotificationMail(email, name, notification) {
  const transporter = createMaiTransporter();

  if (!email || !name || !notification) return;

  const mailOptions = {
    from: '"UpvilleHomes" <upvillehomes@gmail.com>',
    to: email,
    subject: notification.title,
    html: ` <p>${notification.content}</p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Notification email sent");
  } catch (err) {
    throw new ErrorWithStatus(
      err.message || "An error occured",
      err.status || 500
    );
  }
}

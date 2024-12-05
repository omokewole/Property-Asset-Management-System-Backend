import { Server } from "socket.io";
import { supportMessageSchema } from './app/validations/support.validation.js';
import { SupportModel } from './app/models/support.model.js';
import { responseModel } from './app/utils/responseModel.js';


const onlineUsers = new Map();

async function socketServer(server) {
	const io = new Server(server, {
		cors: { origin: process.env.CLIENT_URL },
	});

	io.on("connection", (socket) => {
		socket.on("client-connected", (data) =>
			onlineUsers.set(data.userId, { ...data, socketId: socket.id })
		);

		socket.on("message", async (data) => {
			try {
				if (data) {
					const isValidate = supportMessageSchema.validate(data);

					if (!isValidate.error) {
						const newMessage = new SupportModel({
							...data,
							image: data.img,
						});

						const savedNewMessage = await newMessage.save();

						const populatedMessage = await savedNewMessage.populate([
							{
								path: "sender",
								select: "name email image role",
							},
							{
								path: "session_id",
							},
						]);

						socket.emit(
							"message",
							responseModel(true, "Message sent", populatedMessage)
						);
					} else {
						socket.emit(
							"message",
							responseModel(
								false,
								"Invalid message format",
								isValidate?.error.details
							)
						);
						console.log(isValidate?.error.details);
					}
				}
			} catch (err) {
				console.log(err);
			}
		});

		socket.on("disconnect", () => {
			for (const [userId, user] of onlineUsers.entries()) {
				if (user.socketId === socket.id) {
					onlineUsers.delete(userId);
					break;
				}
			}
		});
	});
}

export default socketServer;

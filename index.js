import express from "express";
import cors from "cors";
import dotenv, { populate } from "dotenv";
import mongoose from "mongoose";
import http from "http";
import { Server } from "socket.io";
import userRouter from "./app/routes/user.route.js";
import PropertyRourter from "./app/routes/property.route.js";
import TenantRouter from "./app/routes/tenant.route.js";
import MaintenanceRouter from "./app/routes/maintenance.route.js";
import NotificationRouter from "./app/routes/notification.route.js";
import SupportRouter from "./app/routes/support.route.js";
import logger from "./app/middlewares/logger.middeware.js";

import { SupportModel } from "./app/models/support.model.js";
import { supportMessageSchema } from "./app/validations/support.validation.js";
import { responseModel } from "./app/utils/responseModel.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
	cors: {
		origin: ["http://localhost:5173", "https://upvillehomes.vercel.app"],
		methods: ["GET", "POST"],
	},
});

app.use(express.json());
app.use(cors());
app.use(logger);

app.use("/api/v1/user", userRouter);
app.use("/api/v1/properties", PropertyRourter);
app.use("/api/v1/tenants", TenantRouter);
app.use("/api/v1/maintenances", MaintenanceRouter);
app.use("/api/v1/notifications", NotificationRouter);
app.use("/api/v1/supports", SupportRouter);

app.get("/welcome", (_, res) => {
	res.send("Welcome to UpvilleHomes Api");
});

app.all("*", (req, res) => {
	res.status(404).json({ message: `Route ${req.url} not found` });
});

const MONGO_URL = process.env.MONGO_URL;
const PORT = process.env.PORT;

const onlineUsers = new Map();

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

					const populatedMessage = await savedNewMessage.populate({
						path: "sender",
						select: "name email image role",
					});

					console.log(populatedMessage)

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
					console.log(isValidate?.error.details)
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

async function startServer() {
	try {
		await mongoose.connect(MONGO_URL);

		console.log("DB connected");

		server.listen(PORT, () => {
			console.log(`App running on port:  ${PORT}`);
		});
	} catch (error) {
		console.log(error);
	}
}

startServer();

export default app;

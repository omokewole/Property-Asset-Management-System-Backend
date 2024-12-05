import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import http from "http";
import userRouter from "./app/routes/user.route.js";
import PropertyRourter from "./app/routes/property.route.js";
import TenantRouter from "./app/routes/tenant.route.js";
import MaintenanceRouter from "./app/routes/maintenance.route.js";
import NotificationRouter from "./app/routes/notification.route.js";
import SupportRouter from "./app/routes/support.route.js";
import logger from "./app/middlewares/logger.middeware.js";
import socketServer from "./socket.io.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(cors({ origin: process.env.CLIENT_URL }));
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


async function startServer() {
	try {
		await mongoose.connect(MONGO_URL);

		console.log("DB connected");

		await socketServer(server);

		server.listen(PORT, () => {
			console.log(`App running on port:  ${PORT}`);
		});
	} catch (error) {
		console.log(error);
	}
}

startServer();

export default app;

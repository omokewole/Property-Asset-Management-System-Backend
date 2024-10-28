import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import userRouter from "./app/routes/user.route.js";

dotenv.config();

const app = express();
app.use(express.json());

app.use(cors());
app.use("/api/v1/user", userRouter);

app.get("/", (_, res) => {
	res.send("Welcome to UpvilleHomes Api");
});

app.all("*", (req, res) => {
	res.status(404).json({ message: `Page not found` });
});

const MONGO_URL = process.env.MONGO_URL;
const PORT = process.env.PORT;

async function startServer() {
	try {
		await mongoose.connect(MONGO_URL);

		console.log("DB connected");

		app.listen(PORT, () => {
			console.log(`App running on port:  ${PORT}`);
		});
	} catch (error) {
		console.log(error);
	}
}

startServer();

export default app;

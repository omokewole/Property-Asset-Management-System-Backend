import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import userRouter from "./app/routes/user.route.js";
import PropertyRourter from "./app/routes/property.route.js";
import path from "path";

dotenv.config();

export const dir_name = path.dirname(new URL(import.meta.url).pathname);

const app = express();
app.use(express.json());

app.use(cors());
app.use("/api/v1/user", userRouter);
app.use("/api/v1/properties", PropertyRourter);

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

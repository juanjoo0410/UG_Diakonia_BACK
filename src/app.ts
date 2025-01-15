import "dotenv/config";
import express from "express";
import cors from "cors";
import router from './routes';
import { connectDB } from "./config/db";

const PORT = process.env.PORT;
const app = express();

connectDB();
app.use(cors({
    origin: "http://54.172.159.35"
}));
app.use(express.json())
app.use(router);
app.listen(PORT, () => console.log("Connected on port " + PORT));
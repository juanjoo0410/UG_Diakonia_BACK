import "dotenv/config";
import express from "express";
import cors from "cors";
import router from './routes';
import { connectDB } from "./config/db";

const PORT = process.env.PORT;
const app = express();

connectDB();
app.use(cors());
app.use(express.json())
app.use(router);
app.listen(PORT, () => console.log("Conectado en puerto " + PORT));
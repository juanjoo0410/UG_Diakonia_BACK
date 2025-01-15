"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const routes_1 = __importDefault(require("./routes"));
const db_1 = require("./config/db");
const PORT = process.env.PORT;
const app = (0, express_1.default)();
(0, db_1.connectDB)();
app.use((0, cors_1.default)({
    origin: "http://54.172.159.35"
}));
app.use(express_1.default.json());
app.use(routes_1.default);
app.listen(PORT, () => console.log("Connected on port " + PORT));

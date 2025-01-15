"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendNotify = void 0;
require("dotenv/config");
const nodemailer_1 = __importDefault(require("nodemailer"));
const sendNotify = (form) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const transporter = nodemailer_1.default.createTransport({
            service: process.env.EMAIL_SERVICE,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });
        const mailOptions = {
            from: `${form.nombre}<no-reply@diakonia.com>`,
            to: form.email,
            subject: form.asunto,
            html: `${form.mensaje}`,
            replyTo: 'no-reply@diakonia.com'
        };
        transporter.sendMail(mailOptions, function (err, info) {
            if (err)
                console.log(err);
            else
                console.log(info);
        });
    }
    catch (error) {
        console.log(error);
    }
});
exports.sendNotify = sendNotify;

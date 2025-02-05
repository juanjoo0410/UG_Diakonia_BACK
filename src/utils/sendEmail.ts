import "dotenv/config";
import nodemailer from 'nodemailer';
import { Parametro } from "../models/parametroModel";

export const sendNotify = async (form: any) => {
    try {
        const emailService = await Parametro.findOne({ where: { codigo: "SYS-CORREO-SERVICE" } });
        const emailUser = await Parametro.findOne({ where: { codigo: "SYS-CORREO-USER" } });
        const emailPass = await Parametro.findOne({ where: { codigo: "SYS-CORREO-PASS-APP" } });

        if (!emailService || !emailUser || !emailPass) {
            console.error("Error: No se encontraron los parámetros de correo en la base de datos.");
            return;
        }
        const transporter = nodemailer.createTransport({
            service: emailService.valor,
            auth: {
                user: emailUser.valor,
                pass: emailPass.valor
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
            if (err) console.log(err)
            else console.log(info);
        });
    } catch (error) {
        console.log(error);
    }
};
import "dotenv/config";
import nodemailer from 'nodemailer';

export const sendNotify = async (form: any) => {
    try {
        const transporter = nodemailer.createTransport({
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
            if (err) console.log(err)
            else console.log(info);
        });
    } catch (error) {
        console.log(error);
    }
};
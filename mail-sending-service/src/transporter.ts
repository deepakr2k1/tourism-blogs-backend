import nodemailer from 'nodemailer';
import mailOptionsInterface from './interfaces/message.interface';
const smtpService = process.env.SMTP_SERVICE;
const smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASSWORD;

const transporter = nodemailer.createTransport({
    service: smtpService,
    auth: {
        user: smtpUser,
        pass: smtpPass
    }
});

transporter.verify((err) => {
    if (err) {
        console.error("Transporter error: ", err);
    } else {
        console.info('Server is ready to send Mails');
    }
});

const sendMail = (option: mailOptionsInterface) => {
    return new Promise(async (resolve, reject) => {
        try {
            await transporter.sendMail(option);
            resolve(null);
        } catch (err) {
            console.error(err);
            reject(err);
        }
    });
};

export default sendMail;
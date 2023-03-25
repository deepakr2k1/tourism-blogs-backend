import path from 'path'
import ejs from 'ejs'
import sendMail from '../transporter';
import messageInterface from '../interfaces/message.interface'

export const sendEmailVerificationCode = (name: string, email: string, code: number) => {
    return new Promise(async (resolve, reject) => {
        try {
            let templatePath = path.join(__dirname, '../templates/emailVerification.ejs');
            let imagePath = path.join(__dirname, '../assets/world_tourism.jpg');
            let template = await ejs.renderFile(templatePath, { code });
            let message: messageInterface = {
                from: 'Tourism Blogs',
                to: email,
                subject: `Welcome ${name}, Please verify your email`,
                html: template,
                attachments: [{
                    filename: 'world_tourism.jpg',
                    path: imagePath,
                    cid: 'world_tourism@nodemailer.com'
                }]
            };
            await sendMail(message);
            resolve('EMAIL_SENT');
        } catch (err) {
            console.error(err);
            reject(err);
        }
    });
};

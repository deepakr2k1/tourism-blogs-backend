const path = require('path');
const ejs = require('ejs');
const transporter = require('./transporter');

const sendVerificationEmail = ({ name, email, code }) => {
    return new Promise(async (resolve, reject) => {
        try {
            const templatePath = path.join(__dirname, '../templates/emailVerification.ejs');
            const template = await ejs.renderFile(templatePath, { name, email, code });
            const mailOptions = {
                from: 'Tourism Blogs',
                to: data.email,
                subject: `Welcome ${name}, Please verify your email`,
                html: template
            };
            await transporter.sendMail(mailOptions);
            console.info('SENT MAIL');
            resolve();
        } catch (err) {
            console.error(err);
            reject(err);
        }
    });
};

module.exports = sendVerificationEmail;
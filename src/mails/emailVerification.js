const path = require('path');
const ejs = require('ejs');
const sendMail = require('./transporter');

const sendVerificationEmail = ({ name, email, code }) => {
    return new Promise(async (resolve, reject) => {
        try {
            let templatePath = path.join(__dirname, '../templates/emailVerification.ejs');
            let template = await ejs.renderFile(templatePath, { code });
            let mailOptions = {
                from: 'Tourism Blogs',
                to: email,
                subject: `Welcome ${name}, Please verify your email`,
                html: template
            };
            await sendMail(mailOptions);
            resolve();
        } catch (err) {
            console.error(err);
            reject(err);
        }
    });
};

module.exports = sendVerificationEmail;
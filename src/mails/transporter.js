const nodemailer = require('nodemailer');
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
        console.error(err);
    } else {
        console.info('Server is ready to take our messages');
    }
});

module.export = transporter;
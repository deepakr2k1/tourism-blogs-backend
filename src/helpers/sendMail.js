// const nodemailer = require("nodemailer");

// const sendMail = async (req, res) => {

//     // connect with the smtp
//     const transporter = nodemailer.createTransport({
//         host: 'smtp.ethereal.email',
//         port: 587,
//         auth: {
//             user: 'jordane20@ethereal.email',
//             pass: 'QJwyCvvXdDybNtdCDg'
//         }
//     });

//     let info = await transporter.sendMail({
//         from: '', // sender address
//         to: "kzentest@gmail.com", // list of receivers
//         subject: "Hello Thapa", // Subject line
//         text: "Hello", // plain text body
//         html: `
//             <H3>Hi Deepak, this is your code: 289507</H3>
//             <img src='../assests/travel-concept-with-landmarks.jpg'>
//         `,
//     });

//     console.log("Message sent: %s", info.messageId);
//     res.json(info);
// };

// module.exports = sendMail;


const nodemailer = require('nodemailer');

let mailTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'xyz@gmail.com',
        pass: '*************'
    }
});

let mailDetails = {
    from: 'xyz@gmail.com',
    to: 'abc@gmail.com',
    subject: 'Test mail',
    text: 'Node.js testing mail for GeeksforGeeks'
};

mailTransporter.sendMail(mailDetails, function (err, data) {
    if (err) {
        console.log('Error Occurs');
    } else {
        console.log('Email sent successfully');
    }
});
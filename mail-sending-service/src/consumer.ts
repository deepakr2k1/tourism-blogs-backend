import amqp from 'amqplib';
import { sendEmailVerificationCode } from './mails/sendEmailVerificationCode';
const mailQueue = 'MAIL_QUEUE';
const rabbitmqServer = process.env.RABBITMQ_SERVER;

let channel: any;

const connect = async () => {
    try {
        const connection = await amqp.connect(rabbitmqServer);
        const channel = await connection.createChannel();
        await channel.assertQueue(mailQueue);
        console.log("Ready to consume messages from RabbitMQ");
        
        channel.consume(mailQueue, async (message) => {
            try {
                const {name, email, code} = JSON.parse(message!.content.toString());
                await sendEmailVerificationCode(name, email, code);
                channel.ack(message!);
            } catch(err) {
                console.error(err, message!.content);
            }
        })
    } catch (err) {
        console.error(err);
    }
};

connect();
export {};
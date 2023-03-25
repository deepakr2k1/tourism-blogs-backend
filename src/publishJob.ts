import amqp from 'amqplib';
const mailQueue = 'MAIL_QUEUE';
const rabbitmqServer = process.env.RABBITMQ_SERVER;

let channel: any;

const connect = async () => {
    try {
        const connection = await amqp.connect(rabbitmqServer);
        channel = await connection.createChannel();
        await channel.assertQueue(mailQueue);
        console.log("Ready to publish message to RabbitMQ");
    } catch (err) {
        console.error(err);
    }
};
connect();

export const publishSendEmailVerificationJob = async (name: string, email: string, code: number) => {
    try {
        channel.sendToQueue(mailQueue, Buffer.from(JSON.stringify({
            name,
            email,
            code
        })));
    } catch (err) {
        console.error(err);
    }
};

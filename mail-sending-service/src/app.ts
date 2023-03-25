import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import './consumer'

const app = express();
const port = process.env.PORT;

// Server
app.listen(port, () => {
    console.info(`Mail-sending-service started listening on port ${port}`)
});

import express from 'express';
import morgan from 'morgan';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            PORT?: number,
            DB_URI: string,
            ACCESS_TOKEN_EXPIRATION: number,
            COOKIE_EXPIRATION: number,
            ACCESS_SECRET_KEY: string,
            SMTP_SERVICE?: string,
            SMTP_USER?: string,
            SMTP_PASSWORD?: string,
        }
    }
}

dotenv.config();
const app = express();
const port = process.env.PORT;
const dbURI: string = process.env.DB_URI;
import { CORS_ORIGIN_URLS } from './config';
const options: cors.CorsOptions = { origin: CORS_ORIGIN_URLS };

// Connect to MongoDB
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.info('Connected to MongoDB'))
    .catch((err: string) => console.info(err));

// Middlewares
app.use(cors(options));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));

import rootRouter from './routes/root.route';
app.use(rootRouter);

// Server
app.listen(port, () => {
    console.info(`Server is listening on port ${port}`)
});

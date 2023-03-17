import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import morgan from 'morgan';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import rootRouter from './routes/root.route';
import { CORS_ORIGIN_URLS } from './config';

const app = express();
const port = process.env.PORT;
const dbURI = process.env.DB_URI;
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

app.use(rootRouter);

// Server
app.listen(port, () => {
    console.info(`Server is listening on port ${port}`)
});

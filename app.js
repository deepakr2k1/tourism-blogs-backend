require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require("cookie-parser");

const port = process.env.PORT;
const dbURI = process.env.DB_URI;
const { CORS_ORIGIN_URLS, COOKIE_OPTIONS } = require('./config');

// Connect to MongoDB
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => console.info('Connected to MongoDB'))
    .catch((err) => console.info(err));

// Middlewares
app.use(cors({ origin: CORS_ORIGIN_URLS, credentials: true }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser(COOKIE_OPTIONS));
app.use(morgan('dev'));
app.use(express.static("public"));

// Routes
app.use('/user', require('./src/routes/userRoutes'));
app.use('/blog', require('./src/routes/blogRoutes'));

// Server
app.listen(port, console.info(`Server is listening on port ${port}`));
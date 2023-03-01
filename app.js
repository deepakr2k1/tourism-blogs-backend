require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require("cookie-parser");

const port = process.env.PORT;
const dbURI = process.env.DB_URI;
const clientHost = process.env.CLIENT_HOST;

// Connect to MongoDB
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => console.log('Connected to MongoDB'))
    .catch((err) => console.log(err));

// Middlewares
app.use(cors({ origin: clientHost }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));

// app.get('/sendMail', require('./src/helpers/sendMail'));

// Middlewares
const auth = require('./src/middlewares/auth');

// Routes
app.use('/user', require('./src/routes/userRoutes'));
app.use('/blog', auth, require('./src/routes/blogRoutes'));

// Server
app.listen(port, console.log(`App is listening on port ${port}`));
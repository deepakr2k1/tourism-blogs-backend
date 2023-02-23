const express = require('express');
const morgan = require('morgan');
const app = express();
const port = process.env.PORT || 8000;
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");

const dbURI = 'mongodb+srv://deepakrathore:pass123@cluster0.bkgzn.mongodb.net/tourists-blogs?retryWrites=true&w=majority';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => console.log('Connected to MongoDB'))
    .catch((err) => console.log(err));

app.set('views', './views');
app.set('view engine', 'ejs');

app.use(cookieParser());
app.use(express.static('static'));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.use('/user', require('./routes/userRoutes'));
app.use('/blogs', require('./routes/blogRoutes'));
app.get('/', (req, res) => res.redirect('/blogs'));
app.get('/about', (req, res) => {
    var user = {
        'name': req.cookies["name"],
        'email': req.cookies["email"],
    };
    res.render('about', { user: user, title: 'About' });
});
app.get('/logout', (req, res) => {
    res.cookie("name", "", { httpOnly: true });
    res.cookie("email", "", { httpOnly: true });
    res.redirect('/blogs');
});
app.use((req, res) => {
    var user = {
        'name': req.cookies["name"],
        'email': req.cookies["email"],
    };
    res.status(404).render('404', { user: user, title: 'Not Found' });
});

app.listen(port, console.log(`Server is listening on port ${port}`));
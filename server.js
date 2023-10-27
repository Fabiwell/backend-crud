const cookieParser = require('cookie-parser');
const session = require("express-session");
const express = require('express');
const app = express();

app.set('view engine', 'ejs');

app.use(express.static(__dirname));
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cookieParser());
app.use(session({
    secret: "croissant",
    saveUninitialized: true,
    resave: true
}));

app.use('/', require('./routes/home'))




app.listen(3000)

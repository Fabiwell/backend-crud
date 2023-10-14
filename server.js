const express = require('express');
const app = express();

app.set('view engine', 'ejs');

app.use(express.static(__dirname));
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/', require('./routes/home'))




app.listen(3000)

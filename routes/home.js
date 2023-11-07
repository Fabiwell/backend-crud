const express = require('express')
const { register, validate } = require('../classes/register')
const router = express.Router()
const request = require('request');
const url = require('url');
const fs = require('fs');
const path = require('path');


const options = {
  'method': 'GET',
  'url': 'https://api.coincap.io/v2/assets/',
  'headers': {
  }
};


router.route('/')
.get(async (req, res) => {

    const filePath = path.join(__dirname, '../resources', 'secret.json');
    const file = fs.readFileSync(filePath, 'utf8')
    const filedata = JSON.parse(file)
    const apikeyExchange = filedata.apikeyExchange
    const urlCoin = `https://api.coincap.io/v2/assets/`;
    const urlExchange = `https://v6.exchangerate-api.com/v6/${apikeyExchange}/latest/USD`

    let exchangeEUR;

    await request(urlExchange, function (error, response){
        if (error) throw new Error(error);

        const rawdata = JSON.parse(response.body)
        exchangeEUR = rawdata.conversion_rates.EUR
    });
    await request(urlCoin, function (error, response){
        if (error) throw new Error(error);

        const data = JSON.parse(response.body)
        data.data.forEach(coin => {
            coin.priceEuro = parseFloat(coin.priceUsd) * exchangeEUR
        });

        res.render('index', {
            coindata: data,
            loggedin: req.session.loggedin,
            error: req.query.error,
            email: req.query.email,
            name: req.query.name,
            registered: req.query.registered,
            failedlogin: req.query.failedlogin
        })
    })
})

router.route('/register')
.post(async (req, res) => {
    const data = req.body
    const name = data.name
    const email = data.email
    const password = data.password

    try {
        await register(email, name, password)
        res.redirect(url.format({
            pathname:"/",
            query: {
                registered: true
            }
        }))

    } catch (error) {
        console.log(error);
        res.redirect(url.format({
            pathname:"/",
            query: {
                error,
                email,
                name,
            }
        }))
    }
})

router.route('/login')
.post(async (req, res) => {
    const data = req.body
    const email = data.email
    const password = data.password

    try{
        if(await validate(email, password)){
            console.log('checking validation');
            req.session.loggedin = true
            req.session.email = email
        }else{
            throw new Error('Invalid credentials.')
        }
        console.log('done checking validation');
        res.redirect('/')

    } catch (error) {
        console.log(error);
        res.redirect(url.format({
            pathname:"/",
            query: {
                error,
                failedlogin: true,
             }
          }))
    }
})

router.route('/news')
.get(async (req, res) => {

    let error;

    res.render('index', {
        news: true,
        error
    })
})


function checkLoggedIn(req, res, next) {
// Check if the email session is set and not null
    if (!req.session.email || !req.session.loggedIn) {
        // Redirect the user to a specific route if they are not logged in
        res.redirect('/account/login');
    }
    else {
        // If the user is logged in,Move to the next middleware/route handler
        next();
    }
}

module.exports = router
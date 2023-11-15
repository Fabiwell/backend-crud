// Import necessary modules and files
const express = require('express');
const { register, validate } = require('../classes/register');
const { pushWallet } = require('../classes/wallet');
const router = express.Router();
const url = require('url');
const fs = require('fs');
const path = require('path');

// Read API keys from a JSON file
const filePath = path.join(__dirname, '../resources', 'secret.json');
const file = fs.readFileSync(filePath, 'utf8');
const keys = JSON.parse(file);

// Define routes
router.route('/')
.get(async (req, res) => {
    // Fetch data from external APIs
    const apikeyExchange = keys.apikeyExchange;
    const urlCoin = 'https://api.coincap.io/v2/assets/';
    const urlExchange = `https://v6.exchangerate-api.com/v6/${apikeyExchange}/latest/USD`;

    const getExchange = async (to) => {
        const response = await fetch(urlExchange);
        const json = await response.json();
        return json.conversion_rates[to];
    }

    const getCoinData = async () => {
        const response = await fetch(urlCoin);
        const json = await response.json();
        return json.data;
    }

    const exchangeEUR = await getExchange('EUR');
    const coinData = await getCoinData();

    // Perform data manipulation
    coinData.forEach(coin => {
        coin.priceEuro = parseFloat(coin.priceUsd) * exchangeEUR;
    });

    // Render the 'index' template with data
    res.render('index', {
        coindata: coinData,
        loggedin: req.session.loggedin,
        error: req.query.error,
        email: req.query.email,
        name: req.query.name,
        registered: req.query.registered,
        failedlogin: req.query.failedlogin
    });
});

// Handle user registration
router.route('/register')
.post(async (req, res) => {
    const data = req.body;
    const name = data.name;
    const email = data.email;
    const password = data.password;

    try {
        await register(email, name, password);
        // Redirect with success message
        res.redirect(url.format({
            pathname:"/",
            query: {
                registered: true
            }
        }));
    } catch (error) {
        console.log(error);
        // Redirect with error details
        res.redirect(url.format({
            pathname:"/",
            query: {
                error,
                email,
                name,
            }
        }));
    }
});

// Handle user login
router.route('/login')
.post(async (req, res) => {
    const data = req.body;
    const id = data.id;
    const password = data.password;

    try {
        if(await validate(id, password)){
            console.log('checking validation');
            // Set session variables on successful login
            req.session.loggedin = true;
            req.session.userId = id;
        } else {
            throw new Error('Invalid credentials.');
        }
        console.log('done checking validation');
        // Redirect to home page
        res.redirect('/');
    } catch (error) {
        console.log(error);
        // Redirect with login failure details
        res.redirect(url.format({
            pathname:"/",
            query: {
                error,
                failedlogin: true,
             }
          }));
    }
});

// Fetch news data
router.route('/news')
.get(async (req, res) => {
    let error;
    const urlNews = `https://newsapi.org/v2/everything?q=crypto&apiKey=${keys.apikeyNews}`;

    try {
        const response = await fetch(urlNews);
        const json = await response.json();
        // Render the 'index' template with news data
        res.render('index', {
          newsData: json,
          news: true,
          error
        });
    } catch (err) {
        console.error('Error fetching news data:', err);
        // Render the 'index' template with error details
        res.render('index', {
          newsData: null,
          news: true,
          error: err
        });
    }
});

// Handle wallet route (not implemented)
router.route('/wallet')
.get((req, res) => {
    const user = req.query.user;
    const userId = req.query.userId;
    const coin = req.query.coin;
    const priceUsd = req.query.priceUsd;
    const priceEuro = req.query.priceEuro;
    const icon = req.query.icon;

    // Placeholder comment indicating that this part is not implemented yet
    // You can add implementation details when ready
  });

// Export the router
module.exports = router;
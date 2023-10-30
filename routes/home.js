const express = require('express')
const { register, validate } = require('../classes/register')
const router = express.Router()
const https = require('https')
const request = require('request');


const options = {
  'method': 'GET',
  'url': 'https://api.coincap.io/v2/assets/',
  'headers': {
  }
};


router.route('/')
.get((req, res) => {
    const coindata = fetchcoindata();
    console.log(coindata);

    res.render('index', {coindata})
})

router.route('/register')
.post(async (req, res) => {
    const data = req.body
    const name = data.name
    const email = data.email
    const password = data.password

    try {
        await register(email, name, password)
        res.render("index", {
            registered: true
        })

    } catch (error) {
        console.log(error);
        res.render("index", {
            error,
            email,
            name,
        })
    }
})

router.route('/login')
.post(async (req, res) => {
    const data = req.body
    const email = data.email
    const password = data.password

    try{
        if(await validate(email, password)){
            req.session.loggedin = true
            req.session.email = email
        }else{
            throw new Error('Invalid credentials.')
        }
    } catch (error) {
        console.log(error);
        res.render('index', {
            error,
            failedlogin: true,
            loggedin: req.session.loggedin
        })
    }
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

  function fetchcoindata() {
    const url = `https://api.coincap.io/v2/assets`;

    return request(url)
        .then(body => JSON.parse(body))
        .catch(error => {
            throw error;
        });
    }

// Usage of fetchcoindata with async/await
(async () => {
    try {
        const coindata = await fetchcoindata();
        console.log(coindata);
    } catch (error) {
        console.error("Error fetching coin data:", error);
    }
})();

module.exports = router
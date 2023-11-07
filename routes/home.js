const express = require('express')
const { register, validate } = require('../classes/register')
const router = express.Router()
const https = require('https')
const request = require('request');
const url = require('url');


const options = {
  'method': 'GET',
  'url': 'https://api.coincap.io/v2/assets/',
  'headers': {
  }
};


router.route('/')
.get(async (req, res) => {

    const url = `https://api.coincap.io/v2/assets/`;

    await request(url, function (error, response){
        if (error) throw new Error(error);

        const data = JSON.parse(response.body)
        data.data.forEach(row => {
            console.log(row);
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
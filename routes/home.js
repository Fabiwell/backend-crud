const express = require('express')
const { register, validate } = require('../classes/register')
const router = express.Router()
const url = require('url');
const fs = require('fs');
const path = require('path');


const filePath = path.join(__dirname, '../resources', 'secret.json');
const file = fs.readFileSync(filePath, 'utf8')
const keys = JSON.parse(file)


router.route('/')
.get(async (req, res) => {

    const apikeyExchange = keys.apikeyExchange
    const urlCoin = `https://api.coincap.io/v2/assets/`;
    const urlExchange = `https://v6.exchangerate-api.com/v6/${apikeyExchange}/latest/USD`
    
    const getExchange = async (to) => {
        const response = await fetch(urlExchange)
        const json = await response.json()
        
        return json.conversion_rates[to]
    }

    const getCoinData = async () => {
        const response = await fetch(urlCoin)
        const json = await response.json()
        
        return json.data
    }
    
    const exchangeEUR = await getExchange('EUR')
    const coinData = await getCoinData()

    coinData.forEach(coin => {
        coin.priceEuro = parseFloat(coin.priceUsd) * exchangeEUR
    })

    res.render('index', {
        coindata: coinData,
        loggedin: req.session.loggedin,
        error: req.query.error,
        email: req.query.email,
        name: req.query.name,
        registered: req.query.registered,
        failedlogin: req.query.failedlogin
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
    const id = data.id
    const password = data.password

    try{
        if(await validate(id, password)){
            console.log('checking validation');
            req.session.loggedin = true
            req.session.userId = id
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

    let error
    const urlNews = `https://newsapi.org/v2/everything?q=crypto&apiKey=${keys.apikeyNews}`


    try {
        const response = await fetch(urlNews)
        const json = await response.json()
  
        res.render('index', {
          newsData: json,
          news: true,
          error
        })
      } catch (err) {
        console.error('Error fetching news data:', err);
        res.render('index', {
          newsData: null, // Handle the case where the data could not be fetched
          news: true,
          error: err
        });
      }
});

router.route('/crypto-history')
.get((req, res) => {
    const url = `https://api.coincap.io/v2/assets/${req.query.crypto}/history?interval=d1`;
  
    request(url, (error, response, body) => {
      if (!error && response.statusCode == 200) {
        const data = JSON.parse(body);
        res.send(data);
      }
    });
  });
module.exports = router
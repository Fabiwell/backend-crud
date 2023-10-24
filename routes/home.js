const express = require('express')
const { register } = require('../classes/register')
const router = express.Router()
const https = require('https')


router.route('/')
.get((req, res) => {
    res.render('index')
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
            email,
            name,
        })
    }
})

router.route('/login')
.post((req, res) => {

})

module.exports = router
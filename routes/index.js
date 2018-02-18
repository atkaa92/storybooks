const express = require('express');
const passport = require('passport');
const router = express.Router();

router.get('/', (req, res) => {
	res.render('index/welcome')
})

router.get('/dashboard', (req, res) => {
	res.send('Dashboard')
})

module.exports = router;

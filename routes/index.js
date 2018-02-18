const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { ensureAuthenticated, ensureGuest } = require('../helpers/auth');

//bring Models
const User = mongoose.model('users')
const Story = mongoose.model('stories');

router.get('/', ensureGuest, (req, res) => {
	res.render('index/welcome')
})
router.get('/about', (req, res) => {
	res.render('index/about')
})
router.get('/dashboard', ensureAuthenticated, (req, res) => {
	Story.find({ user: req.user.id })
		.then(stories => {
			res.render('index/dashboard', {
				stories: stories
			})
		})
})

module.exports = router;

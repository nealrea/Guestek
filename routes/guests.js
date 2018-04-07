var express = require('express');
var router = express.Router();
var models = require('../models/');

router.get('/', (req, res) => {
	console.log(req.query.query);
	models.Guests.findAll({
		where: {
			firstName: req.query.query,
		},
	}).then((guest) => {
		res.json(guest);
	}).catch((err) => console.log(err));
});

router.get('/loadDB', (req, res) => {
	models.Guests.findAll({})
		.then((allGuests) => {
			res.json(allGuests);
	}).catch((err) => console.log(err));
});

router.post('/', (req, res) => {
	console.log(req.body);
	models.Guests.create({
		firstName: req.body.firstName.toLowerCase(),
		lastName: req.body.lastName.toLowerCase(),
		email: req.body.email.toLowerCase(),
	});
});

module.exports = router;
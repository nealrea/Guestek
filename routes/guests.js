var express = require('express');
var router = express.Router();
var models = require('../models/');

router.get('/', (req, res) => {
	models.Guests.findAll({
	}).then((allGuests) => {
		res.json(allGuests);
	});
});
router.post('/', (req, res) => {
	console.log(req.body);
	models.Guests.create({
		firstName: req.body.firstName,
		lastName: req.body.lastName,
		email: req.body.email
	});
});

module.exports = router;
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

router.get('/findGuest', (req, res) => {
	console.log(req.query.firstName);
	console.log(req.query.lastName);
	models.Guests.findOne({
		where: {
			firstName: req.query.firstName,
			lastName: req.query.lastName
		},
	}).then((guest) => {
		res.json(guest);
	}).catch((err) => console.log(err));
});

router.get('/getAllGuests', (req, res) => {
	models.Guests.findAll({})
		.then((allGuests) => {
			res.json(allGuests);
	}).catch((err) => console.log(err));
});

router.post('/', (req, res) => {
	//console.log(req.body);
	models.Guests.create({
		firstName: req.body.firstName.toLowerCase(),
		lastName: req.body.lastName.toLowerCase(),
		email: req.body.email.toLowerCase(),
		totalSpent: req.body.totalSpent,
		numVisits: req.body.numVisits,
		lastOrderId: req.body.lastOrderId,
		lastOrder: req.body.lastOrder,
	}).then(res.end('posted guest!'));
});

router.put('/updateGuest', (req,res) => {
	//console.log(req.body);
	models.Guests.update({
		totalSpent: req.body.totalSpent,
		numVisits: req.body.numVisits,
		lastOrderId: req.body.lastOrderId,
		lastOrder: req.body.lastOrder,
		id: req.body.id,
	},
	{
		where: {
			firstName: req.body.firstName,
			lastName: req.body.lastName
		}
	});
});

module.exports = router;
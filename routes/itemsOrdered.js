var express = require('express');
var router = express.Router();
var models = require('../models/');

router.get('/loadItemsOrdered', (req, res) => {
	console.log(req.query.query);
	models.ItemsOrdered.findAll({
		where: {
			GuestId: req.query.query,
		},
	}).then((items) => {
		res.json(items);
	}).catch((err) => console.log(err));
});

module.exports = router;
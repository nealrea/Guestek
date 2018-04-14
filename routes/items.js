var express = require('express');
var router = express.Router();
var models = require('../models/');

router.get('/loadItems', (req, res) => {
	console.log(req.query.query);
	models.Items.findAll({})
		.then(items => { res.json(items)})
		.catch((err) => console.log(err));
});

/*
router.get('/loadItemsOrdered', (req, res) => {
	console.log(req.query.query);
	models.Items.findAll({
		include: [{
			model: models.ItemsOrdered,
			where: {
				GuestId: req.query.query,
			},
		}],
	}).then((items) => {
		res.json(items);
	}).catch((err) => console.log(err));
});
*/

module.exports = router;
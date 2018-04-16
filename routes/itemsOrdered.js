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

router.get('/getAllItemsOrdered', (req,res) => {
	models.ItemsOrdered.findAll({})
		.then(allItemsOrdered => {
			res.json(allItemsOrdered);
		}).catch(err => console.log(err));
});

router.put('/updateItemsOrdered', (req,res) => {
	console.log(req.body);
	models.ItemsOrdered.update({
		timesOrdered: req.body.timesOrdered
	},
	{
		where: {
			GuestId: req.body.GuestId,
			ItemId: req.body.ItemId
		}
	});
});

router.post('/postItemOrdered', (req, res) => {
	console.log(req.body);
	models.ItemsOrdered.create({
		GuestId: req.body.GuestId,
		ItemId: req.body.ItemId,
		timesOrdered: req.body.timesOrdered,
	}).then(res.end('posted item ordered!'));
});

module.exports = router;
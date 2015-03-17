'use strict';

var express = require('express');
var router = express.Router();
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var Eaten = mongoose.model('Eaten', new Schema({
    date: String,
    foodList: [{
        food: {type: Schema.Types.ObjectId, ref: 'Food'},
        eatenWeight: Number
    }]
}));

router.get('/:date', function (req, res) {
    Eaten.findOne({date: req.params.date}).populate('foodList.food').exec(function (err, eaten) {
        if (err) return res.send(500, err);
        if (!eaten) return res.sendStatus(404);
        return res.json(200, eaten);
    });
});

router.post('/', function (req, res) {
    if(!req.body) return res.sendStatus(404);
    Eaten.findOneAndUpdate(req.body.date, req.body, {upsert: true}, function (err, eaten) {
        if (err) return res.send(500, err);
        if (!eaten) return res.sendStatus(404);
        eaten.save(function (err) {
            if (err) return res.send(500, err);
            return res.json(200, eaten);
        });
    });
});

module.exports = router;

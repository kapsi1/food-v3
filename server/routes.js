'use strict';

var express = require('express');
var foodController = require('./food.js');
var eatenRouter = require('./eaten.js');
var foodRouter = express.Router();

foodRouter.get('/', foodController.index);
foodRouter.get('/:id', foodController.show);
foodRouter.post('/', foodController.create);
foodRouter.put('/:id', foodController.update);
foodRouter.patch('/:id', foodController.update);
foodRouter.delete('/:id', foodController.destroy);

module.exports = function (app) {
    app.use('/api/foods', foodRouter);
    app.use('/api/eaten', eatenRouter);
    app.use(express.static('.'));
};

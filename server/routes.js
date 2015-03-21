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
    app.use(express.static('client'));
    app.use('/jspm_packages', express.static('jspm_packages'));
    app.use('/config.js', express.static('config.js'));
    app.use('/api/foods', foodRouter);
    app.use('/api/eaten', eatenRouter);
};

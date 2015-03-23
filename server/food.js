/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /foods              ->  index
 * POST    /foods              ->  create
 * GET     /foods/:id          ->  show
 * PUT     /foods/:id          ->  update
 * DELETE  /foods/:id          ->  destroy
 */

'use strict';

var _ = require('lodash'),
    mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    FoodSchema = new Schema({
        name: String,
        proteins: Number,
        kcal: Number,
        carbs: Number,
        fat: Number,
        unit: String,
        unitWeight: Number
    }),
    Food = mongoose.model('Food', FoodSchema);


// Get list of foods
exports.index = function (req, res) {
    Food.find(function (err, foods) {
        if (err) {
            return handleError(res, err);
        }
        return res.status(200).json(foods);
    });
};

// Get a single food
exports.show = function (req, res) {
    Food.findById(req.params.id, function (err, food) {
        if (err) {
            return handleError(res, err);
        }
        if (!food) {
            return res.send(404);
        }
        return res.json(food);
    });
};

// Creates a new food in the DB.
exports.create = function (req, res) {
    Food.create(req.body, function (err, food) {
        if (err) {
            return handleError(res, err);
        }
        return res.status(201).json(food);
    });
};

// Updates an existing food in the DB.
exports.update = function (req, res) {
    if (req.body._id) {
        delete req.body._id;
    }
    Food.findById(req.params.id, function (err, food) {
        if (err) {
            return handleError(res, err);
        }
        if (!food) {
            return res.send(404);
        }
        var updated = _.merge(food, req.body);
        updated.save(function (err) {
            if (err) {
                return handleError(res, err);
            }
            return res.status(200).json(food);
        });
    });
};

// Deletes a food from the DB.
exports.destroy = function (req, res) {
    Food.findById(req.params.id, function (err, food) {
        if (err) {
            return handleError(res, err);
        }
        if (!food) {
            return res.sendStatus(404);
        }
        food.remove(function (err) {
            if (err) {
                return handleError(res, err);
            }
            return res.sendStatus(204);
        });
    });
};

function handleError(res, err) {
    return res.send(500, err);
}

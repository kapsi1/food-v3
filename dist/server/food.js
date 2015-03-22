/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /things              ->  index
 * POST    /things              ->  create
 * GET     /things/:id          ->  show
 * PUT     /things/:id          ->  update
 * DELETE  /things/:id          ->  destroy
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


// Get list of things
exports.index = function (req, res) {
    Food.find(function (err, things) {
        if (err) {
            return handleError(res, err);
        }
        return res.status(200).json(things);
    });
};

// Get a single food
exports.show = function (req, res) {
    Food.findById(req.params.id, function (err, thing) {
        if (err) {
            return handleError(res, err);
        }
        if (!thing) {
            return res.send(404);
        }
        return res.json(thing);
    });
};

// Creates a new food in the DB.
exports.create = function (req, res) {
    Food.create(req.body, function (err, thing) {
        if (err) {
            return handleError(res, err);
        }
        return res.json(201, thing);
    });
};

// Updates an existing food in the DB.
exports.update = function (req, res) {
    if (req.body._id) {
        delete req.body._id;
    }
    Food.findById(req.params.id, function (err, thing) {
        if (err) {
            return handleError(res, err);
        }
        if (!thing) {
            return res.send(404);
        }
        var updated = _.merge(thing, req.body);
        updated.save(function (err) {
            if (err) {
                return handleError(res, err);
            }
            return res.json(200, thing);
        });
    });
};

// Deletes a food from the DB.
exports.destroy = function (req, res) {
    Food.findById(req.params.id, function (err, thing) {
        if (err) {
            return handleError(res, err);
        }
        if (!thing) {
            return res.sendStatus(404);
        }
        thing.remove(function (err) {
            if (err) {
                return handleError(res, err);
            }
            return res.send(204);
        });
    });
};

function handleError(res, err) {
    return res.send(500, err);
}

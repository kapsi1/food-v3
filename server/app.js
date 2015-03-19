process.env.NODE_ENV = process.env.NODE_ENV || 'development';
console.log('process.env.NODE_ENV', process.env.NODE_ENV);
var fs = require('fs');
var express = require('express');
var compression = require('compression');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var app = express();
var config = require('./config');

app.use(compression());
app.use(bodyParser.json());
require('./routes')(app);

// Connect to mongodb
var connect = function () {
    mongoose.connect(config.mongo.uri, config.mongo.options);
};
mongoose.connection.on('error', console.log);
mongoose.connection.on('disconnected', connect);

connect();
app.listen(config.port);
console.log('Express app started on port ' + config.port);
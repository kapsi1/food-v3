process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var express = require('express');
var mongoose = require('mongoose');
var compression = require('compression');
var bodyParser = require('body-parser');
var app = express();
var config = require('./config');

app.use(compression());
app.use(bodyParser.json());
require('./routes')(app);

// Connect to mongodb
mongoose.connect(config.mongo.uri, config.mongo.options);
mongoose.connection.on('error', console.log);

// Start server
require('http').createServer(app).listen(config.port, config.ip, function () {
    console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
});
module.exports = app;
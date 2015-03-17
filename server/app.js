var fs = require('fs');
var express = require('express');
var compression = require('compression');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var app = express();
var port = process.env.PORT || 3000;
var db = 'mongodb://localhost/fooddiary-dev';

app.use(compression());
app.use(bodyParser.json());
require('./routes')(app);

// Connect to mongodb
var connect = function () {
    var options = { server: { socketOptions: { keepAlive: 1 } } };
    mongoose.connect(db, options);
};
mongoose.connection.on('error', console.log);
mongoose.connection.on('disconnected', connect);

connect();
app.listen(port);
console.log('Express app started on port ' + port);
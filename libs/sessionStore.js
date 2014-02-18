
var express    = require('express');
var mongoose  = require('../libs/mongoose');
var MongoStore = require('connect-mongo')(express);

var sessionStore = new MongoStore({mongoose_connection: mongoose.connection});

module.exports = sessionStore;
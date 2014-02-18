var log          = require('../libs/log')(module);
var config       = require('../config');
var connect      = require('connect');
var async        = require('async');
var cookie       = require('cookie');
var sessionStore = require('../libs/sessionStore');
var HttpError    = require('../error').HttpError;
var User         = require('../models/user').User;

function loadSession(sid, callback) {

}

function loadUser(session, callback) {

}

module.exports = function(server) {
    var io  = require('socket.io').listen(server);
    //set options to io
    io.set('origins', 'localhost:*'); //control domain access
    io.set('logger', log);
//    io.set('authorization', function(handshake, callback) {
//
//    });

    io.sockets.on('connection', function(socket) {
        console.log(socket.handshake);
        socket.on('message', function(text, callback) {
            socket.broadcast.emit('message', text);
            callback(text);
        });
    });
}

var log          = require('../libs/log')(module);
var config       = require('../config');
var connect      = require('connect');
var async        = require('async');
var cookie       = require('cookie');
var sessionStore = require('../libs/sessionStore');
var HttpError    = require('../error').HttpError;
var User         = require('../models/user').User;

function loadSession(sid, callback) {
    sessionStore.load(sid, function(err, session) {
        if(arguments.length == 0) {
            return callback(null, null);
        } else {
            return callback(null, session);
        }
    });
}

function loadUser(session, callback) {
    if(!session.user) {
        log.debug("session id %s is anonymous", session.id);
        return callback(null, null);
    }

    log.debug("retriving user %s", session.user);

    User.findById(session.user, function(err, user) {
        if(err) return callback(err);

        if (!user) {
            return callback(null, null);
        }

        log.debug("user loaded: " + user);
        callback(null, user);
    });
}
//ToDO: 13:00
module.exports = function(server) {
    var io  = require('socket.io').listen(server);
    //set options to io
    io.set('origins', 'localhost:*'); //control domain access
    io.set('logger', log);
    io.set('authorization', function(handshake, callback) {
        async.waterfall([
            function(callback) {
                handshake.cookie = cookie.parse(handshake.headers.cookie || '');
                var sidCookie = handshake.cookie[config.get('session:key')];
                var sid = connect.utils.parseSignedCookie(sidCookie, config.get('session:secret'));

                loadSession(sid, callback);
            },
            function(session, callback) {
                if(!session) {
                    callback(new HttpError(401, "No session"));
                }

                handshake.session = session;
                loadUser(session, callback);
            },
            function(user, callback) {
                if(!user) {
                    callback(new HttpError(403, "Anonymous session may connect"));
                }

                handshake.user = user;
                callback(null);
            }
        ], function(err) {
            if(!err) {
                return callback(null, true);
            }

            if(err instanceof HttpError) {
                return callback(null, false);
            }

            callback(err);
           });
    });

    io.sockets.on('connection', function(socket) {
        var username = socket.handshake.user.get('username');
        socket.broadcast.emit('join', username);

        socket.on('message', function(text, callback) {
            socket.broadcast.emit('message', username, text);
            callback && callback(text);
        });

        socket.on('disconnect', function() {
            socket.broadcast.emit('leave', username);
        });
    });
    return io;
};

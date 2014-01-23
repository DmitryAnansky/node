var User      = require('../models/user').User;
var HttpError = require('../error').HttpError;
var ObjectId  = require('mongodb').ObjectID;

module.exports = function(app) {
    app.get('/', function(request, response, next) {
        response.render("index", {})
    });

    app.get('/users', function(request, response, next) {
        User.find({}, function(err, users) {
            if (err) throw err;
            response.json(users);
        });
    });

    app.get('/user/:id', function(request, response, next) {
        try {
            var id = new ObjectId(request.params.id);
        } catch (e) {
            return next(404);
        }

        User.findById(id, function(err, user) {
            if (err) return next(err);
            if (!user) {
                next(new HttpError(404, "User not found!"));
            }
            response.json(user);
        });
    });

    app.get('/fun', function(request, response, next) {
        response.end("Funny");
    });
}

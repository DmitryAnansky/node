var User      = require('../models/user').User;
var HttpError = require('../error').HttpError;

exports.get = function(request, response) {
    response.render('login');
}

exports.post = function(request, response, next) {
    //need body parser included before
    var username = request.body.username;
    var password = request.body.password;

    User.authorize(username, password, function(err, user) {
        if(err) {
            if(err instanceof AuthError) {
                return next(new HttpError(403, err.message));
            } else {
                return next(err);
            }
        }

        request.session.user = user._id;
        response.send({});
    });
}
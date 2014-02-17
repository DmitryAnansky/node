var User  = require('models').User;
var async = require('async'); 

exports.get = function(request, response) {
    response.render('login');
}

exports.post = function(request, response, next) {
    //need body parser included before
    var userName = request.body.username;
    var password = request.body.password;

    User.findOne({username: userName}, function(err, user) {
        if(err) return next(err);

        if(user) {
            if(user.checkPassword(password)) {

            } else {

            }
        } else {
            var user = new User({username: userName, password: password});
            user.save(function(err) {
                if(err) return next(err);

            });
        }
    });
}
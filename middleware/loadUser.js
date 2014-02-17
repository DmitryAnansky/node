var User = require('../models/user').User;

module.exports = function(request, response, next) {
    request.user = response.locals.user = null;
    if (!request.session.user) return next();

    User.findById(request.session.user, function(err, user) {
        if(err) return next(err);

        request.user = response.locals.user = user;
        next();
    });
}
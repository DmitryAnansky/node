var HttpError = require('../error').HttpError;

module.exports = function(request, response, next) {
    if (!request.session.user) {
        return next(new HttpError(401, "You are not authorised to this page."));
    }

    next();
}

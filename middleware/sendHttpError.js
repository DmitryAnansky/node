module.exports = function(request, response, next) {

    response.sendHttpError = function(error) {
        response.status(error.status);
        if (response.req.headers['x-requested-with'] == 'XMLHttpRequest') {
            response.json(error);
        } else {
            response.render("error", {error: error});
        }
    };

    next();

};
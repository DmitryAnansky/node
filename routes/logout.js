exports.post = function(request, response, next) {
    var sid = request.session.id;
    var io  = request.app.get('io');

    request.session.destroy(function(err) {
        io.sockets.$emit('session:reload', sid);
        if(err) return next(err);
        response.redirect('/');
    });
}

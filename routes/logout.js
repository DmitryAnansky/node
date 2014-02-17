/**
 * Created by Dima on 17.02.14.
 */

exports.post = function(request, response) {
    request.session.destroy();
    response.redirect('/');
}

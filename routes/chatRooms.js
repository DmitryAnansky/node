var HttpError = require('../error').HttpError;

exports.get = function(request, response) {
    response.render('chatRooms');
}

exports.post = function(request, response, next) {
    var roomName = request.body.roomName;

    if(!roomName) {
            return next(new HttpError(403,"No room name fined"));
    }

    console.log(roomName);
    response.send({});
}
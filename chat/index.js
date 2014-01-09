/**
 * Created by danansky on 09.01.14.
 */

var clients = [];

exports.subscribe = function(request, response) {
    console.log("subscribe");

    clients.push(response);

    //if user leaves chat, we shouldn't keep this connection
    response.on("close", function() {
        clients.splice(clients.indexOf(response), 1);
    });
}

exports.publish = function(message) {
    console.log("publish '%s'", message);

    clients.forEach(function(response) {
        response.end(message);
    });

    clients = [];
}

/**
 * Created by danansky on 06.01.14.
 */

var http = require('http');
var util = require('util');
var path = require('path');
var fs   = require('fs');
var url  = require('url');
//modification over winston module to separate logging level
var log  = require('./log')(module);

//include local  modules
var userModule = require('./user');
var dbModule   = require('./db');
var chat       = require('./chat');
//db.connect();

//http.createServer(function(request, response) {  //request event
//    response.writeHead(200, {
//        'Content-Type': 'text/plain' });
//    response.write("Hello , mr Fox");
//    setTimeout(function(){                       //timeout request
//        response.write("\n");
//        response.write("Bye , mr Fox");
//        log.info(request.url);
//        response.end();
//    }, 5000);
//}).listen(8080);
//
//log.info("Listening on port 8080");


var server = http.createServer(function(request, response){
    switch (request.url) {
        case '/':
            sendFile('index.html', response);
            break;
        case '/subscribe':
            chat.subscribe(request, response);
            break;
        case '/publish':
            var body = '';
            request
                .on("readable", function() {
                    body += request.read();

                    if (body.length > 1e4) {
                        response.statusCode = 413;
                        response.end("To much info for me");
                    }
                })
                .on('end', function() {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {
                        response.statusCode = 400;
                        response.end("Bad request");
                        return;
                    }
                    chat.publish(body.message);
                    response.end("ok");
                })
            break;
        default :
            response.statusCode = 404;
            response.end("Not found");
    }
}).listen(3000);

function sendFile(fileName, response) {
    var fileStream = fs.createReadStream(fileName);
    fileStream
        .on('error', function() {
            response.statusCode = 500;
            response.end("Server error");
        })
        .pipe(response);

    response.on("close", function() {
        fileStream.destroy();
    });
}

module.exports = server;
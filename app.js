
/**
 * Module dependencies.
 */

var express = require('express');
var http    = require('http');
var path    = require('path');
var config  = require('./config');
var log     = require('./libs/log')(module);
var engine  = require('ejs-locals');

var app = express();

app.engine('ejs', engine); //layout partial block
app.set('views', path.join(__dirname + '/views'));
app.set('view engine', 'ejs');

//Middleware
app.use(express.favicon());  //get small icon
if (app.get('env') == 'development') {
    app.use(express.logger('dev'));
} else {
    app.use(express.logger('default'));
}
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser());//'your secret here'
//app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));


//error handler
app.use(function(err, request, response, next) {
    // NODE_ENV = 'production'
    if (app.get('env') == 'development') {
        var errorHandler = app.use(express.errorHandler());
        errorHandler(err, request, response, next);
    } else {
        response.send(500);
    }
});


app.get('/', function(request, response, next) {
    response.render("index", {})
});


http.createServer(app).listen(config.get('port'), function(){
    log.info('Express server listening on port ' + config.get('port'));
});


//var routes = require('./routes');
//var user = require('./routes/user');


//// development only
//if ('development' == app.get('env')) {
//  app.use(express.errorHandler());
//}
//
//app.get('/', routes.index);
//app.get('/users', user.list);

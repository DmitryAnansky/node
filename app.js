
/**
 * Module dependencies.
 */

var express   = require('express');
var http      = require('http');
var path      = require('path');
var config    = require('./config');
var log       = require('./libs/log')(module);
var mongoose  = require('./libs/mongoose');
var engine    = require('ejs-locals');
var HttpError = require('./error').HttpError;


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

var MongoStore = require('connect-mongo')(express);
app.use(express.session(
    {
        secret: config.get('session:secret'),
        key: config.get('session:key'),
        cookie: config.get('session:cookie'),
        store: new MongoStore({mongoose_connection: mongoose.connection})
    }));
//app.use(function(request, response, next) {
//    request.session.numberOfVisits = request.session.numberOfVisits + 0.5 || 1;
//    response.send("Visits: " + request.session.numberOfVisits);
//});

app.use(require('./middleware/sendHttpError'));
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));


require('./routes')(app);


app.use(function(err, request, response, next) {
    if (typeof err == 'number') {
        err = new HttpError(err);
    }

    if (err instanceof HttpError) {
        response.sendHttpError(err);
    } else {
        if (app.get('env') == 'development') {
            var errorHandler = express.errorHandler();
            errorHandler(err, request, response, next);
        } else {
            log.error(err);
            err = new HttpError(500);
            response.sendHttpError(err);
        }
    }
});


http.createServer(app).listen(config.get('port'), function(){
    log.info('Express server listening on port ' + config.get('port'));
});


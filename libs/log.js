/**
 * Created by danansky on 10.01.14.
 */
var winston = require('winston');
var ENV = process.env.NODE_ENV;

function getLogger(module) {
    //get filename where error has occurred
    var path = module.filename.split('/').slice(-2).join('/');

    return new winston.Logger({
        transports: [
            new winston.transports.Console({
                colorize: true,
                lebel: (ENV == 'development') ? 'debug' : 'error',
                label: path
            })
        ]
    });
}

module.exports = getLogger;
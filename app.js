/**
 * Created by danansky on 09.01.14.
 */
var domain = require('domain');
var serverDomain = domain.create();

serverDomain
    .on("error", function(err) {
        console.log("Domain catch error: %s", err);
    });
serverDomain.run(function() {
        var server = require('./server');
        server.listen(3000);
    });
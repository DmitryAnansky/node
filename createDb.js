var mongoose = require('./libs/mongoose');
var User     = require('./models/user').User;

var user = new User({
    username: "Testerr",
    password: "secret"
});

user.save(function(err, user, affected) {
    if (err) throw err;
    User.findOne({username: "Testerr"}, function(err, tester) {
        if (err) throw err;
        console.log(tester);
    });
});
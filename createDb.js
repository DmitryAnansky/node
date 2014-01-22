var mongoose = require('./libs/mongoose');
//mongoose.set('debug', true);
var async    = require('async');


async.series([
    open,
    dropDatabase,
    requireModels,
    createUsers
], function(err, results) {
    console.log(arguments);
    mongoose.disconnect();
    process.exit(err ? 255 : 0);
});

function open(callback) {
    mongoose.connection.on('open', callback);
}

function dropDatabase(callback) {
    var db = mongoose.connection.db;
    db.dropDatabase(callback);
    console.log('DropDatabase: Ok');
}

function requireModels(callback) {
    require('./models/user').User;

    async.each(Object.keys(mongoose.models), function(modelName, callback) {
        mongoose.models[modelName].ensureIndexes(callback);
    }, callback);
}

function createUsers(callback) {
    var users = [
        {username: 'testOne', password: 'test1'},
        {username: 'testTwo', password: 'test2'},
        {username: 'testThree', password: 'test3'}
    ];
    async.each(users, function(userData, callback) {
        var user = new mongoose.models.User(userData);
        user.save(callback);
    }, callback);
}


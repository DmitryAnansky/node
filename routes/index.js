var checkAuth = require('../middleware/checkAuth');

module.exports = function(app) {
    app.get('/', require('./frontpage').get);

    app.get('/login', require('./login').get);
    app.post('/login', require('./login').post);

    app.post('/logout', require('./logout').post);

    app.get('/chat', checkAuth, require('./chat').get);

    app.get('/chat_rooms', checkAuth, require('./chatRooms').get);
    app.post('/create_room', checkAuth, require('./chatRooms').post);
}
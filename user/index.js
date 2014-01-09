/**
 * Created by danansky on 08.01.14.
 */

function User(email, password) {
    this.name = email;
    this.password = password;
}

User.prototype.hello = function (who) {
    console.log(who.name);
}

//exports
exports.User = User;

//test module functional
if (!module.parent) {
    //run some critical functions
    var testUsr = new User("Tony@gmail", "12345");
    testUsr.hello(testUsr);
}
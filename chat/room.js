function Room(name, id, owner) {
    this.name = name;
    this.id = id;
    this.owner = owner;
    this.room_members = [];
}

Room.prototype.addPerson = function(name) {
    this.room_members.push(name);
}

module.exports.Room = Room;
// var records = [
//     { id: 1, username: 'jack', password: 'secret', displayName: 'Jack', emails: [{ value: 'jack@example.com' }] },
//     { id: 2, "username": "jill", "password": 'birthday', "displayName": 'Jill', "emails": ['jill@example.com'] }
// ];


const dbinstance = require("../database").db;

var recordsById = [];
var recordsByName = [];
const collection = dbinstance.collection('users');
collection.all()
    .then(
        cursor => cursor.map(function(value) {
            return value;
        })
    ).then(
        results => {
            // map user by _id
            recordsById = [];
            for (var i = 0; i < results.length; i++) {
                recordsById[results[i]._id] = results[i];
                recordsByName[results[i].username] = results[i];
            }
        },
        err => console.log("Error loading user list: " + err)
    );


exports.findById = function(id, cb) {
    process.nextTick(function() {
        if (recordsById[id]) {
            cb(null, recordsById[id]);
        } else {
            cb(new Error('User ' + id + ' does not exist'));
        }
    });
}

exports.findByUsername = function(username, cb) {
    process.nextTick(function() {
        var record = recordsByName[username];
        if (record != null && record != undefined) {
            return cb(null, record);
        }

        return cb(null, null);
    });
}
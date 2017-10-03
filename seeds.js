var mongoose = require('mongoose');
var Friend = require('./models/friends');

function seedDB() {
    Friend.remove({}, function(err) {
        if(err) {
            console.log(err);
        }
        console.log("Cleaned up the database!");
    });    
}

module.exports = seedDB;
var mongoose = require('mongoose');
var Friend = require('./models/friends');

var data = [
    {
        name: "First Post",
        image: "https://images.pexels.com/photos/336413/pexels-photo-336413.jpeg?h=350&auto=compress&cs=tinysrgb",
        text: "Create professional resumes, CV and bio-data online for free, in minutes. Simply fill in your details and generate beautiful PDF and HTML resumes!"
        // created: {type: Date, default: Date.now}
    }
];
function seedDB() {
    Friend.remove({}, function(err) {
        if(err) {
            console.log(err);
        }
        console.log("Cleaned up the database!");
    });
    
    data.forEach(function(seed) {
        Friend.create(seed, function(err, data) {
            if(err) {
                console.log(err);
            } else {
                console.log("New Friend added!");
            }
        });   
    });
}

module.exports = seedDB;
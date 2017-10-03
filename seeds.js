var mongoose = require('mongoose');
var Friend = require('./models/friends');
var Comment = require('./models/comments');

var data = [
    {
        name: "First Post",
        image: "https://images.pexels.com/photos/336413/pexels-photo-336413.jpeg?h=350&auto=compress&cs=tinysrgb",
        text: "Create professional resumes, CV and bio-data online for free, in minutes. Simply fill in your details and generate beautiful PDF and HTML resumes!"
        // created: {type: Date, default: Date.now}
    },
    {
        name: "Welcome to Paris",
        image: "https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg?h=350&auto=compress&cs=tinysrgb",
        text: "A simple method using valid CSS to keep your footer at the bottom of the screen on pages with little content."
    },
    {
        name: "Here comes the Mustang!",
        image: "https://images.pexels.com/photos/340779/pexels-photo-340779.jpeg?h=350&auto=compress&cs=tinysrgb",
        text: "lectroshot - Capture website screenshots with optional device and network emulation as jpg, png or pdf (with web fonts!) using Electron / Chrome"
    }
];
function seedDB() {
    Friend.remove({}, function(err) {
        if(err) {
            console.log(err);
        }
        console.log("Cleaned up the database!");
        data.forEach(function(seed) {
            Friend.create(seed, function(err, friend) {
                if(err) {
                    console.log(err);
                } else {
                    console.log("New Friend added!");
                    Comment.create({
                        author: "Vishal",
                        text: "Lorem ipsum lore ti si ipsum"
                    }, function(err, comment) {
                        if(err) {
                            console.log(err);
                        } else {
                            console.log("New Comment!");
                            friend.comments.push(comment);
                            friend.save();
                        }
                    });
                }
            });   
        });
    });
}

module.exports = seedDB;
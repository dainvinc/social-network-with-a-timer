var express = require('express');
// var request = require('request');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

mongoose.connect("mongodb://localhost/time_bomb");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

var friendSchema = new mongoose.Schema({
    name: String,
    image: String,
    text: String,
    created: {type: Date, default: Date.now}
});

var Friend = mongoose.model("Friend", friendSchema);

app.get('/', function(req, res) {
    res.redirect('friends');
});

app.get('/friends', function(req, res) {
    Friend.find({}, function(err, friends) {
        if(err) {
            console.log("There's an error " +err);
        } else {
            res.render("friends", {friends: friends});
        }
    });
    // res.render("friends");
});

app.post('/friends', function(req, res) {
    Friend.create(req.body.friend, function(err, newFriend){
        if(err) {
            res.render("/friends/new");
        } else {
            res.redirect("/friends");
        }
    });
    //res.redirect("/friends");
});

app.get('/friends/new', function(req, res) {
    res.render("newfriends");
});

app.get('/friends/*', function(req, res) {
  res.send("What are you doing with your life?");
});

app.listen(process.env.PORT, process.env.IP, function() {
    console.log("Server has started...");
});
var express = require('express');
// var request = require('request');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

mongoose.connect("mongodb://localhost/time_bomb");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

var friends = [{
  name: "Cesare",
  image: "http://dummyimage.com/114x170.jpg/ff4444/ffffff"
}, {
  name: "Candis",
  image: "http://dummyimage.com/180x153.bmp/5fa2dd/ffffff"
}, {
  name: "Jannelle",
  image: "http://dummyimage.com/202x234.png/dddddd/000000"
}, {
  name: "Drusie",
  image: "http://dummyimage.com/234x162.jpg/cc0000/ffffff"
}, {
  name: "Aila",
  image: "http://dummyimage.com/113x134.png/dddddd/000000"
}, {
  name: "Englebert",
  image: "http://dummyimage.com/105x222.bmp/dddddd/000000"
}, {
  name: "Artemus",
  image: "http://dummyimage.com/134x208.jpg/5fa2dd/ffffff"
}, {
  name: "Brianna",
  image: "http://dummyimage.com/194x169.jpg/cc0000/ffffff"
}, {
  name: "Raynor",
  image: "http://dummyimage.com/249x153.png/dddddd/000000"
}, {
  name: "Alec",
  image: "http://dummyimage.com/195x124.bmp/5fa2dd/ffffff"
}];

app.get('/', function(req, res) {
    res.render('home', {friends: friends});
});

app.get('/friends', function(req, res) {
    res.render("friends");
});

app.get('/friends/new', function(req, res) {
    res.render("newfriends");
});

app.listen(process.env.PORT, process.env.IP, function() {
    console.log("Server has started...");
});
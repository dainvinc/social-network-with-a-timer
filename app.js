var express = require('express');
// var request = require('request');
var app = express();
var bodyParser = require('body-parser');
var expressSanitizer = require('express-sanitizer');
var methodOverride = require('method-override');
var mongoose = require('mongoose');

mongoose.connect("mongodb://localhost/time_bomb");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
//This should be written only after the BODY PARSER
app.use(expressSanitizer());
app.use(methodOverride("_method"));

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
});

app.get('/resume', function(req, res) {
    res.render("portfolio");
});

app.post('/friends', function(req, res) {
    req.body.friend.text = req.sanitize(req.body.friend.text);
    Friend.create(req.body.friend, function(err, newFriend){
        if(err) {
            res.render("/friends/new");
        } else {
            res.redirect("/friends");
        }
    });
});

app.get('/friends/new', function(req, res) {
    res.render("newfriends");
});

app.get('/friends/:id', function(req, res) {
    Friend.findById(req.params.id, function(err, foundFriend) {
        if(err) {
            res.redirect("/friends");
        } else {
            res.render("showFriend", {friend: foundFriend});
        }
    });
//   res.send("What are you doing with your life?");
});

app.get('/friends/:id/edit', function(req, res) {
//   res.send("Edit post"); 
    Friend.findById(req.params.id, function(err, foundFriend) {
       if(err) {
           res.redirect("/friends");
       } else {
           res.render("editpost", {friend: foundFriend});
       }
    });
});

app.put('/friends/:id', function(req, res) {
    // res.send("Post updated!");
    req.body.friend.text = req.sanitize(req.body.friend.text);
    Friend.findByIdAndUpdate(req.params.id, req.body.friend, 
    function(err, updatedFriend) {
        if(err) {
            res.redirect("/friends");
        } else {
            res.redirect("/friends/" +req.params.id);
        }
    });
});

app.delete('/friends/:id', function(req, res) {
    // res.send("Post deleted");
    Friend.findByIdAndRemove(req.params.id, function(err, deletedFriend) {
        if(err) {
            res.redirect("/friends");
        } else {
            res.redirect("/friends");
        }
    });
});

app.listen(process.env.PORT, process.env.IP, function() {
    console.log("Server has started...");
});
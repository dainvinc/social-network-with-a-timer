var express = require('express');
// var request = require('request');
var app = express();
var bodyParser = require('body-parser');
var expressSanitizer = require('express-sanitizer');
var methodOverride = require('method-override');
var mongoose = require('mongoose');
var Friend = require('./models/friends');
var seedDB = require('./seeds');

seedDB();
mongoose.connect("mongodb://localhost/time_bomb");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
//This should be written only after the BODY PARSER
app.use(expressSanitizer());
app.use(methodOverride("_method"));

app.get('/', function(req, res) {
    res.redirect('/friends');
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
            res.render("friends/new");
        } else {
            res.redirect("/friends");
        }
    });
});

app.get('/friends/new', function(req, res) {
    res.render("friends/newfriends");
});

app.get('/friends/:id', function(req, res) {
    Friend.findById(req.params.id).populate("comments").exec(function(err, foundFriend) {
        if(err) {
            res.redirect("/friends");
        } else {
            //console.log(foundFriend);
            res.render("friends/showFriend", {friend: foundFriend});
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
           res.render("friends/editpost", {friend: foundFriend});
       }
    });
});

app.post('/friends/:id', function(req, res) {
    Friend.create(req.body.friend.comments, function(err, newcomment) {
        if(err) {
            console.log(err);
        } else {
            res.redirect("/friends/:id");
        }
    });
});

app.get('/friends/:id/addcomment', function(req, res) {
    // res.send("New Comment!");
    Friend.findById(req.params.id, function(err, foundFriend) {
        if(err) {
            res.redirect("/friends/:id");
        } else {
            res.render("comments/addcomment", {friend: foundFriend});
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
var express = require('express');
// var request = require('request');
var app = express();
var bodyParser = require('body-parser');
var expressSanitizer = require('express-sanitizer');
var methodOverride = require('method-override');
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local');
var Friend = require('./models/friends');
var Comment = require('./models/comments');
var User = require('./models/user');
var seedDB = require('./seeds');

mongoose.connect("mongodb://localhost/time_bomb");
app.set("view engine", "ejs");
app.use(express.static(__dirname +"/public"));
app.use(bodyParser.urlencoded({extended: true}));
//This should be written only after the BODY PARSER
app.use(expressSanitizer());
app.use(methodOverride("_method"));
seedDB();

app.use(require("express-session")({
    secret: "I am new to this.",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get('/', function(req, res) {
    res.redirect('/friends');
});

app.get('/friends', isLoggedIn, function(req, res) {
    console.log(req.user);
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

app.get('/friends/:id/comments/new', function(req, res) {
    // res.send("New Comment!");
    Friend.findById(req.params.id, function(err, foundFriend) {
        if(err) {
            res.redirect("/friends/:id");
        } else {
            res.render("comments/addcomment", {friend: foundFriend});
        }
    });
});

app.post('/friends/:id/comments', function(req, res) {
    Friend.findById(req.params.id, function(err, friend) {
        if(err) {
            res.redirect("/friends");
        } else {
            Comment.create(req.body.comment, function(err, comment) {
                if(err) {
                    console.log(err);
                } else {
                    friend.comments.push(comment);
                    friend.save();
                    res.redirect("/friends/" +friend._id);
                }
            });
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

app.get('/signup', function(req, res) {
    res.render('signup');
});

app.post('/signup', function(req, res) {
    // res.send("Signing in...");
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user) {
        if(err) {
            console.log(err);
            return res.render("signup");
        }
        passport.authenticate("local")(req, res, function() {
            res.redirect("/friends");
        });
    });
});

app.get('/login', function(req, res) {
   res.render("login"); 
});

app.post('/login', passport.authenticate("local", {
    successRedirect: "/friends",
    failureRedirect: "/login"
}), function(req, res) {
    
});

app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/login');
})

function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
};

app.listen(process.env.PORT, process.env.IP, function() {
    console.log("Server has started...");
});
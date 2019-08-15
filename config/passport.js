let passport = require("passport");
let LocalStrategy = require("passport-local").Strategy;
let mongoose = require("mongoose");
let User = mongoose.model("User");

passport.use(
    new LocalStrategy({ usernameField: 'email', passwordField: 'password' }, function(username, password, done) {
        User.findOne({ email: username }, function(err, user) {
            if (err) {
                return done(err);
            }
            if (!user) {
                return done(null, false, { message: "Incorrect email address." });
            }
            if (!user.validPassword(password)) {
                return done(null, false, { message: "Incorrect password." });
            }
            return done(null, user);
        });
    })
);

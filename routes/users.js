var express = require('express');
var router = express.Router();
let mongoose = require("mongoose");
let User = mongoose.model("User");
let passport = require('passport');
let jwt = require('express-jwt');
let zxcvbn = require('zxcvbn');

let auth = jwt({ secret: process.env.FLITS_BACKEND_SECRET });

/* GET users listing. */
router.get("/", function (req, res, next) {
  let query = User.find();
  query.sort("fullName");
  query.exec(function (err, users) {
    if (err) return next(err);
    res.json(users);
  });
});

/* GET user by id. */
router.param("userid", function (req, res, next, id) {
  let query = User.findById(id);
  query.exec(function (err, user) {
    if (err) return next(err);
    if (!user) return next(new Error("not found " + id));
    req.user = user;
    return next();
  });
});

router.get("/id/:userid", function (req, res, next) {
  res.json(req.user);
});

/* GET user by email. */
router.param("email", function (req, res, next, email) {
  let query = User.find({ email: email });
  query.exec(function (err, user) {
    if (err) return next(err);
    if (!user) return next(new Error("not found " + email));
    req.user = user;
    return next();
  });
});

router.get("/:email", function (req, res, next) {
  res.json(req.user);
});

/* REGISTER / LOGIN functionality */
router.post("/checkemail", function (req, res, next) {
  User.find({ email: req.body.email }, function (err, result) {
    if (result.length) {
      res.json({ email: "alreadyexists" });
    } else {
      res.json({ email: "ok" });
    }
  });
});

router.post("/register", function (req, res, next) {
  // Check if all fields are filled in
  if (
      !req.body.email ||
      !req.body.password ||
      !req.body.fullName
  )
    return res.status(400).json({ message: "Please fill out all fields." });
  // Check if password is strong enough
  if (zxcvbn(req.body.password).score < 2)
    return res.status(400).json({msg: 'Password is not strong enough.'});

  let user = new User();
  user.email = req.body.email;
  user.setPassword(req.body.password);
  user.fullName = req.body.fullName;

  user.save(function (err) {
    if (err) {
      return next(err);
    }
    return res.json({ token: user.generateJWT() });
  });
});

router.post("/login", function (req, res, next) {
  // Check if all fields are filled in
  if (!req.body.email || !req.body.password) {
    return res.status(400).json({ message: "Please fill out all fields." });
  }
  passport.authenticate("local", function (err, user, info) {
    if (err) {
      return next(err);
    }
    if (user) {
      return res.json({ token: user.generateJWT() });
    } else {
      return res.status(401).json(info);
    }
  })(req, res, next);
});

module.exports = router;

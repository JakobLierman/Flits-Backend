var express = require('express');
var router = express.Router();
let mongoose = require('mongoose');
let SpeedCamera = mongoose.model("SpeedCamera");
let jwt = require('express-jwt');

let auth = jwt({ secret: process.env.FLITS_BACKEND_SECRET });

/* GET speedCameras listing. */
router.get('/', function(req, res, next) {
    let query = SpeedCamera.find().populate("User");
    query.exec(function(err, speedCameras) {
        if (err) return next(err);
        res.json(speedCameras);
    });
});

module.exports = router;

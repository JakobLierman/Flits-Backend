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

/* GET speedCamera by id. */
router.param("speedCameraId", function (req, res, next, id) {
    let query = SpeedCamera.findById(id).populate("User");
    query.exec(function (err, speedCamera) {
        if (err) return next(err);
        if (!speedCamera) return next(new Error("not found " + id));
        req.speedCamera = speedCamera;
        return next();
    });
});

router.get("/:speedCameraId", function (req, res, next) {
    res.json(req.speedCamera);
});

/* POST speedCamera */
router.post("/", auth, function (req, res, next) {
    let speedCamera = new SpeedCamera({
        location: req.body.location,
        kind: req.body.kind,
        description: req.body.description,
        imagePath: req.body.imagePath,
        likes: [],
        dislikes: [],
        timeCreated: req.body.timeCreated,
        expireDate: req.body.expireDate,
        user: req.body.user
    });
    speedCamera.save(function (err, speedCamera) {
        if (err) return next(err);
        res.json(speedCamera);
    });
});

/* DELETE speedCamera */
router.delete("/:speedCameraId", auth, function (req, res, next) {
    req.speedCamera.remove(function (err) {
        if (err) return next(err);
        res.json(req.speedCamera);
    });
});

module.exports = router;

var express = require('express');
var router = express.Router();
let mongoose = require('mongoose');
let AvgSpeedCheck = mongoose.model("AvgSpeedCheck");
let jwt = require('express-jwt');

let auth = jwt({ secret: process.env.FLITS_BACKEND_SECRET });

/* GET avgSpeedChecks listing. */
router.get('/', function(req, res, next) {
    let query = AvgSpeedCheck.find()
        .populate({path: "likes", populate: {path: "user"}})
        .populate({path: "dislikes", populate: {path: "user"}})
        .populate("user");
    query.sort("-timeCreated");
    query.exec(function(err, avgSpeedChecks) {
        if (err) return next(err);
        res.json(avgSpeedChecks);
    });
});

/* GET avgSpeedCheck by id. */
router.param("avgSpeedCheckId", function (req, res, next, id) {
    let query = AvgSpeedCheck.findById(id)
        .populate({path: "likes", populate: {path: "user"}})
        .populate({path: "dislikes", populate: {path: "user"}})
        .populate("user");
    query.exec(function (err, avgSpeedCheck) {
        if (err) return next(err);
        if (!avgSpeedCheck) return next(new Error("not found " + id));
        req.avgSpeedCheck = avgSpeedCheck;
        return next();
    });
});

router.get("/:avgSpeedCheckId", function (req, res, next) {
    res.json(req.avgSpeedCheck);
});

/* POST avgSpeedCheck */
router.post("/", auth, function (req, res, next) {
    let avgSpeedCheck = new AvgSpeedCheck({
        beginLocation: req.body.beginLocation,
        endLocation: req.body.endLocation,
        description: req.body.description,
        likes: [],
        dislikes: [],
        timeCreated: req.body.timeCreated,
        user: req.body.user
    });
    avgSpeedCheck.save(function (err, avgSpeedCheck) {
        if (err) return next(err);
        res.json(avgSpeedCheck);
    });
});

/* DELETE avgSpeedCheck */
router.delete("/:avgSpeedCheckId", auth, function (req, res, next) {
    req.avgSpeedCheck.remove(function (err) {
        if (err) return next(err);
        res.json(req.avgSpeedCheck);
    });
});

module.exports = router;

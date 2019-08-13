var express = require('express');
var router = express.Router();
let mongoose = require('mongoose');
let PoliceCheck = mongoose.model("PoliceCheck");
let jwt = require('express-jwt');
let moment = require('moment');

let auth = jwt({ secret: process.env.FLITS_BACKEND_SECRET });

/* GET policeChecks listing. */
router.get('/', function(req, res, next) {
    let query = PoliceCheck.find()
        .populate({path: "likes", populate: {path: "user"}})
        .populate({path: "dislikes", populate: {path: "user"}})
        .populate("user");
    query.sort("-timeCreated");
    query.exec(function(err, policeChecks) {
        if (err) return next(err);
        res.json(policeChecks);
    });
});

/* GET policeCheck by id. */
router.param("policeCheckId", function (req, res, next, id) {
    let query = PoliceCheck.findById(id)
        .populate({path: "likes", populate: {path: "user"}})
        .populate({path: "dislikes", populate: {path: "user"}})
        .populate("user");
    query.exec(function (err, policeCheck) {
        if (err) return next(err);
        if (!policeCheck) return next(new Error("not found " + id));
        req.policeCheck = policeCheck;
        return next();
    });
});

router.get("/:policeCheckId", function (req, res, next) {
    res.json(req.policeCheck);
});

/* POST policeCheck */
router.post("/", auth, function (req, res, next) {
    let policeCheck = new PoliceCheck({
        location: req.body.location,
        description: req.body.description,
        imagePath: req.body.imagePath,
        likes: [],
        dislikes: [],
        timeCreated: req.body.timeCreated,
        user: req.body.user
    });
    policeCheck.expireDate = calculateExpireDate(policeCheck.timeCreated);
    policeCheck.save(function (err, policeCheck) {
        if (err) return next(err);
        res.json(policeCheck);
    });
});

function calculateExpireDate(timeCreated) {
    return moment(timeCreated).add(4, 'h').toDate();
}

/* DELETE policeCheck */
router.delete("/:policeCheckId", auth, function (req, res, next) {
    req.policeCheck.remove(function (err) {
        if (err) return next(err);
        res.send(true);
    });
});

module.exports = router;

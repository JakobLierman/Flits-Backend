var express = require('express');
var router = express.Router();
let mongoose = require('mongoose');
let PoliceCheck = mongoose.model("PoliceCheck");
let jwt = require('express-jwt');

let auth = jwt({ secret: process.env.FLITS_BACKEND_SECRET });

/* GET policeChecks listing. */
router.get('/', function(req, res, next) {
    let query = PoliceCheck.find().populate("User");
    query.exec(function(err, policeChecks) {
        if (err) return next(err);
        res.json(policeChecks);
    });
});

/* GET policeCheck by id. */
router.param("policeCheckId", function (req, res, next, id) {
    let query = PoliceCheck.findById(id).populate("User");
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
        timeCreated: req.body.timeCreated,
        expireDate: req.body.expireDate,
        user: req.body.user
    });
    policeCheck.save(function (err, policeCheck) {
        if (err) return next(err);
        res.json(policeCheck);
    });
});

/* DELETE policeCheck */
router.delete("/:policeCheckId", auth, function (req, res, next) {
    req.policeCheck.remove(function (err) {
        if (err) return next(err);
        res.json(req.policeCheck);
    });
});

module.exports = router;

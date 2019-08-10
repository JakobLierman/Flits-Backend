var express = require('express');
var router = express.Router();

/* GET speedCameras listing. */
router.get('/', function(req, res, next) {
    let query = SpeedCamera.find().populate("User");
    query.exec(function(err, speedCameras) {
        if (err) return next(err);
        res.json(speedCameras);
    });
});

module.exports = router;

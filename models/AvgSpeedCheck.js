let mongoose = require('mongoose');

let AvgSpeedCheckSchema = new mongoose.Schema({
    beginLocation: { type: String, required: true },
    endLocation: { type: String, required: true },
    description: String,
    timeCreated: { type: Date, required: true, default: Date.now },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

mongoose.model('AvgSpeedCheck', AvgSpeedCheckSchema);
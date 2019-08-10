let mongoose = require('mongoose');

let PoliceCheckSchema = new mongoose.Schema({
    location: { type: String, required: true },
    description: String,
    imagePath: String,
    timeCreated: { type: Date, required: true, default: Date.now },
    expireDate: Date,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

mongoose.model('PoliceCheck', PoliceCheckSchema);
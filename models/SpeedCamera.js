let mongoose = require('mongoose');

let SpeedCameraSchema = new mongoose.Schema({
    location: { type: String, required: true },
    kind: { type: String, required: true },
    description: String,
    imagePath: String,
    timeCreated: { type: Date, required: true, default: Date.now },
    expireDate: Date,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

mongoose.model('SpeedCamera', SpeedCameraSchema);
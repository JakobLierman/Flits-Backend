let mongoose = require('mongoose');

let PoliceCheckSchema = new mongoose.Schema({
    location: { type: String, required: true },
    description: { type: String, default: "" },
    imagePath: { type: String, default: "" },
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    dislikes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    timeCreated: { type: Date, required: true, default: Date.now },
    expireDate: Date,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

mongoose.model('PoliceCheck', PoliceCheckSchema);
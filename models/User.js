let mongoose = require('mongoose');

let UserSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    hash: String,
    salt: String
});

mongoose.model('User', UserSchema);
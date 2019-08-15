let mongoose = require('mongoose');
let crypto = require('crypto');
let jwt = require('jsonwebtoken');

let UserSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    hash: String,
    salt: String,
    tempToken: String
});

UserSchema.methods.setPassword = function (password) {
    this.salt = crypto.randomBytes(32).toString('hex');
    this.hash = crypto
        .pbkdf2Sync(password, this.salt, 10000, 64, 'sha512')
        .toString('hex');
};

UserSchema.methods.validPassword = function (password) {
    let hash = crypto
        .pbkdf2Sync(password, this.salt, 10000, 64, 'sha512')
        .toString('hex');
    return this.hash === hash;
};

UserSchema.methods.generateJWT = function () {
    var today = new Date();
    var exp = new Date(today);
    exp.setDate(today.getDate() + 60);
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            fullName: this.fullName,
            exp: parseInt(exp.getTime() / 1000)
        },
        process.env.FLITS_BACKEND_SECRET
    );
};

mongoose.model('User', UserSchema);
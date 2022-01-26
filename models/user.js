const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
// Passport-Local Mongoose will add a username, hash and salt field to store the username, the hashed password and the salt value.

const userSchema = new mongoose.Schema({
    email: {type: String, unique: true, required: true},
    password: String,
    resetPasswordToken: String,
    resetPasswordExpires: Date
});

userSchema.plugin(passportLocalMongoose, { usernameField : 'email' });

module.exports = mongoose.model('User', userSchema);
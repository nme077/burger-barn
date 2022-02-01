const mongoose = require('mongoose');

const joinTokenSchema = new mongoose.Schema({
    token: String,
    tokenExpires: Date,
    email: String
});

module.exports = mongoose.model('JoinToken', joinTokenSchema);
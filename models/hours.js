const mongoose = require('mongoose');

const hoursSchema = new mongoose.Schema({
    text: String
});

module.exports = mongoose.model('Hours', hoursSchema);
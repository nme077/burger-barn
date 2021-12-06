const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
    name: String,
    category: String,
    prices: [
        [String]
    ],
    description: String
});

module.exports = mongoose.model('MenuItem', menuItemSchema);
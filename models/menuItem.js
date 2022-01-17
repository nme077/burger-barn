const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
    name: String,
    category: String,
    prices: [
        [String]
    ],
    description: String,
    order: Number
});

module.exports = mongoose.model('MenuItem', menuItemSchema);
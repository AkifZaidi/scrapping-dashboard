const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
    number: String,
    carName: String,
    location: String,
    price: String,
}, {
    timestamps: true, // Adds createdAt and updatedAt timestamps
});

module.exports = mongoose.model('Car', carSchema);

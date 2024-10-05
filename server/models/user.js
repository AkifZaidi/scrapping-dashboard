const mongoose = require("mongoose");


const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    date: {
        type: Date,
        default: Date.now,
        required: true
    }, 
    role: { type: String, enum: ['user', 'admin'], default: 'user' }  // Add a role field
})

module.exports = userModel = mongoose.model("user", userSchema)
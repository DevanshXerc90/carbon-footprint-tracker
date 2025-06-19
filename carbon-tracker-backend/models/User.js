const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    wardrobe: [
        {
            itemType: String,
            material: String,
            quantity: Number,
            carbonFootprint: Number,
            dateAdded: { type: Date, default: Date.now },
        },
    ],
});

module.exports = mongoose.model("User", userSchema);

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    rating: { type: Number, default: 1000 },
    registrationDate: { type: Date, default: Date.now },
    achievements: [{ type: String }],
    totalTimePlayed: { type: Number, default: 0 }, // У хвилинах
    messagesSent: { type: Number, default: 0 },
    gamesPlayed: { type: Number, default: 0 },
    wins: { type: Number, default: 0 },
    losses: { type: Number, default: 0 },
});

module.exports = mongoose.model('User', userSchema);
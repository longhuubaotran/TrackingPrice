const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  players: [
    {
      name: { type: String, required: true },
      rating: { type: Number, required: true },
      xbPrice: { type: Number, required: true },
      psPrice: { type: Number, required: true },
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", userSchema);

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  players: [
    {
      name: { type: String, required: true },
      rating: { type: Number, required: true },
      pos: { type: String, required: true },
      psPrice: { type: Number, required: true },
      xbPrice: { type: Number, required: true },
      pcPrice: { type: Number, required: true },
      link: { type: String, required: true },
    },
  ],
  createdAt: { type: Date, default: Date.now },
  autoScan: { type: Boolean, required: true },
});

module.exports = mongoose.model('User', userSchema);

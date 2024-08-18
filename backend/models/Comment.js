const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  text: { type: String },
  userName: { type: String, required: true },
  rating: { type: Number },
  createdAt: { type: Date },
});

module.exports = mongoose.model('Comment', commentSchema);

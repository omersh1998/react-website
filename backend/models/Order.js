const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  products: { type: Object, required: true },
  price: { type: Number, required: true },
  createdAt: { type: Date },
});

module.exports = mongoose.model('Order', orderSchema);

const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  category: { type: String },
  subcategory: { type: String },
  image: { type: String },
  info: { type: Object }
});

module.exports = mongoose.model('Product', productSchema);

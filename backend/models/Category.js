const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the category schema
const categorySchema = new Schema({
  name: { type: String, required: true },
  subcategories: [String],
  filters: [Object]
});

// Create and export the model
const Category = mongoose.model('Category', categorySchema);
module.exports = Category;

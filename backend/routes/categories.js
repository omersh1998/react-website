const express = require("express");
const router = express.Router();
const Category = require("../models/Category");

router.get('/', async (req, res) => {
  try {
    // Fetch all categories from the database
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get the filters for the categories
router.get('/filters', async (req, res) => {
  const { category } = req.query;

  if (!category) {
    return res.status(400).json({ message: 'Category parameter is required' });
  }

  try {
    // Use a case-insensitive regex to find the category
    const categoryData = await Category.findOne({ name: new RegExp('^' + category + '$', 'i') }).exec();

    if (!categoryData) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Return only the filters for the specified category
    res.json(categoryData.filters || []);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
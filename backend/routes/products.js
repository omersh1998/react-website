const express = require('express');
const router = express.Router();
const Product = require('../models/Product'); // Adjust the path as needed

// Fetch products and filter counts based on the selected category and filters
router.get('/products', async (req, res) => {
  try {
    const { category, subcategory, filters = {}, offset = 0, limit = 10 } = req.query;

    // Build query object based on category and subcategory
    let query = {};
    if (category) query['category'] = category;
    if (subcategory) query['subcategory'] = subcategory;

    // Handle filters
    for (const [key, value] of Object.entries(filters)) {
      if (Array.isArray(value) && value.length > 0) {
        query[`info.${key}`] = { $in: value };
      }
    }

    // Fetch products with pagination
    const products = await Product.find(query)
      .skip(Number(offset))
      .limit(Number(limit));

    // Count total products matching the query
    const totalProducts = await Product.countDocuments(query);

    // Fetch counts for each filter option
    const filterCounts = await getFilterCounts(query);

    res.json({
      products,
      totalProducts,
      filterCounts
    });
  } catch (err) {
    console.error('Failed to fetch products:', err);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Function to get counts for each filter option
const getFilterCounts = async (query) => {
  const filterCategories = ['brand', 'color']; // List your filter categories here

  const filterCounts = {};

  for (const category of filterCategories) {
    filterCounts[category] = {};

    // Extract distinct values for filter categories
    const distinctValues = await Product.distinct(`info.${category}`, query);

    for (const value of distinctValues) {
      const count = await Product.countDocuments({
        ...query,
        [`info.${category}`]: value
      });
      filterCounts[category][value] = count;
    }
  }

  return filterCounts;
};

module.exports = router;

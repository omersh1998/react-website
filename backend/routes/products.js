const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

// Get products
router.post('/', async (req, res) => {
  try {
    const { offset = 0, limit = 10, sortBy, category, subcategory, filters } = req.body;

    // Initialize query for all products
    let query = Product.find();

    // Apply category filter if present
    if (category) {
      query = query.where('category').regex(new RegExp(`^${category}$`, 'i'));
    }

    // Apply subcategory filter if present, with case-insensitivity
    if (subcategory) {
      query = query.where('subcategory').regex(new RegExp(`^${subcategory}$`, 'i'));
    }

    // Apply sorting if present
    if (sortBy) {
      query = query.sort(sortBy);
    }

    if (filters) {
      // Create an array for AND conditions
      const andConditions = [];

      for (const [key, values] of Object.entries(filters)) {
        if (values.length > 0) {
          // OR condition for each filter category
          andConditions.push({
            [`info.${key}`]: { $in: values }
          });
        }
      }

      if (andConditions.length > 0) {
        query = query.where({ $and: andConditions });
      }
    }

    const products = await query.skip(parseInt(offset)).limit(parseInt(limit)).exec();
    const totalProducts = await Product.countDocuments(query.getQuery());

    // Execute query and return results
    res.json({
      products,
      totalProducts
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get specific product details
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

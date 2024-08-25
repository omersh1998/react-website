const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const Comment = require("../models/Comment");

const upload = require('../utils/multerConfig');

// Get products
router.post('/', async (req, res) => {
  try {
    const { offset = 0, limit = 10, sort = 'priceAsc', category, subcategory, filters } = req.body;
    let sortOrder = { 'price': 1 };

    // ----- Start to create query ----- //

    let query = Product.find();

    if (category) {
      query = query.where('category').regex(new RegExp(`^${category}$`, 'i'));
    }

    if (subcategory) {
      query = query.where('subcategory').regex(new RegExp(`^${subcategory}$`, 'i'));
    }

    if (sort) {
      if (sort == 'priceDesc') {
        sortOrder = { 'price': -1 };
      }

      if (sort == 'rating') {
        sortOrder = { 'rating.rate': -1 };
      }
    }

    console.log(sortOrder);
    console.log('sortOrder');

    query = query.sort(sortOrder);

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

    // ----- End creating query ----- //

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

router.put('/:id', async (req, res) => {
  const { update } = req.body;
  const imagesToAdd = update.images;
  try {
    const product = await Product.findOneAndUpdate({_id: req.params.id}, update);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({...product, message: 'Product Updated'});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({...product, message: 'Product Deleted'});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id/comments', async (req, res) => {
  try {
    const comments = await Comment.find({productId: req.params.id});
    res.json(comments);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: err.message });
  }
});

// Create new product endpoint
router.post('/create-product', upload.array('images', 5), async (req, res) => {
  try {
    const { name, description, price, category, subcategory, rating, info } = req.body;

    const protocol = req.protocol;
    const host = req.get('host');
    const baseUrl = `${protocol}://${host}`;

    // Process uploaded images and generate URLs
    const imageUrls = req.files.map(file => `${baseUrl}/uploads/${file.filename}`);

    // Create new product
    const newProduct = new Product({
      name,
      description,
      price,
      category,
      subcategory,
      rating: { rate: rating },
      info: JSON.parse(info), // info should be sent as a stringified JSON
      images: imageUrls
    });

    await newProduct.save();

    res.status(201).json({ message: 'Product created successfully', product: newProduct });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Failed to create product' });
  }
});

router.post('/:id/comment', async (req, res) => {
  try {
    const { text, rating, userName } = req.body;
    const newComment = new Comment({ productId: req.params.id, text, rating, userName, createdAt: new Date() });

    await newComment.save();

    res.status(201).json(newComment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;

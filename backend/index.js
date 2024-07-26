const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Product = require('./models/Product');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb+srv://omer:omersh123@cluster0.qqvyuqd.mongodb.net/react-store', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Verify MongoDB connection
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Routes
app.get('/all-products', async (req, res) => {
  try {
    const { offset, limit, sortBy } = req.query;

    let query = Product.find();

    if (offset) {
      query = query.skip(parseInt(offset));
    }

    if (limit) {
      query = query.limit(parseInt(limit));
    }

    if (sortBy) {
      query = query.sort(sortBy);
    }

    const products = await query.exec();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/product/:id', async (req, res) => {
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

app.get('/search', async (req, res) => {
  try {
    const name = req.query.name;

    if (!name) {
      return res.status(400).json({ message: 'Query parameter "name" is required' });
    }

    // Use a case-insensitive regex search to find products with names containing the query
    const products = await Product.find({ name: { $regex: new RegExp(name, 'i') } }).exec();
    
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

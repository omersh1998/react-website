// Dependencies
const express = require('express');
const logger = require("morgan");
const mongoose = require('mongoose');
const cors = require('cors');
const Product = require('./models/Product');
const Category = require('./models/Category');

// Express app
const app = express();
const port = 5000;

// App middleware
app.use(logger("dev"));
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
const productsRouter = require("./routes/products");
const categoriesRouter = require("./routes/categories");

// App Routes
app.use('/products', productsRouter);
app.use('/categories', categoriesRouter);

app.get('/search', async (req, res) => {
  try {
    const name = req.query.name;

    if (!name) {
      return res.status(400).json({ message: 'Query parameter "name" is required' });
    }

    // Use a case-insensitive regex search to find products with names containing the query
    const textToSearch = name ? name.toString() : "";
    const regexPattern = new RegExp(`.*${textToSearch}.*`, "i");

    const products = await Product.find({ name: { $regex: regexPattern } }).exec();
    
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

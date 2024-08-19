const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');

router.post('/', async (req, res) => {
  try {
    const { products, price, userId } = req.body;

    const newOrder = new Order({
      userId,
      products,
      price,
      createdAt: new Date(),
    });

    await newOrder.save();

    res.status(201).json(newOrder); // Respond with the created order
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id', async (req, res) => {
  const userId = req.params.id;
  try {
    const orders = await Order.find({ userId }); // Fetch orders for the logged-in user

    // Extract all product IDs from the orders
    const productIds = orders.flatMap(order =>
      order.products.map(product => product.productId)
    );

    // Remove duplicates
    const uniqueProductIds = [...new Set(productIds)];

    // Fetch product details for the unique product IDs
    const products = await Product.find({ _id: { $in: uniqueProductIds } });
    const productMap = products.reduce((acc, product) => {
      acc[product._id.toString()] = product.name;
      return acc;
    }, {});

    // Map product names to orders
    const ordersWithProductNames = orders.map(order => ({
      ...order.toObject(),
      products: order.products.map(product => ({
        ...product,
        name: productMap[product.productId.toString()] || 'Unknown'
      }))
    }));

    res.json(ordersWithProductNames);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

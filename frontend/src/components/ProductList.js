import React from 'react';
import Product from './Product'; // Import the Product component
import '../styles/ProductList.css'; // Import CSS for ProductList styles

const ProductList = ({ addToCart }) => {
  // Sample product data - Replace with actual data fetching logic
  const products = [
    {
      _id: '1',
      name: 'Product 1',
      price: 19.99,
      image: 'https://via.placeholder.com/300',
    },
    {
      _id: '2',
      name: 'Product 2',
      price: 29.99,
      image: 'https://via.placeholder.com/300',
    },
    {
      _id: '3',
      name: 'Product 3',
      price: 39.99,
      image: 'https://via.placeholder.com/300',
    },
    // Add more products as needed
  ];

  return (
    <div className="product-list">
      {products.map(product => (
        <Product key={product._id} product={product} addToCart={addToCart} />
      ))}
    </div>
  );
};

export default ProductList;

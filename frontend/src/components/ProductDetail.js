import React from 'react';
import { useParams } from 'react-router-dom';

const ProductDetail = () => {
  let { productId } = useParams();

  // Simulated product data - Replace with actual data fetching logic
  const product = {
    _id: productId,
    name: 'Sample Product',
    price: 99.99,
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed et consectetur ipsum.',
    images: ['image1.jpg', 'image2.jpg', 'image3.jpg'],
    // Add more details as needed
  };

  return (
    <div className="product-detail">
      <h2>{product.name}</h2>
      <img src={product.images[0]} alt={product.name} className="product-detail-image" />
      <p className="product-detail-price">${product.price.toFixed(2)}</p>
      <p className="product-detail-description">{product.description}</p>
      {/* Add more images or details as needed */}
    </div>
  );
};

export default ProductDetail;

import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Product.css'; // Import CSS for Product styles

const Product = ({ product, addToCart }) => {
  return (
    <div className="product">
      <Link to={`/products/${product._id}`} className="product-link">
        <img src={product.images[0]} alt={product.name} className="product-image" />
        <div className="product-info">
          <p className="product-name">{product.name}</p>
          <p className="product-price">${product.price.toFixed(2)}</p>
        </div>
      </Link>
      <button onClick={() => addToCart(product)} className="add-to-cart-button">Add to Cart</button>
    </div>
  );
};

export default Product;

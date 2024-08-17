import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Product.css'; // Import CSS for Product styles

const Product = ({ product, addToCart }) => {

  const renderStars = (rating) => {
    const totalStars = 5;
    const filledStars = Math.round(rating); // Ensure rating is rounded to nearest integer
    const stars = [];

    for (let i = 1; i <= totalStars; i++) {
      stars.push(
        <span key={i} className={`star ${i <= filledStars ? 'filled' : 'grey'}`}>
          &#9733;
        </span>
      );
    }

    return stars;
  };

  return (
    <div className="product">
      <Link to={`/products/${product._id}`} className="product-link">
        <img src={product.images[0]} alt={product.name} className="product-image" />

        <div className="product-info">
          <div className="product-name">
            {product.name}
            {product.name.length > 20 && ( // Only add tooltip if the name is long
              <div className="product-name-tooltip">
                {product.name}
              </div>
            )}
          </div>
          <div className="product-price">${product.price.toFixed(2)}</div>
        </div>
        {product.rating && product.rating.rate && (
          <div className="product-rating">
            {renderStars(product.rating.rate)}
          </div>
        )}
      </Link>
      <button onClick={() => addToCart(product)} className="add-to-cart-button">Add to Cart</button>
    </div>
  );
};

export default Product;

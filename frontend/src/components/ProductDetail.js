import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../axiosConfig'; // Ensure axios is configured correctly
import '../styles/ProductDetail.css'; // Import your CSS file

const ProductDetail = ({ addToCart }) => {
  const { productId } = useParams(); // Get productId from URL parameters
  const [product, setProduct] = useState(null); // State to hold product data
  const [loading, setLoading] = useState(true); // State for loading
  const [error, setError] = useState(null); // State for error
  const [selectedImage, setSelectedImage] = useState(''); // State for selected image
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`/products/${productId}`); // Fetch product data from server
        setProduct(response.data); // Set product data
        setSelectedImage(response.data.images[0]); // Set default selected image
      } catch (err) {
        setError(err.message); // Set error message
      } finally {
        setLoading(false); // Set loading to false
      }
    };

    const fetchComments = async () => {
      try {
        const response = await axios.get(`/products/${productId}/comments`);
        setComments(response.data); // Set the comments data
      } catch (err) {
        console.error("Error fetching comments", err);
      }
    };

    fetchProduct();
    fetchComments();
  }, [productId]);

  const renderStars = (rating) => {
    const totalStars = 5;
    const filledStars = Math.round(rating); // Round to the nearest star
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
  };

  if (loading) return <p>Loading...</p>; // Display loading message
  if (error) return <p>Error: {error}</p>; // Display error message
  if (!product) return <p>Product not found</p>; // Handle case where no product is found

  return (
    <div className="product-detail">
      <div className="product-detail-container">
        <div className="product-detail-left">
          <div className="image-preview">
            {product.images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Thumbnail ${index}`}
                className="thumbnail"
                onClick={() => setSelectedImage(image)}
              />
            ))}
          </div>
          <div className="main-image">
            <img src={selectedImage} alt={product.name} />
          </div>
        </div>

        <div className="product-detail-right">
          <div className="product-info">
            <h2>{product.name}</h2>
            <p className="product-detail-price">${product.price.toFixed(2)}</p>
          </div>
          <p className="product-detail-description">{product.description}</p>
          <div className="add-to-cart-wrapper">
            <button onClick={() => addToCart(product)} className="add-to-cart-button">Add to Cart</button>
          </div>
        </div>
      </div>

      <div className="product-comments-card">
        <div className="product-comments">
          <h3>Customer Reviews</h3>
          {comments.length === 0 ? (
            <p>No reviews yet.</p>
          ) : (
            comments.map((comment, index) => (
              <div key={index} className="comment">
                <p>{formatDate(comment.createdAt)}</p>
                <p><strong>{comment.userName || 'Anonymous'}</strong></p>
                <p>{comment.text}</p>
                <div className="comment-stars">
                  {renderStars(comment.rating)} {/* Display stars based on comment rating */}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;

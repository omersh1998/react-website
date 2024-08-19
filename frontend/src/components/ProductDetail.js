import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../axiosConfig'; // Ensure axios is configured correctly
import '../styles/ProductDetail.css'; // Import your CSS file

const ProductDetail = ({ addToCart, isAdmin, username }) => {
  const { productId } = useParams(); // Get productId from URL parameters
  const navigate = useNavigate();
  const [product, setProduct] = useState(null); // State to hold product data
  const [loading, setLoading] = useState(true); // State for loading
  const [error, setError] = useState(null); // State for error
  const [selectedImage, setSelectedImage] = useState(''); // State for selected image
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(1); // Default rating to 1
  const [isEditing, setIsEditing] = useState(false); // State for edit mode
  const [editProduct, setEditProduct] = useState({
    name: '',
    price: '',
    description: '',
    images: []
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`/products/${productId}`); // Fetch product data from server
        setProduct(response.data); // Set product data
        setSelectedImage(response.data.images[0]); // Set default selected image
        setEditProduct({
          name: response.data.name,
          price: response.data.price,
          description: response.data.description,
          images: response.data.images
        });
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

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    // Reset the editProduct state to the original product details
    if (product) {
      setEditProduct({
        name: product.name,
        price: product.price,
        description: product.description,
        images: product.images
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setEditProduct((prev) => ({ ...prev, images: files.map(file => URL.createObjectURL(file)) }));
  };

  const handleSaveChanges = async () => {
    try {
      const update = {
        name: editProduct.name,
        price: parseFloat(editProduct.price),
        description: editProduct.description,
        images: editProduct.images
      };

      await axios.put(`/products/${productId}`, { update });
      // Reload the product data after saving
      const response = await axios.get(`/products/${productId}`);
      setProduct(response.data);
      setIsEditing(false);
    } catch (err) {
      console.error("Error saving product details", err);
    }
  };

  const handleDeleteProduct = async () => {
    try {
      await axios.delete(`/products/${productId}`);
      navigate('/'); // Redirect to homepage after deletion
    } catch (err) {
      console.error("Error deleting product", err);
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    try {
      const userName = username || 'Anonymous';
      const response = await axios.post(`/products/${productId}/comment`, { text: newComment, rating: newRating, userName });
      setComments([...comments, response.data]); // Add the new comment to the list
      setNewComment('');
      setNewRating(1);
    } catch (err) {
      console.error("Error adding comment:", err);
    }
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
          {isAdmin && !isEditing && (
            <div className="edit-icon" onClick={handleEditClick}>
              ✎
            </div>
          )}
          {isAdmin && isEditing && (
            <div className="edit-form">
              <h3>Edit Product</h3>
              <label>
                Name:
                <input type="text" name="name" value={editProduct.name} onChange={handleInputChange} />
              </label>
              <label>
                Price:
                <input type="number" name="price" value={editProduct.price} onChange={handleInputChange} />
              </label>
              <label>
                Description:
                <textarea name="description" value={editProduct.description} onChange={handleInputChange} />
              </label>
              <label>
                Images:
                <input type="file" multiple onChange={handleImageChange} />
                <div className="image-previews">
                  {editProduct.images.map((image, index) => (
                    <img key={index} src={image} alt={`Preview ${index}`} className="image-preview" />
                  ))}
                </div>
              </label>
              <button onClick={handleSaveChanges}>Save Changes</button>
              <button onClick={handleCancelEdit}>Cancel</button>
              <button onClick={handleDeleteProduct} className="delete-button">Delete Product</button>
            </div>
          )}
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
          <form onSubmit={handleSubmitComment} className="comment-form">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add your comment"
              required
            />
            <div>
              <label>Rating:</label>
              {[1, 2, 3, 4, 5].map((rate) => (
                <span
                  key={rate}
                  style={{ color: rate <= newRating ? 'black' : 'grey', cursor: 'pointer' }}
                  onClick={() => setNewRating(rate)}
                >
                  ★
                </span>
              ))}
            </div>
            <button type="submit">Submit Comment</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;

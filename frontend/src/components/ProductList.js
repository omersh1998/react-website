import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../axiosConfig'; // Import the configured Axios instance
import Product from './Product'; // Adjust the path as needed
import LoadingSpinner from './LoadingSpinner';
import '../styles/ProductList.css'; // For your styles

const ProductList = ({ addToCart }) => {
  const { category, subcategory } = useParams(); // Extracts category from URL params
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSpinner, setShowSpinner] = useState(true);

  useEffect(() => {
    let isMounted = true;
    let spinnerTimeout;

    const fetchProducts = async () => {
      try {
        setLoading(true);

        // Start a timer to show spinner for at least 300ms
        spinnerTimeout = setTimeout(() => setShowSpinner(true), 300);

        let query = '/all-products';
        if (category) {
          query += `?category=${category}`;
          if (subcategory) {
            query += `&subcategory=${subcategory}`;
          }
        }

        const response = await axios.get(query);
        if (isMounted) {
          setProducts(response.data);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError('Failed to fetch products');
        }
      } finally {
        if (isMounted) {
          clearTimeout(spinnerTimeout); // Clear spinner timer
          setLoading(false);
          // Ensure spinner is hidden only after content is fully loaded
          setTimeout(() => setShowSpinner(false), 300);
        }
      }
    };

    fetchProducts();

    return () => {
      isMounted = false;
      clearTimeout(spinnerTimeout); // Clean up the timer on unmount
    };
  }, [category, subcategory]);

  if (loading || showSpinner) {
    return <LoadingSpinner />; // Use the new loading spinner component
  }

  if (error) {
    return <div className="error-message">{error}</div>; // Display error message
  }

  return (
    <div className="product-list">
      {products.length === 0 ? (
        <div className="no-results">
          <h2>No results found for your search</h2>
        </div>
      ) : (
        products.map(product => (
          <Product key={product._id} product={product} addToCart={addToCart} />
        ))
      )}
    </div>
  );
};

export default ProductList;

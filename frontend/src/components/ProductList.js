import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../axiosConfig'; // Import the configured Axios instance
import Product from './Product'; // Adjust the path as needed
import LoadingSpinner from './LoadingSpinner';
import '../styles/ProductList.css'; // For your styles

const ProductList = ({ addToCart, setCurrentCategory, selectedFilters, searchProducts }) => {
  const { category, subcategory } = useParams();
  const [products, setProducts] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [error, setError] = useState(null);
  const [showSpinner, setShowSpinner] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(10);

  useEffect(() => {
    if (category) {
      setCurrentCategory(category); // Set the current category for the App component
    }
  }, [category, setCurrentCategory]);

  useEffect(() => {
    let isMounted = true;
    let spinnerTimeout;

    const fetchProducts = async () => {
      try {
        setShowSpinner(true);

        spinnerTimeout = setTimeout(() => setShowSpinner(true), 1000);

        const response = await axios.post('/products', {
          category,
          subcategory,
          offset: (currentPage - 1) * productsPerPage,
          limit: productsPerPage,
          filters: selectedFilters // Include filters in request
        });

        if (isMounted) {
          setProducts(response.data.products);
          setTotalProducts(response.data.totalProducts);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          console.log(err);
          setError('Failed to fetch products');
        }
      } finally {
        if (isMounted) {
          clearTimeout(spinnerTimeout);
          setTimeout(() => setShowSpinner(false), 1000);
        }
      }
    };

    fetchProducts();

    return () => {
      isMounted = false;
      clearTimeout(spinnerTimeout);
    };
  }, [category, subcategory, currentPage, selectedFilters, productsPerPage, searchProducts]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (showSpinner) {
    return (
      <div className="main-wrapper">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="main-wrapper">
      <div className="product-list-container">
        <div className="products-main">
          {products.length === 0 ? (
            <div className="no-results">
              <h2>No products found</h2>
            </div>
          ) : (
            (searchProducts && searchProducts.length ? searchProducts : products).map((product) => (
              <Product key={product._id} product={product} addToCart={addToCart} />
            ))
          )}
        </div>
      </div>
      <div className="pagination">
        {[...Array(Math.ceil((searchProducts && searchProducts.length ? searchProducts.length : totalProducts) / productsPerPage)).keys()].map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page + 1)}
            className={currentPage === page + 1 ? 'active' : 'disabled'}
          >
            {page + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductList;

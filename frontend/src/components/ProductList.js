import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../axiosConfig'; // Import the configured Axios instance
import Product from './Product'; // Adjust the path as needed
import LoadingSpinner from './LoadingSpinner';
import '../styles/ProductList.css'; // For your styles

const ProductList = ({ addToCart }) => {
  const { category, subcategory } = useParams(); // Extracts category from URL params
  const [products, setProducts] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [filters, setFilters] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSpinner, setShowSpinner] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(10); // Number of products per page
  const [expandedFilters, setExpandedFilters] = useState({});

  useEffect(() => {
    let isMounted = true;
    let spinnerTimeout;

    const fetchProducts = async () => {
      try {
        setShowSpinner(true); // Show spinner before starting fetch

        // Start a timer to show spinner for at least 1000ms
        spinnerTimeout = setTimeout(() => setShowSpinner(true), 1000);

        const response = await axios.get('/all-products', {
          params: {
            category,
            subcategory,
            offset: (currentPage - 1) * productsPerPage,
            limit: productsPerPage
          }
        });

        if (isMounted) {
          setProducts(response.data.products);
          setTotalProducts(response.data.totalProducts);
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
          setTimeout(() => setShowSpinner(false), 1000);
        }
      }
    };

    const fetchCategoryFilters = async () => {
      try {
        const query = `/filters?category=${category}`;
        const response = await axios.get(query);
        if (isMounted) {
          setFilters(response.data);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError('Failed to fetch filters');
        }
      }
    };

    fetchProducts();
    fetchCategoryFilters();

    return () => {
      isMounted = false;
      clearTimeout(spinnerTimeout); // Clean up the timer on unmount
    };
  }, [category, subcategory, currentPage, selectedFilters]);

  const handleFilterChange = (filterName, value) => {
    setSelectedFilters((prevFilters) => {
      const newFilters = { ...prevFilters };
      if (!newFilters[filterName]) {
        newFilters[filterName] = [];
      }
      if (newFilters[filterName].includes(value)) {
        newFilters[filterName] = newFilters[filterName].filter((v) => v !== value);
      } else {
        newFilters[filterName].push(value);
      }
      return newFilters;
    });
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setLoading(true); // Trigger loading state
  };

  const toggleFilterCategory = (filterName) => {
    setExpandedFilters((prev) => ({
      ...prev,
      [filterName]: !prev[filterName]
    }));
  };

  if (showSpinner) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="main-wrapper">
      <div className="product-list-container">
        <div className="filters-sidebar">
          <div className="filter-count">
            <h3>{totalProducts} products found</h3>
          </div>
          <div className="filters">
            {filters.map((filterCategory) => (
              <div
                key={filterCategory.name}
                className={`filter-category ${expandedFilters[filterCategory.name] ? 'expanded' : ''}`}
              >
                <div className="filter-header" onClick={() => toggleFilterCategory(filterCategory.name)}>
                  <h4>{filterCategory.name}</h4>
                </div>
                <div className={`filter-body ${expandedFilters[filterCategory.name] ? 'show' : ''}`}>
                  {filterCategory.filters.map((filter) => (
                    <div key={filter} className="filter-option">
                      <input
                        type="checkbox"
                        id={filter}
                        checked={selectedFilters[filterCategory.name]?.includes(filter) || false}
                        onChange={() => handleFilterChange(filterCategory.name, filter)}
                      />
                      <label htmlFor={filter}>{filter}</label>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="products-main">
          {products.length === 0 ? (
            <div className="no-results">
              <h2>No products found</h2>
            </div>
          ) : (
            products.map((product) => (
              <Product key={product._id} product={product} addToCart={addToCart} />
            ))
          )}
        </div>
      </div>
      <div className="pagination">
          {[...Array(Math.ceil(totalProducts / productsPerPage)).keys()].map((page) => (
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

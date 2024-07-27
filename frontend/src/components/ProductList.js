import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../axiosConfig'; // Import the configured Axios instance
import Product from './Product'; // Adjust the path as needed
import LoadingSpinner from './LoadingSpinner';
import '../styles/ProductList.css'; // For your styles

const ProductList = ({ addToCart }) => {
  const { category, subcategory } = useParams(); // Extracts category from URL params
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState({});
  const [loading, setLoading] = useState(false); // Simplified loading state
  const [error, setError] = useState(null);
  const [showSpinner, setShowSpinner] = useState(true);
  const [productCount, setProductCount] = useState(0);
  const [expandedFilters, setExpandedFilters] = useState({}); // Track expanded filter categories

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const queryParams = {
        category,
        subcategory,
        filters: JSON.stringify(selectedFilters),
      };
      const response = await axios.get('/all-products', { params: queryParams });
      setProducts(response.data);
    } catch (err) {
      setError('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategoryFilters = async () => {
    try {
      const response = await axios.get(`/filters?category=${category}`);
      setFilters(response.data);
    } catch (err) {
      setError('Failed to fetch filters');
    }
  };

  const fetchProductCount = async () => {
    try {
      const response = await axios.get('/products-count', {
        params: {
          category,
          subcategory,
          filters: JSON.stringify(selectedFilters),
        },
      });
      setProductCount(response.data.count);
    } catch (err) {
      setError('Failed to fetch product count');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setShowSpinner(true);
      await Promise.all([fetchProducts(), fetchProductCount(), fetchCategoryFilters()]);
      setShowSpinner(false);
    };

    fetchData();
  }, [category, subcategory, selectedFilters]);

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

  const toggleFilterCategory = (filterName) => {
    setExpandedFilters((prevState) => ({
      ...prevState,
      [filterName]: !prevState[filterName],
    }));
  };

  if (loading || showSpinner) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="product-list-container">
      <div className="filters-sidebar">
        <div className="filter-count">
          <h3>{productCount} products found</h3>
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
              <div className="filter-body">
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
  );
};

export default ProductList;

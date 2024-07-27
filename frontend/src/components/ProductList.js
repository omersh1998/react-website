import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../axiosConfig'; // Import the configured Axios instance
import Product from './Product'; // Adjust the path as needed
import LoadingSpinner from './LoadingSpinner';
import '../styles/ProductList.css'; // For your styles

const ProductList = ({ addToCart }) => {
  const { category, subcategory } = useParams();
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSpinner, setShowSpinner] = useState(true);
  const [expandedFilter, setExpandedFilter] = useState(null);

  useEffect(() => {
    let isMounted = true;
    let spinnerTimeout;

    const fetchProducts = async () => {
      try {
        setLoading(true);
        spinnerTimeout = setTimeout(() => setShowSpinner(true), 300);

        let query = '/all-products';
        if (category) {
          query += `?category=${category}`;
          if (subcategory) {
            query += `&subcategory=${subcategory}`;
          }
        }

        const response = await axios.get(query, { params: { ...selectedFilters } });
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
          clearTimeout(spinnerTimeout);
          setLoading(false);
          setTimeout(() => setShowSpinner(false), 300);
        }
      }
    };

    const fetchCategoryFilters = async () => {
      try {
        setLoading(true);
        spinnerTimeout = setTimeout(() => setShowSpinner(true), 300);

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
      } finally {
        if (isMounted) {
          clearTimeout(spinnerTimeout);
          setLoading(false);
          setTimeout(() => setShowSpinner(false), 300);
        }
      }
    };

    fetchProducts();
    if (category) {
      fetchCategoryFilters();
    }

    return () => {
      isMounted = false;
      clearTimeout(spinnerTimeout);
    };
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

  const handleCategoryClick = (filterName) => {
    setExpandedFilter((prev) => (prev === filterName ? null : filterName));
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
        <h3></h3>
        {filters.map((filterCategory) => (
          <div
            key={filterCategory.name}
            className={`filter-category ${expandedFilter === filterCategory.name ? 'expanded' : ''}`}
          >
            <h4 onClick={() => handleCategoryClick(filterCategory.name)}>
              {filterCategory.name}
            </h4>
            <div
              className={`filter-options ${expandedFilter === filterCategory.name ? 'show' : ''}`}
            >
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

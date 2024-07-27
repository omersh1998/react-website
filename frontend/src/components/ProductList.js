import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../axiosConfig'; // Import the configured Axios instance
import Product from './Product'; // Adjust the path as needed
import LoadingSpinner from './LoadingSpinner';
import '../styles/ProductList.css'; // For your styles

const ProductList = ({ addToCart }) => {
  const { category, subcategory } = useParams();
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState([]); // Initialize as empty array
  const [selectedFilters, setSelectedFilters] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSpinner, setShowSpinner] = useState(true);

  // Fetch filters when category changes
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/filters?category=${category}`);
        setFilters(response.data || []); // Ensure filters is always an array
        console.log(response.data);
      } catch (err) {
        setError('Failed to fetch filters');
      } finally {
        setLoading(false);
        setShowSpinner(false);
      }
    };

    if (category) {
      fetchFilters();
    }
  }, [category]);

  // Fetch products when category, subcategory, or selected filters change
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        let query = '/all-products';
        if (category) {
          query += `?category=${category}`;
        }
        if (subcategory) {
          query += `&subcategory=${subcategory}`;
        }
        Object.keys(selectedFilters).forEach((key) => {
          const values = selectedFilters[key];
          if (values.length > 0) {
            query += `&${key}=${values.join(',')}`;
          }
        });

        const response = await axios.get(query);
        setProducts(response.data || []); // Ensure products is always an array
      } catch (err) {
        setError('Failed to fetch products');
      } finally {
        setLoading(false);
        setShowSpinner(false);
      }
    };

    fetchProducts();
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

  if (loading || showSpinner) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="product-list-container">
      <div className="filters-sidebar">
        <h3>Filters</h3>
        {filters.length > 0 ? (
          filters.map((filterCategory) => (
            <div key={filterCategory.name} className="filter-category">
              <h4>{filterCategory.name}</h4>
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
          ))
        ) : (
          <div>No filters available</div>
        )}
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

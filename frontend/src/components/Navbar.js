// src/components/Navbar.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart } from 'react-icons/fa';
import axios from '../axiosConfig';
import '../styles/Navbar.css';

const Navbar = ({ cartItemCount, onSearch }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();

  const categories = [
    { id: 1, name: 'Clothing', subcategories: ['Men', 'Women', 'Kids'] },
    { id: 2, name: 'Electronics', subcategories: ['Phones', 'Laptops', 'Accessories'] },
    { id: 3, name: 'Books', subcategories: ['Fiction', 'Non-fiction'] },
    // Add more categories and subcategories as needed
  ];

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.length > 0) {
        try {
          const response = await axios.get('/search', { params: { name: query } });
          setSuggestions(response.data.slice(0, 10)); // Limit to 10 suggestions
        } catch (err) {
          console.error('Error fetching suggestions:', err);
        }
      } else {
        setSuggestions([]);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      fetchSuggestions();
    }, 300); // Debounce time

    return () => clearTimeout(delayDebounceFn); // Cleanup on unmount or query change
  }, [query]);

  const handleCategoryHover = (categoryId) => {
    const dropdown = document.getElementById(`dropdown-${categoryId}`);
    if (dropdown) {
      dropdown.style.display = 'block';
    }
  };

  const handleCategoryLeave = (categoryId) => {
    const dropdown = document.getElementById(`dropdown-${categoryId}`);
    if (dropdown) {
      dropdown.style.display = 'none';
    }
  };

  const handleInputChange = (event) => {
    setQuery(event.target.value);
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion.name); // Use the name field of the suggestion object
    setShowSuggestions(false);
    onSearch(suggestion.name); // Call the onSearch prop with the search term
    navigate('/');
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      onSearch(query); // Call the onSearch prop with the search term
      setShowSuggestions(false);
      navigate('/');
    }
  };

  return (
    <div>
      {/* Main Navbar */}
      <div className="navbar">
        <div className="navbar-left">
          <Link to="/" className="logo">
            My Website
          </Link>
        </div>
        <div className="navbar-center">
          <div className="search-container">
            <input
              type="text"
              value={query}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Search..."
              className="search-bar"
            />
            {showSuggestions && suggestions.length > 0 && (
              <ul className="suggestions-list">
                {suggestions.map((suggestion, index) => (
                  <li key={index} onClick={() => handleSuggestionClick(suggestion)}>
                    {suggestion.name} {/* Display only the name field */}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <button className="search-button">
            <i className="fa fa-search"></i>
          </button>
        </div>
        <div className="navbar-right">
          <Link to="/cart" className="navbar-cart">
            <FaShoppingCart className="cart-icon" />
            <span className="cart-count">{cartItemCount}</span>
          </Link>
        </div>
      </div>

      {/* Secondary Navbar */}
      <div className="secondary-navbar">
        <ul className="category-list">
          {categories.map(category => (
            <li
              key={category.id}
              className="category-item"
              onMouseEnter={() => handleCategoryHover(category.id)}
              onMouseLeave={() => handleCategoryLeave(category.id)}
            >
              <Link to={`/category/${category.name.toLowerCase()}`} className="category-link">
                {category.name}
              </Link>
              {category.subcategories && (
                <div id={`dropdown-${category.id}`} className="subcategory-dropdown">
                  {category.subcategories.map((subcategory, index) => (
                    <Link
                      key={index}
                      to={`/category/${category.name.toLowerCase()}/${subcategory.toLowerCase()}`}
                      className="subcategory-link"
                    >
                      {subcategory}
                    </Link>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Navbar;

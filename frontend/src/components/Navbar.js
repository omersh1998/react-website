import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaShoppingCart } from 'react-icons/fa';
import axios from '../axiosConfig';
import '../styles/Navbar.css';

const Navbar = ({ cartItemCount, onSearch, cartUpdated }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [categories, setCategories] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.length > 0) {
        try {
          const response = await axios.get('/search', { params: { name: query } });
          setSuggestions(response.data.slice(0, 10)); // Limit to 10 suggestions
          setShowSuggestions(true);
        } catch (err) {
          console.error('Error fetching suggestions:', err);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      fetchSuggestions();
    }, 300); // Debounce time

    return () => clearTimeout(delayDebounceFn); // Cleanup on unmount or query change
  }, [query]);

  useEffect(() => {
    // Fetch categories from the server
    const fetchCategories = async () => {
      try {
        const response = await axios.get('/categories');
        const mappedCategories = response.data.map((item) => {
          item.id = item._id;
          delete item._id;
          return item;
        });
        setCategories(mappedCategories);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    // Reset search query and suggestions on location change
    setQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
  }, [location.pathname]);

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
    setQuery('');
    setShowSuggestions(false);
    navigate(`/search?name=${encodeURIComponent(suggestion)}`); // Navigate to search results
    onSearch(suggestion); // Trigger the search
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      setQuery('');
      navigate(`/search?name=${encodeURIComponent(query)}`); // Navigate to search results
      onSearch(query); // Trigger the search
      setShowSuggestions(false);
    }
  };

  const handleClickOutside = (event) => {
    if (event.target.closest('.search-container') === null) {
      setShowSuggestions(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
              placeholder="Search..."
              className="search-bar"
              value={query}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
            />
            {showSuggestions && suggestions.length > 0 && (
              <ul className="suggestions-list">
                {suggestions.map(suggestion => (
                  <li key={suggestion._id} onClick={() => handleSuggestionClick(suggestion.name)}>
                    {suggestion.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <div className="navbar-right">
          <Link to="/cart" className={`navbar-cart ${cartUpdated ? 'cart-updated' : ''}`}>
            <FaShoppingCart className="cart-icon" />
            {cartItemCount > 0 && <span className="cart-count">{cartItemCount}</span>}
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

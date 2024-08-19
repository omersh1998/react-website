import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaShoppingCart } from 'react-icons/fa';
import axios from '../axiosConfig';
import '../styles/Navbar.css';

const Navbar = ({ cartItemCount, onSearch, cartUpdated, isAdmin, setIsAdmin, username, setUsername, setUserId }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [categories, setCategories] = useState([]);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false); // Modal open/close state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

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

  const handleLogin = async () => {
    try {
      const response = await axios.post('/login', { email, password });

      if (response.data.success) {
        setUsername(response.data.currentUser.userName); // Set username after successful login
        setIsLoginModalOpen(false); // Close the modal
        setErrorMessage('');
        setIsAdmin(!!response.data.currentUser.isAdmin);
        setUserId(response.data.currentUser._id);

        localStorage.setItem('user', JSON.stringify(response.data.currentUser));
      } else {
        setErrorMessage('Invalid login credentials.');
      }
    } catch (error) {
      setErrorMessage('Error during login.');
    }
  };

  const logout = () => {
    setUsername(null);
    navigate('/');
  }

  const cancelLogin = () => {
    setIsLoginModalOpen(false);
    setErrorMessage('');
  }

  return (
    <div>
      {/* Main Navbar */}
      <div className="navbar">
        <div className="navbar-left">
          <Link to="/" className="logo">
            My Website
          </Link>
          {username && <span className="navbar-username">Hello, {username}</span>}
          {username && <span className="navbar-orders"><Link to="/orders">My Orders</Link></span>}
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
          {isAdmin && (
            <div className="add-product-link">
              <a href="/create-product">Add New Product</a>
            </div>)}
          {!username ? (
            <span className="login-link" onClick={() => setIsLoginModalOpen(true)}>Login</span>
          ) :
            <span className="login-link" onClick={() => logout()}>Logout</span>
          }
          <Link to="/cart" className={`navbar-cart ${cartUpdated ? 'cart-updated' : ''}`}>
            <FaShoppingCart className="cart-icon" />
            {cartItemCount > 0 && <span className="cart-count">{cartItemCount}</span>}
          </Link>
        </div>
      </div>

      {/* Login Modal */}
      {isLoginModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>Login</h2>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleLogin}>Login</button>
            <button onClick={cancelLogin}>Cancel</button>
            <p>
              Don't have an account yet?{' '}
              <span
                className="register-link"
                onClick={() => {
                  setIsLoginModalOpen(false);
                  navigate('/register');
                }}
              >
                Register
              </span>
            </p>
          </div>
        </div>
      )}

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

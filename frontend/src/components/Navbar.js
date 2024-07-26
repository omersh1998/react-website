import React from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingCart } from 'react-icons/fa';
import '../styles/Navbar.css';

const Navbar = ({ cartItemCount }) => {
  const categories = [
    { id: 1, name: 'Clothing', subcategories: ['Men', 'Women', 'Kids'] },
    { id: 2, name: 'Electronics', subcategories: ['Phones', 'Laptops', 'Accessories'] },
    { id: 3, name: 'Books', subcategories: ['Fiction', 'Non-fiction'] },
    // Add more categories and subcategories as needed
  ];

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
          <input type="text" placeholder="Search..." className="search-bar" />
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
            <li key={category.id}
                className="category-item"
                onMouseEnter={() => handleCategoryHover(category.id)}
                onMouseLeave={() => handleCategoryLeave(category.id)}>
              <Link to={`/category/${category.name.toLowerCase()}`} className="category-link">
                {category.name}
              </Link>
              {category.subcategories && (
                <div id={`dropdown-${category.id}`} className="subcategory-dropdown">
                  {category.subcategories.map((subcategory, index) => (
                    <Link key={index} to={`/category/${category.name.toLowerCase()}/${subcategory.toLowerCase()}`} className="subcategory-link">
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

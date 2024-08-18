import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import ProductList from './ProductList';
import Register from './Register';
import ProductDetail from './ProductDetail';
import Navbar from './Navbar';
import Footer from './Footer';
import ChatBubble from './ChatBubble';
import ShoppingCart from './ShoppingCart';
import Filters from './Filters'; // Import the new Filters component
import axios from '../axiosConfig'; // Import the configured Axios instance
import '../styles/App.css';
import '../styles/Filters.css'; // Import the Filters CSS

const App = () => {
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState({});
  const [expandedFilters, setExpandedFilters] = useState({});
  const [currentCategory, setCurrentCategory] = useState('');
  const [showFilters, setShowFilters] = useState(true);
  const [isShowFilter, setIsShowFilter] = useState(false);
  const [cartUpdated, setCartUpdated] = useState(false);
  const [sortOption, setSortOption] = useState(undefined);
  const [currentPage, setCurrentPage] = useState(1);
  const [isAdmin, setIsAdmin] = useState(false);

  const location = useLocation();

  const fetchProducts = async (query = '') => {
    try {
      const url = query ? `/search?name=${encodeURIComponent(query)}` : '/products';
      const response = query ? await axios.get(url) : await axios.post(url);
      console.log(response.data);
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchFilters = async (category) => {
    try {
      const response = await axios.get(`/categories/filters?category=${category}`);
      setFilters(response.data);
    } catch (error) {
      console.error('Error fetching filters:', error);
    }
  };

  useEffect(() => {
    setSelectedFilters({});
    setSortOption(undefined);
    setCurrentPage(1);

    if (['/cart', '/product', '/register'].includes(location.pathname) || location.pathname.startsWith('/product')) {
      // Reset filters when navigating to home page
      setIsShowFilter(false);
    } else {
      setIsShowFilter(true);
    }
  }, [location.pathname]);

  useEffect(() => {
    if (currentCategory) {
      fetchFilters(currentCategory);
    }
  }, [currentCategory]);

  useEffect(() => {
    const handleResize = () => {
      setShowFilters(window.innerWidth > 768); // Adjust based on screen size
    };

    handleResize(); // Check initial size
    window.addEventListener('resize', handleResize); // Add event listener for resizing

    return () => window.removeEventListener('resize', handleResize); // Clean up listener
  }, []);

  const initialCart = JSON.parse(localStorage.getItem('cart')) || [];
  const [cart, setCart] = useState(initialCart);

  const updateCartStorage = (updatedCart) => {
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const updateCartStorageAndStore = (updatedCart, timeout = 2000) => {
    updateCartStorage(updatedCart);
    setCart(updatedCart);
    setCartUpdated(true);
    setTimeout(() => setCartUpdated(false), timeout); // Reset after x seconds
  };

  const clearCart = () => {
    updateCartStorageAndStore([], 100);
  }

  const cartItemCount = cart.reduce((total, item) => {
    total += item.quantity;
    return total;
  }, 0);

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.product._id === product._id);
    if (existingItem) {
      const updatedCart = cart.map(item =>
        item.product._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
      );
      updateCartStorageAndStore(updatedCart);
    } else {
      const updatedCart = [...cart, { product: product, quantity: 1 }];
      updateCartStorageAndStore(updatedCart);
    }
  };

  const removeFromCart = (productId) => {
    const updatedCart = cart.filter(item => item.product._id !== productId);
    updateCartStorageAndStore(updatedCart);
  };

  const handleQuantityChange = (productId, newQuantity) => {
    const updatedCart = cart.map(item => {
      if (item.product._id === productId) {
        return { ...item, quantity: newQuantity };
      }
      return item;
    });
    updateCartStorageAndStore(updatedCart);
  };

  const searchProducts = (searchTerm) => {
    fetchProducts(searchTerm);
  };

  const handleFilterChange = (filterName, value) => {
    setSelectedFilters((prevFilters) => {
      const newFilters = { ...prevFilters };
  
      // Initialize filter array if it doesn't exist
      if (!newFilters[filterName]) {
        newFilters[filterName] = [];
      }
  
      // Add or remove the filter value
      if (newFilters[filterName].includes(value)) {
        newFilters[filterName] = newFilters[filterName].filter((v) => v !== value);
      } else {
        newFilters[filterName].push(value);
      }
  
      // Remove the filterName key if its array is empty
      if (newFilters[filterName].length === 0) {
        delete newFilters[filterName];
      }
  
      return newFilters;
    });
  };  

  const toggleFilterCategory = (filterName) => {
    setExpandedFilters((prev) => ({
      ...prev,
      [filterName]: !prev[filterName]
    }));
  };

  return (
    <div className="App">
      <Navbar cartItemCount={cartItemCount} onSearch={searchProducts} cartUpdated={cartUpdated} isAdmin={isAdmin} setIsAdmin={setIsAdmin} />
      <div className="container">
        {isShowFilter && <div className={`filters-sidebar ${!showFilters ? 'hide-filters' : ''}`}>
          {currentCategory && (
            <Filters 
              filters={filters}
              selectedFilters={selectedFilters}
              handleFilterChange={handleFilterChange}
              toggleFilterCategory={toggleFilterCategory}
              expandedFilters={expandedFilters}
            />
          )}
        </div>}
        <div className={isShowFilter ? "products-main" : "products-main flex-column"}>
          <Routes>
            <Route path="/" element={<ProductList selectedFilters={selectedFilters} products={products} addToCart={addToCart} sortOption={sortOption} setSortOption={setSortOption} currentPage={currentPage} setCurrentPage={setCurrentPage} isAdmin={isAdmin} />} />
            <Route path="/cart" element={<ShoppingCart cart={cart} clearCart={clearCart} onQuantityChange={handleQuantityChange} onRemoveFromCart={removeFromCart} />} />
            <Route path="/products/:productId" element={<ProductDetail addToCart={addToCart} isAdmin={isAdmin} />} />
            <Route path="/search" element={<ProductList selectedFilters={selectedFilters} searchProducts={products} addToCart={addToCart} sortOption={sortOption} setSortOption={setSortOption} currentPage={currentPage} setCurrentPage={setCurrentPage} isAdmin={isAdmin} />} />
            <Route path="/category/:category/:subcategory" element={<ProductList selectedFilters={selectedFilters} addToCart={addToCart} setCurrentCategory={setCurrentCategory} sortOption={sortOption} setSortOption={setSortOption} currentPage={currentPage} setCurrentPage={setCurrentPage} isAdmin={isAdmin} />} />
            <Route path="/category/:category" element={<ProductList selectedFilters={selectedFilters} addToCart={addToCart} setCurrentCategory={setCurrentCategory} sortOption={sortOption} setSortOption={setSortOption} currentPage={currentPage} setCurrentPage={setCurrentPage} isAdmin={isAdmin} />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </div>
      </div>
      <ChatBubble />
      <Footer />
    </div>
  );
};

export default App;

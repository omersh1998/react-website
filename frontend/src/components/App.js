import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProductList from './ProductList';
import ProductDetail from './ProductDetail';
import Navbar from './Navbar';
import ShoppingCart from './ShoppingCart';
import axios from '../axiosConfig'; // Import the configured Axios instance
import '../styles/App.css';

const App = () => {
  const [products, setProducts] = useState([]);

  const fetchProducts = async (query = '') => {
    try {
      const url = query ? `/search?name=${encodeURIComponent(query)}` : '/all-products';
      const response = await axios.get(url);
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const initialCart = JSON.parse(localStorage.getItem('cart')) || [];
  const [cart, setCart] = useState(initialCart);

  const updateCartStorage = (updatedCart) => {
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const updateCartStorageAndStore = (updatedCart) => {
    updateCartStorage(updatedCart);
    setCart(updatedCart);
  };

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

  return (
    <div className="App">
      <Navbar cartItemCount={cartItemCount} onSearch={searchProducts} />
      <div className="container">
        <Routes>
          <Route exact path="/" element={<ProductList products={products} addToCart={addToCart} />} />
          <Route path="/cart" element={<ShoppingCart cart={cart} onQuantityChange={handleQuantityChange} onRemoveFromCart={removeFromCart} />} />
          <Route path="/product/:productId" element={<ProductDetail />} />
          <Route path="/search" element={<ProductList products={products} addToCart={addToCart} />} />
          <Route path="/category/:category/:subcategory" element={<ProductList addToCart={addToCart} />} />
          <Route path="/category/:category" element={<ProductList addToCart={addToCart} />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;

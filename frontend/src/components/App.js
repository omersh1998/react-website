import React, { useState, useEffect } from 'react';
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProductList from './ProductList';
import ProductDetail from './ProductDetail';
import Navbar from './Navbar';
import ShoppingCart from './ShoppingCart';
import axios from 'axios';
import '../styles/App.css';

const App = () => {
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [isDropdownVisible, setDropdownVisible] = useState(false);

  useEffect(() => {
    fetchProducts();
    fetchCartItems();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('/api/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchCartItems = async () => {
    try {
      const response = await axios.get('/api/cart');
      setCartItems(response.data.items);
      setTotal(response.data.total);
    } catch (error) {
      console.error('Error fetching cart items:', error);
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
  }

  return (
    <div className="App">
      <Navbar cartItemCount={cartItemCount} />
      <div className="container">

      <Routes>
        <Route exact path="/" element={<ProductList addToCart={addToCart} />} />
        <Route path="/cart" element={<ShoppingCart cart={cart} onQuantityChange={handleQuantityChange} onRemoveFromCart={removeFromCart} />} />
        <Route path="/product/:productId" element={<ProductDetail />} />
      </Routes>
      </div>
    </div>
  );
};

export default App;

import React, { useState } from 'react';
import axios from '../axiosConfig'; // Import the configured Axios instance
import { Payout, Confirmation } from '../modals/Payout';
import '../styles/ShoppingCart.css';

const ShoppingCart = ({ cart, clearCart, onQuantityChange, onRemoveFromCart, userId }) => {
  const [showModal, setShowModal] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [boughtItems, setBoughtItems] = useState([]);

  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
  const totalCost = cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);

  const handleCheckout = () => {
    setShowModal(true);
  };

  const handleConfirmPayment = async () => {
    setBoughtItems(cart.slice());

    // Prepare order data
    const orderData = {
      userId,
      products: cart.map(item => ({
        productId: item.product._id,
        quantity: item.quantity
      })),
      price: totalCost
    };

    try {
      // Send order data to the backend
      await axios.post('/orders', orderData, {
        headers: {
          'Content-Type': 'application/json',
          // Include any necessary headers like authentication tokens
        }
      });
      clearCart(); // Clear cart on successful order placement
      setShowConfirmation(true); // Show confirmation modal
    } catch (error) {
      console.error('Failed to place order:', error);
      // Optionally show an error message to the user
    }
  };

  return (
    <div className="shopping-cart">
      <h2>Shopping Cart</h2>
      <div className="cart-summary">
        <p>Total Items: {totalItems}</p>
        <p>Total Cost: ${totalCost.toFixed(2)}</p>
      </div>
      <div className="cart-items">
        {cart.map(item => (
          <div key={item.product._id} className="cart-item">
            <img src={item?.product?.images[0]} alt={item.product.name} className="cart-item-image" />
            <div className="cart-item-details">
              <p className="cart-item-name">{item.product.name}</p>
              <div className="cart-item-quantity">
                <label>Quantity:</label>
                <select
                  value={item.quantity}
                  onChange={(e) => onQuantityChange(item.product._id, parseInt(e.target.value))}
                >
                  {[...Array(99).keys()].map(num => (
                    <option key={num + 1} value={num + 1}>{num + 1}</option>
                  ))}
                </select>
              </div>
              <p className="cart-item-price">${(item.product.price * item.quantity).toFixed(2)}</p>
            </div>
            <button className="remove-button" onClick={() => onRemoveFromCart(item.product._id)}>X</button>
          </div>
        ))}
      </div>
      <button className="checkout-button" onClick={handleCheckout}>Checkout</button>
      
      {showModal && 
        <Payout 
          onClose={() => setShowModal(false)} 
          onConfirm={handleConfirmPayment} 
          cart={cart} 
          totalCost={totalCost}
        />
      }

      {showConfirmation && 
        <Confirmation 
          cart={boughtItems}
          onClose={() => setShowConfirmation(false)} 
        />
      }
    </div>
  );
};

export default ShoppingCart;

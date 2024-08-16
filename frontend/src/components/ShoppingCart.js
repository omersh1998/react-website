import React, { useState } from 'react';
import { Payout, Confirmation } from '../modals/Payout';
import '../styles/ShoppingCart.css';

const ShoppingCart = ({ cart, clearCart, onQuantityChange, onRemoveFromCart }) => {
  const [showModal, setShowModal] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [boughtItems, setBoughtItemsn] = useState([]);

  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
  const totalCost = cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);

  const handleCheckout = () => {
    setShowModal(true);
  };

  const handleConfirmPayment = () => {
    setBoughtItemsn(cart.slice());
    console.log(boughtItems);
    clearCart();
    setShowConfirmation(true);
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

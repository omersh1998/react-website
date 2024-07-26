import React from 'react';
import '../styles/ShoppingCart.css';

const ShoppingCart = ({ cart, onQuantityChange, onRemoveFromCart }) => {

  // Calculate total number of items in the cart
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  // Calculate total cost of items in the cart
  const totalCost = cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);

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
            <img src={item.product.image} alt={item.product.name} className="cart-item-image" />
            <div className="cart-item-details">
              <p className="cart-item-name">{item.product.name}</p>
              <div className="cart-item-quantity">
                <label>Quantity:</label>
                <select
                  value={item.quantity}
                  onChange={(e) => onQuantityChange(item.product._id, parseInt(e.target.value))}
                >
                  {[...Array(10).keys()].map(num => (
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
      <button className="checkout-button">Checkout</button>
    </div>
  );
};

export default ShoppingCart;

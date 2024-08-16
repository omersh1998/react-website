import React, { useState } from 'react';
import '../styles/Payout.css';

const Spinner = () => (
  <div className="spinner"></div>
);

const Payout = ({ onClose, onConfirm, totalCost }) => {
  const [loading, setLoading] = useState(false);

  const handlePayment = () => {
    setLoading(true);
    setTimeout(() => {
      onConfirm();
      setLoading(false);
      onClose();
    }, 2000); // Simulate a payment delay
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Payment</h2>
        <form onSubmit={(e) => { e.preventDefault(); handlePayment(); }}>
          <label>
            Credit Card:
            <input type="text" required />
          </label>
          <button type="submit" disabled={loading}>
            {loading ? <Spinner /> : `Pay $${totalCost.toFixed(2)}`}
          </button>
        </form>
        <button className="modal-close" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

// Confirmation Component
const Confirmation = ({ cart, onClose }) => {
  return (
    <div className="confirmation-overlay">
      <div className="confirmation-content">
        <h2>Thank You for Your Purchase!</h2>
        <p>You bought:</p>
        <ul>
          {cart.map(item => (
            <li key={item.product._id}>
              {item.product.name} x {item.quantity}
            </li>
          ))}
        </ul>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export {Payout, Confirmation};
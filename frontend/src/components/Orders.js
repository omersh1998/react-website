import React, { useState, useEffect } from 'react';
import axios from '../axiosConfig'; // Ensure axios is configured correctly
import '../styles/Orders.css'; // Import your CSS file

const Orders = ({ userId }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`/orders/${userId}`);
        setOrders(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="orders-page">
      <h2 className="orders-heading">My Orders</h2>
      {orders.length === 0 ? (
        <p className="no-orders">No orders found.</p>
      ) : (
        <ul className="orders-list">
          {orders.map((order, index) => (
            <li key={index} className="order-item">
              <div className="order-date">
                <strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}
              </div>
              <div className="order-details">
                <ul className="order-items">
                  {order.products.map((item, idx) => (
                    <li key={idx} className="order-item-details">
                      {item.name} (x{item.quantity})
                    </li>
                  ))}
                </ul>
                <div className="order-price">
                  <strong>Total Price:</strong> ${order.price.toFixed(2)}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Orders;

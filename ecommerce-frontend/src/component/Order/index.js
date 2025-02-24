// src/pages/OrdersPage.js
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setOrders } from './slice';
import axios from 'axios';
import './index.css';

const Orders = () => {
  const dispatch = useDispatch();
  const orders = useSelector((state) => state.orders.orders);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('https://localhost:7195/api/orders');
        dispatch(setOrders(response.data));
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, [dispatch]);

  return (
    <div className="orders-container">
      <h2>Orders</h2>
      <div className="orders-list">
        {orders.length === 0 ? (
          <p>No orders available.</p>
        ) : (
          orders.map((order) => (
            <div key={order.id} className="order-item">
              <p><strong>Order ID:</strong> {order.id}</p>
              <p><strong>User Name:</strong> {order.userName}</p>
              <p><strong>Order Date:</strong> {new Date(order.orderDate).toLocaleDateString()}</p>

              <div className="order-items">
                {order.items.map((item) => (
                  <div key={item.id} className="order-item-details">
                    <p><strong>Product Name:</strong> {item.productName}</p>
                    <p><strong>Quantity:</strong> {item.quantity}</p>
                    <p><strong>Price:</strong> ${item.price.toFixed(2)}</p>
                    <p><strong>Total:</strong> ${(item.quantity * item.price).toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Orders;

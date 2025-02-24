import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, updateCartItemQuantity, clearCart } from '../../appSlice';
import Checkout from '../CheckoutForm';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import './index.css';

const stripePromise = loadStripe("pk_test_51Qs2iNSCJTlo1sdtwIDfSHbK2sqS5cCn3Z4BNUUBEjm0jxIe4WmIh7H8OcxzZfGFcY2GdVANyTLsx2Ym3GmcBeWW00ljK83VkG");

const Cart = () => {
  const [payment, setPayment] = useState(false);
  const cartItems = useSelector(state => state.app.cart);
  const dispatch = useDispatch();

  const handleQuantityChange = (productId, type) => {
    const item = cartItems.find(item => item.id === productId);
    const newQuantity = type === 'increase' ? item.quantity + 1 : item.quantity - 1;
    dispatch(updateCartItemQuantity({ id: productId, quantity: newQuantity }));
  };

  const handleRemoveFromCart = (productId) => {
    dispatch(removeFromCart(productId));
  };

  const handlePaymentSuccess = () => {
    dispatch(clearCart()); // Clear cart after successful payment
  };

  const calculateTotalAmount = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const totalAmount = calculateTotalAmount();

  return (
    <div className="cart-page">
      <h2>Your Cart</h2>
      
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="cart-items-list">
          {cartItems.map(item => (
            <div key={item.id} className="cart-item">
              <img src={item.imageUrl} alt={item.name} />
              <h3>{item.name}</h3>

              {/* Total price for this item */}
              <p>Total: ${(item.price * item.quantity).toFixed(2)}</p>

              {/* Quantity control */}
              <div className="quantity-control" style={{padding:"10px"}}>
                <button onClick={() => handleQuantityChange(item.id, 'decrease')} disabled={item.quantity <= 1}>-</button>
                <span>{item.quantity}</span>
                <button onClick={() => handleQuantityChange(item.id, 'increase')} disabled={item.quantity >= item.stock}>+</button>
              </div>

              <button onClick={() => handleRemoveFromCart(item.id)}>Remove</button>
            </div>
          ))}
        </div>
      )}

      {cartItems.length > 0 && !payment && (
        <button onClick={() => setPayment(true)} className="pay-button">
          Proceed to Payment (${totalAmount.toFixed(2)})
        </button>
      )}

      {payment && (
        <div className="checkout-section">
          <Elements stripe={stripePromise}>
            <Checkout totalAmount={totalAmount} cartItems={cartItems} onPaymentSuccess={handlePaymentSuccess} />
          </Elements>
        </div>
      )}
    </div>
  );
};

export default Cart;

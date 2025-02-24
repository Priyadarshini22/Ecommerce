import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import axios from "axios";
import React, { useState } from "react";
import './index.css';
import { useSelector } from "react-redux";

const Checkout = ({ totalAmount, cartItems }) => {
  const stripe = useStripe();
  const elements = useElements();
  const token = useSelector((state) => state.auth.token)
  const user = localStorage.getItem('user');
  const [checkOutItem, setCheckOutItem] = useState({
    name: "",
    description: "",
    address: {
      line1: "",
      line2: "",
      city: "",
      state: "",  
      postalCode: "",
      country: "",
    },
    amount: totalAmount
  });

  const [isSubmitting, setIsSubmitting] = useState(false); // Track the submitting state of the form

  const pay = async (event) => {
    event.preventDefault(); // Prevent form default submit behavior

    if (isSubmitting) return; // Prevent multiple submissions

    setIsSubmitting(true); // Disable the button by setting isSubmitting to true

    try {
      // Send payment request to backend
      const response = await axios.post("https://localhost:7195/api/payment", checkOutItem, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.data; // Get the response data
      console.log('Response from backend:', data); // Check the response from the backend

      // Get the CardElement
      const cardElement = elements.getElement(CardElement);

      // Call Stripe's confirmCardPayment method
      const confirmPayment = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: { card: cardElement },
      });

      console.log('Confirm Payment Response:', confirmPayment); // Log the response for debugging

      const { paymentIntent } = confirmPayment;
      debugger
      // Check if paymentIntent exists and has status
      if (paymentIntent && paymentIntent.status === "succeeded") {
        console.log('Payment succeeded:', paymentIntent);

        // Step 3: If payment succeeds, send order details to backend
        await axios.post("https://localhost:7195/api/orders", {
          userName: user, // You might want to replace 0 with actual user ID
          orderDate: new Date(),
          items: cartItems.map(item => ({
            productId: item.id,
            productName: item.name,
            quantity: item.quantity,
            price: item.price,
          })),
        });

        alert(`Payment successful! Order has been saved.`);
      } else {
        console.error('Payment failed:', paymentIntent);
        alert(`Payment failed!`);
      }
    } catch (err) {
      console.error('Error during payment process:', err);
      alert("There was an error in payment");
    } finally {
      setIsSubmitting(false); // Re-enable the button after the process is done
    }
  };

  return (
    <div className="checkout">
      <h2>Checkout</h2>
      <CardElement className="card-element" />
      <form>
        <input 
          type="text" 
          placeholder="Enter Customer Name" 
          onChange={(e) => setCheckOutItem({ ...checkOutItem, name: e.target.value })} 
        />
        
        <p>Enter Address</p>
        <input 
          type="text" 
          placeholder="Line 1" 
          onChange={(e) => setCheckOutItem({ 
            ...checkOutItem, 
            address: { ...checkOutItem.address, line1: e.target.value } 
          })} 
        />
        <input 
          type="text" 
          placeholder="Line 2" 
          onChange={(e) => setCheckOutItem({ 
            ...checkOutItem, 
            address: { ...checkOutItem.address, line2: e.target.value } 
          })} 
        />
        <input 
          type="text" 
          placeholder="City" 
          onChange={(e) => setCheckOutItem({ 
            ...checkOutItem, 
            address: { ...checkOutItem.address, city: e.target.value } 
          })} 
        />
        <input 
          type="text" 
          placeholder="State" 
          onChange={(e) => setCheckOutItem({ 
            ...checkOutItem, 
            address: { ...checkOutItem.address, state: e.target.value } 
          })} 
        />
        <input 
          type="text" 
          placeholder="Postal Code" 
          onChange={(e) => setCheckOutItem({ 
            ...checkOutItem, 
            address: { ...checkOutItem.address, postalCode: e.target.value } 
          })} 
        />
        <input 
          type="text" 
          placeholder="Country" 
          onChange={(e) => setCheckOutItem({ 
            ...checkOutItem, 
            address: { ...checkOutItem.address, country: e.target.value } 
          })} 
        />
        
        <p>Description</p>
        <input 
          type="text" 
          placeholder="Description" 
          onChange={(e) => setCheckOutItem({ ...checkOutItem, description: e.target.value })} 
        />

        <button onClick={pay} disabled={isSubmitting}>
          {isSubmitting ? "Processing..." : "Pay"}
        </button>
      </form>
    </div>
  );
};

export default Checkout;

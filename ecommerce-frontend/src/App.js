import React, { useEffect } from 'react';
import { BrowserRouter as Router, useNavigate } from 'react-router-dom';
import AppRoute from './component/routes';
import Navbar from './Shared/Navbar';
import { loadStripe } from "@stripe/stripe-js";
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { loginSuccess } from './component/Login/slice';

// Stripe public key
const stripePromise = loadStripe("pk_test_51Qs2iNSCJTlo1sdtwIDfSHbK2sqS5cCn3Z4BNUUBEjm0jxIe4WmIh7H8OcxzZfGFcY2GdVANyTLsx2Ym3GmcBeWW00ljK83VkG");

const App = () => {
  const dispatch = useDispatch();
  // Check if token exists in localStorage and automatically log the user in
  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const user = localStorage.getItem('user'); // Assuming user is stored as an object in localStorage

    if (token && role && user) {
      // Set the Authorization header for axios globally
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      // Dispatch to store user data in Redux store
      dispatch(loginSuccess({ token, user, role }));

      // Redirect based on user role
      // navigate(role === 'User' ? '/' : '/products/new');
    }
  }, [dispatch]);

  return (
    <div>
      <Router>
        <Navbar />
        <div>
          <AppRoute />
        </div>
      </Router>
    </div>
  );
};

export default App;

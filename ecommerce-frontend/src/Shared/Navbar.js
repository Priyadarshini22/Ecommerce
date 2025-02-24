// src/Shared/Navbar.js
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../style/Navbar.css'; // Import Navbar CSS
import { useSelector } from 'react-redux';

const Navbar = () => {
  const location = useLocation();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const role = useSelector((state) => state.auth.role);
  console.log("IsAu",isAuthenticated)
  console.log("role",role)

  // Function to highlight the active link
  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <nav className="navbar">
      <div className="brand">MyStore</div>
      <div className="menu">
        {/* Common links accessible by both Admin and User */}
        <Link to="/" className={isActive('/')}>Home</Link>

        {/* Links visible only for User */}
        {isAuthenticated && role === 'User' && (
          <>
            <Link to="/products" className={isActive('/products')}>Products</Link>
            <Link to="/cart" className={isActive('/cart')}>Cart</Link>
          </>
        )}

        {/* Links visible only for Admin */}
        {isAuthenticated && role === 'Admin' && (
          <>
            <Link to="/products/new" className={isActive('/products/new')}>Add Product</Link>
            <Link to="/orders" className={isActive('/orders')}>Orders</Link>
          </>
        )}

        {/* Links for both User and Admin */}
        {!isAuthenticated && (
          <>
            <Link to="/login" className={isActive('/login')}>Login</Link>
            <Link to="/register" className={isActive('/register')}>Register</Link>
          </>
        )}

        {/* Logout button */}
        {isAuthenticated && (
          <button
            className="logout-btn"
            onClick={() => {
              localStorage.removeItem('token');
              window.location.href = '/login';
            }}
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

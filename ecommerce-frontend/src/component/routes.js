// src/Shared/AppRoute.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './Home';
import ProductList from './ProductList';
import Login from './Login';
import Register from './Register';
import ProductForm from './ProductForm';
import Cart from './Cart';
import ProtectedRoute from './ProtectedRoute'; // Import ProtectedRoute component
import Orders from './Order';

const AppRoute = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} /> {/* Default page showing product list */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protect product-related routes */}
      <Route 
        path="/products" 
        element={<ProtectedRoute element={ProductList} allowedRoles={['User']} />} 
      />
      <Route 
        path="/products/new" 
        element={<ProtectedRoute element={ProductForm} allowedRoles={['Admin']} />} 
      />
      <Route 
        path="/orders" 
        element={<ProtectedRoute element={Orders} allowedRoles={['Admin']} />} 
      />
      <Route 
        path="/cart" 
        element={<ProtectedRoute element={Cart} allowedRoles={['User']} />} 
      />
    </Routes>
  );
};

export default AppRoute;

// src/components/ProtectedRoute.js
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ element: Component, allowedRoles }) => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const role = useSelector((state) => state.auth.role);
  const navigate = useNavigate();

  useEffect(() => {
    debugger
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      navigate("/login");
    }

    // Redirect to unauthorized if the role is not allowed
    if (isAuthenticated && !allowedRoles.includes(role)) {
      navigate("/unauthorized");
    }
  }, []);

  // If authenticated and role is allowed, render the component
  if (isAuthenticated && allowedRoles.includes(role)) {
    return <Component />;
  }

  // Return null or an empty fragment while redirecting to handle async behavior
  return null;
};

export default ProtectedRoute;

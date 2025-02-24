// Login.js
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { loginSuccess } from './slice';
import './index.css';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUserName] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('https://localhost:7195/api/Auth/login', { username, password });
      debugger
      console.log(response)
      const { token, userName, role } = response.data;

      dispatch(loginSuccess({ token, userName, role}));
      localStorage.setItem('role', role);
      localStorage.setItem('token', token); // Store token in localStorage
      localStorage.setItem('user',userName);
      navigate(role == 'User' ? '/' : '/products/new')
    } catch (error) {
      console.error('Login failed:', error);
      alert("Login failed")
    }
  };

  return (
    <div className="login-container">
    <form className="login-form">
      <h2>Login</h2>
      <input type="text" placeholder="Username" onChange={(e) => setUserName(e.target.value)} />
      <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleLogin}>Login</button>
    </form>
    </div>
  );
};

export default Login;
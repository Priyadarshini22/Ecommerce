import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import store from './store';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe("pk_test_51N8NUGSEefhuuBwIVgT9BgL5ITx6Cy02b3kPx43iF1jbzCOICYlXqO8YbqrfkUNkZyhx2ljN5ncAVa13IFiC0nM400KSwA9LqR");

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
       <App />  
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

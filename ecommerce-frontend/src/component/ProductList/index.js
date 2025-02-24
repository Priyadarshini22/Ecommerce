import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setProducts } from './slice';
import axios from 'axios';
import ProductCard from '../ProductCard';
import './index.css';
const ProductList = () => {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.products.products);
  const token = useSelector((state) => state.auth.token);
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('https://localhost:7195/api/products',{
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        dispatch(setProducts(response.data));
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const addProduct = async (newProduct) => {
    try {
      await axios.post('https://localhost:7195/api/Products', newProduct);
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  const updateProduct = async (productId, updatedProduct) => {
    try {
      await axios.put(`https://localhost:7195/api/Products/${productId}`, updatedProduct);
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };
  return (
    <div>
      <h2>Products</h2>
      <div className="product-list-container">
      {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductList;

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, resetQuantityUpdated } from '../../appSlice';
import './index.css';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const cartItems = useSelector(state => state.app.cart);
  const [quantityInCart, setQuantityInCart] = useState(1);

  // Check if the product is already in the cart
  const isProductInCart = cartItems.some(item => item.id === product.id);

  useEffect(() => {
    // Set the quantity of the product in the cart if it's already added
    const existingProduct = cartItems.find(item => item.id === product.id);
    if (existingProduct) {
      setQuantityInCart(existingProduct.quantity);
    }
  }, [cartItems, product.id]);

  useEffect(() => {
    // Reset the cart or quantities once payment is successful (if needed)
    if (cartItems.length === 0) {
      dispatch(resetQuantityUpdated());
    }
  }, [cartItems, dispatch]);

  // Handle Add to Cart
  const handleAddToCart = () => {
    if (quantityInCart <= product.quantity) {
      dispatch(addToCart({ ...product, quantity: quantityInCart }));
    } else {
      alert('Sorry, not enough stock available!');
    }
  };

  // Handle increase quantity
  const increaseQuantity = () => {
    if (quantityInCart < product.quantity) {
      setQuantityInCart(quantityInCart + 1);
    }
  };

  // Handle decrease quantity
  const decreaseQuantity = () => {
    if (quantityInCart > 1) {
      setQuantityInCart(quantityInCart - 1);
    }
  };

  return (
    <div className="product-list-container">
      <div key={product.id} className="product-card">
        <img src={product.imageUrl} alt={product.name} />
        <h3>{product.name}</h3>
        <p>{product.description}</p>
        <p>Available Stock: {product.quantity}</p>

        <div className="quantity-control">
          <button onClick={decreaseQuantity} disabled={quantityInCart <= 1}>-</button>
          <input
            type="number"
            value={quantityInCart}
            onChange={(e) => setQuantityInCart(Math.min(Math.max(e.target.value, 1), product.quantity))}
            min="1"
            max={product.quantity}
          />
          <button onClick={increaseQuantity} disabled={quantityInCart >= product.quantity}>+</button>
        </div>

        {/* Add to Cart Button */}
        <button 
          onClick={handleAddToCart} 
          disabled={isProductInCart}
        >
          {isProductInCart ? 'Added to Cart' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;

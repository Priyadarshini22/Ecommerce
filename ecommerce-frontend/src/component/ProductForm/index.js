import axios from "axios";
import { useState } from "react";
import './index.css';

const ProductForm = () => {
  const token = localStorage.getItem('token');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [imageUrl, setimageUrl] = useState('');
  const [quantity, setQuantity] = useState(''); // Added quantity field
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate inputs
    if (!name || !description || !price || !imageUrl || !quantity) {
      setError("All fields are required!");
      return;
    }

    if (isNaN(price) || price <= 0) {
      setError("Price must be a valid positive number!");
      return;
    }

    if (isNaN(quantity) || quantity <= 0) {
      setError("Quantity must be a valid positive number!");
      return;
    }

    const newProduct = {
      name,
      description,
      price,
      imageUrl,
      quantity, // Include quantity in the request
    };

    try {
      await axios.post('https://localhost:7195/api/products', newProduct, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      alert('Product added successfully!');
      setName('');
      setDescription('');
      setPrice('');
      setimageUrl('');
      setQuantity('');
      setError(null); // Reset error on success
    } catch (error) {
      console.error('Error adding product:', error);
      setError('Failed to add product. Please try again.');
    }

    console.log('New Product Submitted:', newProduct);
  };

  return (
    <div className="add-product-container">
      <h2>Add Product</h2>
      <form onSubmit={handleSubmit}>
        {error && <div className="error-message">{error}</div>} {/* Display error message if any */}

        <div className="form-group">
          <input
            type="text"
            placeholder="Product Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="form-group">
          <textarea
            placeholder="Product Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="form-group">
          <input
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>

        <div className="form-group">
          <input
            type="text"
            placeholder="Image URL"
            value={imageUrl}
            onChange={(e) => setimageUrl(e.target.value)}
          />
        </div>

        <div className="form-group">
          <input
            type="number"
            placeholder="Stock Quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
        </div>

        <button type="submit">Add Product</button>
      </form>
    </div>
  );
};

export default ProductForm;

import React, { useState, useEffect } from "react";
import axios from "axios";
import './index.css'; // You can create custom styles here

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const token = localStorage.getItem("token");

  useEffect(() => {
    // Fetch top 10 latest products from your API
    const fetchProducts = async () => {
      try {
        const response = await axios.get('https://localhost:7195/api/products', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        setProducts(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false);
      }
    };

    fetchProducts();

    // Automatically change image every 3 seconds
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % products.length);
    }, 3000); // 3000ms = 3 seconds

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, [products.length]);

  // Function to go to the next image
  const nextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % products.length);
  };

  // Function to go to the previous image
  const prevImage = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + products.length) % products.length
    );
  };

  return (
    <div className="home">
      <section className="intro">
        <h1>Welcome to Our E-Commerce Platform!</h1>
        <p>Your one-stop shop for the latest and greatest products. Browse through our collection of top-rated items, exclusive deals, and much more!</p>
      </section>

      <section className="latest-products">
        <h2>Top 10 Latest Products</h2>
        {loading ? (
          <p>Loading products...</p>
        ) : (
          <div className="carousel-container">
            <button className="prev-btn" onClick={prevImage}>❮</button>
            <div className="carousel-image">
              <img
                src={products[currentIndex]?.imageUrl}
                alt={products[currentIndex]?.name}
                className="product-image"
              />
            </div>
            <button className="next-btn" onClick={nextImage}>❯</button>
          </div>
        )}
      </section>
      {/* <button>Start Shopping</button> */}

    </div>
  );
};

export default Home;

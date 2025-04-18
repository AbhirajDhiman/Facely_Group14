import React from "react";
import "../css/Home.css";

const Home = () => {
  return (
    <div className="home-container">
      <div className="content-card">
        <h1 className="heading">
          About Us
        </h1>
        <p className="lead-text">
          Welcome to <strong>Animal MarketPlace</strong>, your one-stop destination for
          buying and selling animals, pet products, and veterinary support. Our
          mission is to connect animal lovers with trusted sellers while
          ensuring the best care for their pets and livestock.
        </p>

        <div className="section">
          <h2 className="section-heading">
            🐾 What We Offer:
          </h2>
          <ul className="feature-list">
            <li>Wide range of animals for sale – pets, livestock, and exotic breeds</li>
            <li>High-quality pet and farm products</li>
            <li>Verified sellers for a trustworthy experience</li>
            <li>24/7 veterinary consultation and support</li>
          </ul>
        </div>

        <div className="section">
          <h2 className="section-heading">
            ❤️ Our Mission:
          </h2>
          <p className="lead-text">
            We aim to create a <strong>safe, ethical, and transparent</strong> marketplace
            where animal lovers can find the perfect companions, farm animals,
            and essential products while promoting responsible pet ownership and
            care.
          </p>
        </div>

        <div className="contact-section">
          <h2 className="section-heading">
            📩 Contact Us
          </h2>
          <p className="lead-text">
            Have questions? Reach out to us at:
          </p>
          <p className="contact-email">support@animalmarket.com</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
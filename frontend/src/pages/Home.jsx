import React from "react";

const Home = () => {
  return (
    <div className="bg-gray-100 min-h-screen py-12 px-6">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-8">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-6">
          About Us
        </h1>
        <p className="text-gray-600 text-lg text-center">
          Welcome to **Animal MarketPlace**, your one-stop destination for
          buying and selling animals, pet products, and veterinary support. Our
          mission is to connect animal lovers with trusted sellers while
          ensuring the best care for their pets and livestock.
        </p>

        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            🐾 What We Offer:
          </h2>
          <ul className="list-disc list-inside text-gray-600 text-lg">
            <li>Wide range of animals for sale – pets, livestock, and exotic breeds</li>
            <li>High-quality pet and farm products</li>
            <li>Verified sellers for a trustworthy experience</li>
            <li>24/7 veterinary consultation and support</li>
          </ul>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            ❤️ Our Mission:
          </h2>
          <p className="text-gray-600 text-lg">
            We aim to create a **safe, ethical, and transparent** marketplace
            where animal lovers can find the perfect companions, farm animals,
            and essential products while promoting responsible pet ownership and
            care.
          </p>
        </div>

        <div className="mt-8 text-center">
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">
            📩 Contact Us
          </h2>
          <p className="text-gray-600 text-lg">
            Have questions? Reach out to us at:
          </p>
          <p className="text-gray-800 font-semibold">support@animalmarket.com</p>
        </div>
      </div>
    </div>
  );
};

export default Home;

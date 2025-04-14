// SignUpForm.js

import React from "react";
import "./App.css"; // Import styles like scanner-line, glass, glow-border, etc.
import "./App.jsx";

const SignUpForm = () => {
  return (
    <div className="max-w-md mx-auto mt-20 glass glow-border p-8 rounded-xl">
      {/* Scanner animation line */}
      <div className="scanner-line"></div>

      {/* Heading */}
      <h2 className="text-3xl text-cyan-400 text-center mb-6">
        Create Your FaceSecure Account
      </h2>

      {/* Sign-up form */}
      <form>
        <div className="mb-4">
          <label className="block mb-2 text-sm">Full Name</label>
          <input
            type="text"
            className="w-full p-2 rounded bg-gray-800 text-white border border-cyan-500"
            placeholder="Enter your full name"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2 text-sm">Email Address</label>
          <input
            type="email"
            className="w-full p-2 rounded bg-gray-800 text-white border border-cyan-500"
            placeholder="Enter your email"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2 text-sm">Username</label>
          <input
            type="text"
            className="w-full p-2 rounded bg-gray-800 text-white border border-cyan-500"
            placeholder="Choose a username"
          />
        </div>

        <div className="mb-6">
          <label className="block mb-2 text-sm">Password</label>
          <input
            type="password"
            className="w-full p-2 rounded bg-gray-800 text-white border border-cyan-500"
            placeholder="Create a password"
          />
        </div>

        <button type="submit" className="w-full futuristic-button">
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default SignUpForm;

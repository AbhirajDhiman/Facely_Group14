import React from "react";
import "./App.css"; // 👈 Make sure this is imported

const LoginForm = () => {
  return (
    <div className="max-w-md mx-auto mt-20 glow-border p-8 rounded-xl">
      {/* Scanner line on top */}
      <div className="scanner-line"></div>

      <h2 className="text-3xl text-cyan-400 text-center mb-6">Login to FaceSecure</h2>

      <form>
        <div className="mb-4">
          <label className="block mb-2 text-sm">Username</label>
          <input
            type="text"
            className="w-full p-2 rounded bg-gray-800 text-white border border-cyan-500"
            placeholder="Enter username"
          />
        </div>

        <div className="mb-6">
          <label className="block mb-2 text-sm">Password</label>
          <input
            type="password"
            className="w-full p-2 rounded bg-gray-800 text-white border border-cyan-500"
            placeholder="Enter password"
          />
        </div>

        <button type="submit" className="w-full futuristic-button">
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginForm;

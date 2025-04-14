// App.jsx

import React, { useState } from "react";
import LoginForm from "./LoginForm";
import SignUpForm from "./SignUpForm";
import "./App.css"; // For custom styles like scanner-line, glow-border, etc.

const App = () => {
  const [isLogin, setIsLogin] = useState(true);

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4">
      {/* Page title */}
      <h1 className="text-4xl text-cyan-400 mb-4 font-bold">
        🔐 AI Face Recognizer
      </h1>

      {/* Form container */}
      {isLogin ? <LoginForm /> : <SignUpForm />}

      {/* Toggle button */}
      <p className="mt-6 text-sm text-gray-400">
        {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
        <button
          className="underline text-cyan-300 hover:text-cyan-200 transition"
          onClick={toggleForm}
        >
          {isLogin ? "Sign Up" : "Login"}
        </button>
      </p>
    </div>
  );
};

export default App;

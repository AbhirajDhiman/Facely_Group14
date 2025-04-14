
import React, { useState } from "react";
import LoginForm from "./LoginForm";
import SignUpForm from "./SignUpForm";
import FaceScanner from "./FaceScanner";

const AuthContainer = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="w-full max-w-md p-6 rounded-2xl shadow-2xl bg-gradient-to-br from-gray-900 via-gray-800 to-black border border-blue-500">
      <FaceScanner />
      {isLogin ? <LoginForm /> : <SignUpForm />}
      <button
        className="mt-4 text-blue-400 hover:underline"
        onClick={() => setIsLogin(!isLogin)}
      >
        {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Log In"}
      </button>
    </div>
  );
};

export default AuthContainer;

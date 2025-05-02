import { motion } from "framer-motion";
import Input from "../components/Input";
import { Loader, Lock, Mail, User } from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import PasswordStrengthMeter from "../components/PasswordStrengthmeter";
import { useAuthStore } from "../store/authStore";
import "../css/SignUpPage.css";

const SignUpPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const navigate = useNavigate();
  const { signup, error, isLoading } = useAuthStore();

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };
  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("profilePic", profilePic); // profilePic should be a File object
  
      await signup(formData);
      navigate("/verify-email");
    } catch (error) {
      // Error is handled by authStore
    }
  };
  

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="signup-container"
    >
      <div className="signup-inner">
        <h2 className="signup-heading">Create Account</h2>

        <form onSubmit={handleSignUp}>
          <div className="profile-pic-section">
            <label htmlFor="profilePic" className="profile-pic-label">
              {previewUrl ? (
                <img src={previewUrl} alt="Profile Preview" className="profile-pic-preview" />
              ) : (
                <div className="profile-pic-placeholder">
                  <User size={24} className="profile-pic-icon" />
                  <p>Add Profile Picture</p>
                </div>
              )}
            </label>
            <input
              type="file"
              id="profilePic"
              className="profile-pic-input"
              accept="image/*"
              onChange={handleProfilePicChange}
            />
          </div>
          <Input
            icon={User}
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            icon={Mail}
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            icon={Lock}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          
          {error && <p className="error-message">{error}</p>}
          <PasswordStrengthMeter password={password} />

          <motion.button
            className="signup-button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader className="animate-spin" size={24} style={{ margin: '0 auto' }} />
            ) : (
              "Sign Up"
            )}
          </motion.button>
        </form>
      </div>
      
      <div className="signup-footer">
        <p className="footer-text">
          Already have an account?{" "}
          <Link to="/login" className="footer-link">
            Login
          </Link>
        </p>
      </div>
    </motion.div>
  );
};

export default SignUpPage;

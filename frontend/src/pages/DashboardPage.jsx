import { motion } from "framer-motion";
import { useAuthStore } from "../store/authStore";
import { formatDate } from "../utils/date";
import { useState } from "react";
import EditProfileModal from "../components/EditProfileModal";
import "../css/DashboardPage.css";

const DashboardPage = () => {
  const { user, logout } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);

  const handleLogout = () => logout();
  const toggleEdit = () => setIsEditing((prev) => !prev);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.5 }}
      className="dashboard-container"
    >
      <h2 className="dashboard-heading">Dashboard</h2>

      <div className="profile-section">
        <img
          src={user.profilePic || "/default-avatar.png"}
          alt="Profile"
          className="profile-picture"
        />
        <button className="edit-profile-btn" onClick={toggleEdit}>
          Edit Profile
        </button>
      </div>

      <div className="dashboard-content">
        <motion.div
          className="info-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="card-heading">Profile Information</h3>
          <p className="info-text">Name: {user.name}</p>
          <p className="info-text">Email: {user.email}</p>
        </motion.div>

        <motion.div
          className="info-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="card-heading">Account Activity</h3>
          <p className="info-text">
            <span className="font-bold">Joined: </span>
            {new Date(user.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
          <p className="info-text">
            <span className="font-bold">Last Login: </span>
            {formatDate(user.lastLogin)}
          </p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="logout-container"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLogout}
          className="logout-button"
        >
          Logout
        </motion.button>
      </motion.div>

      {isEditing && <EditProfileModal user={user} onClose={toggleEdit} />}
    </motion.div>
  );
};

export default DashboardPage;

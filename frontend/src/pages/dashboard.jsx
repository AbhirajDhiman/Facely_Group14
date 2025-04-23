import React from 'react';
import './css/FacelyDashboard.css';

const FacelyDashboard = () => {
  return (
    <div className="dashboard">
      <div className="header">
        <h1>Facely Dashboard</h1>
        <p>Welcome to your AI Face Recognition Hub</p>
      </div>

      <div className="search-bar">
        <input type="text" placeholder="Search for users or insights..." />
        <i className="ph ph-magnifying-glass"></i>
      </div>

      <div className="stats">
        <div className="card">
          <i className="ph ph-user-check"></i>
          <p>Faces Recognized</p>
          <h2>1,247</h2>
        </div>
        <div className="card">
          <i className="ph ph-activity"></i>
          <p>Accuracy Rate</p>
          <h2>98.5%</h2>
        </div>
        <div className="card">
          <i className="ph ph-calendar-check"></i>
          <p>Today's Matches</p>
          <h2>37</h2>
        </div>
        <div className="card">
          <i className="ph ph-cpu"></i>
          <p>AI Status</p>
          <h2 style={{ color: '#34d399' }}>Active</h2>
        </div>
      </div>

      <div className="ai-insights">
        <h2>AI Insights</h2>
        <p>⭐ Most Recognized User: <strong>Aarav Singh</strong></p>
        <p>⏰ Peak Time: <strong>12 PM - 2 PM</strong></p>
        <p>📍 Hotspot: <strong>Main Entrance</strong></p>
      </div>
    </div>
  );
};
// added the css file separatly here to link it with the dashboardD
export default FacelyDashboard;

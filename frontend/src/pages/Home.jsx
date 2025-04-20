import React from 'react';
import '../css/Home.css';
import { Link } from 'react-router-dom'; // For navigation (optional, if using react-router)

function HomePage() {
  return (
    <div className="home-container">
      <div className="content-container">
        <h1 className="title">Welcome to Image Filter</h1>
        <p className="description">
          Effortlessly filter and manage your images from Google Drive, uploaded folders, or zip files. 
          Organize your photos by metadata, tags, or content with our intuitive tools.
        </p>
        <div className="button-container">
          <Link to="/upload" className="cta-button">Upload Images</Link>
          <Link to="/connect-drive" className="cta-button">Connect Google Drive</Link>
          <Link to="/gallery" className="cta-button">View Gallery</Link>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
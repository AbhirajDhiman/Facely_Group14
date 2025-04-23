import React from 'react';
import './css/BlogPage.css';
// added a blog page 
const BlogPage = () => {
  return (
    <div className="app-container">
      <div className="blog-container">
        <header className="blog-header">
          <h1>Welcome to Facely</h1>
          <p>A Face Recognition Based Attendance System</p>
        </header>

        <section className="blog-content">
          <h2>About the Project</h2>
          <p>
            Facely is an AI-powered face recognition attendance system developed using Python and the MUN stack
            (MongoDB, Express.js, Node.js). It provides a secure and contactless method of recording student
            attendance by leveraging facial recognition technology.
          </p>

          <h2>Key Features</h2>
          <ul>
            <li>Real-time face detection and recognition</li>
            <li>Secure data handling with MongoDB</li>
            <li>Express.js and Node.js for backend APIs</li>
            <li>Efficient and user-friendly web interface</li>
          </ul>

          <h2>How It Works</h2>
          <p>
            The system captures a user’s face through a camera, compares it against a trained dataset, and if
            matched, marks attendance in the backend. It ensures a seamless, automated process minimizing
            manual errors.
          </p>

          <h2>Team Members</h2>
          <ul>
            <li>Abhiraj Dhiman</li>
            <li>Group 14 Members</li>
          </ul>

          <h2>Source Code</h2>
          <p>
            You can check out the full project on GitHub:
            <a href="https://github.com/AbhirajDhiman/Facely_Group14" target="_blank" rel="noopener noreferrer">
              Facely GitHub Repository
            </a>
          </p>
        </section>
      </div>
    </div>
  );
};

export default BlogPage;

import React from 'react';
import '../css/about.css';

const About = () => {
  return (
    <div className="container">
      <header>
        <h1>About Facely</h1>
        <p className="subtitle">Facial Recognition System by Abhiraj, Jaskaran & Versha</p>
      </header>

      <section className="overview">
        <h2>Project Overview</h2>
        <p>
          Facely is an intelligent facial recognition system developed as a class group project. It allows users to upload a photo for identity verification or recognition. By leveraging AI and computer vision, the system analyzes facial features and compares them to a database of stored images.
        </p>
      </section>

      <section className="use-cases">
        <h2>Practical Use Cases</h2>
        <ul>
          <li><strong>In an organization:</strong> Check all events or security footage where a specific employee appears by uploading their photo.</li>
          <li><strong>At a function or event:</strong> Find all pictures where you were captured during a college fest or corporate event by uploading your image.</li>
          <li><strong>In a hackathon or team project:</strong> Gather all images you're featured in for a report or social post by uploading one photo.</li>
        </ul>
      </section>

      <section className="workflow">
        <h2>How the App Works</h2>
        <ol>
          <li><strong>User Photo Upload:</strong> Users upload an image via the web interface.</li>
          <li><strong>Face Detection:</strong> The system detects faces in the uploaded image.</li>
          <li><strong>Feature Extraction:</strong> Facial features are extracted.</li>
          <li><strong>Face Matching & Recognition:</strong> The system compares the uploaded face embeddings with those stored in the database to find matches.</li>
          <li><strong>Result Display:</strong> The application displays the matched identity and retrieves all corresponding images. If no match is found, it returns an "Unknown" status.</li>
        </ol>
      </section>

      <section className="team">
        <h2>Meet the Team</h2>
        <ul>
          <li><strong>Abhiraj Dhiman</strong> – Developer</li>
          <li><strong>Jaskaran</strong> – Developer</li>
          <li><strong>Versha</strong> – Developer</li>
        </ul>
      </section>

      <footer>
        <p>
          View the project on{' '}
          <a href="https://github.com/AbhirajDhiman/Facely_Group14" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
        </p>
      </footer>
    </div>
  );
};

export default About;

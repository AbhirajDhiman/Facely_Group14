import React from 'react';
import './ProfilePage.css';

const ProfilePage = () => {
  return (
    <>
      <header>
        <h1>John Doe</h1>
        <p className="subtitle">Full Stack Developer | Lifelong Learner</p>
      </header>

      <div className="container">
        <h2>About Me</h2>
        <p>
          I'm a passionate developer with experience in building modern web
          applications using React, Node.js, and MongoDB. I love solving
          real-world problems and constantly improving my skills.
        </p>

        <h2>Skills</h2>
        <ul>
          <li>JavaScript (ES6+), TypeScript</li>
          <li>React, Next.js, Redux</li>
          <li>Node.js, Express</li>
          <li>MongoDB, PostgreSQL</li>
          <li>Git & GitHub</li>
        </ul>

        <h2>Interests</h2>
        <p>
          When I'm not coding, I enjoy reading about psychology, working out,
          and creating motivational content on YouTube.
        </p>
      </div>

      <footer>
        &copy; {new Date().getFullYear()} John Doe. All rights reserved.
      </footer>
    </>
  );
};

export default ProfilePage;

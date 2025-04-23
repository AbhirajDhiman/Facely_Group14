import React from "react";
import "./css/Feedback.css";

const Feedback = () => {
  return (
    <div className="app-container">
      <div className="feedback-box">
        <h2>We Value Your Feedback</h2>
        <form action="/submit-feedback" method="POST">
          <input type="text" name="name" placeholder="Your Name" required />
          <input type="email" name="email" placeholder="Your Email" required />
          <textarea name="message" rows="5" placeholder="Your feedback..." required></textarea>
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default Feedback;

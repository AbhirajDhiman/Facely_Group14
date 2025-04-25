import React from 'react';
import './RecognitionResults.css';

const RecognitionResults = ({ uploadedImage, matchedImage, confidence }) => {
  const confidenceColor =
    confidence >= 80 ? 'green' : confidence >= 50 ? 'orange' : 'red';

  return (
    <div className="results-container">
      <div className="image-section">
        <h2 className="section-title">Uploaded Image</h2>
        <img src={uploadedImage} alt="Uploaded" className="image-box" />
      </div>

      <div className="image-section">
        <h2 className="section-title">Matched Image</h2>
        <img src={matchedImage} alt="Matched" className="image-box" />
        <p className="confidence-text" style={{ color: confidenceColor }}>
          Match Confidence: {confidence}%
        </p>
      </div>

      <div className="button-section">
        <button onClick={() => window.location.reload()} className="btn retry-btn">
          Retry
        </button>
        <button onClick={() => window.history.back()} className="btn back-btn">
          Go Back
        </button>
      </div>
    </div>
  );
};

RecognitionResults.defaultProps = {
  uploadedImage: "/images/sample-upload.jpg",
  matchedImage: "/images/sample-match.jpg",
  confidence: 94.3,
};

export default RecognitionResults;

import React from 'react';

const RecognitionResults = ({ uploadedImage, matchedImage, confidence }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
      <div className="text-center">
        <h2 className="font-semibold mb-2">Uploaded Image</h2>
        <img src={uploadedImage} alt="Uploaded" className="w-64 h-64 object-cover rounded-xl mx-auto shadow-lg" />
      </div>

      <div className="text-center">
        <h2 className="font-semibold mb-2">Matched Image</h2>
        <img src={matchedImage} alt="Matched" className="w-64 h-64 object-cover rounded-xl mx-auto shadow-lg" />
        <p className="mt-4 text-lg text-green-600 font-semibold">Match Confidence: {confidence}%</p>
      </div>

      <div className="col-span-2 text-center mt-8">
        <button
          onClick={() => window.location.reload()}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-700 mr-4"
        >
          Retry
        </button>
        <button
          onClick={() => window.history.back()}
          className="bg-gray-500 text-white px-6 py-2 rounded-lg shadow-md hover:bg-gray-600"
        >
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

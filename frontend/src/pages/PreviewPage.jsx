import React, { useState, useEffect } from 'react';
import JSZip from 'jszip';
import { useLocation } from 'react-router-dom';
import '../css/PreviewPage.css';
import { set } from 'mongoose';
import { Loader } from 'lucide-react';
import axios from 'axios';

function PreviewPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  useEffect(()=>{
    setIsDone(false);
  }, [currentIndex]);
  const location = useLocation();
  const files = location.state?.files || [];

  const [modalOpen, setModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const handleSaveToGallery = async () => {
    setIsLoading(true);
    const currentFile = files[currentIndex];
    try {
      // Fetch the image blob from the URL
      const response = await fetch(currentFile.url);
      const blob = await response.blob();
      
      // Create FormData and append the image
      const formData = new FormData();
      formData.append('picture', blob, currentFile.name);

      const result = await axios.post('http://localhost:5001/api/gallery/upload-pic', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        withCredentials: true
      });
      setIsDone(true);
      setIsLoading(false);
      
      console.log('Image ready for upload:', formData);
      
    } catch (error) {
      console.error('Error preparing image:', error);
    }
  };

  const handleDownloadZip = async () => {
    const zip = new JSZip();
    for (const [index, file] of files.entries()) {
      const response = await fetch(file.url);
      const blob = await response.blob();
      zip.file(`match_${index + 1}_${file.name}`, blob);
    }
    const zipBlob = await zip.generateAsync({ type: "blob" });
    const url = window.URL.createObjectURL(zipBlob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'filtered_images.zip');
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const openModal = (index) => {
    setCurrentIndex(index);
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  const changeImage = (direction) => {
    setCurrentIndex((prevIndex) =>
      (prevIndex + direction + files.length) % files.length
    );
  };

  return (
    <div className="preview-container">
      <h2 className="heading">Matched Images Preview</h2>
      <div className="image-grid">
        {files.map((file, index) => (
          <div key={index} className="image-card" onClick={() => openModal(index)}>
            <img src={file.url} alt={file.name} />
            <p>{file.name.length > 20 ? file.name.slice(0, 17) + '...' : file.name}</p>
          </div>
        ))}
      </div>

      <button onClick={handleDownloadZip} className="download-btn">
        Download ZIP
      </button>

      {modalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <span className="close-btn" onClick={closeModal}>&times;</span>
            <img src={files[currentIndex].url} alt={files[currentIndex].name} className="modal-image" />
            <div className="modal-controls">
              <button onClick={() => changeImage(-1)}>⟨</button>
              <button onClick={handleSaveToGallery}>
              {isDone? "Saved to gallery" : isLoading ? (
              <Loader className="animate-spin" size={24} style={{ margin: '0 auto' }} />
            ) : (
              "Save to galley"
            )}
              </button>
              <button onClick={() => changeImage(1)}>⟩</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PreviewPage;

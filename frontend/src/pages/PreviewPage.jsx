import React, { useState } from 'react';
import JSZip from 'jszip';
import { useLocation } from 'react-router-dom';
import '../css/PreviewPage.css';

function PreviewPage() {
  const location = useLocation();
  const files = location.state?.files || [];

  const [modalOpen, setModalOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

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
              <button onClick={() => changeImage(1)}>⟩</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PreviewPage;

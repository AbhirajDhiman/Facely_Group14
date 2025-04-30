import React, { useState, useEffect } from 'react';
import '../css/Gallery.css';
import { useAuthStore } from '../store/authStore';

const Gallery = () => {

  const { images } = useAuthStore();
  console.log(images[0]);


  const [currentIndex, setCurrentIndex] = useState(0);
  // const images = [
  //   { id: 1, src: 'https://picsum.photos/800/500?random=1', alt: 'Nature 1' },
  //   { id: 2, src: 'https://picsum.photos/800/500?random=2', alt: 'Nature 2' },
  //   { id: 3, src: 'https://picsum.photos/800/500?random=3', alt: 'Nature 3' },
  //   { id: 4, src: 'https://picsum.photos/800/500?random=4', alt: 'Nature 4' },
  //   { id: 5, src: 'https://picsum.photos/800/500?random=5', alt: 'Nature 5' },
  // ];

  const handlePrev = () => setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  const handleNext = () => setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));

  useEffect(() => {



    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };

    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
    <div className="gallery-container">
      <header>
        <h1>Your's Gallery</h1>
        <p className="subtitle">Capturing the Beauty of the Yours</p>
      </header>

      {images.length==0?"Gallery is empty":<div className="gallery-content">
        <div className="main-image-container">
          <img 
            src={images[currentIndex].url} 
            // alt={images[currentIndex].alt} 
            className="main-image"
          />
          
          <button className="nav-btn prev" onClick={handlePrev}>&#10094;</button>
          <button className="nav-btn next" onClick={handleNext}>&#10095;</button>
        </div>

        <div className="thumbnail-grid">
          {
          images.map((img, index) => (
            <div 
              key={index}
              className={`thumbnail ${index === currentIndex ? 'active' : ''}`}
              onClick={() => setCurrentIndex(index)}
            >
              <img 
                src={img.url} 
                alt={img.alt}
                className="thumbnail-image"
              />
            </div>
          ))
          }
        </div>
      </div>}

      <footer>
        <p>© 2023 Nature's Gallery. Use arrow keys or click to navigate.</p>
      </footer>
    </div>
    </>
  );
};

export default Gallery;
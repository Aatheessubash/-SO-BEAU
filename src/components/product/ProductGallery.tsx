import React, { useState } from 'react';
import { Maximize2, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { sounds } from '../../utils/soundEffects';
import '../../styles/components/ProductGallery.scss';

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export const ProductGallery: React.FC<ProductGalleryProps> = ({ images, productName }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomCoords, setZoomCoords] = useState({ x: 0, y: 0 });

  const currentImage = images[activeIndex] || images[0];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomCoords({ x, y });
  };

  const handlePrev = () => {
    sounds.playSwatchClick();
    setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleNext = () => {
    sounds.playSwatchClick();
    setActiveIndex((prev) => (prev + 1) % images.length);
  };

  return (
    <div className="product-gallery-container">
      {/* Thumbnails Sidebar */}
      {images.length > 1 && (
        <div className="gallery-thumbnails">
          {images.map((img, idx) => (
            <button
              key={idx}
              className={`gallery-thumb-btn ${activeIndex === idx ? 'active' : ''}`}
              onClick={() => {
                sounds.playSwatchClick();
                setActiveIndex(idx);
              }}
              aria-label={`View image ${idx + 1}`}
            >
              <img src={img} alt={`${productName} thumbnail ${idx + 1}`} />
            </button>
          ))}
        </div>
      )}

      {/* Main Large Image */}
      <div 
        className="gallery-main-viewport"
        onMouseEnter={() => setIsZoomed(true)}
        onMouseLeave={() => setIsZoomed(false)}
        onMouseMove={handleMouseMove}
      >
        <img 
          src={currentImage} 
          alt={productName}
          className="gallery-main-image"
          style={
            isZoomed
              ? {
                  transformOrigin: `${zoomCoords.x}% ${zoomCoords.y}%`,
                  transform: 'scale(1.8)',
                }
              : undefined
          }
        />

        <button 
          className="lightbox-trigger-btn"
          onClick={() => setIsLightboxOpen(true)}
          aria-label="Enlarge image"
        >
          <Maximize2 size={16} />
        </button>

        {/* Mobile Next / Prev buttons */}
        {images.length > 1 && (
          <div className="mobile-gallery-nav">
            <button onClick={handlePrev} className="mobile-nav-arrow" aria-label="Previous">
              <ChevronLeft size={20} />
            </button>
            <span className="mobile-nav-counter">
              {activeIndex + 1} / {images.length}
            </span>
            <button onClick={handleNext} className="mobile-nav-arrow" aria-label="Next">
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {isLightboxOpen && (
        <div className="gallery-lightbox-overlay animate-fade-in" onClick={() => setIsLightboxOpen(false)}>
          <button 
            className="lightbox-close-btn" 
            onClick={() => setIsLightboxOpen(false)}
            aria-label="Close enlarged view"
          >
            <X size={24} />
          </button>
          <div className="lightbox-image-wrap" onClick={(e) => e.stopPropagation()}>
            <img src={currentImage} alt={productName} />
          </div>
        </div>
      )}
    </div>
  );
};

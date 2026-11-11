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

  const validImages = images && images.length > 0 ? images : ['/images/placeholder.jpg'];
  const currentImage = validImages[activeIndex] || validImages[0];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomCoords({ x, y });
  };

  const handlePrev = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    sounds.playSwatchClick();
    setActiveIndex((prev) => (prev - 1 + validImages.length) % validImages.length);
  };

  const handleNext = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    sounds.playSwatchClick();
    setActiveIndex((prev) => (prev + 1) % validImages.length);
  };

  return (
    <div className="product-gallery-container clean-spacious-gallery">
      {/* Clean Angle Thumbnails (From blue_scrub_female / blue_scrub_male) */}
      {validImages.length > 1 && (
        <div className="gallery-thumbnails-strip" role="tablist" aria-label="Product photoshoot perspectives">
          {validImages.map((imgUrl, idx) => (
            <button
              key={idx}
              type="button"
              role="tab"
              aria-selected={activeIndex === idx}
              className={`gallery-thumb-btn ${activeIndex === idx ? 'active' : ''}`}
              onClick={() => {
                sounds.playSwatchClick();
                setActiveIndex(idx);
              }}
              onMouseEnter={() => {
                setActiveIndex(idx);
              }}
              title={`Perspective 0${idx + 1}`}
            >
              <img src={imgUrl} alt={`${productName} Angle ${idx + 1}`} loading="lazy" />
            </button>
          ))}
        </div>
      )}

      {/* Main Large Image Viewport */}
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
                  transform: 'scale(1.75)',
                }
              : undefined
          }
        />

        {/* Enlarge Lightbox Trigger */}
        <button 
          type="button"
          className="lightbox-trigger-btn"
          onClick={() => setIsLightboxOpen(true)}
          aria-label="Enlarge image"
        >
          <Maximize2 size={16} />
        </button>

        {/* Floating Navigation Arrows */}
        {validImages.length > 1 && (
          <>
            <button
              type="button"
              className="gallery-floating-arrow prev"
              onClick={handlePrev}
              aria-label="Previous angle"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              className="gallery-floating-arrow next"
              onClick={handleNext}
              aria-label="Next angle"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}
      </div>

      {/* Lightbox Modal */}
      {isLightboxOpen && (
        <div className="gallery-lightbox-overlay animate-fade-in" onClick={() => setIsLightboxOpen(false)}>
          <button 
            type="button"
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

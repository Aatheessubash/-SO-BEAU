import React, { useState } from 'react';
import { Maximize2, X, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import { sounds } from '../../utils/soundEffects';
import '../../styles/components/ProductGallery.scss';

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export const ProductGallery: React.FC<ProductGalleryProps> = ({ images, productName }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const validImages = images && images.length > 0 ? images : ['/images/placeholder.jpg'];
  const currentImage = validImages[activeIndex] || validImages[0];

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
          {validImages.slice(0, 5).map((imgUrl, idx) => (
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
              <img src={imgUrl} alt={`${productName} Angle ${idx + 1}`} width={72} height={92} loading="lazy" />
            </button>
          ))}

          {/* Scroll / Next Chevron Button matching reference */}
          <button
            type="button"
            className="gallery-thumb-scroll-btn"
            onClick={handleNext}
            aria-label="View next photoshoot angle"
          >
            <ChevronDown size={16} />
          </button>
        </div>
      )}

      {/* Main Large Image Viewport */}
      <div className="gallery-main-viewport">
        <img 
          src={currentImage} 
          alt={productName}
          className="gallery-main-image"
          width={600}
          height={760}
        />

        {/* Counter Badge (e.g. 1 / 6) */}
        {validImages.length > 0 && (
          <div className="gallery-counter-badge" aria-label={`Image ${activeIndex + 1} of ${validImages.length}`}>
            {activeIndex + 1} / {validImages.length}
          </div>
        )}

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

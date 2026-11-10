import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import '../../styles/components/AnnouncementBar.scss';

const ANNOUNCEMENTS = [
  'Complimentary Express Delivery across Australia on orders over $150 AUD • www.sobeau.com.au',
  'SO YOU. SO BEAU. — Contemporary lifestyle scrubs & elevated apparel',
  'Welcome to SOBEAU — Use code BEAU10 for 10% off your wardrobe',
  'Complimentary 30-day Australian returns & size exchanges',
];

export const AnnouncementBar: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % ANNOUNCEMENTS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    document.documentElement.style.setProperty('--announcement-height', isVisible ? '38px' : '0px');
  }, [isVisible]);

  if (!isVisible) return null;

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + ANNOUNCEMENTS.length) % ANNOUNCEMENTS.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % ANNOUNCEMENTS.length);
  };

  return (
    <div className="announcement-bar">
      <div className="announcement-content container">
        <button 
          onClick={handlePrev} 
          className="announcement-nav-btn prev"
          aria-label="Previous announcement"
        >
          <ChevronLeft size={14} />
        </button>

        <div className="announcement-text-wrapper">
          <p className="announcement-text">
            {ANNOUNCEMENTS[currentIndex]}
          </p>
        </div>

        <button 
          onClick={handleNext} 
          className="announcement-nav-btn next"
          aria-label="Next announcement"
        >
          <ChevronRight size={14} />
        </button>

        <button 
          onClick={() => setIsVisible(false)} 
          className="announcement-close-btn"
          aria-label="Close announcement bar"
        >
          <X size={13} />
        </button>
      </div>
    </div>
  );
};

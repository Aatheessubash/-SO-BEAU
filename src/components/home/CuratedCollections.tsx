import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ChevronRight } from 'lucide-react';
import { Product } from '../../types';
import { useCart } from '../../context/CartContext';
import { sounds } from '../../utils/soundEffects';
import '../../styles/components/CuratedCollections.scss';

interface CuratedCollectionsProps {
  products?: Product[];
}

interface StyleThumb {
  id: string;
  gender: 'womens' | 'mens';
  name: string;
  colorName: string;
  hex: string;
  img: string;
  index: number;
}

const WOMENS_STYLES = [
  { name: 'French Navy', hex: '#1D2A44', img: '/images/female/female-navy-front.png' },
  { name: 'Deep Charcoal', hex: '#1E2022', img: '/images/female/female-charcoal-front.png' },
  { name: 'Surgical Blue', hex: '#4A7C9B', img: '/images/female/female-surgical-blue-front.png' },
  { name: 'Warm Taupe', hex: '#A39382', img: '/images/female/female-taupe-front.png' },
  { name: 'Terracotta Clay', hex: '#8C554F', img: '/images/female/female-terracotta-front.png' },
  { name: 'Plum Noir', hex: '#4A2838', img: '/images/female/female-plum-front.png' }
];

const MENS_STYLES = [
  { name: 'Surgical Blue', hex: '#4A7C9B', img: '/images/male/male-surgical-blue-front.png' },
  { name: 'French Navy', hex: '#1D2A44', img: '/images/male/male-navy-front.png' },
  { name: 'Deep Charcoal', hex: '#1E2022', img: '/images/male/male-charcoal-front.png' },
  { name: 'Warm Taupe', hex: '#A39382', img: '/images/male/male-taupe-front.png' },
  { name: 'Terracotta Clay', hex: '#8C554F', img: '/images/male/male-terracotta-front.png' },
  { name: 'Plum Noir', hex: '#4A2838', img: '/images/male/male-plum-front.png' }
];

const ALL_STYLE_THUMBS: StyleThumb[] = [
  ...WOMENS_STYLES.map((s, idx) => ({
    id: `womens-${idx}`,
    gender: 'womens' as const,
    name: "Women's Scrub",
    colorName: s.name,
    hex: s.hex,
    img: s.img,
    index: idx
  })),
  ...MENS_STYLES.map((s, idx) => ({
    id: `mens-${idx}`,
    gender: 'mens' as const,
    name: "Men's Scrub",
    colorName: s.name,
    hex: s.hex,
    img: s.img,
    index: idx
  }))
];

export const CuratedCollections: React.FC<CuratedCollectionsProps> = ({ products = [] }) => {
  const { isInWishlist, toggleWishlist } = useCart();

  const womensProduct = products.find(p => p.category === 'womens-scrubs') || {
    id: 'sb-001',
    slug: 'the-womens-nursing-scrub-set',
    name: "The Women's Scrub Set"
  };
  const mensProduct = products.find(p => p.category === 'mens-scrubs') || {
    id: 'sb-002',
    slug: 'the-mens-nursing-scrub-set',
    name: "The Men's Scrub Set"
  };

  const [activeWomensIdx, setActiveWomensIdx] = useState(0);
  const [activeMensIdx, setActiveMensIdx] = useState(0);
  const [selectedThumbId, setSelectedThumbId] = useState<string>('womens-0');

  const dockTrackRef = useRef<HTMLDivElement>(null);

  const handleSelectThumb = (thumb: StyleThumb) => {
    setSelectedThumbId(thumb.id);
    if (thumb.gender === 'womens') {
      setActiveWomensIdx(thumb.index);
    } else {
      setActiveMensIdx(thumb.index);
    }
    sounds.playSwatchClick();
  };

  const handleScrollRight = () => {
    if (dockTrackRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = dockTrackRef.current;
      if (scrollLeft + clientWidth >= scrollWidth - 10) {
        dockTrackRef.current.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        dockTrackRef.current.scrollBy({ left: 220, behavior: 'smooth' });
      }
    }
  };

  const currentWomens = WOMENS_STYLES[activeWomensIdx] || WOMENS_STYLES[0];
  const currentMens = MENS_STYLES[activeMensIdx] || MENS_STYLES[0];

  const isWomensSaved = isInWishlist(womensProduct.id);
  const isMensSaved = isInWishlist(mensProduct.id);

  return (
    <section id="products" className="curated-silhouettes-suite" aria-label="Premium Scrubs Collection">
      {/* Clinic Ambient Atmosphere Layer */}
      <div className="clinic-ambient-backdrop" />
      
      {/* Decorative Corner Waves (SVG) */}
      <div className="corner-wave corner-wave-left" aria-hidden="true">
        <svg viewBox="0 0 450 320" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M-60 350 C80 320, 160 210, 140 120 C120 40, 20 -20, -60 10 Z" fill="url(#blueWaveGradLeft)" />
          <path d="M-80 380 C120 340, 240 230, 200 80 C180 -10, 80 -40, -80 0 Z" fill="url(#blueWaveGradLeftDeep)" opacity="0.65" />
          <defs>
            <linearGradient id="blueWaveGradLeft" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1E60D5" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#0B3E92" stopOpacity="0.95" />
            </linearGradient>
            <linearGradient id="blueWaveGradLeftDeep" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2575FC" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#0A2C68" stopOpacity="0.6" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="corner-wave corner-wave-right" aria-hidden="true">
        <svg viewBox="0 0 450 320" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M510 350 C370 320, 290 210, 310 120 C330 40, 430 -20, 510 10 Z" fill="url(#blueWaveGradRight)" />
          <defs>
            <linearGradient id="blueWaveGradRight" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1E60D5" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#0B3E92" stopOpacity="0.95" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="container relative-content-wrap">
        
        {/* Section Header */}
        <div className="curated-header-center">
          <div className="kicker-line-wrap">
            <span className="line" />
            <span className="kicker-text">PREMIUM SCRUBS COLLECTION</span>
            <span className="line" />
          </div>
          <h2 className="main-headline">
            Women's &amp; Men's <span className="blue-accent">Scrubs</span>
          </h2>
          <p className="sub-headline">
            Zero boxy cuts. Ergonomically shaped to sustain 14-hour continuous theater shifts with bespoke tailored lines.
          </p>
        </div>

        {/* Dual Hero Cards Grid */}
        <div className="dual-hero-cards-grid">
          
          {/* Card 1: Women's "Designed for Care" */}
          <div className="hero-editorial-card womens-card">
            {/* Soft Pastel Background Curve */}
            <div className="card-ambient-curve womens-curve" />

            {/* Wishlist Heart Button */}
            <button
              type="button"
              className={`card-wishlist-circle-btn ${isWomensSaved ? 'is-active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                toggleWishlist(womensProduct.id);
              }}
              aria-label="Save Women's Scrub to Wishlist"
            >
              <Heart size={18} fill={isWomensSaved ? '#E11D48' : 'none'} color={isWomensSaved ? '#E11D48' : '#718096'} />
            </button>

            {/* Left Column: Pill + Headings + CTA */}
            <div className="card-left-column">
              <div className="card-top-tag-wrap">
                <span className="category-pill-badge pill-womens">
                  <span className="gender-symbol">♀</span>
                  <span>Women's</span>
                </span>
              </div>

              <div className="card-editorial-content">
                <h3 className="card-bold-title">
                  Designed<br />for Care
                </h3>
                <p className="card-sub-copy">
                  Comfort. Confidence.<br />All Day.
                </p>
                <Link 
                  to="/products/the-womens-nursing-scrub-set" 
                  className="editorial-explore-btn"
                >
                  <span>Explore Women's</span>
                  <span className="btn-arrow">&rarr;</span>
                </Link>
              </div>
            </div>

            {/* Right Column: Model Figure */}
            <div className="card-figure-showcase">
              <img
                key={currentWomens.img}
                src={currentWomens.img}
                alt={`Women's Scrub in ${currentWomens.name}`}
                className="model-full-figure swatch-crossfade-img"
                loading="eager"
              />
            </div>
          </div>

          {/* Card 2: Men's "Built for Performance" */}
          <div className="hero-editorial-card mens-card">
            {/* Soft Pastel Background Curve */}
            <div className="card-ambient-curve mens-curve" />

            {/* Wishlist Heart Button */}
            <button
              type="button"
              className={`card-wishlist-circle-btn ${isMensSaved ? 'is-active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                toggleWishlist(mensProduct.id);
              }}
              aria-label="Save Men's Scrub to Wishlist"
            >
              <Heart size={18} fill={isMensSaved ? '#1E60D5' : 'none'} color={isMensSaved ? '#1E60D5' : '#718096'} />
            </button>

            {/* Left Column: Pill + Headings + CTA */}
            <div className="card-left-column">
              <div className="card-top-tag-wrap">
                <span className="category-pill-badge pill-mens">
                  <span className="gender-symbol">♂</span>
                  <span>Men's</span>
                </span>
              </div>

              <div className="card-editorial-content">
                <h3 className="card-bold-title">
                  Built for<br />Performance
                </h3>
                <p className="card-sub-copy">
                  Move Freely.<br />Work Better.
                </p>
                <Link 
                  to="/products/the-mens-nursing-scrub-set" 
                  className="editorial-explore-btn"
                >
                  <span>Explore Men's</span>
                  <span className="btn-arrow">&rarr;</span>
                </Link>
              </div>
            </div>

            {/* Right Column: Model Figure */}
            <div className="card-figure-showcase">
              <img
                key={currentMens.img}
                src={currentMens.img}
                alt={`Men's Scrub in ${currentMens.name}`}
                className="model-full-figure swatch-crossfade-img"
                loading="eager"
              />
            </div>
          </div>

        </div>

        {/* Bottom Floating Capsule Dock: "Shop by Style:" */}
        <div className="style-dock-floating-wrap">
          <div className="style-dock-container">
            <span className="dock-title-label">Shop by Style:</span>

            <div className="dock-scroll-track" ref={dockTrackRef}>
              {ALL_STYLE_THUMBS.map((thumb) => {
                const isActive = selectedThumbId === thumb.id;
                return (
                  <button
                    key={thumb.id}
                    type="button"
                    className={`style-thumb-pill ${isActive ? 'is-active' : ''}`}
                    onClick={() => handleSelectThumb(thumb)}
                    title={`${thumb.name} in ${thumb.colorName}`}
                  >
                    <div className="thumb-figure-wrap">
                      <img
                        src={thumb.img}
                        alt={`${thumb.name} - ${thumb.colorName}`}
                        className="thumb-figure-img"
                        loading="lazy"
                      />
                    </div>
                    <span 
                      className="thumb-swatch-dot" 
                      style={{ backgroundColor: thumb.hex }}
                    />
                  </button>
                );
              })}
            </div>

            {/* Dock Right Scroll Arrow */}
            <button
              type="button"
              className="dock-arrow-btn"
              onClick={handleScrollRight}
              aria-label="Scroll styles right"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};

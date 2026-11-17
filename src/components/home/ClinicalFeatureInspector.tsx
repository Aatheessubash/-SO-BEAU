import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Home,
  Crown, 
  Tag, 
  Ruler, 
  ShoppingBag, 
  Heart, 
  ShieldCheck, 
  Feather, 
  RotateCcw, 
  Truck, 
  Headphones, 
  ChevronLeft, 
  ChevronRight, 
  ChevronDown, 
  Maximize2, 
  X 
} from 'lucide-react';
import { sounds } from '../../utils/soundEffects';
import { useCart } from '../../context/CartContext';
import { api } from '../../services/api';
import { Product } from '../../types';
import { SizeGuideModal } from '../common/SizeGuideModal';
import '../../styles/components/ClinicalFeatureInspector.scss';

const INSPECTOR_IMAGES = [
  '/images/blue_scrub_female/TYRAECOM28.125576_2048x.webp',
  '/images/blue_scrub_female/TYRAECOM28.125585_2048x.webp',
  '/images/blue_scrub_female/TYRAECOM28.125511_2048x.webp',
  '/images/female/female-top-pocket-detail.jpg',
  '/images/female/female-fabric-tech.png',
  '/images/blue_scrub_female/TYRAECOM28.125541_2048x.webp',
];

const SIZE_OPTIONS = [
  { label: 'AU 4 (XXS)', stock: 'IT' },
  { label: 'AU 6 (XS)', stock: '8' },
  { label: 'AU 8 (S)', stock: '24' },
  { label: 'AU 10 (M)', stock: '18' },
  { label: 'AU 12 (L)', stock: '15' },
  { label: 'AU 14 (XL)', stock: '20' },
  { label: 'AU 16 (2XL)', stock: '12' },
];

export const ClinicalFeatureInspector: React.FC = () => {
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const [product, setProduct] = useState<Product | null>(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState('AU 6 (XS)');
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  useEffect(() => {
    api.getProductBySlug('the-womens-nursing-scrub-set').then((res) => {
      if (res?.data) {
        setProduct(res.data);
      }
    }).catch((e) => console.error(e));
  }, []);

  const productId = product?.id || 'sb-001';
  const isSaved = isInWishlist(productId);

  const handlePrev = () => {
    sounds.playSwatchClick();
    setActiveIndex((prev) => (prev - 1 + INSPECTOR_IMAGES.length) % INSPECTOR_IMAGES.length);
  };

  const handleNext = () => {
    sounds.playSwatchClick();
    setActiveIndex((prev) => (prev + 1) % INSPECTOR_IMAGES.length);
  };

  const handleAddToCart = (e?: React.MouseEvent<HTMLButtonElement>) => {
    if (product) {
      const color = product.colors?.[0] || { name: 'French Navy', hex: '#1D2A44', code: 'navy' };
      addToCart(product, color, selectedSize, 1, e?.currentTarget);
    }
  };

  const currentImage = INSPECTOR_IMAGES[activeIndex] || INSPECTOR_IMAGES[0];

  return (
    <section className="clinical-feature-inspector-section" id="anatomy-inspector">
      {/* Ambient Blue Waves Background (Top Right, Bottom Left, Bottom Right) */}
      <div className="inspector-wave wave-top-right" aria-hidden="true">
        <svg viewBox="0 0 700 500" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M700 0H220C340 140 500 200 700 240V0Z" fill="url(#insp-wave-tr1)" />
          <path d="M700 0H380C460 180 600 260 700 320V0Z" fill="url(#insp-wave-tr2)" />
          <defs>
            <linearGradient id="insp-wave-tr1" x1="700" y1="0" x2="220" y2="240" gradientUnits="userSpaceOnUse">
              <stop stopColor="#1E60D5" stopOpacity="0.10" />
              <stop offset="1" stopColor="#60A5FA" stopOpacity="0.01" />
            </linearGradient>
            <linearGradient id="insp-wave-tr2" x1="700" y1="0" x2="380" y2="320" gradientUnits="userSpaceOnUse">
              <stop stopColor="#2563EB" stopOpacity="0.07" />
              <stop offset="1" stopColor="#93C5FD" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="inspector-wave wave-bottom-left" aria-hidden="true">
        <svg viewBox="0 0 600 400" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 400H450C350 280 220 220 0 200V400Z" fill="url(#insp-wave-bl)" />
          <defs>
            <linearGradient id="insp-wave-bl" x1="0" y1="400" x2="450" y2="200" gradientUnits="userSpaceOnUse">
              <stop stopColor="#1E60D5" stopOpacity="0.12" />
              <stop offset="1" stopColor="#60A5FA" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="inspector-wave wave-bottom-right" aria-hidden="true">
        <svg viewBox="0 0 600 400" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M600 400H150C250 280 380 220 600 200V400Z" fill="url(#insp-wave-br)" />
          <defs>
            <linearGradient id="insp-wave-br" x1="600" y1="400" x2="150" y2="200" gradientUnits="userSpaceOnUse">
              <stop stopColor="#1E60D5" stopOpacity="0.12" />
              <stop offset="1" stopColor="#60A5FA" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="container inspector-container">
        {/* Breadcrumb matching reference: Home > Women's > Chest Anatomy */}
        <div className="inspector-breadcrumbs-wrap">
          <nav className="inspector-breadcrumbs" aria-label="Breadcrumb">
            <Link to="/" className="home-icon-link" aria-label="Home">
              <Home size={15} color="#1E60D5" />
            </Link>
            <span className="breadcrumb-separator">&gt;</span>
            <Link to="/collections/scrubs?category=womens-scrubs" className="breadcrumb-link">
              Women's
            </Link>
            <span className="breadcrumb-separator">&gt;</span>
            <span className="breadcrumb-current">Chest Anatomy</span>
          </nav>
        </div>

        {/* Main Stage Grid */}
        <div className="inspector-main-grid">
          {/* Left Column: Vertical Thumbnails Strip + Main Photo Stage */}
          <div className="inspector-gallery-col">
            {/* 5 Vertical Thumbnails Strip + Down Arrow Button */}
            <div className="inspector-thumb-strip">
              {INSPECTOR_IMAGES.slice(0, 5).map((imgUrl, idx) => (
                <button
                  key={idx}
                  type="button"
                  className={`inspector-thumb-btn ${activeIndex === idx ? 'active' : ''}`}
                  onClick={() => {
                    sounds.playSwatchClick();
                    setActiveIndex(idx);
                  }}
                  title={`Perspective 0${idx + 1}`}
                >
                  <img src={imgUrl} alt={`Scrub perspective ${idx + 1}`} loading="lazy" />
                </button>
              ))}

              {/* Scroll Down Chevron Button */}
              <button
                type="button"
                className="inspector-thumb-scroll-btn"
                onClick={handleNext}
                aria-label="View next perspective"
              >
                <ChevronDown size={18} />
              </button>
            </div>

            {/* Main Image Stage */}
            <div className="inspector-main-viewport">
              <img
                src={currentImage}
                alt="Women's Scrub Chest Anatomy"
                className="inspector-hero-img"
              />

              {/* Lightbox Trigger */}
              <button
                type="button"
                className="inspector-enlarge-btn"
                onClick={() => setIsLightboxOpen(true)}
                aria-label="Enlarge photoshoot"
              >
                <Maximize2 size={16} />
              </button>

              {/* Navigation Chevrons */}
              <button
                type="button"
                className="inspector-nav-arrow prev"
                onClick={handlePrev}
                aria-label="Previous image"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                type="button"
                className="inspector-nav-arrow next"
                onClick={handleNext}
                aria-label="Next image"
              >
                <ChevronRight size={20} />
              </button>

              {/* Counter Badge */}
              <div className="inspector-counter-badge">
                {activeIndex + 1} / {INSPECTOR_IMAGES.length}
              </div>
            </div>
          </div>

          {/* Right Column: Title, Features, Sizing & CTAs */}
          <div className="inspector-info-col">
            {/* Kicker Pill: Crown + Premium Collection */}
            <div className="inspector-kicker-pill">
              <Crown size={14} className="crown-icon" fill="#1E60D5" color="#1E60D5" />
              <span>Premium Collection</span>
            </div>

            {/* Title */}
            <h2 className="inspector-headline">Chest Anatomy</h2>

            {/* Subtitle */}
            <p className="inspector-subheadline">
              Comfortable. Functional. Professional.
            </p>

            {/* Price & Savings Row */}
            <div className="inspector-pricing-row">
              <span className="price-bold">₹158 AUD</span>
              <span className="price-strike">₹199 AUD</span>
              <span className="price-tag-badge">
                <Tag size={13} fill="#1E8E3E" color="#1E8E3E" />
                <span>Save $41 (21%)</span>
              </span>
            </div>

            {/* 3-Item Feature Highlight Card */}
            <div className="inspector-feature-trio-card">
              <div className="feature-item">
                <div className="feature-icon">
                  <ShieldCheck size={20} color="#1E60D5" />
                </div>
                <div className="feature-text">
                  <span className="item-title">Premium Fabric</span>
                  <span className="item-desc">All-Day Comfort</span>
                </div>
              </div>

              <div className="feature-item">
                <div className="feature-icon">
                  <Feather size={20} color="#1E60D5" />
                </div>
                <div className="feature-text">
                  <span className="item-title">Ultra Lightweight</span>
                  <span className="item-desc">Move Freely</span>
                </div>
              </div>

              <div className="feature-item">
                <div className="feature-icon">
                  <RotateCcw size={20} color="#1E60D5" />
                </div>
                <div className="feature-text">
                  <span className="item-title">Easy Returns</span>
                  <span className="item-desc">Shop Confidently</span>
                </div>
              </div>
            </div>

            {/* Size Section with 2-Row Grid */}
            <div className="inspector-size-section">
              <div className="size-header-row">
                <span className="size-title">Size</span>
                <button
                  type="button"
                  className="size-guide-btn"
                  onClick={() => setIsSizeGuideOpen(true)}
                >
                  <Ruler size={14} className="guide-icon" />
                  <span>Size Guide</span>
                </button>
              </div>

              <div className="size-cards-grid">
                {SIZE_OPTIONS.map((sz) => {
                  const isSelected = selectedSize === sz.label;
                  return (
                    <button
                      key={sz.label}
                      type="button"
                      className={`size-card-btn ${isSelected ? 'active' : ''}`}
                      onClick={() => {
                        sounds.playSwatchClick();
                        setSelectedSize(sz.label);
                      }}
                    >
                      <span className="card-size-label">{sz.label}</span>
                      <span className="card-stock-label">≈ {sz.stock}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Dual Actions Row: Add to Cart & Wishlist */}
            <div className="inspector-dual-actions-row">
              <button
                type="button"
                className="btn-inspector-cart"
                onClick={handleAddToCart}
              >
                <ShoppingBag size={19} className="cart-icon" />
                <span>Add to Cart</span>
              </button>
              <button
                type="button"
                className={`btn-inspector-wishlist ${isSaved ? 'is-saved' : ''}`}
                onClick={() => {
                  sounds.playSwatchClick();
                  toggleWishlist(productId);
                }}
              >
                <Heart size={19} className="wishlist-icon" fill={isSaved ? '#031F41' : 'none'} />
                <span>Add to Wishlist</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Full-Width Trust Dock */}
        <div className="inspector-trust-dock">
          <div className="trust-dock-item">
            <div className="dock-icon">
              <Truck size={22} color="#1E60D5" />
            </div>
            <div className="dock-text">
              <span className="dock-title">Free Shipping</span>
              <span className="dock-desc">On orders over $100</span>
            </div>
          </div>

          <div className="trust-dock-item">
            <div className="dock-icon">
              <RotateCcw size={22} color="#1E60D5" />
            </div>
            <div className="dock-text">
              <span className="dock-title">30-Day Returns</span>
              <span className="dock-desc">Hassle Free</span>
            </div>
          </div>

          <div className="trust-dock-item">
            <div className="dock-icon">
              <Headphones size={22} color="#1E60D5" />
            </div>
            <div className="dock-text">
              <span className="dock-title">Dedicated Support</span>
              <span className="dock-desc">We're here to help</span>
            </div>
          </div>

          <div className="trust-dock-item">
            <div className="dock-icon">
              <ShieldCheck size={22} color="#1E60D5" />
            </div>
            <div className="dock-text">
              <span className="dock-title">Secure Checkout</span>
              <span className="dock-desc">Your information is safe</span>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {isLightboxOpen && (
        <div className="inspector-lightbox-overlay" onClick={() => setIsLightboxOpen(false)}>
          <button
            type="button"
            className="lightbox-close"
            onClick={() => setIsLightboxOpen(false)}
            aria-label="Close"
          >
            <X size={24} />
          </button>
          <div className="lightbox-img-box" onClick={(e) => e.stopPropagation()}>
            <img src={currentImage} alt="Enlarged Chest Anatomy View" />
          </div>
        </div>
      )}

      {/* Size Guide Modal */}
      <SizeGuideModal isOpen={isSizeGuideOpen} onClose={() => setIsSizeGuideOpen(false)} />
    </section>
  );
};

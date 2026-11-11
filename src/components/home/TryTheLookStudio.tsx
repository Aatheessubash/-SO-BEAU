import React, { useState, useEffect, useRef } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Star,
  Check,
  ShoppingBag,
  Eye,
  Truck,
  RotateCcw
} from 'lucide-react';
import { Product } from '../../types';
import { useCart } from '../../context/CartContext';
import { sounds } from '../../utils/soundEffects';
import { CircularCarousel, CircularCarouselRef } from '../common/CircularCarousel';
import '../../styles/components/TryTheLookStudio.scss';

interface TryTheLookStudioProps {
  products: Product[];
}

export const TryTheLookStudio: React.FC<TryTheLookStudioProps> = ({ products }) => {
  const { addToCart, openQuickView } = useCart();

  // Find the 2 core products
  const womensProduct = products.find(p => p.category === 'womens-scrubs') || products[0];
  const mensProduct = products.find(p => p.category === 'mens-scrubs') || products[1] || products[0];

  // Gender tab state: 'womens' | 'mens'
  const [selectedGender, setSelectedGender] = useState<'womens' | 'mens'>('womens');
  const activeProduct = selectedGender === 'womens' ? womensProduct : mensProduct;

  // Active color look index (0 to colors.length - 1)
  const [activeLookIndex, setActiveLookIndex] = useState(0);

  // Selected size state (default 'M')
  const [selectedSize, setSelectedSize] = useState<string>('M');

  // Add to Bag feedback state
  const [isAdded, setIsAdded] = useState(false);

  // Button ref for fly-to-cart animation
  const addButtonRef = useRef<HTMLButtonElement>(null);

  // Reference to React Bits Circular Carousel
  const carouselRef = useRef<CircularCarouselRef>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  // Reset carousel and size default when gender switches
  useEffect(() => {
    setActiveLookIndex(0);
    carouselRef.current?.rotateToIndex(0);
    if (activeProduct?.sizes && activeProduct.sizes.length > 0) {
      setSelectedSize(activeProduct.sizes.includes('M') ? 'M' : activeProduct.sizes[0]);
    }
  }, [selectedGender, activeProduct]);

  if (!activeProduct || !activeProduct.colors || activeProduct.colors.length === 0) {
    return null;
  }

  const colors = activeProduct.colors;
  const currentColor = colors[activeLookIndex] || colors[0];
  const availableSizes = activeProduct.sizes && activeProduct.sizes.length > 0 
    ? activeProduct.sizes 
    : ['XS', 'S', 'M', 'L', 'XL', '2XL'];

  // Handlers for navigating looks
  const handlePrevLook = () => {
    carouselRef.current?.prev();
    sounds.playSwatchClick();
  };

  const handleNextLook = () => {
    carouselRef.current?.next();
    sounds.playSwatchClick();
  };

  const handleSelectLook = (idx: number) => {
    carouselRef.current?.rotateToIndex(idx);
    sounds.playSwatchClick();
  };

  const handleAddToCart = () => {
    if (!currentColor) return;
    addToCart(activeProduct, currentColor, selectedSize, 1, addButtonRef.current);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2200);
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      handlePrevLook();
    } else if (e.key === 'ArrowRight') {
      handleNextLook();
    }
  };

  return (
    <section 
      id="try-the-look" 
      className="try-the-look-studio-section" 
      ref={stageRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      aria-label="Try the Look Interactive Studio"
    >
      <div className="studio-container">
        
        {/* Left Column (3/4): 3D Runway Carousel Studio */}
        <div className="studio-main-stage">
          
          {/* Top Stage Header: Title & Gender Switcher */}
          <div className="stage-top-bar">
            <div className="stage-title-block">
              <h2 className="studio-title">Try the Look.</h2>
              <p className="studio-subtitle">
                {colors.length} signature colorways, styled head to toe. Drag the circular runway to inspect drape, fit, and clinical posture.
              </p>
            </div>

            {/* Gender / Product Switcher Toggle */}
            <div className="gender-switcher-pill" role="tablist">
              <button
                type="button"
                role="tab"
                aria-selected={selectedGender === 'womens'}
                className={`gender-tab-btn ${selectedGender === 'womens' ? 'active' : ''}`}
                onClick={() => setSelectedGender('womens')}
              >
                Women's Scrub Set
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={selectedGender === 'mens'}
                className={`gender-tab-btn ${selectedGender === 'mens' ? 'active' : ''}`}
                onClick={() => setSelectedGender('mens')}
              >
                Men's Scrub Set
              </button>
            </div>
          </div>

          {/* Perspective Studio Floor Stage */}
          <div className="studio-cove-viewport">
            {/* Ambient Studio Lighting Gradients */}
            <div className="studio-cove-backwall" />
            <div className="studio-cove-floor" />
            <div className="studio-horizon-crease" />

            {/* React Bits Circular Carousel (7 Variants Visible, Selected Only Highlighted) */}
            <CircularCarousel
              ref={carouselRef}
              items={colors}
              activeIndex={activeLookIndex}
              onIndexChange={(newIndex) => {
                setActiveLookIndex(newIndex);
              }}
              renderItem={(color, { isCenter, isNearLeft, isNearRight, isOuterLeft, isOuterRight, isFarLeft, isFarRight, index }) => (
                <div 
                  className={`model-card-figure ${
                    isCenter 
                      ? 'active-center' 
                      : isNearLeft 
                        ? 'side-variant near-side near-left' 
                        : isNearRight 
                          ? 'side-variant near-side near-right' 
                          : isOuterLeft
                            ? 'side-variant outer-side outer-left'
                            : isOuterRight
                              ? 'side-variant outer-side outer-right'
                              : isFarLeft 
                                ? 'side-variant far-side far-left' 
                                : isFarRight 
                                  ? 'side-variant far-side far-right' 
                                  : 'staggered-side'
                  }`}
                  title={`${color.name} ${isCenter ? '(Selected)' : '- Tap to select'}`}
                >
                  {/* Layered Ground Contact Shadow */}
                  <div className="model-ground-shadow" />

                  {/* Model Photo Container */}
                  <div className="model-image-wrap">
                    <img
                      src={color.modelImage || activeProduct.images[0]}
                      alt={`${activeProduct.name} in ${color.name}`}
                      className="model-photo"
                      loading={isCenter ? 'eager' : 'lazy'}
                    />
                  </div>

                  {/* Active Look: ONLY Highlighted on Center / Selected Variant */}
                  {isCenter && (
                    <div className="active-look-pedestal">
                      <span className="pedestal-dot" />
                      <span className="pedestal-label">
                        {String(index + 1).padStart(2, '0')} {color.name}
                      </span>
                      <span className="selected-badge">
                        <Check size={11} strokeWidth={3} />
                        SELECTED
                      </span>
                    </div>
                  )}
                </div>
              )}
            />

            {/* Stage Left / Right Navigation Hotspots */}
            <button
              type="button"
              className="stage-nav-arrow arrow-left"
              onClick={handlePrevLook}
              aria-label="Previous look"
            >
              <ChevronLeft size={22} />
            </button>
            <button
              type="button"
              className="stage-nav-arrow arrow-right"
              onClick={handleNextLook}
              aria-label="Next look"
            >
              <ChevronRight size={22} />
            </button>
          </div>
        </div>

        {/* Right Column (1/4): Selected Variant Details & Bag Action (Clean, un-cluttered & responsive) */}
        <aside className="selected-variant-detail-panel" aria-label="Selected Look Details">
          {/* Product Identity Block */}
          <div className="panel-title-block">
            <span className="collection-kicker">AUSTRALIAN MEDICAL ATELIER • 14-HR SHIFT READY</span>
            <h3 className="product-heading">{activeProduct.name}</h3>
          </div>

          <div className="panel-divider" />

          {/* Active Colorway Selector */}
          <div className="panel-option-block">
            <div className="option-header-row">
              <span className="option-label">Colorway</span>
              <span className="option-active-value">
                {currentColor.name}
                <span 
                  className="color-hex-tag" 
                  style={{ backgroundColor: currentColor.hex }}
                  aria-hidden="true" 
                />
              </span>
            </div>
            <div className="colorways-palette-grid" role="radiogroup" aria-label="Select colorway">
              {colors.map((color, idx) => {
                const isSelected = idx === activeLookIndex;
                return (
                  <button
                    type="button"
                    key={`colorway-${color.code}-${idx}`}
                    role="radio"
                    aria-checked={isSelected}
                    aria-label={`${color.name}${isSelected ? ' (Selected)' : ''}`}
                    className={`colorway-swatch-btn ${isSelected ? 'active' : ''}`}
                    onClick={() => handleSelectLook(idx)}
                    title={color.name}
                  >
                    <span 
                      className="colorway-swatch-fill" 
                      style={{ backgroundColor: color.hex }}
                    />
                    {isSelected && <Check size={11} className="swatch-check" strokeWidth={3} />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Size Selector */}
          <div className="panel-option-block">
            <div className="option-header-row">
              <span className="option-label">Size</span>
              <span className="option-active-value">AU {selectedSize}</span>
            </div>
            <div className="sizes-selector-grid" role="radiogroup" aria-label="Select size">
              {availableSizes.map((size) => {
                const isSelected = size === selectedSize;
                return (
                  <button
                    type="button"
                    key={`size-${size}`}
                    role="radio"
                    aria-checked={isSelected}
                    className={`size-chip-btn ${isSelected ? 'active' : ''}`}
                    onClick={() => {
                      setSelectedSize(size);
                      sounds.playSwatchClick();
                    }}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action CTAs (Clean, sleek, no price) */}
          <div className="panel-cta-group">
            <button
              ref={addButtonRef}
              type="button"
              className={`atelier-add-bag-btn ${isAdded ? 'added' : ''}`}
              onClick={handleAddToCart}
            >
              {isAdded ? (
                <>
                  <Check size={18} strokeWidth={2.5} />
                  <span>Added to Bag!</span>
                </>
              ) : (
                <>
                  <ShoppingBag size={18} />
                  <span>Add Look to Bag</span>
                </>
              )}
            </button>
          </div>
        </aside>

      </div>
    </section>
  );
};

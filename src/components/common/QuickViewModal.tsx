import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { X, Star, Check, ShieldCheck } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { ColorAvatarScroll } from './ColorAvatarScroll';
import '../../styles/components/QuickViewModal.scss';

export const QuickViewModal: React.FC = () => {
  const { quickViewProduct, closeQuickView, addToCart } = useCart();

  if (!quickViewProduct) return null;

  const [selectedColor, setSelectedColor] = useState(quickViewProduct.colors[0]);
  const [selectedSize, setSelectedSize] = useState(quickViewProduct.sizes[0] || 'S');
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = (e?: React.MouseEvent<HTMLButtonElement>) => {
    addToCart(quickViewProduct, selectedColor, selectedSize, quantity, e?.currentTarget);
    closeQuickView();
  };

  return (
    <div className="modal-overlay" onClick={closeQuickView}>
      <div className="quickview-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="quickview-close-btn" onClick={closeQuickView} aria-label="Close modal">
          <X size={20} />
        </button>

        <div className="quickview-grid">
          {/* Left: Gallery */}
          <div className="quickview-gallery">
            <div className="main-image-wrap">
              <img 
                src={selectedColor.modelImage || quickViewProduct.images[activeImageIndex] || quickViewProduct.images[0]} 
                alt={quickViewProduct.name} 
              />
            </div>
            {quickViewProduct.images.length > 1 && (
              <div className="quickview-thumbnails">
                {quickViewProduct.images.map((img, idx) => (
                  <button
                    key={idx}
                    className={`thumb-btn ${activeImageIndex === idx ? 'active' : ''}`}
                    onClick={() => setActiveImageIndex(idx)}
                  >
                    <img src={img} alt={`Thumbnail ${idx + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Info & Actions */}
          <div className="quickview-info">
            {quickViewProduct.badge && (
              <span className={`badge-tag badge-${quickViewProduct.badge.toLowerCase()}`}>
                {quickViewProduct.badge}
              </span>
            )}

            <h3 className="quickview-title">{quickViewProduct.name}</h3>

            <div className="quickview-rating-row">
              <div className="star-rating">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    fill={i < Math.floor(quickViewProduct.rating) ? '#D4AF37' : 'none'}
                    color="#D4AF37"
                  />
                ))}
                <span className="star-count">({quickViewProduct.reviewCount} verified reviews)</span>
              </div>
            </div>

            <div className="price-display quickview-price">
              <span className="price-current">${quickViewProduct.price.toFixed(2)} AUD</span>
              {quickViewProduct.compareAtPrice && (
                <span className="price-compare">${quickViewProduct.compareAtPrice.toFixed(2)}</span>
              )}
            </div>
            <div className="quickview-afterpay-note">
              <span>or 4 interest-free payments of <strong>${(quickViewProduct.price / 4).toFixed(2)} AUD</strong> with Afterpay</span>
            </div>

            <p className="quickview-headline">{quickViewProduct.headline}</p>

            {/* Animated Avatar Horizontal Color Scroll */}
            <div className="option-section">
              <ColorAvatarScroll
                colors={quickViewProduct.colors}
                selectedColor={selectedColor}
                onSelectColor={setSelectedColor}
                size="md"
                showLabel={true}
              />
            </div>

            {/* Size selection */}
            <div className="option-section">
              <div className="option-header-row">
                <label className="option-label">
                  Australian Size: <strong>{selectedSize}</strong>
                </label>
                <Link to="/pages/size-guide" onClick={closeQuickView} className="size-guide-link">
                  Size Guide
                </Link>
              </div>
              <div className="size-chips-row">
                {quickViewProduct.sizes.map((s) => (
                  <button
                    key={s}
                    className={`size-chip-btn ${selectedSize === s ? 'selected' : ''}`}
                    onClick={() => setSelectedSize(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity and Add to Bag */}
            <div className="actions-section">
              <div className="qty-picker">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="qty-btn"
                  aria-label="Decrease"
                >
                  -
                </button>
                <span className="qty-val">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="qty-btn"
                  aria-label="Increase"
                >
                  +
                </button>
              </div>

              <button 
                onClick={handleAddToCart}
                className="btn btn-primary add-to-bag-btn"
              >
                Add to Bag • ${(quickViewProduct.price * quantity).toFixed(2)} AUD
              </button>
            </div>

            {/* Quick Highlights */}
            <div className="quickview-perks">
              <div className="perk-item">
                <Check size={14} /> BeauTech™ 4-way stretch weave
              </div>
              <div className="perk-item">
                <ShieldCheck size={14} /> Silvadur™ antimicrobial silver ions
              </div>
            </div>

            <div className="quickview-footer-link">
              <Link 
                to={`/products/${quickViewProduct.slug}`} 
                onClick={closeQuickView}
                className="full-details-link"
              >
                View Full Product Specifications & Sizing &rarr;
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

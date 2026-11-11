import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Eye, Star, Plus, RotateCcw } from 'lucide-react';
import { Product, ProductColor } from '../../types';
import { useCart } from '../../context/CartContext';
import { ColorAvatarScroll } from '../common/ColorAvatarScroll';
import { sounds } from '../../utils/soundEffects';
import '../../styles/components/ProductCard.scss';

interface ProductCardProps {
  product: Product;
  index?: number;
  disableHover?: boolean;
  showOffersAndRatings?: boolean;
  showPrice?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  index = 0,
  disableHover = false,
  showOffersAndRatings = false,
  showPrice = true,
}) => {
  const { openQuickView, toggleWishlist, isInWishlist, addToCart } = useCart();
  const [selectedColor, setSelectedColor] = useState<ProductColor>(product.colors[0]);
  const [isHovered, setIsHovered] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isHeartPopping, setIsHeartPopping] = useState(false);

  const isSaved = isInWishlist(product.id);
  const showBack = !disableHover && (isHovered || isFlipped);

  // 02. Front and Back Images
  const frontImage = selectedColor?.modelImage || product.images[0];
  const backImage =
    product.images[1] ||
    (product.id === 'sb-001'
      ? '/images/female/female-pants-fit.jpg'
      : product.id === 'sb-002'
      ? '/images/male/male-jogger-back-fit.jpg'
      : frontImage);

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsHeartPopping(true);
    toggleWishlist(product.id);
    setTimeout(() => setIsHeartPopping(false), 550);
  };

  const handleQuickAddSize = (size: string, e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    // 05. Product flies into shopping bag via currentTarget
    addToCart(product, selectedColor, size, 1, e.currentTarget);
  };

  return (
    <div
      className={`product-card ${!disableHover && isHovered ? 'is-card-hovered' : ''} ${
        disableHover ? 'hover-disabled' : ''
      }`}
      style={{ animationDelay: `${index * 0.12}s` }}
      onMouseEnter={() => {
        if (!disableHover) setIsHovered(true);
      }}
      onMouseLeave={() => {
        if (!disableHover) setIsHovered(false);
      }}
    >
      {/* 02. Product Image Front/Back Flip Container */}
      <div className="product-image-container">
        <Link to={`/products/${product.slug}`} className="product-image-link">
          {/* Front Image */}
          <img
            src={frontImage}
            alt={`${product.name} Front View`}
            className={`product-flip-img front-view ${showBack ? 'hide' : 'show'}`}
            loading="lazy"
          />

          {/* Back Image (Reveals on Hover or Click Flip) */}
          {!disableHover && (
            <img
              src={backImage}
              alt={`${product.name} Back Movement View`}
              className={`product-flip-img back-view ${showBack ? 'show' : 'hide'}`}
              loading="lazy"
            />
          )}

          {/* View Perspective Badge */}
          {!disableHover && (
            <span className={`perspective-tag ${showBack ? 'active' : ''}`}>
              {showBack ? 'Back Movement Fit' : 'Front Model'}
            </span>
          )}
        </Link>

        {/* 360 / Front-Back Angle Toggle Button */}
        {!disableHover && (
          <button
            type="button"
            className={`card-flip-toggle-btn ${isFlipped ? 'flipped' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsFlipped((prev) => !prev);
              sounds.playSwatchClick();
            }}
            title={showBack ? 'Show Front Angle' : 'Show Back Movement Angle'}
            aria-label="Toggle front or back view"
          >
            <RotateCcw size={13} />
            <span>{showBack ? 'Front' : '360° Fit'}</span>
          </button>
        )}

        {/* Product Badge */}
        {product.badge && !disableHover && (
          <div className="card-badge-wrap">
            <span className={`badge-tag badge-${product.badge.toLowerCase().replace(/\s+/g, '-')}`}>
              {product.badge}
            </span>
          </div>
        )}

        {/* 02. Wishlist Heart with Bouncy Spring Pop Animation */}
        <button
          className={`card-wishlist-btn ${isSaved ? 'is-saved' : ''} ${
            isHeartPopping ? 'animate-heart-pop' : ''
          }`}
          onClick={handleWishlistClick}
          aria-label={isSaved ? 'Remove from wishlist' : 'Save to wishlist'}
        >
          <Heart size={18} fill={isSaved ? '#171717' : 'none'} color={isSaved ? '#171717' : '#444'} />
        </button>

        {/* Quick View Trigger on Corner */}
        {!disableHover && (
          <button
            className="card-quickview-circle-btn"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              openQuickView(product);
            }}
            title="Quick View specs"
            aria-label="Quick View"
          >
            <Eye size={15} />
          </button>
        )}

        {/* 02. Quick-Add Size Selector Bar (Reveals smoothly on hover) */}
        {!disableHover && (
          <div className={`card-quick-add-bar ${isHovered ? 'is-visible' : ''}`}>
            <div className="quick-add-header">
              <span className="quick-add-caption">Quick Add Size:</span>
              <span className="quick-add-shade">{selectedColor.name}</span>
            </div>
            <div className="quick-sizes-scroll">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  type="button"
                  className="quick-size-pill"
                  onClick={(e) => handleQuickAddSize(s, e)}
                  title={`Quick add size ${s} in ${selectedColor.name}`}
                >
                  <span>{s.split(' ')[1] ? s.split(' ')[1].replace(/[()]/g, '') : s}</span>
                  <Plus size={10} className="plus-icon" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Product Information */}
      <div className="product-card-body">
        {/* Animated Avatar Horizontal Color Scroll */}
        <div className="card-avatar-color-container">
          <div className="card-color-header-mini">
            <span className="card-color-label">
              Shade: <strong>{selectedColor.name}</strong>
            </span>
            <span className="card-color-tally">{product.colors.length} shades</span>
          </div>
          <ColorAvatarScroll
            colors={product.colors}
            selectedColor={selectedColor}
            onSelectColor={setSelectedColor}
            size="sm"
            showLabel={false}
          />
        </div>

        {/* Category & Title */}
        <span className="card-category-name">{product.categoryName}</span>
        <h3 className="card-product-title">
          <Link to={`/products/${product.slug}`}>{product.name}</Link>
        </h3>

        {/* Price & Rating: Offers and ratings are shown on Shop page only */}
        {showPrice ? (
          <div className="card-footer-row">
            <div className="price-display">
              <span className="price-current">${product.price.toFixed(2)} AUD</span>
              {showOffersAndRatings && product.compareAtPrice && (
                <span className="price-compare">${product.compareAtPrice.toFixed(2)}</span>
              )}
              {showOffersAndRatings && product.compareAtPrice && product.compareAtPrice > product.price && (
                <span className="price-save-badge">Save ${(product.compareAtPrice - product.price).toFixed(0)}</span>
              )}
            </div>

            {showOffersAndRatings && (
              <div className="star-rating">
                <Star size={13} fill="#D4AF37" color="#D4AF37" />
                <span className="star-rating-val">{product.rating}</span>
                <span className="star-count">({product.reviewCount})</span>
              </div>
            )}
          </div>
        ) : (
          <div className="card-footer-row no-price-footer">
            <Link to={`/products/${product.slug}`} className="card-explore-action">
              Explore Silhouette &rarr;
            </Link>
          </div>
        )}

        {showOffersAndRatings && (
          <div className="card-afterpay-row">
            <span>or 4 payments of <strong>${(product.price / 4).toFixed(2)}</strong> with Afterpay</span>
          </div>
        )}
      </div>
    </div>
  );
};

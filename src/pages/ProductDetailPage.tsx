import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  Check,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Share2,
  Heart,
} from 'lucide-react';
import { api } from '../services/api';
import { Product, ProductColor, Review, CartItemCustomization } from '../types';
import { useCart } from '../context/CartContext';
import { sounds } from '../utils/soundEffects';
import { ProductGallery } from '../components/product/ProductGallery';
import { ProductCard } from '../components/product/ProductCard';
import { ColorAvatarScroll } from '../components/common/ColorAvatarScroll';
import { SizeGuideModal } from '../components/common/SizeGuideModal';
import { ReviewFormModal } from '../components/product/ReviewFormModal';
import { CustomEmbroideryModal } from '../components/product/CustomEmbroideryModal';
import '../styles/pages/ProductDetailPage.scss';

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { addToCart, toggleWishlist, isInWishlist, showToast, openFitFinder } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Selections
  const [selectedColor, setSelectedColor] = useState<ProductColor | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>('S');
  const [selectedLength, setSelectedLength] = useState<string>('Regular (Standard Inseam)');
  const [quantity, setQuantity] = useState(1);
  const [customization, setCustomization] = useState<CartItemCustomization | null>(null);

  // Modals
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isEmbroideryModalOpen, setIsEmbroideryModalOpen] = useState(false);

  // Accordion toggles
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    description: true,
    fabric: false,
    fit: false,
    care: false,
    shipping: false,
  });

  // Sticky add-to-bag observer
  const [showStickyBar, setShowStickyBar] = useState(false);

  useEffect(() => {
    const fetchProductData = async () => {
      if (!slug) return;
      setLoading(true);
      try {
        const res = await api.getProductBySlug(slug);
        if (res.data) {
          setProduct(res.data);
          setSelectedColor(res.data.colors[0]);
          setSelectedSize(res.data.sizes[1] || res.data.sizes[0] || 'S');

          // Fetch reviews and related products
          const [revRes, prodRes] = await Promise.all([
            api.getReviews(res.data.id),
            api.getProducts(),
          ]);

          if (revRes.data) setReviews(revRes.data);
          if (prodRes.data) {
            setRelatedProducts(
              prodRes.data
                .filter((p) => p.id !== res.data.id)
                .slice(0, 4)
            );
          }
        }
      } catch (err) {
        console.error('Failed to load product details', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [slug]);

  // Scroll listener for sticky CTA
  useEffect(() => {
    const handleScroll = () => {
      setShowStickyBar(window.scrollY > 600);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleAccordion = (sectionKey: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [sectionKey]: !prev[sectionKey],
    }));
  };

  if (loading) {
    return (
      <div className="pdp-loading-container container">
        <div className="spinner" />
        <p>Opening product specifications...</p>
      </div>
    );
  }

  if (!product || !selectedColor) {
    return (
      <div className="pdp-notfound-container container">
        <h2>Piece Not Found</h2>
        <p>The scrub silhouette you are looking for may have been retired or moved.</p>
        <Link to="/collections/scrubs" className="btn btn-primary">
          Explore Scrubs Collection
        </Link>
      </div>
    );
  }

  const isSaved = isInWishlist(product.id);
  const unitPrice = product.price + (customization ? customization.price : 0);
  const totalPrice = unitPrice * quantity;

  const handleAddToCart = (e?: React.MouseEvent<HTMLButtonElement>) => {
    addToCart(product, selectedColor, selectedSize, quantity, e?.currentTarget, customization || undefined);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${product.name} | SO BEAU`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Product link copied to clipboard.', 'info');
    }
  };

  return (
    <div className="product-detail-page animate-fade-in">
      {/* Breadcrumbs */}
      <div className="container pdp-breadcrumbs-wrap">
        <nav className="pdp-breadcrumbs">
          <Link to="/">Home</Link>
          <span>/</span>
          <Link to="/collections/scrubs">Collections</Link>
          <span>/</span>
          <Link to={`/collections/scrubs?category=${product.category}`}>
            {product.categoryName}
          </Link>
          <span>/</span>
          <span className="current">{product.name}</span>
        </nav>
      </div>

      <div className="container pdp-main-container">
        <div className="pdp-grid">
          {/* Left Column: Multi-Image Gallery */}
          <div className="pdp-gallery-column">
            <ProductGallery 
              key={selectedColor ? selectedColor.code : 'default'} 
              images={(selectedColor && selectedColor.modelImage)
                ? [selectedColor.modelImage, ...product.images.filter((img) => img !== selectedColor.modelImage)]
                : product.images} 
              productName={product.name} 
            />
          </div>

          {/* Right Column: Information, Selectors & CTAs */}
          <div className="pdp-info-column">
            {/* Header info */}
            <div className="pdp-header">
              {product.badge && (
                <span className={`badge-tag badge-${product.badge.toLowerCase().replace(/\s+/g, '-')}`}>
                  {product.badge}
                </span>
              )}

              <h1 className="pdp-title">{product.name}</h1>

              {/* Rating */}
              <div className="pdp-rating-row">
                <div className="star-rating">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={15}
                      fill={i < Math.floor(product.rating) ? '#D4AF37' : 'none'}
                      color="#D4AF37"
                    />
                  ))}
                  <span className="rating-num">{product.rating}</span>
                </div>
                <a href="#reviews" className="review-count-link">
                  ({reviews.length > 0 ? reviews.length : product.reviewCount} clinician reviews)
                </a>
              </div>

              {/* Price & Installment */}
              <div className="price-display pdp-price">
                <span className="price-current">${unitPrice.toFixed(2)} AUD</span>
                {product.compareAtPrice && (
                  <span className="price-compare">${product.compareAtPrice.toFixed(2)}</span>
                )}
                <span className="price-currency">AUD (GST included)</span>
              </div>
              <div className="afterpay-callout">
                <span>or 4 interest-free payments of <strong>${(unitPrice / 4).toFixed(2)} AUD</strong> with</span>
                <span className="afterpay-badge">afterpay ↗</span>
              </div>
            </div>

            {/* Headline Hook */}
            <p className="pdp-headline-hook">{product.headline}</p>

            {/* Animated Avatar Horizontal Color Scroll */}
            {selectedColor && (
              <div className="pdp-option-block">
                <ColorAvatarScroll
                  colors={product.colors}
                  selectedColor={selectedColor}
                  onSelectColor={setSelectedColor}
                  size="lg"
                  showLabel={true}
                />
              </div>
            )}

            {/* Size Selector */}
            <div className="pdp-option-block">
              <div className="option-label-row">
                <span className="label-text">
                  Australian Size: <strong>{selectedSize}</strong>
                </span>
                <div className="size-actions-group" style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                  <button
                    type="button"
                    onClick={() => {
                      sounds.playSwatchClick();
                      openFitFinder();
                    }}
                    className="size-guide-trigger"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: '#1B3B2B', fontWeight: 600 }}
                  >
                    <Sparkles size={12} color="#C5A059" />
                    <span>Find My Size (30s Quiz)</span>
                  </button>
                  <span style={{ color: '#DDD' }}>•</span>
                  <button
                    type="button"
                    onClick={() => setIsSizeGuideOpen(true)}
                    className="size-guide-trigger"
                  >
                    Size Table
                  </button>
                </div>
              </div>
              <div className="pdp-size-chips">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    className={`size-chip ${selectedSize === s ? 'active' : ''}`}
                    onClick={() => setSelectedSize(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
              <p className="fit-recommendation-note">
                <Sparkles size={13} /> {product.fitNotes}
              </p>
            </div>

            {/* Pant Inseam Length Variant Selector */}
            {product.lengths && product.lengths.length > 0 && (
              <div className="pdp-option-group pdp-length-selector" style={{ marginBottom: '1.75rem' }}>
                <div className="option-header-row" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
                  <span className="option-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>
                    Pant Inseam: <strong style={{ color: '#1B3B2B' }}>{selectedLength}</strong>
                  </span>
                </div>
                <div className="pdp-size-chips">
                  {product.lengths.map((len) => (
                    <button
                      key={len}
                      type="button"
                      className={`size-chip ${selectedLength === len ? 'active' : ''}`}
                      onClick={() => setSelectedLength(len)}
                    >
                      {len}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Custom Embroidery Personalization Bar (Inspired by photo 6 & Ralph Lauren Customize) */}
            <div className="pdp-embroidery-box">
              {customization ? (
                <div className="embroidery-active-card">
                  <div className="emb-left">
                    <span className="emb-sparkle">✦</span>
                    <div className="emb-details">
                      <span className="emb-title">Personalized Embroidery Applied (+${customization.price.toFixed(2)} AUD)</span>
                      <span className="emb-text">
                        "{customization.text}" • {customization.placement} • {customization.threadColor} thread
                      </span>
                    </div>
                  </div>
                  <div className="emb-actions">
                    <button
                      type="button"
                      className="emb-edit-btn"
                      onClick={() => setIsEmbroideryModalOpen(true)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="emb-remove-btn"
                      onClick={() => setCustomization(null)}
                      title="Remove customization"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  className="pdp-embroidery-trigger"
                  onClick={() => setIsEmbroideryModalOpen(true)}
                >
                  <div className="trigger-content">
                    <span className="now-avail-pill">Now Available</span>
                    <span className="trigger-title">Personalize with Custom Embroidery (e.g. Dr. Sumit Kumar)</span>
                  </div>
                  <span className="trigger-price">+$15.00 AUD &rarr;</span>
                </button>
              )}
            </div>

            {/* Quantity & Add to Bag CTA */}
            <div className="pdp-actions-row" id="main-pdp-actions">
              <div className="quantity-selector">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="qty-btn"
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span className="qty-val">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="qty-btn"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className="btn btn-primary add-to-bag-cta"
              >
                <span>Add to Bag</span>
                <span>•</span>
                <span>${totalPrice.toFixed(2)} AUD</span>
              </button>

              <button
                onClick={() => toggleWishlist(product.id)}
                className={`wishlist-toggle-btn ${isSaved ? 'is-saved' : ''}`}
                aria-label={isSaved ? 'Remove from saved' : 'Save piece'}
              >
                <Heart size={20} fill={isSaved ? '#171717' : 'none'} />
              </button>

              <button
                onClick={handleShare}
                className="share-btn"
                aria-label="Share product"
              >
                <Share2 size={18} />
              </button>
            </div>

            {/* Ralph Lauren Luxury Action Bar */}
            <div className="pdp-luxury-action-bar">
              <button
                type="button"
                onClick={() => setIsSizeGuideOpen(true)}
                className="luxury-link-item"
              >
                FIND YOUR HOSPITAL FIT
              </button>
              <span className="luxury-link-divider">•</span>
              <button
                type="button"
                onClick={() => setIsEmbroideryModalOpen(true)}
                className="luxury-link-item highlight"
              >
                CUSTOMIZE EMBROIDERY
              </button>
              <span className="luxury-link-divider">•</span>
              <a href="#reviews" className="luxury-link-item">
                CLINICIAN REVIEWS ({reviews.length > 0 ? reviews.length : product.reviewCount})
              </a>
            </div>

            {/* Trust Perks Banner */}
            <div className="pdp-perks-box">
              <div className="perk-row">
                <Truck size={18} />
                <div className="perk-text">
                  <strong>Complimentary Express Delivery</strong>
                  <span>On all Australian orders over $150 AUD. Dispatched from Melbourne in 24h.</span>
                </div>
              </div>
              <div className="perk-row">
                <RotateCcw size={18} />
                <div className="perk-text">
                  <strong>30-Day Australian Returns &amp; Exchanges</strong>
                  <span>Easy exchanges if you need to adjust sizing after shift try-on.</span>
                </div>
              </div>
              <div className="perk-row">
                <ShieldCheck size={18} />
                <div className="perk-text">
                  <strong>Silvadur™ Antimicrobial Shield</strong>
                  <span>Permanent silver ions eliminate bacteria and shift odor.</span>
                </div>
              </div>
            </div>

            {/* Collapsible Accordions */}
            <div className="pdp-accordions-group">
              {/* Description */}
              <div className="accordion-item">
                <button
                  className="accordion-header"
                  onClick={() => toggleAccordion('description')}
                >
                  <span>Silhouette &amp; Architectural Details</span>
                  {openSections.description ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
                {openSections.description && (
                  <div className="accordion-content animate-fade-in">
                    <p>{product.description}</p>
                    <ul className="details-checklist">
                      {product.details.map((detail, idx) => (
                        <li key={idx}>
                          <Check size={14} className="check-icon" />
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Fabric Science */}
              <div className="accordion-item">
                <button
                  className="accordion-header"
                  onClick={() => toggleAccordion('fabric')}
                >
                  <span>Proprietary BeauTech™ Fabric Science</span>
                  {openSections.fabric ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
                {openSections.fabric && (
                  <div className="accordion-content animate-fade-in">
                    <p>
                      Crafted with our signature four-way stretch weave: 72% Polyester, 21% Rayon, 7% Spandex. Rayon gives it the luxurious fluid drape of designer ready-to-wear, while the high-tenacity polyester and spandex core provides resilient stretch that bounces back even after 14 hours of continuous hospital rounds.
                    </p>
                    <p>
                      Silvadur™ silver ion antimicrobial finish keeps the fabric fresh by destroying 99.9% of odor-causing bacteria upon contact.
                    </p>
                  </div>
                )}
              </div>

              {/* Fit & Sizing */}
              <div className="accordion-item">
                <button
                  className="accordion-header"
                  onClick={() => toggleAccordion('fit')}
                >
                  <span>Fit &amp; Sizing Notes</span>
                  {openSections.fit ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
                {openSections.fit && (
                  <div className="accordion-content animate-fade-in">
                    <p>{product.fitNotes}</p>
                    <button
                      type="button"
                      onClick={() => setIsSizeGuideOpen(true)}
                      className="btn-text"
                    >
                      View Full Measurement Chart &rarr;
                    </button>
                  </div>
                )}
              </div>

              {/* Care Instructions */}
              <div className="accordion-item">
                <button
                  className="accordion-header"
                  onClick={() => toggleAccordion('care')}
                >
                  <span>Care &amp; Wash Instructions</span>
                  {openSections.care ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
                {openSections.care && (
                  <div className="accordion-content animate-fade-in">
                    <ul className="details-checklist">
                      {product.fabricCare.map((item, idx) => (
                        <li key={idx}>
                          <Check size={14} className="check-icon" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Shipping & Returns */}
              <div className="accordion-item">
                <button
                  className="accordion-header"
                  onClick={() => toggleAccordion('shipping')}
                >
                  <span>Shipping &amp; Australian Returns</span>
                  {openSections.shipping ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
                {openSections.shipping && (
                  <div className="accordion-content animate-fade-in">
                    <p>
                      <strong>Australia Post Express:</strong> 1-2 business days across metro Australia.<br />
                      <strong>Australia Post Standard:</strong> 3-5 business days. Free for orders over $150 AUD.<br />
                      <strong>Returns:</strong> 30 days from delivery. Unworn pieces with tags intact are eligible for free exchange or full refund to original payment method.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Customer Reviews Section */}
        <section className="pdp-reviews-section" id="reviews">
          <div className="reviews-section-header">
            <div>
              <span className="overline">Clinician Reviews</span>
              <h2 className="reviews-title">Shift Feedback &amp; Experiences</h2>
            </div>
            <button
              onClick={() => setIsReviewModalOpen(true)}
              className="btn btn-outline"
            >
              Write a Review
            </button>
          </div>

          <div className="reviews-summary-bar">
            <div className="overall-score-box">
              <span className="big-rating">{product.rating}</span>
              <div className="stars-col">
                <div className="star-rating">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      fill={i < Math.floor(product.rating) ? '#D4AF37' : 'none'}
                      color="#D4AF37"
                    />
                  ))}
                </div>
                <span className="based-on">Based on {reviews.length || product.reviewCount} verified reviews</span>
              </div>
            </div>
            <div className="clinician-badges-highlight">
              <div className="highlight-pill">
                <span>98% True to Size</span>
              </div>
              <div className="highlight-pill">
                <span>100% Wrinkle Resistant</span>
              </div>
              <div className="highlight-pill">
                <span>14-Hour Breathability Rated</span>
              </div>
            </div>
          </div>

          <div className="reviews-list-grid">
            {reviews.map((rev) => (
              <div key={rev.id} className="review-card">
                <div className="review-card-top">
                  <div className="star-rating">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={13}
                        fill={i < rev.rating ? '#D4AF37' : 'none'}
                        color="#D4AF37"
                      />
                    ))}
                  </div>
                  <span className="review-date">{rev.date}</span>
                </div>

                <h4 className="review-card-title">"{rev.title}"</h4>
                <p className="review-card-content">{rev.content}</p>

                <div className="review-card-author">
                  <strong>{rev.author}</strong>
                  <span>{rev.role} • {rev.location}</span>
                  {rev.colorPurchased && (
                    <span className="verified-purchase-tag">
                      Verified Purchase • {rev.colorPurchased}, Size {rev.sizePurchased}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Related Nursing Shift & Detail Imagery */}
        {product.relatedImages && product.relatedImages.length > 0 && (
          <section className="pdp-related-imagery-section section-padding-sm">
            <div className="section-head text-center" style={{ marginBottom: '2.5rem' }}>
              <span className="overline">Shift Perspectives</span>
              <h2 className="text-section-title">Clinical Details &amp; Movement In Action</h2>
              <p style={{ color: '#666', fontSize: '0.95rem', maxWidth: '600px', margin: '0.5rem auto 0' }}>
                Tested by Australian nurses through 14-hour emergency handovers, theatre procedures, and high-mobility ward rounds.
              </p>
            </div>

            <div className="related-imagery-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem', marginBottom: '3.5rem' }}>
              {product.relatedImages.map((imgUrl, idx) => {
                const captions = [
                  'Ergonomic 4-Way Stretch Performance',
                  'Hospital Ward In-Action Mobility',
                  'Reinforced Scissor & Tool Pockets',
                  'Atelier Tailored Flatlock Seams',
                ];
                return (
                  <div key={idx} className="related-image-card" style={{ position: 'relative', overflow: 'hidden', backgroundColor: '#f5f2ec', border: '1px solid #e5e0d8', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                    <img
                      src={imgUrl}
                      alt={`${product.name} clinical detail ${idx + 1}`}
                      style={{ width: '100%', height: '340px', objectFit: 'cover', display: 'block' }}
                    />
                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '1rem', background: 'linear-gradient(to top, rgba(26,25,24,0.85) 0%, transparent 100%)', color: '#fff' }}>
                      <span style={{ fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#d4af37', display: 'block', marginBottom: '0.2rem' }}>
                        Detail 0{idx + 1}
                      </span>
                      <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 500 }}>{captions[idx] || 'Clinical Shift Detail'}</h4>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Counterpart Nursing Scrub Model */}
        {relatedProducts.length > 0 && (
          <section className="pdp-related-section">
            <div className="section-head text-center" style={{ marginBottom: '2rem' }}>
              <span className="overline">Counterpart Silhouette</span>
              <h2 className="text-section-title">Explore The Counterpart Nursing Model</h2>
            </div>
            <div style={{ maxWidth: '440px', margin: '0 auto' }}>
              {relatedProducts.map((relProduct) => (
                <ProductCard key={relProduct.id} product={relProduct} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Sticky Mobile/Desktop Bottom Bar */}
      {showStickyBar && (
        <div className="pdp-sticky-bar animate-fade-in-up">
          <div className="container sticky-bar-inner">
            <div className="sticky-product-info">
              <img src={product.images[0]} alt={product.name} />
              <div className="text-col">
                <span className="sticky-title">{product.name}</span>
                <span className="sticky-meta">{selectedColor.name} • Size {selectedSize}</span>
              </div>
            </div>

            <div className="sticky-cta-wrap">
              <span className="sticky-price">${(product.price * quantity).toFixed(2)} AUD</span>
              <button onClick={handleAddToCart} className="btn btn-primary btn-sm">
                Add to Bag
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sizing Modal */}
      <SizeGuideModal isOpen={isSizeGuideOpen} onClose={() => setIsSizeGuideOpen(false)} />

      {/* Review Writing Modal */}
      <ReviewFormModal
        product={product}
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        onReviewAdded={(newRev) => setReviews((prev) => [newRev, ...prev])}
      />

      {/* Custom Hospital Embroidery Modal */}
      <CustomEmbroideryModal
        isOpen={isEmbroideryModalOpen}
        onClose={() => setIsEmbroideryModalOpen(false)}
        product={product}
        initialCustomization={customization}
        onApply={(newCustom) => setCustomization(newCustom)}
      />
    </div>
  );
};

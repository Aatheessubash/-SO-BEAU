import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Home,
  Crown,
  Tag,
  Ruler,
  ShoppingBag,
  Heart,
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  Check,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Share2,
  Feather,
  Headphones,
} from 'lucide-react';
import { api } from '../services/api';
import { Product, ProductColor, CartItemCustomization } from '../types';
import { useCart } from '../context/CartContext';
import { sounds } from '../utils/soundEffects';
import { ProductGallery } from '../components/product/ProductGallery';
import { ProductCard } from '../components/product/ProductCard';
import { SizeGuideModal } from '../components/common/SizeGuideModal';
import { CustomEmbroideryModal } from '../components/product/CustomEmbroideryModal';
import '../styles/pages/ProductDetailPage.scss';

const SIZE_OPTIONS = [
  { label: 'AU 4 (XXS)', code: 'XXS', stock: '11' },
  { label: 'AU 6 (XS)', code: 'XS', stock: '8' },
  { label: 'AU 8 (S)', code: 'S', stock: '24' },
  { label: 'AU 10 (M)', code: 'M', stock: '18' },
  { label: 'AU 12 (L)', code: 'L', stock: '15' },
  { label: 'AU 14 (XL)', code: 'XL', stock: '20' },
  { label: 'AU 16 (2XL)', code: '2XL', stock: '12' },
  { label: 'AU 18 (3XL)', code: '3XL', stock: '11' },
];

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { addToCart, toggleWishlist, isInWishlist, showToast, openFitFinder } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Selections - default to AU 6 (XS) matching reference design
  const [selectedColor, setSelectedColor] = useState<ProductColor | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>('AU 6 (XS)');
  const [selectedLength, setSelectedLength] = useState<string>('Regular (Standard Inseam)');
  const [quantity, setQuantity] = useState(1);
  const [customization, setCustomization] = useState<CartItemCustomization | null>(null);

  // Modals
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [isEmbroideryModalOpen, setIsEmbroideryModalOpen] = useState(false);

  // Accordion toggles: ALL CLOSED by default for clean, uncluttered presentation
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    description: false,
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
          if (!selectedSize) {
            setSelectedSize('AU 6 (XS)');
          }

          const prodRes = await api.getProducts();
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
  const comparePrice = product.compareAtPrice && product.compareAtPrice > unitPrice ? product.compareAtPrice : 199;
  const savingsAmount = Math.max(0, comparePrice - unitPrice);
  const savingsPercent = Math.round((savingsAmount / comparePrice) * 100);

  // Split title into navy lead and vibrant blue accent (e.g. "The Women's" and "Scrub Set")
  const formatTitle = (name: string) => {
    if (name.includes("Scrub Set")) {
      const parts = name.split("Scrub Set");
      return {
        lead: parts[0].trim(),
        accent: "Scrub Set",
      };
    }
    const words = name.split(" ");
    if (words.length > 2) {
      return {
        lead: words.slice(0, 2).join(" "),
        accent: words.slice(2).join(" "),
      };
    }
    return {
      lead: name,
      accent: "",
    };
  };

  const titleParts = formatTitle(product.name);

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
      {/* Top-Right Ambient Blue Waves */}
      <div className="pdp-ambient-waves" aria-hidden="true">
        <svg viewBox="0 0 800 600" fill="none" xmlns="http://www.w3.org/2000/svg" className="ambient-wave-svg">
          <path
            d="M800 0H240C380 160 560 220 800 260V0Z"
            fill="url(#wave-grad-1)"
          />
          <path
            d="M800 0H420C500 200 660 300 800 360V0Z"
            fill="url(#wave-grad-2)"
          />
          <path
            d="M800 0H560C620 240 720 400 800 460V0Z"
            fill="url(#wave-grad-3)"
          />
          <defs>
            <linearGradient id="wave-grad-1" x1="800" y1="0" x2="240" y2="260" gradientUnits="userSpaceOnUse">
              <stop stopColor="#1E60D5" stopOpacity="0.10" />
              <stop offset="1" stopColor="#60A5FA" stopOpacity="0.01" />
            </linearGradient>
            <linearGradient id="wave-grad-2" x1="800" y1="0" x2="420" y2="360" gradientUnits="userSpaceOnUse">
              <stop stopColor="#2563EB" stopOpacity="0.07" />
              <stop offset="1" stopColor="#93C5FD" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="wave-grad-3" x1="800" y1="0" x2="560" y2="460" gradientUnits="userSpaceOnUse">
              <stop stopColor="#3B82F6" stopOpacity="0.05" />
              <stop offset="1" stopColor="#DBEAFE" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Bottom Corner Waves matching reference */}
      <div className="pdp-ambient-wave-bl" aria-hidden="true">
        <svg viewBox="0 0 500 350" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 350H350C260 240 160 180 0 160V350Z" fill="url(#pdp-wave-bl)" />
          <defs>
            <linearGradient id="pdp-wave-bl" x1="0" y1="350" x2="350" y2="160" gradientUnits="userSpaceOnUse">
              <stop stopColor="#1E60D5" stopOpacity="0.09" />
              <stop offset="1" stopColor="#60A5FA" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="pdp-ambient-wave-br" aria-hidden="true">
        <svg viewBox="0 0 500 350" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M500 350H150C240 240 340 180 500 160V350Z" fill="url(#pdp-wave-br)" />
          <defs>
            <linearGradient id="pdp-wave-br" x1="500" y1="350" x2="150" y2="160" gradientUnits="userSpaceOnUse">
              <stop stopColor="#1E60D5" stopOpacity="0.09" />
              <stop offset="1" stopColor="#60A5FA" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Breadcrumb Header matching reference */}
      <div className="container pdp-breadcrumbs-wrap">
        <nav className="pdp-breadcrumbs">
          <Link to="/" className="pdp-home-icon-link" aria-label="Home">
            <Home size={15} color="#1E60D5" />
          </Link>
          <span className="breadcrumb-separator">&gt;</span>
          <Link to={`/collections/scrubs?category=${product.category || 'womens-scrubs'}`} className="breadcrumb-link">
            {product.categoryName?.includes("Women") || product.category === 'womens-scrubs' ? "Women's" : "Men's"}
          </Link>
          <span className="breadcrumb-separator">&gt;</span>
          <span className="breadcrumb-current">{product.name}</span>
        </nav>
      </div>

      <div className="container pdp-main-container">
        <div className="pdp-grid">
          {/* Left Column: Clean Spacious Image Showcase with Perspectives */}
          <div className="pdp-gallery-column">
            <ProductGallery 
              images={product.images} 
              productName={product.name} 
            />
          </div>

          {/* Right Column: Information, Selectors & CTAs */}
          <div className="pdp-info-column">
            {/* Premium Collection Kicker Pill matching reference */}
            <div className="pdp-kicker-pill">
              <Crown size={14} className="crown-icon" fill="#1E60D5" color="#1E60D5" />
              <span>Premium Collection</span>
            </div>

            {/* Split Editorial Title */}
            <h1 className="pdp-editorial-title">
              <span className="title-lead">{titleParts.lead}</span>
              {titleParts.accent && <span className="title-accent">{titleParts.accent}</span>}
            </h1>

            {/* Subtitle Headline */}
            <p className="pdp-editorial-subtitle">
              Comfortable. Functional. Professional.
            </p>

            {/* Price & Savings Row */}
            <div className="pdp-pricing-row">
              <span className="price-primary">${unitPrice.toFixed(0)} AUD</span>
              {comparePrice > unitPrice && (
                <span className="price-compare">${comparePrice.toFixed(0)} AUD</span>
              )}
              {savingsAmount > 0 && (
                <span className="price-save-tag">
                  <Tag size={13} className="tag-icon" fill="#1E8E3E" color="#1E8E3E" />
                  <span>Save ${savingsAmount} ({savingsPercent}%)</span>
                </span>
              )}
            </div>

            {/* Feature Highlight Trio Card matching reference */}
            <div className="pdp-feature-trio-card">
              <div className="feature-trio-item">
                <div className="feature-trio-icon">
                  <ShieldCheck size={18} color="#1E60D5" />
                </div>
                <div className="feature-trio-text">
                  <span className="trio-title">Premium Fabric</span>
                  <span className="trio-subtitle">All-Day Comfort</span>
                </div>
              </div>

              <div className="feature-trio-item">
                <div className="feature-trio-icon">
                  <Feather size={18} color="#1E60D5" />
                </div>
                <div className="feature-trio-text">
                  <span className="trio-title">Ultra Lightweight</span>
                  <span className="trio-subtitle">Move Freely</span>
                </div>
              </div>

              <div className="feature-trio-item">
                <div className="feature-trio-icon">
                  <RotateCcw size={18} color="#1E60D5" />
                </div>
                <div className="feature-trio-text">
                  <span className="trio-title">Easy Returns</span>
                  <span className="trio-subtitle">Shop Confidently</span>
                </div>
              </div>
            </div>

            {/* Signature Clinical Shade Selector (Compact) */}
            {selectedColor && product.colors && product.colors.length > 0 && (
              <div className="pdp-shades-card">
                <div className="shades-card-header">
                  <span className="shades-card-title">
                    Shade: <strong>{selectedColor.name}</strong> ({product.colors.length} Clinical Shades)
                  </span>
                </div>
                <div className="shades-swatches-strip" role="radiogroup" aria-label="Available Clinical Shades">
                  {product.colors.map((c) => {
                    const isSelected = selectedColor.code === c.code;
                    return (
                      <button
                        key={c.code}
                        type="button"
                        role="radio"
                        aria-checked={isSelected}
                        className={`shade-circle-btn ${isSelected ? 'active' : ''}`}
                        onClick={() => {
                          sounds.playSwatchClick();
                          setSelectedColor(c);
                        }}
                        title={c.name}
                      >
                        <span className="shade-inner" style={{ backgroundColor: c.hex }} />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Size Section with 2-row Cards Grid */}
            <div className="pdp-size-section">
              <div className="size-section-header">
                <span className="size-heading">Size</span>
                <button
                  type="button"
                  className="size-guide-trigger"
                  onClick={() => setIsSizeGuideOpen(true)}
                >
                  <Ruler size={14} className="guide-icon" />
                  <span>Size Guide</span>
                </button>
              </div>

              <div className="size-cards-grid">
                {SIZE_OPTIONS.map((sz) => {
                  const isSelected = selectedSize === sz.label || selectedSize === sz.code;
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
                      <span className="card-size-name">{sz.label}</span>
                      <span className="card-stock-hint">≈ {sz.stock}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Dual Action CTAs: Add to Cart & Wishlist */}
            <div className="pdp-dual-actions-row" id="main-pdp-actions">
              <button
                type="button"
                className="btn-pdp-cart-primary"
                onClick={handleAddToCart}
              >
                <ShoppingBag size={18} className="cart-icon" />
                <span>Add to Cart</span>
              </button>
              <button
                type="button"
                className={`btn-pdp-wishlist-secondary ${isSaved ? 'is-saved' : ''}`}
                onClick={() => {
                  sounds.playSwatchClick();
                  toggleWishlist(product.id);
                }}
              >
                <Heart size={18} className="wishlist-icon" fill={isSaved ? '#031F41' : 'none'} />
                <span>Add to Wishlist</span>
              </button>
            </div>

            {/* Custom Monogram Embroidery Box */}
            <div 
              className={`pdp-monogram-box ${customization ? 'has-customization' : ''}`}
              onClick={() => setIsEmbroideryModalOpen(true)}
              role="button"
              tabIndex={0}
            >
              <div className="monogram-left">
                <span className="monogram-square-check">
                  {customization ? '✓' : ''}
                </span>
                <span className="monogram-text">
                  {customization 
                    ? `Personalized Embroidery: "${customization.text}" (${customization.placement})` 
                    : 'Add Hospital Monogram Embroidery (+ $18 AUD)'}
                </span>
              </div>
              <div className="monogram-right">
                <span className="needle-icon" title="Custom Monogram Embroidery">🪡</span>
              </div>
            </div>
          </div>
        </div>

        {/* Full-Width Bottom Trust Dock matching reference */}
        <div className="pdp-trust-dock-card">
          <div className="dock-item">
            <div className="dock-icon">
              <Truck size={22} color="#1E60D5" />
            </div>
            <div className="dock-text">
              <span className="dock-title">Free Shipping</span>
              <span className="dock-desc">On orders over $100</span>
            </div>
          </div>

          <div className="dock-item">
            <div className="dock-icon">
              <RotateCcw size={22} color="#1E60D5" />
            </div>
            <div className="dock-text">
              <span className="dock-title">30-Day Returns</span>
              <span className="dock-desc">Hassle Free</span>
            </div>
          </div>

          <div className="dock-item">
            <div className="dock-icon">
              <Headphones size={22} color="#1E60D5" />
            </div>
            <div className="dock-text">
              <span className="dock-title">Dedicated Support</span>
              <span className="dock-desc">We're here to help</span>
            </div>
          </div>

          <div className="dock-item">
            <div className="dock-icon">
              <ShieldCheck size={22} color="#1E60D5" />
            </div>
            <div className="dock-text">
              <span className="dock-title">Secure Checkout</span>
              <span className="dock-desc">Your information is safe</span>
            </div>
          </div>
        </div>

        {/* Clean Collapsible Accordions & Shift Details */}
        <div className="pdp-secondary-specs-container">
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

          {/* Trust Credentials Footer */}
          <div className="pdp-trust-footer">
            <div className="trust-item">
              <span className="trust-icon">📦</span>
              <span>AusPost Same-Day Melbourne Dispatch</span>
            </div>
            <div className="trust-item">
              <span className="trust-icon">🛡️</span>
              <span>100-Day Clinical Shift Guarantee</span>
            </div>
          </div>
        </div>

        {/* Clinical Details & Movement In Action (USER VERIFIED - KEPT & BEAUTIFIED) */}
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
                  'Contoured Feminine Silhouette',
                ];
                return (
                  <div key={idx} className="related-image-card" style={{ position: 'relative', overflow: 'hidden', borderRadius: '8px', boxShadow: '0 4px 18px rgba(0,0,0,0.06)' }}>
                    <img
                      src={imgUrl}
                      alt={captions[idx] || `Detail ${idx + 1}`}
                      width={360}
                      height={340}
                      loading="lazy"
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
                <ProductCard key={relProduct.id} product={relProduct} showOffersAndRatings={false} />
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
              <img src={product.images[0]} alt={product.name} width={48} height={60} loading="lazy" />
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

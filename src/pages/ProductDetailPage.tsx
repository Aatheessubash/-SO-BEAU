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
import { Product, ProductColor, CartItemCustomization } from '../types';
import { useCart } from '../context/CartContext';
import { sounds } from '../utils/soundEffects';
import { ProductGallery } from '../components/product/ProductGallery';
import { ProductCard } from '../components/product/ProductCard';
import { SizeGuideModal } from '../components/common/SizeGuideModal';
import { CustomEmbroideryModal } from '../components/product/CustomEmbroideryModal';
import '../styles/pages/ProductDetailPage.scss';

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { addToCart, toggleWishlist, isInWishlist, showToast, openFitFinder } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
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
          setSelectedSize(res.data.sizes[1] || res.data.sizes[0] || 'S');

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
          {/* Left Column: Clean Spacious Image Showcase with Perspectives */}
          <div className="pdp-gallery-column">
            <ProductGallery 
              images={product.images} 
              productName={product.name} 
            />
          </div>

          {/* Right Column: Information, Selectors & CTAs */}
          <div className="pdp-info-column">
            {/* Melbourne Atelier Badge */}
            <div className="pdp-atelier-badge">
              MELBOURNE ATELIER • MENS CLINICAL SUITE
            </div>

            {/* Product Title */}
            <h1 className="pdp-title">{product.name}</h1>

            {/* Price & Afterpay Row */}
            <div className="pdp-price-afterpay-row">
              <div className="pdp-price-wrap">
                <span className="price-current">${unitPrice.toFixed(0)} AUD</span>
                <span className="price-tax">(inc. GST)</span>
              </div>
              <div className="pdp-afterpay-pill">
                <span>or 4 interest-free payments of ${(unitPrice / 4).toFixed(2)} AUD with </span>
                <span className="afterpay-tag">afterpay ◒</span>
              </div>
            </div>

            {/* Subtitle Headline */}
            <p className="pdp-subtitle">
              {product.headline || "Mandarin V-Placket Top & Ergonomic 10-Pocket Cargo Jogger in BeauTech™ 4-Way Recoil Stretch."}
            </p>

            {/* Shade Swatch Selector */}
            {selectedColor && (
              <div className="pdp-shade-block">
                <div className="shade-header-row">
                  <span className="shade-label">
                    SHADE: <strong>{selectedColor.name.toUpperCase()}</strong> ({product.colors.length} SIGNATURE CLINICAL SHADES)
                  </span>
                </div>
                <div className="shade-swatches-grid" role="radiogroup" aria-label="Select Color Shade">
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

            {/* Size Selector */}
            <div className="pdp-size-block">
              <div className="size-header-row">
                <span className="size-title">SIZE</span>
                <span className="stock-indicator">
                  <span className="stock-dot" /> Stock
                </span>
              </div>
              <div className="size-chips-grid">
                {product.sizes.map((s, idx) => {
                  const isSelected = selectedSize === s;
                  const stockCount = [11, 8, 24, 18, 15, 20, 12][idx % 7];
                  return (
                    <button
                      key={s}
                      type="button"
                      className={`atelier-size-chip ${isSelected ? 'active' : ''}`}
                      onClick={() => {
                        sounds.playSwatchClick();
                        setSelectedSize(s);
                      }}
                    >
                      <span className="size-name">{s.startsWith('AU ') ? s : `AU ${s}`}</span>
                      <span className="size-stock-count">• {stockCount}</span>
                    </button>
                  );
                })}
              </div>
              <div className="size-actions-bar">
                <button
                  type="button"
                  onClick={() => {
                    sounds.playSwatchClick();
                    openFitFinder();
                  }}
                  className="fit-finder-gold-link"
                >
                  <span className="sparkle">✦</span> Fit Finder <strong>(Find size in 30s)</strong>
                </button>
                <button
                  type="button"
                  onClick={() => setIsSizeGuideOpen(true)}
                  className="size-table-underline-link"
                >
                  Size Table
                </button>
              </div>
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

            {/* CTAs Stack */}
            <div className="pdp-cta-stack" id="main-pdp-actions">
              <button
                type="button"
                onClick={handleAddToCart}
                className="btn-add-scrub-bag"
              >
                ADD SCRUB SET TO BAG — ${totalPrice.toFixed(0)} AUD
              </button>
              <button
                type="button"
                onClick={() => {
                  handleAddToCart();
                  sounds.playAddToCartChime();
                }}
                className="btn-apple-pay-cta"
              >
                <span>1-click</span>
                <span className="apple-mark">Pay</span>
              </button>
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

            {/* Clean Collapsible Accordions (Closed by default so page remains clean and spacious) */}
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

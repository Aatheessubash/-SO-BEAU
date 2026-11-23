import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ShieldCheck,
  Leaf,
  RotateCcw,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Shirt,
  Star,
  Check,
  Camera,
  Box,
} from 'lucide-react';
import { api } from '../services/api';
import { Product, ProductColor, CartItemCustomization } from '../types';
import { useCart } from '../context/CartContext';
import { sounds } from '../utils/soundEffects';
import { SizeGuideModal } from '../components/common/SizeGuideModal';
import { CustomEmbroideryModal } from '../components/product/CustomEmbroideryModal';
import { Interactive3DGarmentViewer } from '../components/common/Interactive3DGarmentViewer';
import '../styles/pages/ProductDetailPage.scss';

const SIZES = ['4', '6', '8', '10', '12', '14', '16', '18'];

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { addToCart, toggleWishlist, isInWishlist, showToast, openFitFinder } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  // Selections - default to AU 8 matching reference design
  const [selectedColor, setSelectedColor] = useState<ProductColor | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>('8');
  const [quantity, setQuantity] = useState(1);
  const [customization, setCustomization] = useState<CartItemCustomization | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Dual View Mode: High-Res Editorial Photography vs Real-Time 3D Atelier Inspection
  const [viewMode, setViewMode] = useState<'2d' | '3d'>('2d');

  // Modals
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [isEmbroideryModalOpen, setIsEmbroideryModalOpen] = useState(false);

  // Accordion toggles for preserved clinical specifications
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    fabric: false,
    engineering: false,
    validation: false,
    shipping: false,
  });

  useEffect(() => {
    const fetchProductData = async () => {
      if (!slug) return;
      setLoading(true);
      try {
        const res = await api.getProductBySlug(slug);
        if (res.data) {
          setProduct(res.data);
          setSelectedColor(res.data.colors[0]);
        }
      } catch (err) {
        console.error('Failed to load product details', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [slug]);

  const toggleAccordion = (sectionKey: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [sectionKey]: !prev[sectionKey],
    }));
  };

  if (loading) {
    return (
      <div className="pdp-luxury-loading">
        <div className="pdp-spinner" />
        <p>Loading Atelier Piece...</p>
      </div>
    );
  }

  if (!product || !selectedColor) {
    return (
      <div className="pdp-luxury-notfound">
        <h2>Piece Not Found</h2>
        <p>The scrub silhouette you are looking for may have been retired or moved.</p>
        <Link to="/collections/scrubs" className="btn-atelier-primary">
          Explore Scrubs Collection
        </Link>
      </div>
    );
  }

  const unitPrice = product.price + (customization ? customization.price : 0);
  const isWomens = product.category === 'womens-scrubs' || product.slug.includes('women');

  const handleAddToCart = (e?: React.MouseEvent<HTMLButtonElement>) => {
    sounds.playAddToCart();
    addToCart(product, selectedColor, `AU ${selectedSize}`, quantity, e?.currentTarget, customization || undefined);
  };

  // Determine active display image
  let heroImageSrc = isWomens 
    ? '/images/pdp-studio-female-shadow.jpg' 
    : '/images/male/male-navy-front.png';

  if (product.images && product.images.length > activeImageIndex && activeImageIndex > 0) {
    heroImageSrc = product.images[activeImageIndex];
  }

  return (
    <div className="pdp-luxury-page">
      {/* Main Luxury Split Viewport */}
      <div className="pdp-luxury-split-container">
        {/* Left Column: Spacious Studio Model Stage with 2D/3D Mode */}
        <div className="pdp-studio-column">
          {/* View Mode Switcher Pill */}
          <div className="pdp-view-mode-toggle" role="tablist" aria-label="Studio View Mode">
            <button
              type="button"
              role="tab"
              aria-selected={viewMode === '2d'}
              className={`pdp-mode-btn ${viewMode === '2d' ? 'active' : ''}`}
              onClick={() => {
                sounds.playSwatchClick();
                setViewMode('2d');
              }}
            >
              <Camera size={13} />
              <span>Photography</span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={viewMode === '3d'}
              className={`pdp-mode-btn ${viewMode === '3d' ? 'active' : ''}`}
              onClick={() => {
                sounds.playSwatchClick();
                setViewMode('3d');
              }}
            >
              <Sparkles size={13} />
              <span>3D Atelier 360°</span>
            </button>
          </div>

          {viewMode === '3d' ? (
            <div className="pdp-3d-stage-wrap">
              <Interactive3DGarmentViewer
                initialColorHex={selectedColor.hex}
                onColorChange={(cw) => {
                  const match = product.colors.find((c) => c.hex.toLowerCase() === cw.hex.toLowerCase());
                  if (match) setSelectedColor(match);
                }}
                showColorControls={true}
                height="620px"
              />
            </div>
          ) : (
            <div className="pdp-studio-image-frame">
              <img
                src={heroImageSrc}
                alt={product.name}
                className="pdp-studio-primary-image"
                loading="eager"
              />

              {/* Optional Angle Switcher Dots when multiple images exist */}
              {product.images && product.images.length > 1 && (
                <div className="pdp-angle-dots-row" role="tablist" aria-label="Angles">
                  {product.images.slice(0, 5).map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      role="tab"
                      aria-selected={activeImageIndex === idx}
                      className={`angle-dot ${activeImageIndex === idx ? 'is-active' : ''}`}
                      onClick={() => setActiveImageIndex(idx)}
                      title={`View angle ${idx + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Specification & Purchase Section */}
        <div className="pdp-details-column">
          <div className="pdp-details-inner">
            {/* Atelier Eyebrow with Trailing Hairline Rule */}
            <div className="pdp-eyebrow-line">
              <span className="eyebrow-text">
                {isWomens ? "ATELIER EDITION / WOMEN'S" : "ATELIER EDITION / MEN'S"}
              </span>
              <div className="eyebrow-hairline" />
            </div>

            {/* Editorial Title */}
            <h1 className="pdp-product-title">
              {product.name}
            </h1>

            {/* Clinical Sub-specs Line */}
            <div className="pdp-specs-bullets">
              <span>HOSPITAL-GRADE</span>
              <span className="bullet-sep">&bull;</span>
              <span>7 POCKETS</span>
              <span className="bullet-sep">&bull;</span>
              <span>ALL-DAY COMFORT</span>
            </div>

            {/* Price & GST */}
            <div className="pdp-price-display">
              <span className="price-bold">${unitPrice.toFixed(0)} AUD</span>
              <span className="price-gst-sub">inc. GST</span>
            </div>

            {/* Colorway Selection Swatches */}
            <div className="pdp-colorway-section">
              <div className="colorway-swatches-row" role="radiogroup" aria-label="Available Colors">
                {product.colors.map((color) => {
                  const isCurrent = selectedColor.id === color.id;
                  return (
                    <button
                      key={color.id}
                      type="button"
                      role="radio"
                      aria-checked={isCurrent}
                      aria-label={color.name}
                      title={color.name}
                      className={`color-swatch-circle ${isCurrent ? 'is-selected' : ''}`}
                      style={{ backgroundColor: color.hex }}
                      onClick={() => {
                        sounds.playSwatchClick();
                        setSelectedColor(color);
                      }}
                    />
                  );
                })}
              </div>
            </div>

            {/* Size Matrix */}
            <div className="pdp-size-section">
              <div className="size-label-row">
                <span className="size-label-title">SIZE</span>
                <span className="size-label-region">AU</span>
              </div>

              <div className="size-boxes-row" role="radiogroup" aria-label="Select Size">
                {SIZES.map((sz) => {
                  const isSelected = selectedSize === sz;
                  return (
                    <button
                      key={sz}
                      type="button"
                      role="radio"
                      aria-checked={isSelected}
                      className={`size-box-btn ${isSelected ? 'is-active' : ''}`}
                      onClick={() => {
                        sounds.playSwatchClick();
                        setSelectedSize(sz);
                      }}
                    >
                      {sz}
                    </button>
                  );
                })}
              </div>

              {/* Fit Guide Link with Hanger Icon */}
              <button
                type="button"
                className="fit-guide-link-btn"
                onClick={() => setIsSizeGuideOpen(true)}
              >
                <Shirt size={14} className="hanger-icon" />
                <span>Fit Guide &amp; Measurements</span>
              </button>
            </div>

            {/* Primary Action: ADD TO ATELIER BAG */}
            <button
              type="button"
              className="pdp-add-atelier-btn"
              onClick={handleAddToCart}
            >
              <span>ADD TO ATELIER BAG &mdash; ${unitPrice.toFixed(0)} AUD</span>
              <span className="btn-arrow">&rarr;</span>
            </button>

            {/* Trust Badges Strip (3 Columns) */}
            <div className="pdp-trust-trio-row">
              <div className="trust-trio-item">
                <ShieldCheck size={18} className="trust-icon" strokeWidth={1.5} />
                <span className="trust-text">TGA Compliant &bull; Hospital Validated</span>
              </div>
              <div className="trust-trio-item">
                <Leaf size={18} className="trust-icon" strokeWidth={1.5} />
                <span className="trust-text">Carbon-Neutral Shipping</span>
              </div>
              <div className="trust-trio-item">
                <RotateCcw size={18} className="trust-icon" strokeWidth={1.5} />
                <span className="trust-text">30-Day Trial</span>
              </div>
            </div>

            {/* Collapsible Clinical Accordions (Preserved Content) */}
            <div className="pdp-clinical-accordions">
              {/* Accordion 1: Fabric & Silvadur */}
              <div className="accordion-item">
                <button
                  type="button"
                  className="accordion-header"
                  onClick={() => toggleAccordion('fabric')}
                  aria-expanded={openSections.fabric}
                >
                  <span>Silvadur™ Antimicrobial &amp; BeauTech™ Fabric</span>
                  {openSections.fabric ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                {openSections.fabric && (
                  <div className="accordion-content">
                    <p>
                      Engineered with proprietary <strong>BeauTech™ 4-way recoil stretch</strong> (72% Poly, 21% Rayon, 7% Spandex) infused with EPA-registered <strong>Silvadur™ silver ion antimicrobial technology</strong>, maintaining 99.4% pathogen reduction through 50+ hospital wash cycles.
                    </p>
                  </div>
                )}
              </div>

              {/* Accordion 2: Engineering & Pockets */}
              <div className="accordion-item">
                <button
                  type="button"
                  className="accordion-header"
                  onClick={() => toggleAccordion('engineering')}
                  aria-expanded={openSections.engineering}
                >
                  <span>Garment Engineering (7 Functional Pockets)</span>
                  {openSections.engineering ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                {openSections.engineering && (
                  <div className="accordion-content">
                    <ul>
                      <li>1 Slanted Trauma-Shear Chest Loop (holds scissors vertical with zero bounce)</li>
                      <li>2 Concealed Ergonomic Deep Hip Pockets</li>
                      <li>2 Zippered Security Cargo Pockets for Stethoscopes &amp; Tablets</li>
                      <li>2 Rear Patch Pockets with Reinforced Stress-Point Bar-Tacking</li>
                    </ul>
                  </div>
                )}
              </div>

              {/* Accordion 3: Clinical Validation */}
              <div className="accordion-item">
                <button
                  type="button"
                  className="accordion-header"
                  onClick={() => toggleAccordion('validation')}
                  aria-expanded={openSections.validation}
                >
                  <span>Hospital Field Validation</span>
                  {openSections.validation ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                {openSections.validation && (
                  <div className="accordion-content">
                    <p>
                      Exhaustively field-tested across 500+ shifts in Melbourne trauma bays, emergency departments, and intensive care units. Designed to retain tailored drape after 14-hour double rotations.
                    </p>
                  </div>
                )}
              </div>

              {/* Accordion 4: Shipping & Returns */}
              <div className="accordion-item">
                <button
                  type="button"
                  className="accordion-header"
                  onClick={() => toggleAccordion('shipping')}
                  aria-expanded={openSections.shipping}
                >
                  <span>Complimentary Shipping &amp; 30-Day Returns</span>
                  {openSections.shipping ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                {openSections.shipping && (
                  <div className="accordion-content">
                    <p>
                      Complimentary carbon-neutral express shipping across Australia on all orders over $150 AUD. Delivered with ATO-compliant tax invoice for clinician expense deduction. 30-day effortless size exchange.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sizing & Customization Modals */}
      <SizeGuideModal isOpen={isSizeGuideOpen} onClose={() => setIsSizeGuideOpen(false)} />
      <CustomEmbroideryModal
        isOpen={isEmbroideryModalOpen}
        onClose={() => setIsEmbroideryModalOpen(false)}
        onSave={(data) => {
          setCustomization(data);
          showToast('Custom hospital embroidery added', 'success');
        }}
        currentCustomization={customization}
      />
    </div>
  );
};

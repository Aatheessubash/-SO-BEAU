import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  Heart, 
  RotateCcw, 
  SlidersHorizontal, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight,
  Check,
  X,
  Grid,
  LayoutGrid
} from 'lucide-react';
import { api } from '../services/api';
import { Product, ProductColor } from '../types';
import { useCart } from '../context/CartContext';
import { sounds } from '../utils/soundEffects';
import '../styles/pages/ShopPage.scss';

export const ShopPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { addToCart, toggleWishlist, isInWishlist } = useCart();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [activeLayout, setActiveLayout] = useState<'split' | 'duet'>('split');

  // Angle selections for the showcase cards
  const [selectedFemaleAngle, setSelectedFemaleAngle] = useState<number>(0);
  const [selectedMaleAngle, setSelectedMaleAngle] = useState<number>(0);

  // Selected sizes for quick add
  const [selectedFemaleSize, setSelectedFemaleSize] = useState<string>('AU 8 (S)');
  const [selectedMaleSize, setSelectedMaleSize] = useState<string>('AU M (40)');

  // Selected colors
  const [selectedFemaleColor, setSelectedFemaleColor] = useState<string>('navy');
  const [selectedMaleColor, setSelectedMaleColor] = useState<string>('surgical-blue');

  // Read URL query params
  const categoryParam = searchParams.get('category') || 'all';
  const searchParam = searchParams.get('search') || '';
  const wishlistParam = searchParams.get('wishlist') === 'true';

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const prodRes = await api.getProducts();
        if (prodRes.data) {
          setProducts(prodRes.data);
        }
      } catch (err) {
        console.error('Failed to load shop data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleCategoryChange = (catId: string) => {
    sounds.playSwatchClick();
    const nextParams = new URLSearchParams(searchParams);
    if (catId === 'all') {
      nextParams.delete('category');
    } else {
      nextParams.set('category', catId);
    }
    setSearchParams(nextParams);
  };

  // Female Scrub Set (`sb-001`)
  const femaleProduct = useMemo(() => {
    return products.find((p) => p.id === 'sb-001') || {
      id: 'sb-001',
      name: "The Women's Scrub Set",
      category: 'womens-scrubs',
      price: 158.0,
      compareAtPrice: 186.0,
      slug: 'the-womens-nursing-scrub-set',
      images: [
        '/images/female/female-navy-front.png',
        '/images/female/female-pants-fit.jpg',
        '/images/female/female-sage-front.png',
        '/images/female/female-top-pocket-detail.jpg',
      ],
      colors: [
        { name: 'French Navy', hex: '#1D2A44', code: 'navy' },
        { name: 'Soft Sage', hex: '#7D9D8B', code: 'sage' },
        { name: 'Deep Forest Green', hex: '#1B3B2B', code: 'forest' },
        { name: 'Deep Charcoal', hex: '#1E2022', code: 'charcoal' },
        { name: 'Warm Taupe', hex: '#A39382', code: 'taupe' },
        { name: 'Terracotta Clay', hex: '#8C554F', code: 'terracotta' },
        { name: 'Surgical Blue', hex: '#4A7C9B', code: 'surgical-blue' },
        { name: 'Plum Noir', hex: '#4A2838', code: 'plum' },
      ],
      sizes: ['AU 4 (XXS)', 'AU 6 (XS)', 'AU 8 (S)', 'AU 10 (M)', 'AU 12 (L)', 'AU 14 (XL)', 'AU 16 (2XL)'],
    };
  }, [products]);

  // Male Scrub Set (`sb-002`)
  const maleProduct = useMemo(() => {
    return products.find((p) => p.id === 'sb-002') || {
      id: 'sb-002',
      name: "The Men's Scrub Set",
      category: 'mens-scrubs',
      price: 158.0,
      compareAtPrice: 186.0,
      slug: 'the-mens-nursing-scrub-set',
      images: [
        '/images/male/male-surgical-blue-front.png',
        '/images/male/male-navy-front.png',
        '/images/male/male-jogger-back-fit.jpg',
        '/images/male/male-front-back.png',
      ],
      colors: [
        { name: 'Surgical Blue', hex: '#4A7C9B', code: 'surgical-blue' },
        { name: 'French Navy', hex: '#1D2A44', code: 'navy' },
        { name: 'Deep Forest Green', hex: '#1B3B2B', code: 'forest' },
        { name: 'Soft Sage', hex: '#7D9D8B', code: 'sage' },
        { name: 'Deep Charcoal', hex: '#1E2022', code: 'charcoal' },
        { name: 'Warm Taupe', hex: '#A39382', code: 'taupe' },
        { name: 'Terracotta Clay', hex: '#8C554F', code: 'terracotta' },
        { name: 'Plum Noir', hex: '#4A2838', code: 'plum' },
      ],
      sizes: ['AU XS (36)', 'AU S (38)', 'AU M (40)', 'AU L (42)', 'AU XL (44)', 'AU 2XL (46)'],
    };
  }, [products]);

  // Angle labels
  const femaleAngleLabels = ['Front 3/4', 'Back Movement', 'Pants Fit', 'Pocket Detail'];
  const maleAngleLabels = ['Full Front', 'Chest & V-Neck', 'Back Stride', 'Pocket Detail'];

  // Handle Quick Add to Cart
  const handleAddToCart = (product: any, colorCode: string, size: string, e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    sounds.playAddToCartChime();
    const colorObj = product.colors.find((c: any) => c.code === colorCode) || product.colors[0];
    addToCart(product, colorObj, size, 1, e.currentTarget);
  };

  const isVisible = (cat: string) => {
    if (categoryParam === 'all') return true;
    if (categoryParam === 'womens-scrubs' && cat === 'womens-scrubs') return true;
    if (categoryParam === 'mens-scrubs' && cat === 'mens-scrubs') return true;
    return false;
  };

  return (
    <div className="shop-page shop-editorial-theme animate-fade-in">
      {/* 1. Luxury Atelier Editorial Header */}
      <header className="shop-editorial-header">
        <div className="container">
          <div className="header-meta-row">
            <span className="atelier-tag">Atelier 2026 • Core Clinical Rotation</span>
          </div>

          <h1 className="atelier-shop-title">The Essential Scrub Sets</h1>
          <p className="atelier-shop-sub">
            Designed for Australian hospital rounds. Certified hospital-grade performance with BeauTech™ 4-way stretch, Silvadur™ antimicrobial defense, and dedicated clinical utility.
          </p>

          {/* Interactive Navigation Toolbar */}
          <div className="atelier-toolbar">
            {/* Gender Switcher Tabs */}
            <div className="gender-tabs-pill" role="tablist" aria-label="Catalog Filter">
              <button
                type="button"
                role="tab"
                aria-selected={categoryParam === 'all'}
                className={`gender-tab-btn ${categoryParam === 'all' ? 'active' : ''}`}
                onClick={() => handleCategoryChange('all')}
              >
                All Editions <span className="tab-badge">2</span>
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={categoryParam === 'womens-scrubs'}
                className={`gender-tab-btn ${categoryParam === 'womens-scrubs' ? 'active' : ''}`}
                onClick={() => handleCategoryChange('womens-scrubs')}
              >
                Women's Set <span className="tab-badge">1</span>
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={categoryParam === 'mens-scrubs'}
                className={`gender-tab-btn ${categoryParam === 'mens-scrubs' ? 'active' : ''}`}
                onClick={() => handleCategoryChange('mens-scrubs')}
              >
                Men's Set <span className="tab-badge">1</span>
              </button>
            </div>

            {/* Right Controls: Filter Drawer Trigger & Layout Switcher */}
            <div className="toolbar-actions">
              <button 
                type="button" 
                className="filter-toggle-pill"
                onClick={() => setIsFilterDrawerOpen(true)}
              >
                <SlidersHorizontal size={14} />
                <span>Filters & 8 Shades</span>
              </button>

              <div className="view-mode-toggle" aria-label="Layout mode">
                <button
                  type="button"
                  className={`view-btn ${activeLayout === 'split' ? 'active' : ''}`}
                  onClick={() => {
                    sounds.playSwatchClick();
                    setActiveLayout('split');
                  }}
                  title="Editorial Split Anatomy View"
                >
                  Editorial View
                </button>
                <button
                  type="button"
                  className={`view-btn ${activeLayout === 'duet' ? 'active' : ''}`}
                  onClick={() => {
                    sounds.playSwatchClick();
                    setActiveLayout('duet');
                  }}
                  title="2-Up Studio Showcase Grid"
                >
                  Duet Grid
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 2. Main Catalog Showcase */}
      <main className="shop-editorial-container container">
        {activeLayout === 'split' ? (
          /* ============================================================== */
          /* DESIGN B: EDITORIAL SPLIT-SCREEN SHOWCASE (USER SELECTED)      */
          /* ============================================================== */
          <div className="editorial-split-layout">
            {/* OUTFIT 1: THE WOMEN'S TAILORED SCRUB SET */}
            {isVisible('womens-scrubs') && (
              <article className="split-showcase-row">
                {/* Left: Studio Image Half with Angle Selection */}
                <div className="split-image-half">
                  <span className="badge-tga">TGA Certified Medical Grade</span>
                  <button
                    type="button"
                    className={`split-wishlist-btn ${isInWishlist(femaleProduct.id) ? 'active' : ''}`}
                    onClick={() => toggleWishlist(femaleProduct.id)}
                    aria-label="Save Women's Scrub Set to Wishlist"
                  >
                    <Heart size={16} fill={isInWishlist(femaleProduct.id) ? '#C5A059' : 'none'} />
                  </button>

                  <Link to={`/products/${femaleProduct.slug}`} className="image-frame-link">
                    <img
                      src={femaleProduct.images[selectedFemaleAngle] || femaleProduct.images[0]}
                      alt="The Women's Tailored Scrub Set"
                      className="split-model-img"
                    />
                  </Link>

                  {/* Thumbnail Angle Switcher */}
                  <div className="split-angle-thumbnails">
                    {femaleProduct.images.slice(0, 4).map((imgUrl, idx) => (
                      <button
                        key={idx}
                        type="button"
                        className={`thumb-btn ${selectedFemaleAngle === idx ? 'active' : ''}`}
                        onClick={() => {
                          sounds.playSwatchClick();
                          setSelectedFemaleAngle(idx);
                        }}
                        title={femaleAngleLabels[idx] || `Angle ${idx + 1}`}
                      >
                        <img src={imgUrl} alt={`Women's View ${idx + 1}`} />
                        <span className="thumb-label">{femaleAngleLabels[idx]}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Right: Garment Anatomy & Purchase Details */}
                <div className="split-content-half">
                  <span className="editorial-eyebrow">Certified TGA Medical Grade</span>
                  <h2 className="editorial-product-title">
                    <Link to={`/products/${femaleProduct.slug}`}>The Women's Tailored Scrub Set</Link>
                  </h2>
                  <p className="editorial-product-desc">
                    Precision-cut for clinical endurance. Featuring an architectural contoured V-neck with anti-microbial Silvadur™ protection and our high-rise 7-pocket jogger.
                  </p>

                  {/* Clinical Specifications */}
                  <div className="editorial-specs-list">
                    <div className="spec-bullet">
                      <CheckCircle2 size={16} className="spec-check" />
                      <span>BeauTech™ 4-Way Recoil Stretch</span>
                    </div>
                    <div className="spec-bullet">
                      <CheckCircle2 size={16} className="spec-check" />
                      <span>14-Hour Shift Ergonomic Waistband</span>
                    </div>
                    <div className="spec-bullet">
                      <CheckCircle2 size={16} className="spec-check" />
                      <span>Tested for 60°C Hospital Autoclave Washes</span>
                    </div>
                  </div>

                  {/* Color Swatch Selector */}
                  <div className="editorial-colors-section">
                    <div className="colors-header-row">
                      <span className="shade-name">
                        Shade: <strong>{femaleProduct.colors.find(c => c.code === selectedFemaleColor)?.name || 'French Navy'}</strong>
                      </span>
                      <span className="shades-total">8 Signature Shades</span>
                    </div>
                    <div className="color-swatches-strip">
                      {femaleProduct.colors.map((c) => (
                        <button
                          key={c.code}
                          type="button"
                          className={`swatch-btn ${selectedFemaleColor === c.code ? 'selected' : ''}`}
                          style={{ backgroundColor: c.hex }}
                          title={c.name}
                          onClick={() => {
                            sounds.playSwatchClick();
                            setSelectedFemaleColor(c.code);
                          }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Size Selector */}
                  <div className="editorial-sizes-section">
                    <span className="size-label">Select Size:</span>
                    <div className="size-pills-row">
                      {femaleProduct.sizes.map((sz) => (
                        <button
                          key={sz}
                          type="button"
                          className={`size-pill ${selectedFemaleSize === sz ? 'selected' : ''}`}
                          onClick={() => {
                            sounds.playSwatchClick();
                            setSelectedFemaleSize(sz);
                          }}
                        >
                          {sz.replace('AU ', '')}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Pricing Row */}
                  <div className="editorial-price-row">
                    <div className="price-stack">
                      <span className="current-price">${femaleProduct.price.toFixed(2)} AUD</span>
                      {femaleProduct.compareAtPrice && (
                        <span className="compare-price">${femaleProduct.compareAtPrice.toFixed(2)}</span>
                      )}
                    </div>
                    <span className="afterpay-pill">4 × $39.50 with Afterpay</span>
                  </div>

                  {/* Add to Bag CTA */}
                  <div className="editorial-cta-row">
                    <button
                      type="button"
                      className="atelier-add-bag-btn"
                      onClick={(e) => handleAddToCart(femaleProduct, selectedFemaleColor, selectedFemaleSize, e)}
                    >
                      <span>Add Women's Set to Bag • $158.00</span>
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              </article>
            )}

            {/* OUTFIT 2: THE MEN'S ATHLETIC SCRUB SET */}
            {isVisible('mens-scrubs') && (
              <article className="split-showcase-row reversed">
                {/* Right: Studio Image Half with Angle Selection */}
                <div className="split-image-half">
                  <span className="badge-tga">TGA Certified Medical Grade</span>
                  <button
                    type="button"
                    className={`split-wishlist-btn ${isInWishlist(maleProduct.id) ? 'active' : ''}`}
                    onClick={() => toggleWishlist(maleProduct.id)}
                    aria-label="Save Men's Scrub Set to Wishlist"
                  >
                    <Heart size={16} fill={isInWishlist(maleProduct.id) ? '#C5A059' : 'none'} />
                  </button>

                  <Link to={`/products/${maleProduct.slug}`} className="image-frame-link">
                    <img
                      src={maleProduct.images[selectedMaleAngle] || maleProduct.images[0]}
                      alt="The Men's Athletic Scrub Set"
                      className="split-model-img"
                    />
                  </Link>

                  {/* Thumbnail Angle Switcher */}
                  <div className="split-angle-thumbnails">
                    {maleProduct.images.slice(0, 4).map((imgUrl, idx) => (
                      <button
                        key={idx}
                        type="button"
                        className={`thumb-btn ${selectedMaleAngle === idx ? 'active' : ''}`}
                        onClick={() => {
                          sounds.playSwatchClick();
                          setSelectedMaleAngle(idx);
                        }}
                        title={maleAngleLabels[idx] || `Angle ${idx + 1}`}
                      >
                        <img src={imgUrl} alt={`Men's View ${idx + 1}`} />
                        <span className="thumb-label">{maleAngleLabels[idx]}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Left: Garment Anatomy & Purchase Details */}
                <div className="split-content-half">
                  <span className="editorial-eyebrow">Certified TGA Medical Grade</span>
                  <h2 className="editorial-product-title">
                    <Link to={`/products/${maleProduct.slug}`}>The Men's Athletic Scrub Set</Link>
                  </h2>
                  <p className="editorial-product-desc">
                    Athletic broad-shoulder tailoring with zero back restriction. Pairs a concealed Mandarin V-placket top with a 10-pocket cargo utility jogger pant.
                  </p>

                  {/* Clinical Specifications */}
                  <div className="editorial-specs-list">
                    <div className="spec-bullet">
                      <CheckCircle2 size={16} className="spec-check" />
                      <span>BeauTech™ 4-Way Recoil Stretch</span>
                    </div>
                    <div className="spec-bullet">
                      <CheckCircle2 size={16} className="spec-check" />
                      <span>10 Reinforced Bar-Tack Pockets</span>
                    </div>
                    <div className="spec-bullet">
                      <CheckCircle2 size={16} className="spec-check" />
                      <span>Dedicated Medical Shears & Pen Slots</span>
                    </div>
                  </div>

                  {/* Color Swatch Selector */}
                  <div className="editorial-colors-section">
                    <div className="colors-header-row">
                      <span className="shade-name">
                        Shade: <strong>{maleProduct.colors.find(c => c.code === selectedMaleColor)?.name || 'Surgical Blue'}</strong>
                      </span>
                      <span className="shades-total">8 Signature Shades</span>
                    </div>
                    <div className="color-swatches-strip">
                      {maleProduct.colors.map((c) => (
                        <button
                          key={c.code}
                          type="button"
                          className={`swatch-btn ${selectedMaleColor === c.code ? 'selected' : ''}`}
                          style={{ backgroundColor: c.hex }}
                          title={c.name}
                          onClick={() => {
                            sounds.playSwatchClick();
                            setSelectedMaleColor(c.code);
                          }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Size Selector */}
                  <div className="editorial-sizes-section">
                    <span className="size-label">Select Size:</span>
                    <div className="size-pills-row">
                      {maleProduct.sizes.map((sz) => (
                        <button
                          key={sz}
                          type="button"
                          className={`size-pill ${selectedMaleSize === sz ? 'selected' : ''}`}
                          onClick={() => {
                            sounds.playSwatchClick();
                            setSelectedMaleSize(sz);
                          }}
                        >
                          {sz.replace('AU ', '')}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Pricing Row */}
                  <div className="editorial-price-row">
                    <div className="price-stack">
                      <span className="current-price">${maleProduct.price.toFixed(2)} AUD</span>
                      {maleProduct.compareAtPrice && (
                        <span className="compare-price">${maleProduct.compareAtPrice.toFixed(2)}</span>
                      )}
                    </div>
                    <span className="afterpay-pill">4 × $39.50 with Afterpay</span>
                  </div>

                  {/* Add to Bag CTA */}
                  <div className="editorial-cta-row">
                    <button
                      type="button"
                      className="atelier-add-bag-btn"
                      onClick={(e) => handleAddToCart(maleProduct, selectedMaleColor, selectedMaleSize, e)}
                    >
                      <span>Add Men's Set to Bag • $158.00</span>
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              </article>
            )}
          </div>
        ) : (
          /* ============================================================== */
          /* DESIGN A: DUET GRID VIEW                                       */
          /* ============================================================== */
          <div className="editorial-duet-grid">
            {isVisible('womens-scrubs') && (
              <article className="atelier-duet-card">
                <div className="card-visual-frame">
                  <span className="badge-tga">TGA Certified Medical Grade</span>
                  <button
                    type="button"
                    className={`card-wishlist-btn ${isInWishlist(femaleProduct.id) ? 'active' : ''}`}
                    onClick={() => toggleWishlist(femaleProduct.id)}
                  >
                    <Heart size={16} fill={isInWishlist(femaleProduct.id) ? '#C5A059' : 'none'} />
                  </button>
                  <Link to={`/products/${femaleProduct.slug}`}>
                    <img src={femaleProduct.images[selectedFemaleAngle]} alt="Women's Set" className="duet-img" />
                  </Link>
                  <div className="angle-dock">
                    {femaleAngleLabels.slice(0, 3).map((lbl, i) => (
                      <button
                        key={i}
                        type="button"
                        className={`angle-btn ${selectedFemaleAngle === i ? 'active' : ''}`}
                        onClick={() => setSelectedFemaleAngle(i)}
                      >
                        {lbl}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="card-body">
                  <span className="card-overline">Women's Clinical Tailoring</span>
                  <h3 className="card-name"><Link to={`/products/${femaleProduct.slug}`}>The Women's Scrub Set</Link></h3>
                  <div className="card-price-line">
                    <span className="cur-price">$158.00 AUD</span>
                    <span className="afterpay">4 × $39.50 Afterpay</span>
                  </div>
                  <button
                    type="button"
                    className="duet-add-btn"
                    onClick={(e) => handleAddToCart(femaleProduct, selectedFemaleColor, selectedFemaleSize, e)}
                  >
                    Add to Bag • $158.00 AUD
                  </button>
                </div>
              </article>
            )}

            {isVisible('mens-scrubs') && (
              <article className="atelier-duet-card">
                <div className="card-visual-frame">
                  <span className="badge-tga">TGA Certified Medical Grade</span>
                  <button
                    type="button"
                    className={`card-wishlist-btn ${isInWishlist(maleProduct.id) ? 'active' : ''}`}
                    onClick={() => toggleWishlist(maleProduct.id)}
                  >
                    <Heart size={16} fill={isInWishlist(maleProduct.id) ? '#C5A059' : 'none'} />
                  </button>
                  <Link to={`/products/${maleProduct.slug}`}>
                    <img src={maleProduct.images[selectedMaleAngle]} alt="Men's Set" className="duet-img" />
                  </Link>
                  <div className="angle-dock">
                    {maleAngleLabels.slice(0, 3).map((lbl, i) => (
                      <button
                        key={i}
                        type="button"
                        className={`angle-btn ${selectedMaleAngle === i ? 'active' : ''}`}
                        onClick={() => setSelectedMaleAngle(i)}
                      >
                        {lbl}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="card-body">
                  <span className="card-overline">Men's Clinical Athletic</span>
                  <h3 className="card-name"><Link to={`/products/${maleProduct.slug}`}>The Men's Scrub Set</Link></h3>
                  <div className="card-price-line">
                    <span className="cur-price">$158.00 AUD</span>
                    <span className="afterpay">4 × $39.50 Afterpay</span>
                  </div>
                  <button
                    type="button"
                    className="duet-add-btn"
                    onClick={(e) => handleAddToCart(maleProduct, selectedMaleColor, selectedMaleSize, e)}
                  >
                    Add to Bag • $158.00 AUD
                  </button>
                </div>
              </article>
            )}
          </div>
        )}

        {/* 3. Clinical Guarantees Footer Strip */}
        <div className="editorial-guarantees-banner">
          <div className="guarantee-col">
            <ShieldCheck size={22} className="guarantee-icon" />
            <div>
              <strong>TGA Compliant Medical Grade</strong>
              <p>Certified Class 1 Australian Hospital Standard</p>
            </div>
          </div>
          <div className="guarantee-col">
            <Sparkles size={22} className="guarantee-icon" />
            <div>
              <strong>Silvadur™ Antimicrobial</strong>
              <p>Silver-ion defense tested through 60°C washes</p>
            </div>
          </div>
          <div className="guarantee-col">
            <RotateCcw size={22} className="guarantee-icon" />
            <div>
              <strong>Complimentary 30-Day Size Exchange</strong>
              <p>Wear test on your hospital shifts risk-free</p>
            </div>
          </div>
        </div>
      </main>

      {/* 4. Slideout Filters Drawer */}
      <div className={`shop-filters-slideout ${isFilterDrawerOpen ? 'open' : ''}`}>
        <div className="drawer-backdrop" onClick={() => setIsFilterDrawerOpen(false)} />
        <div className="drawer-panel">
          <div className="drawer-header">
            <h3>Refine Collection</h3>
            <button
              type="button"
              className="drawer-close-btn"
              onClick={() => setIsFilterDrawerOpen(false)}
              aria-label="Close Filter Drawer"
            >
              <X size={20} />
            </button>
          </div>

          <div className="drawer-body">
            {/* Category selection */}
            <div className="drawer-group">
              <h4>Gender Silhouette</h4>
              <div className="drawer-pill-group">
                <button
                  type="button"
                  className={`drawer-pill ${categoryParam === 'all' ? 'active' : ''}`}
                  onClick={() => handleCategoryChange('all')}
                >
                  All Editions (2)
                </button>
                <button
                  type="button"
                  className={`drawer-pill ${categoryParam === 'womens-scrubs' ? 'active' : ''}`}
                  onClick={() => handleCategoryChange('womens-scrubs')}
                >
                  Women's Tailored Set (1)
                </button>
                <button
                  type="button"
                  className={`drawer-pill ${categoryParam === 'mens-scrubs' ? 'active' : ''}`}
                  onClick={() => handleCategoryChange('mens-scrubs')}
                >
                  Men's Athletic Set (1)
                </button>
              </div>
            </div>

            {/* Colors */}
            <div className="drawer-group">
              <h4>Signature Shades (8 Available)</h4>
              <div className="drawer-colors-grid">
                {femaleProduct.colors.map((c) => (
                  <div key={c.code} className="drawer-color-item">
                    <span className="dot" style={{ backgroundColor: c.hex }} />
                    <span className="name">{c.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="drawer-footer">
            <button
              type="button"
              className="btn btn-primary btn-block"
              onClick={() => setIsFilterDrawerOpen(false)}
            >
              View Refined Pieces
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Copy, Check, ArrowRight, Layers, Eye, ShieldCheck } from 'lucide-react';
import { BrandLogo } from '../common/BrandLogo';
import '../../styles/components/BrandExperienceSection.scss';

const BRAND_COLORS = [
  {
    name: 'Deep Forest Green',
    hex: '#1B3B2B',
    role: 'Primary Signature & Dark Canvas',
    textDark: false,
    contrastHex: '#FDFBF7',
    desc: 'The grounding signature shade. Conveys clinical authority, nature, and understated luxury.',
  },
  {
    name: 'Warm Cream',
    hex: '#FDFBF7',
    role: 'Primary Canvas & Apparel Base',
    textDark: true,
    contrastHex: '#1B3B2B',
    desc: 'Soft, welcoming light neutral replacing sterile clinical white. Provides high tactile warmth.',
  },
  {
    name: 'Soft Beige',
    hex: '#E7DEC2',
    role: 'Secondary Neutral & Divider Accent',
    textDark: true,
    contrastHex: '#1B3B2B',
    desc: 'Refined neutral accent echoing natural studio linens, hangtags, and skin-tone harmony.',
  },
  {
    name: 'Muted Gold',
    hex: '#C5A059',
    role: 'Prestige Accent, Sparkle & Foil',
    textDark: true,
    contrastHex: '#1B3B2B',
    desc: 'Signature metallic luster used on four-point star sparkles, luxury packaging foil, and embroidery.',
  },
];

export const BrandExperienceSection: React.FC = () => {
  const [copiedHex, setCopiedHex] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'concept' | 'colors' | 'pattern' | 'mockups'>('concept');

  const copyToClipboard = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 2000);
  };

  return (
    <section className="brand-experience-section section-padding">
      <div className="container">
        {/* Section Header */}
        <div className="brand-exp-header text-center">
          <span className="overline">Brand Identity &amp; Aesthetic System</span>
          <h2 className="brand-exp-title">
            The Brand Experience
          </h2>
          <p className="brand-exp-lead">
            Rooted in individual expression, confidence, and modern sophistication.
          </p>
        </div>

        {/* Interactive Identity Navigation Tabs */}
        <div className="brand-exp-tabs">
          <button
            className={`tab-btn ${activeTab === 'concept' ? 'active' : ''}`}
            onClick={() => setActiveTab('concept')}
          >
            01. Brand Concept
          </button>
          <button
            className={`tab-btn ${activeTab === 'colors' ? 'active' : ''}`}
            onClick={() => setActiveTab('colors')}
          >
            02. Colour System
          </button>
          <button
            className={`tab-btn ${activeTab === 'pattern' ? 'active' : ''}`}
            onClick={() => setActiveTab('pattern')}
          >
            03. Brand Pattern &amp; Clear Space
          </button>
          <button
            className={`tab-btn ${activeTab === 'mockups' ? 'active' : ''}`}
            onClick={() => setActiveTab('mockups')}
          >
            04. Lifestyle &amp; Mockups
          </button>
        </div>

        {/* Tab 1: Brand Concept (From Image 3) */}
        {activeTab === 'concept' && (
          <div className="tab-pane concept-pane animate-fade-in">
            <div className="concept-grid">
              {/* Left Column: Big Brand Wordmark & Concept Manifesto */}
              <div className="concept-manifesto-card">
                <div className="wordmark-showcase-box">
                  <BrandLogo variant="spaced" theme="forest" height={58} showSparkle={true} />
                </div>

                <div className="concept-copy-block">
                  <span className="concept-kicker">BRANDING CONCEPT</span>
                  <p className="concept-body-text">
                    So beau is a contemporary lifestyle brand rooted in individual expression, confidence, and modern sophistication. The refined wordmark and tagline — “So you. So beau.” capture the essence of a brand that empowers you to be yourself, in and beyond the workplace.
                  </p>
                  <p className="concept-body-text secondary">
                    Designed for stylish medical scrubs and future lifestyle apparel, So beau blends functionality with elevated, everyday style.
                  </p>
                </div>

                <div className="concept-attributes-row">
                  <div className="attr-item">
                    <span className="attr-label">Positioning</span>
                    <span className="attr-val">Contemporary Lifestyle Label</span>
                  </div>
                  <div className="attr-item">
                    <span className="attr-label">Designed In</span>
                    <span className="attr-val">Melbourne, Australia</span>
                  </div>
                  <div className="attr-item">
                    <span className="attr-label">Domain</span>
                    <span className="attr-val">www.sobeau.com.au</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Three Visual Pillars (Tee, Box, Cap from Image 3) */}
              <div className="experience-items-grid">
                {/* 1. Lifestyle T-Shirt Card */}
                <div className="exp-card tee-card">
                  <div className="exp-card-visual bg-charcoal">
                    <div className="tshirt-render">
                      <span className="tshirt-print">
                        <strong>So beau</strong>
                        <small>— So you. So beau. —</small>
                      </span>
                    </div>
                  </div>
                  <div className="exp-card-info">
                    <span className="exp-tag">Apparel Range</span>
                    <h4>Heavyweight Lifestyle Tee</h4>
                    <p>Relaxed drop-shoulder silhouette with muted gold foil print.</p>
                    <Link to="/products/sobeau-lifestyle-relaxed-tee" className="exp-link">
                      View Tee &rarr;
                    </Link>
                  </div>
                </div>

                {/* 2. Luxury Keepsake Box Card */}
                <div className="exp-card box-card">
                  <div className="exp-card-visual bg-forest">
                    <div className="rigid-box-render">
                      <div className="box-lid">
                        <span className="box-foil">
                          <strong>So beau</strong>
                          <small>— So you. So beau. —</small>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="exp-card-info">
                    <span className="exp-tag">Packaging Experience</span>
                    <h4>Signature Keepsake Box</h4>
                    <p>FSC-certified Deep Forest Green rigid box with gold foil stamping.</p>
                    <Link to="/products/sobeau-luxury-keepsake-gift-box" className="exp-link">
                      Unboxing Details &rarr;
                    </Link>
                  </div>
                </div>

                {/* 3. Forest Green Dad Cap Card */}
                <div className="exp-card cap-card">
                  <div className="exp-card-visual bg-forest-dark">
                    <div className="cap-render">
                      <div className="cap-crown">
                        <span className="cap-embroidery">
                          <strong>So beau</strong>
                        </span>
                      </div>
                      <div className="cap-visor" />
                    </div>
                  </div>
                  <div className="exp-card-info">
                    <span className="exp-tag">Everyday Accessories</span>
                    <h4>Forest Green Twill Cap</h4>
                    <p>6-panel cotton twill cap with high-density muted gold embroidery.</p>
                    <Link to="/products/sobeau-signature-forest-twill-cap" className="exp-link">
                      View Cap &rarr;
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Colour System (From Image 1) */}
        {activeTab === 'colors' && (
          <div className="tab-pane colors-pane animate-fade-in">
            <div className="colors-system-grid">
              {BRAND_COLORS.map((col) => (
                <div key={col.hex} className="color-swatch-card">
                  {/* Arch-shaped Swatch header as in Image 1 */}
                  <div
                    className="swatch-color-arch"
                    style={{ backgroundColor: col.hex, color: col.contrastHex }}
                  >
                    <div className="swatch-inner-label">
                      <span className="swatch-title">{col.name.toUpperCase()}</span>
                      <span className="swatch-hex-code">{col.hex}</span>
                    </div>
                  </div>

                  <div className="swatch-info-wrap">
                    <div className="swatch-role-header">
                      <span className="swatch-role">{col.role}</span>
                      <button
                        className="copy-hex-btn"
                        onClick={() => copyToClipboard(col.hex)}
                        title="Copy HEX Code"
                      >
                        {copiedHex === col.hex ? <Check size={14} color="#1B3B2B" /> : <Copy size={14} />}
                        <span>{copiedHex === col.hex ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                    <p className="swatch-description">{col.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Campaign Shade Callout */}
            <div className="campaign-color-spotlight">
              <div className="spotlight-badge">
                <Sparkles size={14} />
                <span>2026 Shift Edition Highlight</span>
              </div>
              <div className="spotlight-content">
                <div className="spotlight-swatch" style={{ backgroundColor: '#8C554F' }}>
                  <span>#8C554F</span>
                </div>
                <div className="spotlight-text">
                  <h4>Terracotta Clay &bull; Desert Rose</h4>
                  <p>
                    The hero campaign shade featured across Australian hospital wards. Engineered with a soft matte finish, structured silhouette, and embroidered gold caduceus emblem.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Brand Pattern & Clear Space (From Image 1) */}
        {activeTab === 'pattern' && (
          <div className="tab-pane pattern-pane animate-fade-in">
            <div className="pattern-clear-space-grid">
              {/* Left Column: Brand Pattern Tile Showcase */}
              <div className="pattern-showcase-box">
                <div className="pattern-display-frame brand-pattern-bg">
                  <div className="pattern-overlay-tag">
                    <span>OFFICIAL BRAND PATTERN &bull; #1B3B2B + #C5A059</span>
                  </div>
                </div>
                <div className="pattern-meta">
                  <h4>The Monogram Star Matrix</h4>
                  <p>
                    Composed of repeating high-contrast Warm Cream serif 'S' letterforms adorned with 4-point Muted Gold sparkles and interstitial diamond stars. Utilized across luxury tissue paper, packaging linings, and brand collateral.
                  </p>
                </div>
              </div>

              {/* Right Column: Clear Space Rules */}
              <div className="clear-space-box">
                <div className="clear-space-diagram">
                  <div className="clear-space-grid-lines">
                    <span className="grid-label top-left">X</span>
                    <span className="grid-label top-center">S</span>
                    <span className="grid-label top-right">X</span>
                    <span className="grid-label mid-left">S</span>
                    <span className="grid-label mid-right">S</span>
                    <span className="grid-label bot-left">X</span>
                    <span className="grid-label bot-center">S</span>
                    <span className="grid-label bot-right">X</span>

                    <div className="clear-space-logo-center">
                      <BrandLogo variant="full" theme="forest" height={52} />
                    </div>
                  </div>
                </div>
                <div className="clear-space-meta">
                  <h4>Clear Space &amp; Signage Grid</h4>
                  <p>
                    A minimum exclusion zone equal to the cap-height 'S' must surround the Sobeau wordmark and tagline on all applications to preserve visual authority and elegance.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Lifestyle Mockups & Stationery (From Image 1) */}
        {activeTab === 'mockups' && (
          <div className="tab-pane mockups-pane animate-fade-in">
            <div className="mockups-grid">
              {/* Stationery Card */}
              <div className="mockup-card">
                <div className="mockup-preview stationery-preview">
                  <div className="envelope-render">
                    <div className="envelope-flap" />
                  </div>
                  <div className="letterhead-render">
                    <BrandLogo variant="full" theme="forest" height={28} />
                    <div className="letterhead-lines">
                      <span className="line" />
                      <span className="line" />
                      <span className="line" />
                    </div>
                    <div className="letterhead-gold-trim" />
                  </div>
                </div>
                <div className="mockup-info">
                  <h4>Stationery &amp; Letterhead</h4>
                  <p>Deep Forest Green envelopes paired with Warm Cream letterhead and foil-stamped cards.</p>
                </div>
              </div>

              {/* Tote Bag Card */}
              <div className="mockup-card">
                <div className="mockup-preview tote-preview">
                  <div className="tote-render">
                    <div className="tote-handles" />
                    <div className="tote-body">
                      <BrandLogo variant="full" theme="forest" height={32} />
                    </div>
                  </div>
                </div>
                <div className="mockup-info">
                  <h4>The Canvas Tote Bag</h4>
                  <p>16oz unbleached Warm Cream canvas with Deep Forest Green shoulder handles.</p>
                  <Link to="/products/sobeau-atelier-canvas-tote" className="mockup-link">
                    Explore Tote Bag &rarr;
                  </Link>
                </div>
              </div>

              {/* Storefront Signage Card */}
              <div className="mockup-card">
                <div className="mockup-preview signage-preview">
                  <div className="signage-facade">
                    <div className="signage-3d-letters">
                      <BrandLogo variant="full" theme="forest" height={42} />
                    </div>
                  </div>
                </div>
                <div className="mockup-info">
                  <h4>Storefront &amp; Studio Signage</h4>
                  <p>Architectural 3D acrylic letters with integrated gold star illumination.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Layers, Activity, Clock, ArrowRight } from 'lucide-react';
import '../../styles/components/ProductHighlights.scss';

const PocketIcon: React.FC<{ size?: number }> = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 3h16a1 1 0 0 1 1 1v7a9 9 0 0 1-18 0V4a1 1 0 0 1 1-1z" />
    <polyline points="4 8 12 13 20 8" />
  </svg>
);

const FABRIC_GAUGES = [
  { label: 'Softness', value: 72 },
  { label: 'Stretch', value: 92 },
  { label: 'Sweatproof', value: 80 },
  { label: 'Weight', value: 40 },
  { label: 'Durability', value: 82 },
];

const HIGHLIGHTS = [
  {
    id: 'fabric',
    icon: Layers,
    title: 'Proprietary BeauTech™ 4-Way Stretch',
    subtitle: '63% Poly, 34% Viscose, 3% Elastane',
    description:
      'Engineered specifically to bridge medical fluid resistance and silk-soft drape. Wrinkle-resistant, lint-resistant, and hair-resistant weave that breathes in high-stress resus rooms.',
    image: '/images/female/female-fabric-tech.png',
    detailTag: 'SILVADUR™ Antimicrobial Silver Ion Infusion',
  },
  {
    id: 'fit',
    icon: Activity,
    title: 'Contoured Non-Slip Waistband & Jogger Fit',
    subtitle: 'Tested across 14-Hour Shifts',
    description:
      'Engineered with an ultra-soft compressive elastic band and exterior flat drawcord that anchors securely without digging into your hips when bending over clinical beds.',
    image: '/images/female/female-pants-fit.jpg',
    detailTag: 'Zero Mid-Shift Readjustments',
  },
  {
    id: 'pockets',
    icon: PocketIcon,
    title: 'Custom Cargo Embroidery & Pockets',
    subtitle: 'Carry Everything, Bulk Nothing',
    description:
      'Deep slanted hip pockets, custom hospital embroidery placement, shear loops, and invisible zippered security compartments keep your diagnostic essentials firmly in place.',
    image: '/images/male/male-pocket-embroidery-detail.jpg',
    detailTag: 'Custom Clinical Embroidery • Shear Slots',
  },
  {
    id: 'shift',
    icon: Clock,
    title: 'Side Phone Sleeve & 14-Hour Comfort',
    subtitle: 'From Handover to Post-Shift Coffee',
    description:
      'Wash after wash, our high-tenacity yarn holds its shape and rich color. Deep side sleeve securely stores hospital smartphones and pagers for instant access during critical calls.',
    image: '/images/male/male-side-phone-pocket-detail.jpg',
    detailTag: 'Hospital Smartphone Sleeve • Non-Iron',
  },
];

export const ProductHighlights: React.FC = () => {
  const [activeHighlight, setActiveHighlight] = useState(HIGHLIGHTS[0]);

  return (
    <section className="product-highlights-section section-padding">
      <div className="container">
        <div className="section-head-wrap">
          <span className="overline">Anatomy of Innovation</span>
          <h2 className="text-section-title">Details engineered for shift life.</h2>
        </div>

        <div className="highlights-main-grid">
          {/* Left Feature Showcase Tabs */}
          <div className="highlights-tabs-col">
            {HIGHLIGHTS.map((h) => {
              const Icon = h.icon;
              const isActive = activeHighlight.id === h.id;
              return (
                <div
                  key={h.id}
                  className={`highlight-tab-item ${isActive ? 'active' : ''}`}
                  onClick={() => setActiveHighlight(h)}
                >
                  <div className="tab-icon-wrap">
                    <Icon size={20} />
                  </div>
                  <div className="tab-text-wrap">
                    <span className="tab-subtitle">{h.subtitle}</span>
                    <h3 className="tab-title">{h.title}</h3>
                    {isActive && (
                      <p className="tab-description animate-fade-in">
                        {h.description}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}

            <div className="highlights-cta-row">
              <Link to="/collections/scrubs" className="btn btn-primary">
                <span>Experience the BeauTech™ Difference</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          {/* Right Visual Display with Technicalities Card (Inspired by User Image 2) */}
          <div className="highlights-visual-col">
            <div className="visual-card">
              <img 
                src={activeHighlight.image} 
                alt={activeHighlight.title}
                key={activeHighlight.id}
                className={`visual-img ${activeHighlight.id === 'fabric' ? 'is-graphic' : ''} animate-fade-in`}
              />

              {/* Interactive Technicalities HUD Overlay if Fabric Tab is Active */}
              {activeHighlight.id === 'fabric' && (
                <div className="technicalities-hud-overlay animate-fade-in">
                  <div className="hud-header">
                    <span className="technicalities-pill">Technicalities</span>
                    <p className="technicalities-desc">
                      4-way stretch, Anti-wrinkle, Breathable, Moisture-wicking, Low carbon footprint. Sustainably made from recycled PET bottles.
                    </p>
                  </div>

                  {/* Composition Glass Card */}
                  <div className="hud-composition-card">
                    <span className="comp-tag">Composition</span>
                    <div className="comp-breakdown">
                      <div className="comp-item">
                        <span className="comp-percent">63%</span>
                        <span className="comp-name">Polyester</span>
                      </div>
                      <span className="comp-divider">|</span>
                      <div className="comp-item">
                        <span className="comp-percent">34%</span>
                        <span className="comp-name">Viscose</span>
                      </div>
                      <span className="comp-divider">|</span>
                      <div className="comp-item">
                        <span className="comp-percent">3%</span>
                        <span className="comp-name">Elastane</span>
                      </div>
                    </div>
                  </div>

                  {/* 5 Technical Sliders */}
                  <div className="hud-gauges-list">
                    {FABRIC_GAUGES.map((g) => (
                      <div key={g.label} className="hud-gauge-row">
                        <span className="gauge-label">{g.label}</span>
                        <div className="gauge-slider-track">
                          <div className="gauge-slider-bar" style={{ width: `${g.value}%` }}>
                            <div className="gauge-thumb" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="visual-caption-badge">
                <span className="badge-tag badge-bestseller">{activeHighlight.detailTag}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
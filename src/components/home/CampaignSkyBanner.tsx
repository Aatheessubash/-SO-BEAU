import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import '../../styles/components/CampaignSkyBanner.scss';

export const CampaignSkyBanner: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'female' | 'male'>('female');

  return (
    <section className="campaign-sky-section">
      {/* Dynamic Ethereal Sky & Soft Cloud Layers */}
      <div className="sky-cloud-background" aria-hidden="true">
        <div className="cloud-layer cloud-layer-1" />
        <div className="cloud-layer cloud-layer-2" />
        <div className="cloud-layer cloud-layer-3" />
      </div>

      <div className="container campaign-sky-container">
        {/* Top Header: Brand Wordmark & Tagline Badge */}
        <div className="campaign-sky-header text-center">
          <h2 className="campaign-sky-title">SO BEAU</h2>
          
          <div className="campaign-sky-tagline-pill">
            <span>So you. So Beau</span>
          </div>
        </div>

        {/* Central Showcase Grid with Product Callout Lines */}
        <div className="campaign-product-stage">
          {/* Left / Bottom Callout: Soft matte finish with a structured silhouette */}
          <div className="product-callout callout-silhouette animate-fade-in">
            <div className="callout-content">
              <span className="callout-text">Soft matte finish with a structured silhouette</span>
            </div>
            <div className="callout-line line-left" />
          </div>

          {/* Center Stage: The Scrub Set in Signature Terracotta Clay */}
          <div className="product-visual-wrapper">
            <div className="scrub-clothing-render">
              {/* Scrub Top Illustration / Photo with Gold Caduceus Embroidery */}
              <div className="scrub-item-card top-card">
                <div className="v-neck-shape">
                  <div className="v-neck-inner">
                    <span className="caduceus-embroidery" title="Gold Caduceus Medical Emblem">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#C5A059" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 2v20" />
                        <path d="M12 4c-3 0-5 2-5 4s2 3 5 4c3 1 5 2 5 4s-2 4-5 4" />
                        <path d="M12 4c3 0 5 2 5 4s-2 3-5 4c-3 1-5 2-5 4s2 4 5 4" />
                        <circle cx="12" cy="3" r="1.5" fill="#C5A059" />
                        <path d="M8 3c-1.5 1-3 2.5-3 5" />
                        <path d="M16 3c1.5 1 3 2.5 3 5" />
                      </svg>
                    </span>
                  </div>
                  <div className="pocket-accent">
                    <span className="pocket-seam" />
                  </div>
                </div>
                <div className="scrub-label-badge">
                  <span>Terracotta Clay • AU Medical Grade</span>
                </div>
              </div>

              {/* Scrub Pants Illustration */}
              <div className="scrub-item-card pants-card">
                <div className="elastic-waistband">
                  <span className="waist-drawcord" />
                </div>
                <div className="jogger-silhouette">
                  <span className="pant-crease" />
                </div>
              </div>
            </div>

            {/* Gender Switcher Pill */}
            <div className="gender-toggle-wrap">
              <button
                className={`gender-toggle-btn ${activeTab === 'female' ? 'active' : ''}`}
                onClick={() => setActiveTab('female')}
              >
                Women's Fit
              </button>
              <button
                className={`gender-toggle-btn ${activeTab === 'male' ? 'active' : ''}`}
                onClick={() => setActiveTab('male')}
              >
                Men's Fit
              </button>
            </div>
          </div>

          {/* Right / Top Callout: Premium fabric */}
          <div className="product-callout callout-fabric animate-fade-in">
            <div className="callout-line line-right" />
            <div className="callout-content">
              <span className="callout-text">Premium fabric</span>
              <span className="callout-subtext">4-Way Stretch &bull; TGA Compliant</span>
            </div>
          </div>
        </div>

        {/* Bottom CTA & Australian Domain URL */}
        <div className="campaign-sky-footer text-center">
          <div className="cta-button-wrapper">
            <Link
              to={activeTab === 'female' ? '/products/the-womens-nursing-scrub-set' : '/products/the-mens-nursing-scrub-set'}
              className="btn btn-campaign-sky"
            >
              <span>GET YOURS TODAY</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="campaign-sky-url">
            <a href="https://www.sobeau.com.au" target="_blank" rel="noreferrer" className="url-link">
              www.sobeau.com.au
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

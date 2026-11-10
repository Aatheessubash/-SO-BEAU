import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { BrandLogo } from '../common/BrandLogo';
import '../../styles/components/EditorialBanner.scss';

export const EditorialBanner: React.FC = () => {
  return (
    <section className="editorial-banner-section">
      <div className="container-fluid p-0">
        <div className="editorial-banner-grid">
          {/* Left Column: High-Fashion Full-Bleed Imagery with Background Watermark */}
          <div className="editorial-image-column">
            <div className="watermark-text-wrap">
              <span className="watermark-outline">COMFORT, DURABILITY, AND EVERYDAY STYLE.</span>
            </div>

            <div className="editorial-photo-card">
              <img
                src="/dummy_images/lookbook-indigo-scrubs.png"
                alt="SO BEAU Editorial Hospital Scrub Collection"
                className="editorial-main-img"
              />
              <div className="photo-corner-badge">
                <span className="tag-atelier">Australian Medical Atelier</span>
                <span className="tag-edition">Shift Edition 2026</span>
              </div>
            </div>
          </div>

          {/* Right Column: Editorial Typographic Showcase (Inspired by MAISON Reference) */}
          <div className="editorial-text-column">
            <div className="editorial-text-content">
              <div className="brand-wordmark-mini">
                <BrandLogo variant="wordmark" theme="forest" height={28} />
                <span className="wordmark-sub">MELBOURNE &bull; WWW.SOBEAU.COM.AU</span>
              </div>

              <h2 className="editorial-headline">
                REFINED ESSENTIALS FOR MODERN CLINICAL LIVING
              </h2>

              <p className="editorial-lead">
                Thoughtfully designed scrubs crafted with sustainable, hospital-grade performance textiles. Timeless Australian silhouettes engineered for unmatched 14-hour shift comfort.
              </p>

              <div className="editorial-highlights-list">
                <div className="highlight-item">
                  <span className="highlight-bullet">01</span>
                  <div className="highlight-text">
                    <strong>4-Way BeauTech™ Adaptive Recoil</strong>
                    <span>Moves fluidly during chest compressions, transfers, and bed adjustments.</span>
                  </div>
                </div>
                <div className="highlight-item">
                  <span className="highlight-bullet">02</span>
                  <div className="highlight-text">
                    <strong>TGA Australian Hospital Compliant</strong>
                    <span>Certified fluid repellence and Silvadur™ antimicrobial silver ion barrier.</span>
                  </div>
                </div>
                <div className="highlight-item">
                  <span className="highlight-bullet">03</span>
                  <div className="highlight-text">
                    <strong>Personalized Precision Embroidery</strong>
                    <span>Commercial hospital name &amp; department stitching on pocket placements.</span>
                  </div>
                </div>
              </div>

              <div className="editorial-cta-group">
                <Link to="/collections/scrubs" className="btn btn-primary editorial-btn">
                  <span>Shop New Arrivals</span>
                  <ArrowRight size={16} />
                </Link>
                <Link to="/pages/our-story" className="btn btn-outline editorial-btn-sec">
                  <span>About Our Brand</span>
                </Link>
              </div>
            </div>

            {/* Bottom Watermark Marquee Line */}
            <div className="editorial-bottom-bar">
              <span className="bottom-statement">COMFORT, DURABILITY, AND EVERYDAY STYLE.</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import '../../styles/components/Hero.scss';

export const Hero: React.FC = () => {
  return (
    <section className="hero-section skims-hero-style">
      {/* Ambient Cinematic Background Video with Directional Gradient Blur */}
      <div className="hero-bg-video-wrapper" aria-hidden="true">
        <video
          src="/video/VN20261109_081100.mp4"
          poster="/images/campaign-video-poster.jpg"
          autoPlay
          loop
          muted
          playsInline
          className="hero-bg-video"
        />
        {/* Progressive Blur Layers: Left Heavy, Center Medium, Right Current */}
        <div className="hero-blur-center" />
        <div className="hero-blur-left" />
        <div className="hero-bg-video-overlay" />
      </div>

      {/* Background Architectural Watermark */}
      <div className="hero-watermark-typography" aria-hidden="true">
        <span>SO BEAU • SO YOU. SO BEAU. • CONTEMPORARY LIFESTYLE APPAREL</span>
      </div>

      {/* Left Container with Editorial Content */}
      <div className="container hero-container">
        <div className="hero-text-card">
          {/* Headline in 2 lines */}
          <h1 className="hero-headline">
            <span className="line-reveal-wrapper">
              <span className="line-reveal-inner" style={{ animationDelay: '0.08s' }}>
                INDIVIDUAL EXPRESSION.
              </span>
            </span>
            <span className="line-reveal-wrapper">
              <span className="line-reveal-inner" style={{ animationDelay: '0.18s' }}>
                CLINICAL SOPHISTICATION.
              </span>
            </span>
          </h1>

          <p className="hero-supporting-text animate-fade-in-up" style={{ animationDelay: '0.28s' }}>
            Founded in Melbourne by clinicians and atelier tailors, SO BEAU redefines professional medical workwear. We craft high-performance scrubs and tailored hospital layers engineered with BeauTech™ 4-way recoil stretch and Silvadur™ antimicrobial defense for 14-hour hospital shifts and everyday presence.
          </p>

          {/* Dual CTAs: SHOP WOMEN & SHOP MEN */}
          <div className="hero-cta-group animate-fade-in-up" style={{ animationDelay: '0.38s' }}>
            <Link to="/products/the-womens-nursing-scrub-set" className="btn btn-primary hero-btn skims-btn">
              <span>Shop Women's Set</span>
              <ArrowRight size={15} />
            </Link>

            <Link to="/products/the-mens-nursing-scrub-set" className="btn btn-outline hero-btn skims-btn">
              <span>Shop Men's Set</span>
              <ArrowRight size={15} />
            </Link>
          </div>

          {/* Perks Row with Checkmarks */}
          <div className="hero-perks-row animate-fade-in-up" style={{ animationDelay: '0.48s' }}>
            <div className="perk-pill">
              <CheckCircle2 size={13} className="perk-icon" />
              <span>TGA Australian Medical Grade</span>
            </div>
            <div className="perk-pill">
              <CheckCircle2 size={13} className="perk-icon" />
              <span>BeauTech™ 4-Way Recoil</span>
            </div>
            <div className="perk-pill">
              <CheckCircle2 size={13} className="perk-icon" />
              <span>Silvadur™ Antimicrobial</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

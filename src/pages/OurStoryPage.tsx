import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, HeartHandshake, ArrowRight, ShieldCheck, Scissors } from 'lucide-react';
import { BrandLogo } from '../components/common/BrandLogo';
import '../styles/pages/OurStoryPage.scss';

export const OurStoryPage: React.FC = () => {
  return (
    <div className="our-story-page animate-fade-in">
      {/* Editorial Hero Banner */}
      <section className="story-hero-section">
        <div className="container story-hero-inner">
          <span className="overline">About Our Brand • The Origin</span>
          <h1 className="story-main-title">
            Two worlds. <br />
            <em>One beautiful idea.</em>
          </h1>
          <p className="story-subtitle">
            Born between emergency hospital handovers and Melbourne fashion studio drafting tables.
          </p>
        </div>
      </section>

      {/* Main Narrative Section */}
      <section className="story-narrative-section section-padding">
        <div className="container container-editorial">
          <div className="story-text-body">
            <p className="drop-cap-paragraph">
              She's a doctor. He's got fashion in the family. She brings home stories from the hospital. He brings a million ideas. Somewhere between the two, SO BEAU happened.
            </p>

            <p>
              Long shifts, coffee gone cold, running around all day — she's seen it all. And with a little boutique inspiration running through the family, one question kept coming up:
            </p>

            <blockquote className="highlight-callout">
              “Why can't scrubs be as comfortable as your favourite outfit and look just as good?”
            </blockquote>

            <p>
              Meet SO BEAU. A little fashion, a lot of function, and absolutely no boring scrubs.
            </p>

            <div className="story-photo-break">
              <div className="photo-frame">
                <img 
                  src="/images/female/female-navy-front.jpg" 
                  alt="Doctor wearing tailored scrubs in hospital setting" 
                />
                <span className="caption">Real shifts. Real comfort. Designed for Australian hospitals.</span>
              </div>
            </div>

            <h3 className="section-subheading">This isn't just our brand. It's yours too.</h3>

            <p>
              But here's the thing — this isn't just our brand. It's yours too.
            </p>

            <p>
              We're just getting started, and we don't want to build SO BEAU in our own little bubble. We want to build it with <strong>YOU</strong>.
            </p>

            <p>
              Your stories. Your ideas. Your frustrations. Even your wildest suggestions.
            </p>

            <p>
              Because the best designs don't just come from a drawing board. They come from the people who actually wear them, shift after shift.
            </p>

            <p>
              We're here to turn your ideas into cooler designs, smarter details and everyday comfort — without compromising on style.
            </p>

            <div className="manifesto-card">
              <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'center' }}>
                <BrandLogo variant="spaced" theme="cream" height={48} />
              </div>
              <span className="manifesto-tagline">BRANDING CONCEPT</span>
              <p className="manifesto-text" style={{ fontSize: '1.15rem', fontStyle: 'normal' }}>
                “So beau is a contemporary lifestyle brand rooted in individual expression, confidence, and modern sophistication. The refined wordmark and tagline — ‘So you. So beau.’ capture the essence of a brand that empowers you to be yourself, in and beyond the workplace. Designed for stylish medical scrubs and future lifestyle apparel, So beau blends functionality with elevated, everyday style.”
              </p>
              <span className="manifesto-closer">Australian Designed &bull; www.sobeau.com.au</span>
              <span className="manifesto-signature">SO YOU. SO BEAU.</span>
            </div>
          </div>
        </div>
      </section>

      {/* The Two Worlds: Dual Grid */}
      <section className="two-worlds-section section-padding-sm">
        <div className="container">
          <div className="two-worlds-grid">
            <div className="world-card clinic-card">
              <span className="world-num">01 / The Clinic</span>
              <h3>The Clinical Reality</h3>
              <p>
                14-hour resus marathons, chest compressions, rushing down clinical corridors, bending over ventilators, fluid splashes, and relentless laundry cycles. Every scrub must withstand intense hospital realities without losing shape or failing a clinician when seconds count.
              </p>
              <div className="world-features">
                <span>• Silvadur™ antimicrobial silver ions</span>
                <span>• Liquid-repellent barrier finish</span>
                <span>• Flatlock anti-rub friction seams</span>
              </div>
            </div>

            <div className="world-card atelier-card">
              <span className="world-num">02 / The Atelier</span>
              <h3>The Fashion Vision</h3>
              <p>
                Inspired by modern Australian luxury design. Tailored darts, clean Mandarin necklines, architectural silhouettes, and warm earth neutrals (Warm Taupe, Soft Sage, Deep Charcoal) that bring calm human dignity back to healthcare environments.
              </p>
              <div className="world-features">
                <span>• Haute couture drape &amp; proportion</span>
                <span>• BeauTech™ 4-way stretch weave</span>
                <span>• Flattering tucked or untucked lines</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Future Horizons: Beyond Scrubs */}
      <section className="future-horizons-section section-padding">
        <div className="container">
          <div className="horizons-header text-center">
            <span className="overline">The Long-Term Vision</span>
            <h2 className="text-section-title">Beyond the Clinic Floor</h2>
            <p className="horizons-lead">
              SO BEAU was born in the hospital, but our vision is crafted for modern living. Designed to evolve into an all-encompassing premium lifestyle label.
            </p>
          </div>

          <div className="horizons-grid">
            <div className="horizon-tile">
              <span className="tile-category">Available Now</span>
              <h4>Premium Medical Scrubs</h4>
              <p>V-Necks, Mandarin collars, high-waist joggers, and straight-leg scrub trousers.</p>
              <Link to="/collections/scrubs" className="tile-link">Explore Scrubs &rarr;</Link>
            </div>

            <div className="horizon-tile">
              <span className="tile-category">New Horizon</span>
              <h4>Activewear Studio</h4>
              <p>Buttery-soft compression bras, supportive 7/8 leggings, and technical stretch layers.</p>
              <Link to="/collections/scrubs?category=activewear" className="tile-link">View Activewear &rarr;</Link>
            </div>

            <div className="horizon-tile">
              <span className="tile-category">In Co-Design</span>
              <h4>Everyday Clothing</h4>
              <p>Breathable modal knits, off-duty fleece, tailored coats, and clinical transition pieces.</p>
              <Link to="/pages/community" className="tile-link">Vote on Prototypes &rarr;</Link>
            </div>

            <div className="horizon-tile">
              <span className="tile-category">Coming Soon</span>
              <h4>Lifestyle &amp; Accessories</h4>
              <p>Shift canvas totes, protective stethoscope cases, compression socks, and scrub caps.</p>
              <Link to="/collections/scrubs?category=accessories" className="tile-link">Explore Accessories &rarr;</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Community Co-Creation CTA */}
      <section className="story-co-design-cta section-padding-sm">
        <div className="container text-center">
          <div className="cta-box-card">
            <Sparkles size={24} className="sparkle-icon" />
            <h3>Have an idea for our next scrub silhouette?</h3>
            <p>
              Tell us what pockets you need, what colors calm your patients, and how you want your scrubs to fit.
            </p>
            <div className="cta-btn-group">
              <Link to="/pages/community" className="btn btn-primary">
                <span>Join the Community Co-Design</span>
                <ArrowRight size={16} />
              </Link>
              <Link to="/collections/scrubs" className="btn btn-outline">
                <span>Shop Current Collection</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

import React from 'react';
import { Link } from 'react-router-dom';
import { Scissors, Shield, HeartHandshake } from 'lucide-react';
import '../../styles/components/PhilosophySection.scss';

export const PhilosophySection: React.FC = () => {
  return (
    <section className="philosophy-section section-padding">
      <div className="container">
        <div className="philosophy-header text-center">
          <h2 className="philosophy-title">
            Not just scrubs. <br />
            <em>A whole new feeling.</em>
          </h2>
          <p className="philosophy-lead">
            Traditional scrubs were engineered for mass laundry vats in the 1970s. We created SO BEAU for the doctor, surgeon, nurse, and clinician who refuses to leave their personal style and bodily comfort in the hospital locker room.
          </p>
        </div>

        <div className="philosophy-pillars-grid">
          <div className="philosophy-card">
            <div className="card-number-tag">01</div>
            <div className="icon-wrap">
              <Scissors size={24} />
            </div>
            <h3>Fashion-Forward Tailoring</h3>
            <p>
              Darted waists, contoured shoulders, and modern Mandarin collars inspired by contemporary Australian fashion ateliers. Subtle curves drape gracefully whether tucked or untucked.
            </p>
            <span className="pillar-detail">Curated in Warm Taupe, Soft Sage &amp; Deep Charcoal</span>
          </div>

          <div className="philosophy-card">
            <div className="card-number-tag">02</div>
            <div className="icon-wrap">
              <Shield size={24} />
            </div>
            <h3>Hospital-Grade Performance</h3>
            <p>
              Every seam is reinforced with flatlock anti-rub stitching. Treated with Silvadur™ antimicrobial silver ions to eradicate odor-causing bacteria and finished with fluid-repellent barrier tech.
            </p>
            <span className="pillar-detail">Tested across 14-hour emergency resus shifts</span>
          </div>

          <div className="philosophy-card">
            <div className="card-number-tag">03</div>
            <div className="icon-wrap">
              <HeartHandshake size={24} />
            </div>
            <h3>Co-Created With Clinicians</h3>
            <p>
              "Your stories. Your ideas. Our next creation." We don't design in an isolated corporate tower. Every pocket angle, scissor holder, and waistband drawcord is tested and refined with Australian doctors and nurses.
            </p>
            <span className="pillar-detail">Active community idea voting on every release</span>
          </div>
        </div>

        {/* Large Editorial Quote Banner */}
        <div className="editorial-quote-banner">
          <div className="banner-quote-content">
            <span className="quote-mark">“</span>
            <blockquote className="text-editorial-quote">
              Why should the clothes you spend 70 hours a week in be the least inspiring pieces in your wardrobe? You deserve scrubs that honour your hard work with uncompromising style.
            </blockquote>
            <cite className="quote-author">
              <strong>Dr. Chloe &amp; Alexander</strong> — Founders of SO BEAU, Melbourne
            </cite>
            <Link to="/pages/our-story" className="btn btn-outline-light quote-cta-btn">
              Read Our Founder Journey
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

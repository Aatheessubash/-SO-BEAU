import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { api } from '../../services/api';
import { BrandLogo } from './BrandLogo';
import '../../styles/components/Footer.scss';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const { showToast } = useCart();

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setLoading(true);
    try {
      const res = await api.subscribeNewsletter(email);
      setSubscribed(true);
      showToast(res.message || 'Welcome to the SO BEAU circle.');
    } catch {
      showToast('Welcome to the SO BEAU circle. Use code BEAU10.');
      setSubscribed(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="site-footer">
      {/* Top Newsletter Teaser */}
      <div className="footer-newsletter-banner">
        <div className="container newsletter-banner-inner">
          <div className="banner-text">
            <span className="banner-tagline">A little beau in your inbox</span>
            <h3>Join our healthcare circle for 10% off your first wardrobe.</h3>
          </div>
          <div className="banner-form-wrap">
            {subscribed ? (
              <div className="newsletter-success-tag">
                <Check size={16} /> <span>Welcome code: <strong>BEAU10</strong> (10% off)</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="footer-newsletter-form">
                <input
                  type="email"
                  placeholder="Enter your clinical or personal email..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button type="submit" disabled={loading} className="newsletter-submit-btn">
                  <span>Subscribe</span>
                  <ArrowRight size={14} />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="container footer-main-content">
        <div className="footer-columns-grid">
          {/* Brand Manifesto Column */}
          <div className="footer-brand-column">
            <Link to="/" className="footer-brand-link" aria-label="SOBEAU Home">
              <BrandLogo variant="full" theme="cream" height={44} />
            </Link>
            <p className="footer-mission-text">
              So beau is a contemporary lifestyle brand rooted in individual expression, confidence, and modern sophistication. Designed for stylish medical scrubs and future lifestyle apparel, blending functionality with elevated, everyday style.
            </p>
            <div className="brand-location-badge">
              <span>Melbourne Studio, VIC • www.sobeau.com.au</span>
            </div>

            {/* Official Brand Palette Swatches */}
            <div className="footer-brand-swatches" style={{ display: 'flex', gap: '8px', marginTop: '1.2rem', alignItems: 'center' }}>
              <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#C5A059' }}>Colour System:</span>
              <span title="Deep Forest Green (#1B3B2B)" style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: '#1B3B2B', border: '1px solid #C5A059', display: 'inline-block' }} />
              <span title="Warm Cream (#FDFBF7)" style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: '#FDFBF7', border: '1px solid #C5A059', display: 'inline-block' }} />
              <span title="Soft Beige (#E7DEC2)" style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: '#E7DEC2', border: '1px solid #C5A059', display: 'inline-block' }} />
              <span title="Muted Gold (#C5A059)" style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: '#C5A059', border: '1px solid #C5A059', display: 'inline-block' }} />
            </div>

            <div className="social-links-row">
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noreferrer" 
                className="social-icon-btn" 
                aria-label="Instagram"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                </svg>
              </a>
              <a 
                href="https://tiktok.com" 
                target="_blank" 
                rel="noreferrer" 
                className="social-icon-btn" 
                aria-label="TikTok"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.82 4.49 6.3 6.3 0 0 0 1.96-4.57V8.58a8.28 8.28 0 0 0 4.81 1.52v-3.41z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Column 1: Shop */}
          <div className="footer-nav-col">
            <h4 className="col-header">Medical Scrubs</h4>
            <ul>
              <li><Link to="/collections/scrubs">All Scrubs (2 Models)</Link></li>
              <li><Link to="/collections/scrubs?category=womens-scrubs">Women's Tailored Set (Female Model)</Link></li>
              <li><Link to="/collections/scrubs?category=mens-scrubs">Men's Athletic Set (Male Model)</Link></li>
              <li><Link to="/pages/size-guide">Australian Sizing Guide</Link></li>
              <li><Link to="/pages/shipping">Free AU Express Delivery</Link></li>
            </ul>
          </div>

          {/* Column 2: Our Story & Community */}
          <div className="footer-nav-col">
            <h4 className="col-header">The Brand</h4>
            <ul>
              <li><Link to="/pages/our-story">About Our Brand</Link></li>
              <li><Link to="/pages/community">Community Co-Creation</Link></li>
              <li><Link to="/pages/community#ideas">Submit a Design Idea</Link></li>
              <li><Link to="/pages/our-story#fabric">BeauTech™ Fabric Science</Link></li>
              <li><Link to="/pages/contact#hospital">Clinic &amp; Hospital Teams</Link></li>
            </ul>
          </div>

          {/* Column 3: Concierge & Customer Care */}
          <div className="footer-nav-col">
            <h4 className="col-header">Concierge &amp; Care</h4>
            <ul>
              <li><Link to="/pages/contact">Contact Melbourne Studio</Link></li>
              <li><Link to="/pages/shipping">Shipping &amp; Express Delivery</Link></li>
              <li><Link to="/pages/returns">30-Day Returns &amp; Exchanges</Link></li>
              <li><Link to="/pages/size-guide">Australian Sizing Guide</Link></li>
              <li><Link to="/pages/faq">Frequently Asked Questions</Link></li>
            </ul>
          </div>

          {/* Column 4: Legal & Policies */}
          <div className="footer-nav-col">
            <h4 className="col-header">Legal &amp; Ethics</h4>
            <ul>
              <li><Link to="/pages/privacy">Privacy Policy (APPs)</Link></li>
              <li><Link to="/pages/terms">Terms &amp; Conditions</Link></li>
              <li><Link to="/pages/shipping#carbon">Carbon-Neutral Delivery</Link></li>
              <li><Link to="/pages/contact#care">care@sobeau.com.au</Link></li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom Bar */}
        <div className="footer-bottom-bar">
          <div className="bottom-left">
            <p>&copy; {new Date().getFullYear()} SOBEAU Australia Pty Ltd • www.sobeau.com.au. All rights reserved.</p>
            <p className="acknowledgement-text">
              SO BEAU acknowledges the Traditional Custodians of the lands across Australia on which we design and live.
            </p>
          </div>

          <div className="payment-badges-row">
            <span className="payment-badge">VISA</span>
            <span className="payment-badge">MASTERCARD</span>
            <span className="payment-badge">AMEX</span>
            <span className="payment-badge">APPLE PAY</span>
            <span className="payment-badge">AFTERPAY</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

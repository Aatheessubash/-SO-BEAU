import React from 'react';
import '../styles/pages/ContentPages.scss';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="content-page animate-fade-in">
      <div className="content-hero-banner">
        <div className="container text-center">
          <span className="overline">Legal &amp; Compliance</span>
          <h1>Privacy Policy</h1>
          <p className="hero-lead">
            Compliant with the Australian Privacy Principles (APPs) and the Privacy Act 1988 (Cth).
          </p>
        </div>
      </div>

      <div className="container container-editorial">
        <div className="legal-article-body">
          <p className="effective-date">Last Updated: October 2026 • SO BEAU Australia Pty Ltd</p>

          <h3>1. Our Commitment to Your Privacy</h3>
          <p>
            SO BEAU Australia Pty Ltd ("SO BEAU", "we", "our", or "us") respects your personal privacy. We understand that many of our clients are healthcare professionals working in confidential hospital environments. We handle all personal information with strict security standards in compliance with the Australian Privacy Principles (APPs) contained in the Privacy Act 1988 (Cth).
          </p>

          <h3>2. Collection of Personal Information</h3>
          <p>
            We collect personal information necessary to provide you with tailored scrubs and e-commerce services, including:
          </p>
          <ul>
            <li>Your name, personal or clinical email address, phone number, and delivery address.</li>
            <li>Billing and transaction details (processed securely via PCI-DSS certified payment gateways).</li>
            <li>Shift feedback, review submissions, and community co-design suggestions submitted via our platform.</li>
          </ul>

          <h3>3. Use and Disclosure</h3>
          <p>
            Your information is used strictly to fulfill your orders, provide dispatch tracking via Australia Post, process size exchanges, and notify you of new collection drops (if you have opted into our newsletter). We do not sell, rent, or trade your personal information to third-party advertisers.
          </p>

          <h3>4. Security of Data</h3>
          <p>
            All web traffic and checkout submissions are encrypted using industry-standard 256-bit Secure Socket Layer (SSL) encryption. Payment processing is tokenized through Stripe and Apple Pay; your full credit card numbers are never stored on our servers.
          </p>

          <h3>5. Contacting Our Privacy Officer</h3>
          <p>
            If you have questions about your personal data or wish to request deletion of your account, please email <strong>privacy@sobeau.com.au</strong> or write to: Privacy Officer, SO BEAU Australia Pty Ltd, Level 3, 180 Flinders Lane, Melbourne VIC 3000.
          </p>
        </div>
      </div>
    </div>
  );
};

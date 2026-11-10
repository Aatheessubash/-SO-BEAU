import React from 'react';
import '../styles/pages/ContentPages.scss';

export const TermsPage: React.FC = () => {
  return (
    <div className="content-page animate-fade-in">
      <div className="content-hero-banner">
        <div className="container text-center">
          <span className="overline">Legal Agreement</span>
          <h1>Terms &amp; Conditions</h1>
          <p className="hero-lead">
            Terms governing the use of the SO BEAU website and e-commerce transactions in Australia.
          </p>
        </div>
      </div>

      <div className="container container-editorial">
        <div className="legal-article-body">
          <p className="effective-date">Last Updated: October 2026 • SO BEAU Australia Pty Ltd</p>

          <h3>1. General &amp; Australian Consumer Law</h3>
          <p>
            By accessing or ordering from SO BEAU (sobeau.com.au), you agree to be bound by these Terms and Conditions. Our goods come with guarantees that cannot be excluded under the Australian Consumer Law (ACL), Schedule 2 of the Competition and Consumer Act 2010 (Cth). You are entitled to a replacement or refund for a major failure and compensation for any other reasonably foreseeable loss or damage.
          </p>

          <h3>2. Pricing &amp; Australian GST</h3>
          <p>
            All prices on our platform are quoted in Australian Dollars ($ AUD) and are inclusive of the 10% Australian Goods and Services Tax (GST). Delivery fees are calculated at checkout in accordance with our published shipping rates.
          </p>

          <h3>3. Orders &amp; Contract Formation</h3>
          <p>
            An order placed by you is an offer to purchase the specified product for the stated price. SO BEAU reserves the right to accept or decline your offer in whole or in part for any reason, including unavailability of stock, error in price, or payment authorization failure.
          </p>

          <h3>4. Returns &amp; Exchange Policy</h3>
          <p>
            In addition to your rights under the Australian Consumer Law, SO BEAU provides a 30-day change-of-mind and size exchange policy for unwashed, unworn garments with all tags intact. Size exchanges are shipped complimentary within Australia.
          </p>

          <h3>5. Intellectual Property</h3>
          <p>
            All trademarks, logos (including "SO BEAU" and "SO YOU. SO BEAU."), product photography, architectural garment patterns, and website content are the exclusive intellectual property of SO BEAU Australia Pty Ltd.
          </p>

          <h3>6. Governing Law</h3>
          <p>
            These Terms are governed by and construed in accordance with the laws of the State of Victoria, Australia. Any disputes arising hereunder shall be subject to the jurisdiction of the courts of Victoria.
          </p>
        </div>
      </div>
    </div>
  );
};

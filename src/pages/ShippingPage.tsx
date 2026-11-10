import React from 'react';
import { Link } from 'react-router-dom';
import { Truck, ShieldCheck, Clock, MapPin, Leaf, ArrowRight } from 'lucide-react';
import '../styles/pages/ContentPages.scss';

export const ShippingPage: React.FC = () => {
  return (
    <div className="content-page animate-fade-in">
      <div className="content-hero-banner">
        <div className="container text-center">
          <span className="overline">Reliable Logistics</span>
          <h1>Australian Shipping &amp; Delivery</h1>
          <p className="hero-lead">
            Priority fulfillment from our Melbourne logistics facility via Australia Post.
          </p>
        </div>
      </div>

      <div className="container content-body-container">
        {/* Shipping Options Table */}
        <section className="guide-table-section">
          <h2>Delivery Methods &amp; Estimated Transit Times</h2>
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Method</th>
                  <th>Transit Time (Metro AU)</th>
                  <th>Cost (Orders &lt; $150)</th>
                  <th>Cost (Orders &ge; $150)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Australia Post Standard</strong></td>
                  <td>3 – 5 Business Days</td>
                  <td>$10.00 AUD</td>
                  <td><strong style={{ color: '#3A694B' }}>FREE</strong></td>
                </tr>
                <tr>
                  <td><strong>Australia Post Express Post</strong></td>
                  <td>1 – 2 Business Days</td>
                  <td>$15.00 AUD</td>
                  <td>$15.00 AUD</td>
                </tr>
                <tr>
                  <td><strong>International Delivery (NZ, UK, US)</strong></td>
                  <td>6 – 10 Business Days</td>
                  <td>$25.00 AUD</td>
                  <td>$25.00 AUD</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* 3 Pillars */}
        <div className="content-pillars-grid">
          <div className="content-pillar-card">
            <Clock size={22} className="pillar-icon" />
            <h4>Same-Day Dispatch</h4>
            <p>
              Orders placed before 2:00 PM AEST on business days dispatch same day from our Melbourne distribution hub.
            </p>
          </div>

          <div className="content-pillar-card">
            <Leaf size={22} className="pillar-icon" />
            <h4>100% Carbon-Neutral</h4>
            <p>
              All domestic parcel deliveries via Australia Post are carbon-neutral, shipped in biodegradable mailer bags.
            </p>
          </div>

          <div className="content-pillar-card">
            <MapPin size={22} className="pillar-icon" />
            <h4>Hospital &amp; Ward Delivery</h4>
            <p>
              We deliver directly to hospital reception desks, staff break rooms, and medical practices across regional and metro Australia.
            </p>
          </div>
        </div>

        {/* FAQ note */}
        <section className="faq-snippet-box">
          <h3>Tracking Your Order</h3>
          <p>
            The moment your scrubs leave our Melbourne warehouse, you will receive an Australia Post tracking notification via email and SMS with live GPS updates and safe drop preferences.
          </p>
          <Link to="/pages/contact" className="btn-text">
            Have questions about an active order? Speak with concierge &rarr;
          </Link>
        </section>
      </div>
    </div>
  );
};

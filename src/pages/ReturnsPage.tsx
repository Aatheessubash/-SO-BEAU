import React from 'react';
import { Link } from 'react-router-dom';
import { RotateCcw, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';
import '../styles/pages/ContentPages.scss';

export const ReturnsPage: React.FC = () => {
  return (
    <div className="content-page animate-fade-in">
      <div className="content-hero-banner">
        <div className="container text-center">
          <span className="overline">Confidence in Every Shift</span>
          <h1>30-Day Australian Returns &amp; Exchanges</h1>
          <p className="hero-lead">
            We want you to feel confident, comfortable, and tailored on your shift. If the fit isn't perfect, we make exchanges effortless.
          </p>
        </div>
      </div>

      <div className="container content-body-container">
        {/* 3 Step Process */}
        <section className="guide-table-section">
          <h2>How to Exchange or Return Your Scrubs</h2>
          <div className="content-pillars-grid">
            <div className="content-pillar-card">
              <span className="step-tag">Step 01</span>
              <h4>Initiate Exchange</h4>
              <p>
                Email <strong>care@sobeau.com.au</strong> with your order reference (e.g. SB-AU-123456) and the replacement size or shade you require.
              </p>
            </div>

            <div className="content-pillar-card">
              <span className="step-tag">Step 02</span>
              <h4>Australia Post Label / QR</h4>
              <p>
                We email you an Australia Post prepaid return label or QR code. No printer needed — just show the barcode on your phone at any Australia Post branch.
              </p>
            </div>

            <div className="content-pillar-card">
              <span className="step-tag">Step 03</span>
              <h4>Prompt Replacement</h4>
              <p>
                The instant Australia Post scans your return parcel into their tracking network, your new replacement size is dispatched immediately from Melbourne.
              </p>
            </div>
          </div>
        </section>

        {/* Hygiene Guidelines */}
        <section className="how-to-measure-card">
          <div className="card-inner">
            <ShieldCheck size={28} className="ruler-icon" />
            <div>
              <h3>Hygiene &amp; Clinical Return Conditions</h3>
              <p>
                To safeguard clinical infection control standards across Australian healthcare environments, returned pieces must meet the following:
              </p>
              <ul className="guidelines-list">
                <li><CheckCircle2 size={16} /> Garments must be unwashed and unworn during clinical patient rounds (home try-on is encouraged).</li>
                <li><CheckCircle2 size={16} /> Original tags and interior labels intact.</li>
                <li><CheckCircle2 size={16} /> Free of hospital deodorant, perfume marks, animal hair, or biological fluids.</li>
              </ul>
              <div className="fit-tip">
                <span>
                  <strong>Size exchanges are 100% complimentary</strong> within Australia. For refunds, a flat $10 handling fee is deducted to cover return freight.
                </span>
              </div>
            </div>
          </div>
        </section>

        <div className="content-page-cta">
          <a href="mailto:care@sobeau.com.au?subject=Exchange%20Request" className="btn btn-primary">
            <span>Contact Concierge to Initiate Exchange</span>
            <ArrowRight size={16} />
          </a>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Ruler, Sparkles, Check, ArrowRight } from 'lucide-react';
import '../styles/pages/ContentPages.scss';

export const SizeGuidePage: React.FC = () => {
  const [unit, setUnit] = useState<'cm' | 'in'>('cm');

  return (
    <div className="content-page animate-fade-in">
      <div className="content-hero-banner">
        <div className="container text-center">
          <span className="overline">Shift Accuracy</span>
          <h1>Australian Sizing &amp; Measurement Guide</h1>
          <p className="hero-lead">
            Engineered to Australian sizing standards (AU 4 to AU 20) with our proprietary BeauTech™ 4-way stretch weave.
          </p>
        </div>
      </div>

      <div className="container content-body-container">
        {/* Unit Toggle */}
        <div className="unit-toggle-bar">
          <span>Display measurements in:</span>
          <div className="toggle-group">
            <button
              className={`toggle-btn ${unit === 'cm' ? 'active' : ''}`}
              onClick={() => setUnit('cm')}
            >
              Centimetres (CM)
            </button>
            <button
              className={`toggle-btn ${unit === 'in' ? 'active' : ''}`}
              onClick={() => setUnit('in')}
            >
              Inches (IN)
            </button>
          </div>
        </div>

        {/* Section 1: Tops */}
        <section className="guide-table-section">
          <h2>1. Scrub Tops, Jackets &amp; Modal Underscrubs</h2>
          <p className="table-intro">
            Tailored through the bust and waist with a contoured drop-tail curved hemline.
          </p>
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>SO BEAU Size</th>
                  <th>AU Standard</th>
                  <th>Bust / Chest ({unit})</th>
                  <th>Waist ({unit})</th>
                  <th>Body Length ({unit})</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>XXS</strong></td>
                  <td>AU 4 - 6</td>
                  <td>{unit === 'cm' ? '78 - 82' : '30.5 - 32.2'}</td>
                  <td>{unit === 'cm' ? '60 - 64' : '23.6 - 25.2'}</td>
                  <td>{unit === 'cm' ? '64' : '25.2'}</td>
                </tr>
                <tr>
                  <td><strong>XS</strong></td>
                  <td>AU 6 - 8</td>
                  <td>{unit === 'cm' ? '83 - 87' : '32.6 - 34.2'}</td>
                  <td>{unit === 'cm' ? '65 - 69' : '25.5 - 27.1'}</td>
                  <td>{unit === 'cm' ? '65.5' : '25.8'}</td>
                </tr>
                <tr>
                  <td><strong>S</strong></td>
                  <td>AU 8 - 10</td>
                  <td>{unit === 'cm' ? '88 - 93' : '34.6 - 36.6'}</td>
                  <td>{unit === 'cm' ? '70 - 75' : '27.5 - 29.5'}</td>
                  <td>{unit === 'cm' ? '67' : '26.4'}</td>
                </tr>
                <tr>
                  <td><strong>M</strong></td>
                  <td>AU 12 - 14</td>
                  <td>{unit === 'cm' ? '94 - 100' : '37.0 - 39.3'}</td>
                  <td>{unit === 'cm' ? '76 - 82' : '29.9 - 32.2'}</td>
                  <td>{unit === 'cm' ? '69' : '27.1'}</td>
                </tr>
                <tr>
                  <td><strong>L</strong></td>
                  <td>AU 14 - 16</td>
                  <td>{unit === 'cm' ? '101 - 108' : '39.7 - 42.5'}</td>
                  <td>{unit === 'cm' ? '83 - 90' : '32.6 - 35.4'}</td>
                  <td>{unit === 'cm' ? '71' : '27.9'}</td>
                </tr>
                <tr>
                  <td><strong>XL</strong></td>
                  <td>AU 16 - 18</td>
                  <td>{unit === 'cm' ? '109 - 116' : '42.9 - 45.6'}</td>
                  <td>{unit === 'cm' ? '91 - 98' : '35.8 - 38.5'}</td>
                  <td>{unit === 'cm' ? '73' : '28.7'}</td>
                </tr>
                <tr>
                  <td><strong>2XL</strong></td>
                  <td>AU 18 - 20</td>
                  <td>{unit === 'cm' ? '117 - 125' : '46.0 - 49.2'}</td>
                  <td>{unit === 'cm' ? '99 - 107' : '38.9 - 42.1'}</td>
                  <td>{unit === 'cm' ? '75' : '29.5'}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 2: Pants */}
        <section className="guide-table-section">
          <h2>2. High-Waist Joggers &amp; Straight-Leg Scrub Pants</h2>
          <p className="table-intro">
            Featuring non-slip compressive yoga waistbands and custom 4-way stretch ankle cuffs.
          </p>
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>SO BEAU Size</th>
                  <th>AU Standard</th>
                  <th>Natural Waist ({unit})</th>
                  <th>Hip Fullest ({unit})</th>
                  <th>Jogger Inseam ({unit})</th>
                  <th>Straight Leg Inseam ({unit})</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>XXS</strong></td>
                  <td>AU 4 - 6</td>
                  <td>{unit === 'cm' ? '60 - 64' : '23.6 - 25.2'}</td>
                  <td>{unit === 'cm' ? '86 - 90' : '33.8 - 35.4'}</td>
                  <td>{unit === 'cm' ? '72' : '28.3'}</td>
                  <td>{unit === 'cm' ? '78' : '30.7'}</td>
                </tr>
                <tr>
                  <td><strong>XS</strong></td>
                  <td>AU 6 - 8</td>
                  <td>{unit === 'cm' ? '65 - 69' : '25.5 - 27.1'}</td>
                  <td>{unit === 'cm' ? '91 - 95' : '35.8 - 37.4'}</td>
                  <td>{unit === 'cm' ? '72.5' : '28.5'}</td>
                  <td>{unit === 'cm' ? '78.5' : '30.9'}</td>
                </tr>
                <tr>
                  <td><strong>S</strong></td>
                  <td>AU 8 - 10</td>
                  <td>{unit === 'cm' ? '70 - 75' : '27.5 - 29.5'}</td>
                  <td>{unit === 'cm' ? '96 - 101' : '37.7 - 39.7'}</td>
                  <td>{unit === 'cm' ? '73' : '28.7'}</td>
                  <td>{unit === 'cm' ? '79' : '31.1'}</td>
                </tr>
                <tr>
                  <td><strong>M</strong></td>
                  <td>AU 12 - 14</td>
                  <td>{unit === 'cm' ? '76 - 82' : '29.9 - 32.2'}</td>
                  <td>{unit === 'cm' ? '102 - 108' : '40.1 - 42.5'}</td>
                  <td>{unit === 'cm' ? '73.5' : '28.9'}</td>
                  <td>{unit === 'cm' ? '79.5' : '31.3'}</td>
                </tr>
                <tr>
                  <td><strong>L</strong></td>
                  <td>AU 14 - 16</td>
                  <td>{unit === 'cm' ? '83 - 90' : '32.6 - 35.4'}</td>
                  <td>{unit === 'cm' ? '109 - 116' : '42.9 - 45.6'}</td>
                  <td>{unit === 'cm' ? '74' : '29.1'}</td>
                  <td>{unit === 'cm' ? '80' : '31.5'}</td>
                </tr>
                <tr>
                  <td><strong>XL</strong></td>
                  <td>AU 16 - 18</td>
                  <td>{unit === 'cm' ? '91 - 98' : '35.8 - 38.5'}</td>
                  <td>{unit === 'cm' ? '117 - 124' : '46.0 - 48.8'}</td>
                  <td>{unit === 'cm' ? '74.5' : '29.3'}</td>
                  <td>{unit === 'cm' ? '80.5' : '31.7'}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* How to Measure Guidance */}
        <section className="how-to-measure-card">
          <div className="card-inner">
            <Ruler size={24} className="ruler-icon" />
            <div>
              <h3>How to Measure in 3 Easy Steps</h3>
              <p>
                <strong>1. Bust / Chest:</strong> Measure under arms around the fullest part of your bust, keeping tape horizontal.<br />
                <strong>2. Natural Waist:</strong> Measure around the narrowest part of your torso (typically 2cm above navel).<br />
                <strong>3. Hip:</strong> Stand with feet together and measure around the fullest point of your hips and seat.
              </p>
              <div className="fit-tip">
                <Sparkles size={14} />
                <span>
                  <strong>Between sizes?</strong> Our 4-way stretch weave offers generous mechanical give. For a streamlined runway silhouette, pick your smaller size; for relaxed drape over modal underscrubs, select one size up.
                </span>
              </div>
            </div>
          </div>
        </section>

        <div className="content-page-cta">
          <Link to="/collections/scrubs" className="btn btn-primary">
            <span>Shop Your Fit in Scrubs</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
};

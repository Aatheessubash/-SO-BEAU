import React, { useState } from 'react';
import { X, Ruler } from 'lucide-react';
import '../../styles/components/SizeGuideModal.scss';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SizeGuideModal: React.FC<SizeGuideModalProps> = ({ isOpen, onClose }) => {
  const [unit, setUnit] = useState<'cm' | 'in'>('cm');
  const [activeTab, setActiveTab] = useState<'tops' | 'pants' | 'coats'>('tops');

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="size-guide-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="size-guide-header">
          <div className="title-row">
            <Ruler size={18} />
            <h3>Australian Sizing Guide</h3>
          </div>
          <button onClick={onClose} className="close-btn" aria-label="Close size guide">
            <X size={20} />
          </button>
        </div>

        <div className="size-guide-controls">
          <div className="tab-buttons">
            <button
              className={`tab-btn ${activeTab === 'tops' ? 'active' : ''}`}
              onClick={() => setActiveTab('tops')}
            >
              Scrub Tops & Underscrubs
            </button>
            <button
              className={`tab-btn ${activeTab === 'pants' ? 'active' : ''}`}
              onClick={() => setActiveTab('pants')}
            >
              Joggers & Pants
            </button>
            <button
              className={`tab-btn ${activeTab === 'coats' ? 'active' : ''}`}
              onClick={() => setActiveTab('coats')}
            >
              Lab Coats & Jackets
            </button>
          </div>

          <div className="unit-toggle">
            <button
              className={`unit-btn ${unit === 'cm' ? 'active' : ''}`}
              onClick={() => setUnit('cm')}
            >
              CM
            </button>
            <button
              className={`unit-btn ${unit === 'in' ? 'active' : ''}`}
              onClick={() => setUnit('in')}
            >
              IN
            </button>
          </div>
        </div>

        <div className="size-table-container">
          {activeTab === 'tops' && (
            <table className="size-table">
              <thead>
                <tr>
                  <th>SO BEAU Size</th>
                  <th>AU Standard</th>
                  <th>Bust / Chest ({unit})</th>
                  <th>Waist ({unit})</th>
                  <th>Length ({unit})</th>
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
          )}

          {activeTab === 'pants' && (
            <table className="size-table">
              <thead>
                <tr>
                  <th>SO BEAU Size</th>
                  <th>AU Standard</th>
                  <th>Natural Waist ({unit})</th>
                  <th>Hips ({unit})</th>
                  <th>Jogger Inseam ({unit})</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>XXS</strong></td>
                  <td>AU 4 - 6</td>
                  <td>{unit === 'cm' ? '60 - 64' : '23.6 - 25.2'}</td>
                  <td>{unit === 'cm' ? '86 - 90' : '33.8 - 35.4'}</td>
                  <td>{unit === 'cm' ? '72' : '28.3'}</td>
                </tr>
                <tr>
                  <td><strong>XS</strong></td>
                  <td>AU 6 - 8</td>
                  <td>{unit === 'cm' ? '65 - 69' : '25.5 - 27.1'}</td>
                  <td>{unit === 'cm' ? '91 - 95' : '35.8 - 37.4'}</td>
                  <td>{unit === 'cm' ? '72.5' : '28.5'}</td>
                </tr>
                <tr>
                  <td><strong>S</strong></td>
                  <td>AU 8 - 10</td>
                  <td>{unit === 'cm' ? '70 - 75' : '27.5 - 29.5'}</td>
                  <td>{unit === 'cm' ? '96 - 101' : '37.7 - 39.7'}</td>
                  <td>{unit === 'cm' ? '73' : '28.7'}</td>
                </tr>
                <tr>
                  <td><strong>M</strong></td>
                  <td>AU 12 - 14</td>
                  <td>{unit === 'cm' ? '76 - 82' : '29.9 - 32.2'}</td>
                  <td>{unit === 'cm' ? '102 - 108' : '40.1 - 42.5'}</td>
                  <td>{unit === 'cm' ? '73.5' : '28.9'}</td>
                </tr>
                <tr>
                  <td><strong>L</strong></td>
                  <td>AU 14 - 16</td>
                  <td>{unit === 'cm' ? '83 - 90' : '32.6 - 35.4'}</td>
                  <td>{unit === 'cm' ? '109 - 116' : '42.9 - 45.6'}</td>
                  <td>{unit === 'cm' ? '74' : '29.1'}</td>
                </tr>
                <tr>
                  <td><strong>XL</strong></td>
                  <td>AU 16 - 18</td>
                  <td>{unit === 'cm' ? '91 - 98' : '35.8 - 38.5'}</td>
                  <td>{unit === 'cm' ? '117 - 124' : '46.0 - 48.8'}</td>
                  <td>{unit === 'cm' ? '74.5' : '29.3'}</td>
                </tr>
              </tbody>
            </table>
          )}

          {activeTab === 'coats' && (
            <table className="size-table">
              <thead>
                <tr>
                  <th>Size</th>
                  <th>AU Size</th>
                  <th>Chest ({unit})</th>
                  <th>Sleeve ({unit})</th>
                  <th>Coat Length ({unit})</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>XS</strong></td>
                  <td>AU 6 - 8</td>
                  <td>{unit === 'cm' ? '86 - 90' : '33.8 - 35.4'}</td>
                  <td>{unit === 'cm' ? '60' : '23.6'}</td>
                  <td>{unit === 'cm' ? '88' : '34.6'}</td>
                </tr>
                <tr>
                  <td><strong>S</strong></td>
                  <td>AU 8 - 10</td>
                  <td>{unit === 'cm' ? '91 - 96' : '35.8 - 37.7'}</td>
                  <td>{unit === 'cm' ? '61.5' : '24.2'}</td>
                  <td>{unit === 'cm' ? '90' : '35.4'}</td>
                </tr>
                <tr>
                  <td><strong>M</strong></td>
                  <td>AU 12 - 14</td>
                  <td>{unit === 'cm' ? '97 - 103' : '38.1 - 40.5'}</td>
                  <td>{unit === 'cm' ? '63' : '24.8'}</td>
                  <td>{unit === 'cm' ? '92' : '36.2'}</td>
                </tr>
                <tr>
                  <td><strong>L</strong></td>
                  <td>AU 14 - 16</td>
                  <td>{unit === 'cm' ? '104 - 111' : '40.9 - 43.7'}</td>
                  <td>{unit === 'cm' ? '64.5' : '25.3'}</td>
                  <td>{unit === 'cm' ? '94' : '37.0'}</td>
                </tr>
              </tbody>
            </table>
          )}
        </div>

        <div className="size-guide-footer-note">
          <h4>How to Measure for Shift Comfort</h4>
          <p>
            <strong>Bust/Chest:</strong> Measure across the fullest part of your chest with tape parallel to the floor.<br />
            <strong>Waist:</strong> Measure around your natural waistline, where you bend side to side.<br />
            <strong>Between Sizes?</strong> Our proprietary BeauTech™ 4-way stretch fabric provides generous ease. If you prefer a tailored couture silhouette, select your true size. For a more relaxed, draped hospital fit or layering over our modal underscrubs, size up.
          </p>
        </div>
      </div>
    </div>
  );
};

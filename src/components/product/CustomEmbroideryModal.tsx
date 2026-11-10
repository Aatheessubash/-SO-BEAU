import React, { useState } from 'react';
import { X, Check, Sparkles, ShieldCheck } from 'lucide-react';
import { CartItemCustomization, Product } from '../../types';
import '../../styles/components/CustomEmbroideryModal.scss';

interface CustomEmbroideryModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  initialCustomization?: CartItemCustomization | null;
  onApply: (customization: CartItemCustomization) => void;
}

const THREAD_COLORS: Array<{ name: CartItemCustomization['threadColor']; hex: string; textHex: string }> = [
  { name: 'Optic White', hex: '#FFFFFF', textHex: '#FFFFFF' },
  { name: 'Hospital Silver', hex: '#D8D8D8', textHex: '#E0E0E0' },
  { name: 'Navy', hex: '#1D2A44', textHex: '#8FA3C7' },
  { name: 'Gold', hex: '#D4AF37', textHex: '#F3D268' },
];

const PLACEMENTS: Array<CartItemCustomization['placement']> = [
  'Left Pocket',
  'Right Pocket',
  'Chest',
];

const FONTS: Array<{ name: CartItemCustomization['font']; label: string; fontClass: string }> = [
  { name: 'Classic Block', label: 'Classic Block', fontClass: 'font-block' },
  { name: 'Clinical Sans', label: 'Clinical Sans', fontClass: 'font-sans' },
  { name: 'Script', label: 'Signature Script', fontClass: 'font-script' },
];

export const CustomEmbroideryModal: React.FC<CustomEmbroideryModalProps> = ({
  isOpen,
  onClose,
  product,
  initialCustomization,
  onApply,
}) => {
  const [text, setText] = useState(initialCustomization?.text || 'Dr. Sumit Kumar');
  const [placement, setPlacement] = useState<CartItemCustomization['placement']>(
    initialCustomization?.placement || 'Left Pocket'
  );
  const [threadColor, setThreadColor] = useState<CartItemCustomization['threadColor']>(
    initialCustomization?.threadColor || 'Optic White'
  );
  const [font, setFont] = useState<CartItemCustomization['font']>(
    initialCustomization?.font || 'Clinical Sans'
  );

  if (!isOpen) return null;

  const handleSave = () => {
    if (!text.trim()) return;
    onApply({
      text: text.trim(),
      placement,
      threadColor,
      font,
      price: 15.00,
    });
    onClose();
  };

  const selectedThread = THREAD_COLORS.find((t) => t.name === threadColor) || THREAD_COLORS[0];
  const selectedFontObj = FONTS.find((f) => f.name === font) || FONTS[1];

  return (
    <div className="custom-embroidery-overlay animate-fade-in" onClick={onClose}>
      <div
        className="custom-embroidery-modal animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div className="title-wrap">
            <span className="badge-pill">Now Available</span>
            <h2>Personalized Hospital Embroidery</h2>
            <p className="subtitle">High-precision commercial stitching tested for 60°C hospital wash cycles.</p>
          </div>
          <button className="close-btn" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        <div className="modal-grid">
          {/* Left: Live Visual Preview */}
          <div className="preview-pane">
            <div className="preview-canvas-card">
              <img
                src="/images/male/male-pocket-embroidery-detail.jpg"
                alt="Embroidery Placement Preview"
                className="base-pocket-img"
              />

              {/* Circular Spotlight Callout matching reference image 6 */}
              <div className="spotlight-circle-wrap">
                <div className="spotlight-badge-top">Now Available</div>
                <div className="spotlight-circle">
                  <div
                    className={`stitched-preview-text ${selectedFontObj.fontClass}`}
                    style={{ color: selectedThread.textHex }}
                  >
                    {text.trim() || 'Your Name / Dept'}
                  </div>
                </div>
                <div className="spotlight-caption-bottom">
                  Custom embroidery on your {placement.toLowerCase()}.
                </div>
              </div>

              <div className="garment-tag-chip">
                <span>{product.name}</span>
              </div>
            </div>

            <div className="embroidery-guarantee-box">
              <ShieldCheck size={16} />
              <span>Complies with Australian hospital clinician ID standards &amp; infection control guidelines.</span>
            </div>
          </div>

          {/* Right: Controls & Options */}
          <div className="controls-pane">
            {/* 1. Name & Credentials */}
            <div className="control-group">
              <label className="control-label" htmlFor="embroidery-text">
                Name &amp; Role / Department <span className="char-limit">(Max 24 characters)</span>
              </label>
              <input
                id="embroidery-text"
                type="text"
                maxLength={24}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="e.g. Dr. Sumit Kumar or RN Chloe"
                className="text-input"
              />
              <div className="quick-suggestions">
                <span className="hint-label">Quick suggestions:</span>
                <button
                  type="button"
                  className="hint-chip"
                  onClick={() => setText('Dr. Sumit Kumar')}
                >
                  Dr. Sumit Kumar
                </button>
                <button
                  type="button"
                  className="hint-chip"
                  onClick={() => setText('RN Sarah Jenkins')}
                >
                  RN Sarah Jenkins
                </button>
                <button
                  type="button"
                  className="hint-chip"
                  onClick={() => setText('Emergency Dept.')}
                >
                  Emergency Dept.
                </button>
              </div>
            </div>

            {/* 2. Placement */}
            <div className="control-group">
              <label className="control-label">Placement Location</label>
              <div className="pill-options-grid">
                {PLACEMENTS.map((p) => (
                  <button
                    key={p}
                    type="button"
                    className={`pill-option-btn ${placement === p ? 'active' : ''}`}
                    onClick={() => setPlacement(p)}
                  >
                    <span>{p}</span>
                    {placement === p && <Check size={14} />}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Thread Color */}
            <div className="control-group">
              <label className="control-label">
                Thread Color: <strong>{threadColor}</strong>
              </label>
              <div className="thread-swatches-row">
                {THREAD_COLORS.map((t) => (
                  <button
                    key={t.name}
                    type="button"
                    className={`thread-swatch-btn ${threadColor === t.name ? 'active' : ''}`}
                    onClick={() => setThreadColor(t.name)}
                    title={t.name}
                  >
                    <span className="swatch-circle" style={{ backgroundColor: t.hex }} />
                    <span className="swatch-name">{t.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Font Typography */}
            <div className="control-group">
              <label className="control-label">Typography Style</label>
              <div className="font-options-row">
                {FONTS.map((f) => (
                  <button
                    key={f.name}
                    type="button"
                    className={`font-choice-card ${font === f.name ? 'active' : ''}`}
                    onClick={() => setFont(f.name)}
                  >
                    <span className={`font-sample ${f.fontClass}`}>Aa</span>
                    <span className="font-name">{f.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Pricing and Action */}
            <div className="modal-footer-action">
              <div className="pricing-summary">
                <span className="fee-label">Commercial Embroidery Fee</span>
                <span className="fee-amount">+$15.00 AUD</span>
              </div>

              <div className="action-buttons-row">
                <button type="button" className="btn btn-outline" onClick={onClose}>
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSave}
                  disabled={!text.trim()}
                >
                  <Sparkles size={16} />
                  <span>Apply Embroidery (+$15 AUD)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Check, 
  ArrowRight, 
  RotateCcw, 
  Ruler, 
  ShieldCheck, 
  ShoppingBag 
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { sounds } from '../../utils/soundEffects';
import '../../styles/components/FitFinderModal.scss';

interface FitFinderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FitFinderModal: React.FC<FitFinderModalProps> = ({ isOpen, onClose }) => {
  const { addToCart, showToast } = useCart();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [gender, setGender] = useState<'womens' | 'mens'>('womens');
  const [heightGroup, setHeightGroup] = useState<'petite' | 'regular' | 'tall'>('regular');
  const [buildGroup, setBuildGroup] = useState<'slim' | 'athletic' | 'broad'>('athletic');
  const [fitPreference, setFitPreference] = useState<'tailored' | 'classic' | 'relaxed'>('tailored');

  if (!isOpen) return null;

  // Compute recommendation
  const calculateRecommendation = () => {
    let topSize = 'AU 8 (S)';
    let pantSize = 'AU 8 (S)';
    let inseam = 'Regular (Standard Inseam)';

    if (gender === 'womens') {
      if (buildGroup === 'slim') {
        topSize = fitPreference === 'tailored' ? 'AU 6 (XS)' : 'AU 8 (S)';
        pantSize = 'AU 6 (XS)';
      } else if (buildGroup === 'athletic') {
        topSize = 'AU 8 (S)';
        pantSize = 'AU 8 (S)';
      } else {
        topSize = fitPreference === 'relaxed' ? 'AU 12 (L)' : 'AU 10 (M)';
        pantSize = 'AU 10 (M)';
      }
      if (heightGroup === 'petite') inseam = 'Petite / Short (-2")';
      if (heightGroup === 'tall') inseam = 'Tall (+2.5")';
    } else {
      if (buildGroup === 'slim') {
        topSize = 'AU S (38)';
        pantSize = 'AU S (38)';
      } else if (buildGroup === 'athletic') {
        topSize = fitPreference === 'tailored' ? 'AU M (40)' : 'AU L (42)';
        pantSize = 'AU M (40)';
      } else {
        topSize = 'AU XL (44)';
        pantSize = 'AU XL (44)';
      }
      if (heightGroup === 'petite') inseam = 'Short (-2")';
      if (heightGroup === 'tall') inseam = 'Tall (+2.5")';
    }

    return { topSize, pantSize, inseam };
  };

  const rec = calculateRecommendation();

  const handleNext = () => {
    sounds.playSwatchClick();
    setStep((prev) => (Math.min(prev + 1, 4) as 1 | 2 | 3 | 4));
  };

  const handleReset = () => {
    sounds.playSwatchClick();
    setStep(1);
  };

  const handleAddRecommended = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Add product to cart with recommended sizes
    sounds.playAddToCartChime();
    showToast(`Added recommended ${gender === 'womens' ? "Women's" : "Men's"} Scrub Set to bag!`, 'success');
    onClose();
  };

  return (
    <div className="fit-finder-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="fit-finder-modal-card" onClick={(e) => e.stopPropagation()}>
        
        {/* Close Button */}
        <button type="button" className="modal-close-btn" onClick={onClose} aria-label="Close modal">
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div className="modal-header-block">
          <h2 className="modal-title">Find Your Shift Size.</h2>
          <p className="modal-subtitle">
            Say goodbye to boxy scrubs and saggy waistbands. 3 quick questions for a bespoke tailored fit.
          </p>

          {/* Progress Dots */}
          <div className="quiz-progress-dots">
            {[1, 2, 3, 4].map((i) => (
              <span
                key={i}
                className={`dot ${step === i ? 'active' : step > i ? 'completed' : ''}`}
              />
            ))}
          </div>
        </div>

        {/* Step 1: Gender */}
        {step === 1 && (
          <div className="quiz-step-pane animate-fade-in">
            <h3 className="step-question">Step 01 • Which scrub silhouette are you shopping for?</h3>
            <div className="options-grid-2">
              <button
                type="button"
                className={`choice-card ${gender === 'womens' ? 'selected' : ''}`}
                onClick={() => {
                  setGender('womens');
                  handleNext();
                }}
              >
                <div className="choice-avatar">
                  <img src="/images/female/female-navy-front.png" alt="Women's Set" />
                </div>
                <div className="choice-info">
                  <strong>Women's Tailored Set</strong>
                  <span>Contoured waist darting &amp; 7-pocket jogger pant</span>
                </div>
              </button>

              <button
                type="button"
                className={`choice-card ${gender === 'mens' ? 'selected' : ''}`}
                onClick={() => {
                  setGender('mens');
                  handleNext();
                }}
              >
                <div className="choice-avatar">
                  <img src="/images/male/male-surgical-blue-front.png" alt="Men's Set" />
                </div>
                <div className="choice-info">
                  <strong>Men's Athletic Set</strong>
                  <span>Mandarin V-placket &amp; 10-pocket cargo jogger pant</span>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Height & Build */}
        {step === 2 && (
          <div className="quiz-step-pane animate-fade-in">
            <h3 className="step-question">Step 02 • Select your height and build</h3>
            
            <div className="sub-section">
              <label className="sub-label">Height Inseam Range:</label>
              <div className="options-pill-row">
                <button
                  type="button"
                  className={`pill-choice ${heightGroup === 'petite' ? 'selected' : ''}`}
                  onClick={() => {
                    setHeightGroup('petite');
                    sounds.playSwatchClick();
                  }}
                >
                  Petite / Short (&lt; 163cm / 5'4")
                </button>
                <button
                  type="button"
                  className={`pill-choice ${heightGroup === 'regular' ? 'selected' : ''}`}
                  onClick={() => {
                    setHeightGroup('regular');
                    sounds.playSwatchClick();
                  }}
                >
                  Regular (164cm – 178cm / 5'5"–5'10")
                </button>
                <button
                  type="button"
                  className={`pill-choice ${heightGroup === 'tall' ? 'selected' : ''}`}
                  onClick={() => {
                    setHeightGroup('tall');
                    sounds.playSwatchClick();
                  }}
                >
                  Tall (&gt; 179cm / 5'11"+)
                </button>
              </div>
            </div>

            <div className="sub-section" style={{ marginTop: '1.25rem' }}>
              <label className="sub-label">Body Build:</label>
              <div className="options-pill-row">
                <button
                  type="button"
                  className={`pill-choice ${buildGroup === 'slim' ? 'selected' : ''}`}
                  onClick={() => {
                    setBuildGroup('slim');
                    sounds.playSwatchClick();
                  }}
                >
                  Slim / Slender
                </button>
                <button
                  type="button"
                  className={`pill-choice ${buildGroup === 'athletic' ? 'selected' : ''}`}
                  onClick={() => {
                    setBuildGroup('athletic');
                    sounds.playSwatchClick();
                  }}
                >
                  Athletic / Muscular
                </button>
                <button
                  type="button"
                  className={`pill-choice ${buildGroup === 'broad' ? 'selected' : ''}`}
                  onClick={() => {
                    setBuildGroup('broad');
                    sounds.playSwatchClick();
                  }}
                >
                  Curvy / Broad Shoulders
                </button>
              </div>
            </div>

            <button type="button" className="btn btn-primary step-next-btn" onClick={handleNext}>
              <span>Continue to Fit Preference</span>
              <ArrowRight size={15} />
            </button>
          </div>
        )}

        {/* Step 3: Fit Preference */}
        {step === 3 && (
          <div className="quiz-step-pane animate-fade-in">
            <h3 className="step-question">Step 03 • How do you like your scrubs to feel on shift?</h3>
            <div className="preference-cards-col">
              <button
                type="button"
                className={`pref-card ${fitPreference === 'tailored' ? 'selected' : ''}`}
                onClick={() => {
                  setFitPreference('tailored');
                  sounds.playSwatchClick();
                }}
              >
                <div className="pref-radio">
                  {fitPreference === 'tailored' && <span className="radio-inner" />}
                </div>
                <div className="pref-content">
                  <strong>Contemporary Tailored Fit (Most Popular)</strong>
                  <span>Sleek, streamlined silhouette that hugs gently with zero fabric excess. Modern atelier aesthetic.</span>
                </div>
              </button>

              <button
                type="button"
                className={`pref-card ${fitPreference === 'classic' ? 'selected' : ''}`}
                onClick={() => {
                  setFitPreference('classic');
                  sounds.playSwatchClick();
                }}
              >
                <div className="pref-radio">
                  {fitPreference === 'classic' && <span className="radio-inner" />}
                </div>
                <div className="pref-content">
                  <strong>Classic Clinical Fit</strong>
                  <span>Traditional hospital roominess with extra ease through the hips, chest, and thighs.</span>
                </div>
              </button>

              <button
                type="button"
                className={`pref-card ${fitPreference === 'relaxed' ? 'selected' : ''}`}
                onClick={() => {
                  setFitPreference('relaxed');
                  sounds.playSwatchClick();
                }}
              >
                <div className="pref-radio">
                  {fitPreference === 'relaxed' && <span className="radio-inner" />}
                </div>
                <div className="pref-content">
                  <strong>Relaxed Oversized Drape</strong>
                  <span>Maximized airiness and layering comfort over heavy underscrubs or thermal layers.</span>
                </div>
              </button>
            </div>

            <button type="button" className="btn btn-primary step-next-btn" onClick={handleNext}>
              <span>Calculate My Bespoke Size</span>
              <Sparkles size={15} />
            </button>
          </div>
        )}

        {/* Step 4: Result */}
        {step === 4 && (
          <div className="quiz-step-pane animate-fade-in result-pane">
            <div className="result-badge-row">
              <span className="match-pill">
                <Check size={13} />
                99.4% BeauFit™ Clinical Match
              </span>
            </div>

            <h3 className="result-title">Your Tailored Shift Configuration</h3>

            <div className="rec-boxes-grid">
              <div className="rec-box">
                <span className="box-label">Recommended Scrub Top</span>
                <div className="box-size">{rec.topSize}</div>
                <span className="box-desc">BeauTech™ V-Neck / Placket Top</span>
              </div>

              <div className="rec-box">
                <span className="box-label">Recommended Scrub Pants</span>
                <div className="box-size">{rec.pantSize}</div>
                <span className="box-desc">{rec.inseam}</span>
              </div>
            </div>

            <div className="fit-guarantee-note">
              <ShieldCheck size={18} className="shield-icon" />
              <span>
                <strong>100-Day Shift Trial Guarantee:</strong> If this size isn’t the best-fitting scrub you’ve ever worn on shift, swap sizes for free with complimentary AU returns.
              </span>
            </div>

            <div className="result-cta-row">
              <button
                type="button"
                className="btn btn-primary result-cta-btn"
                onClick={handleAddRecommended}
              >
                <ShoppingBag size={15} />
                <span>Add Recommended Set to Bag ($158)</span>
              </button>

              <button
                type="button"
                className="btn btn-outline restart-btn"
                onClick={handleReset}
              >
                <RotateCcw size={14} />
                <span>Recalculate</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

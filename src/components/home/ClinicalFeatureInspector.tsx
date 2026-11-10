import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Maximize2, 
  Smartphone, 
  Scissors, 
  Layers, 
  Activity, 
  Check, 
  ArrowRight,
  Info
} from 'lucide-react';
import { sounds } from '../../utils/soundEffects';
import '../../styles/components/ClinicalFeatureInspector.scss';

interface FeaturePin {
  id: string;
  name: string;
  category: string;
  topPct: number; // Y position in %
  leftPct: number; // X position in %
  specTag: string;
  headline: string;
  description: string;
  clinicalTest: string;
  image: string;
  gender: 'womens' | 'mens' | 'both';
}

const FEATURE_PINS: FeaturePin[] = [
  {
    id: 'collar-shears',
    name: 'Trauma Shears Slot & V-Placket',
    category: 'Chest Anatomy',
    topPct: 22,
    leftPct: 44,
    specTag: 'Reinforced 60-Weight Bar-Tack',
    headline: 'Quick-Draw Shears Slot & Badge Loop',
    description: 'Slanted reinforced chest slot keeps stainless trauma shears vertical against your chest with zero wobble during rapid CPR or patient transfers.',
    clinicalTest: 'Tested through 500+ trauma-bay rapid shears extractions.',
    image: '/images/male/male-pocket-embroidery-detail.jpg',
    gender: 'both',
  },
  {
    id: 'underarm-gusset',
    name: 'Silvadur™ Underarm Gusset',
    category: 'Thermoregulation',
    topPct: 32,
    leftPct: 32,
    specTag: 'Silver-Ion Micro-Shield',
    headline: '360° Reach With Zero Pull-Out',
    description: 'Proprietary ergonomic underarm gusset lets you reach top-shelf hospital supplies without pulling your scrub top out of your waistband.',
    clinicalTest: 'Rated 100% active antimicrobial defense across 14-hour ICU shifts.',
    image: '/images/female/female-fabric-tech.png',
    gender: 'both',
  },
  {
    id: 'smartphone-cargo',
    name: 'Hospital Smartphone Sleeve',
    category: 'Utility Storage',
    topPct: 54,
    leftPct: 36,
    specTag: 'Fits iPhone 16 Pro Max & Pager',
    headline: 'Anti-Swing Deep Thigh Cargo Pocket',
    description: 'Angled ergonomic pocket hugs your outer thigh. Secures heavy hospital smartphones, Vocera badges, and penlights without swinging against your knee.',
    clinicalTest: 'Zero smartphone drop-outs during emergency stairs sprints.',
    image: '/images/male/male-side-phone-pocket-detail.jpg',
    gender: 'both',
  },
  {
    id: 'ergonomic-waistband',
    name: 'High-Rise Non-Slip Drawcord',
    category: 'Waist Architecture',
    topPct: 43,
    leftPct: 52,
    specTag: 'Flat Anti-Dig Drawcord',
    headline: 'Anchors Firmly Across 300+ Squats',
    description: 'Ultra-soft compressive elastic waistband with flat woven drawcord. Stays anchored right at your natural waist without rolling over or digging in.',
    clinicalTest: 'Zero readjustments needed during 14 hours of patient lifts.',
    image: '/images/female/female-waist-badge-detail.jpg',
    gender: 'both',
  },
  {
    id: 'jogger-cuff',
    name: 'Reinforced 4-Way Recoil Jogger Cuffs',
    category: 'Lower Leg Anatomy',
    topPct: 86,
    leftPct: 46,
    specTag: 'BeauTech™ Recoil Knit',
    headline: 'Zero Floor Drag & Clean Clinical Drape',
    description: 'Tapered athletic ankle cuffs keep scrub pants well clear of hospital floors and fluids while pairing cleanly with clinical sneakers or clogs.',
    clinicalTest: 'Zero cuff fraying tested over 60 commercial autoclave washes.',
    image: '/images/female/female-pants-fit.jpg',
    gender: 'both',
  },
];

export const ClinicalFeatureInspector: React.FC = () => {
  const [selectedGender, setSelectedGender] = useState<'womens' | 'mens'>('womens');
  const [activePinId, setActivePinId] = useState<string>('collar-shears');

  const activePin = FEATURE_PINS.find((p) => p.id === activePinId) || FEATURE_PINS[0];

  const modelImage = selectedGender === 'womens'
    ? '/images/female/female-navy-front.png'
    : '/images/male/male-surgical-blue-front.png';

  const handlePinClick = (pinId: string) => {
    setActivePinId(pinId);
    sounds.playSwatchClick();
  };

  return (
    <section className="clinical-feature-inspector-section section-padding">
      <div className="container">
        
        {/* Header */}
        <div className="inspector-header text-center">
          <h2 className="inspector-title">
            Engineered Down to the Millimeter.
          </h2>
          <p className="inspector-subtitle">
            Every seam, pocket angle, and bar-tack on SO BEAU scrubs has a specific clinical reason. Tap any glowing pin to inspect the clinical blueprint.
          </p>

          {/* Model Switcher Toggle */}
          <div className="blueprint-gender-toggle">
            <button
              type="button"
              className={`toggle-btn ${selectedGender === 'womens' ? 'active' : ''}`}
              onClick={() => {
                setSelectedGender('womens');
                sounds.playSwatchClick();
              }}
            >
              Women's Set Blueprint
            </button>
            <button
              type="button"
              className={`toggle-btn ${selectedGender === 'mens' ? 'active' : ''}`}
              onClick={() => {
                setSelectedGender('mens');
                sounds.playSwatchClick();
              }}
            >
              Men's Set Blueprint
            </button>
          </div>
        </div>

        {/* Blueprint Interactive Stage */}
        <div className="blueprint-stage-grid">
          
          {/* Left: Interactive Model Canvas with Pulsing Hotspots */}
          <div className="blueprint-model-viewport">
            <div className="blueprint-grid-overlay" />
            
            {/* Model Cutout Image */}
            <div className="model-figure-container">
              <img
                src={modelImage}
                alt={`${selectedGender} scrub blueprint`}
                className="blueprint-model-img"
              />

              {/* Pulsing Hotspot Pins */}
              {FEATURE_PINS.map((pin, idx) => {
                const isActive = pin.id === activePinId;
                return (
                  <button
                    key={pin.id}
                    type="button"
                    className={`blueprint-pin ${isActive ? 'is-active' : ''}`}
                    style={{ top: `${pin.topPct}%`, left: `${pin.leftPct}%` }}
                    onClick={() => handlePinClick(pin.id)}
                    aria-label={`Inspect ${pin.name}`}
                    title={pin.name}
                  >
                    <span className="pin-pulse-ring" />
                    <span className="pin-core-dot">
                      {idx + 1}
                    </span>
                    <span className="pin-preview-tooltip">
                      {pin.name}
                    </span>
                  </button>
                );
              })}
            </div>
            
            <div className="blueprint-corner-tag">
              <span>FIG. 0{FEATURE_PINS.indexOf(activePin) + 1} • {activePin.category.toUpperCase()}</span>
            </div>
          </div>

          {/* Right: Detailed Feature Spotlight Card */}
          <div className="blueprint-detail-card">
            <div className="card-top-meta">
              <span className="meta-category">{activePin.category}</span>
              <span className="meta-spec">{activePin.specTag}</span>
            </div>

            <h3 className="detail-headline">{activePin.headline}</h3>
            <p className="detail-description">{activePin.description}</p>

            {/* Macro Detail Photo */}
            <div className="detail-photo-wrapper">
              <img
                src={activePin.image}
                alt={activePin.headline}
                className="detail-macro-img"
              />
              <div className="photo-lens-tag">
                <Maximize2 size={12} />
                <span>Macro Atelier Detail View</span>
              </div>
            </div>

            {/* Clinical Evidence Box */}
            <div className="clinical-evidence-box">
              <div className="evidence-icon">
                <ShieldCheck size={18} />
              </div>
              <div className="evidence-text">
                <strong>Hospital Field Validation:</strong>
                <span>{activePin.clinicalTest}</span>
              </div>
            </div>

            {/* Quick Hotspot Selectors */}
            <div className="hotspot-pills-selector">
              {FEATURE_PINS.map((pin, idx) => (
                <button
                  key={pin.id}
                  type="button"
                  className={`hotspot-selector-pill ${pin.id === activePinId ? 'active' : ''}`}
                  onClick={() => handlePinClick(pin.id)}
                >
                  <span>0{idx + 1}. {pin.name.split(' ')[0]}</span>
                </button>
              ))}
            </div>

            {/* Link to Shop Set */}
            <div className="detail-footer-link">
              <Link
                to={selectedGender === 'womens' ? '/products/the-womens-nursing-scrub-set' : '/products/the-mens-nursing-scrub-set'}
                className="btn btn-primary detail-cta-btn"
              >
                <span>Shop This {selectedGender === 'womens' ? "Women's" : "Men's"} Set ($148 AUD)</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

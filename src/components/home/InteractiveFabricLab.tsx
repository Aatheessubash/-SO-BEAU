import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  Droplets, 
  Activity, 
  ShieldCheck, 
  RotateCcw, 
  Wind, 
  ArrowRight, 
  CheckCircle2, 
  Play, 
  Clock, 
  Footprints,
  SlidersHorizontal
} from 'lucide-react';
import { sounds } from '../../utils/soundEffects';
import '../../styles/components/InteractiveFabricLab.scss';

interface ShiftPhase {
  hour: number;
  timeLabel: string;
  phaseName: string;
  department: string;
  steps: number;
  heartRate: number;
  sweatLevel: string;
  wrinkleState: string;
  note: string;
}

const SHIFT_PHASES: ShiftPhase[] = [
  {
    hour: 1,
    timeLabel: '07:00 AM',
    phaseName: 'Pre-Shift Handover',
    department: 'Acute Care Ward',
    steps: 1250,
    heartRate: 72,
    sweatLevel: 'Zero (Cold Morning)',
    wrinkleState: 'Crisp Atelier Ironed',
    note: 'Freshly stepped into ward. Contoured collar and clean drape establish instant clinical authority.',
  },
  {
    hour: 4,
    timeLabel: '11:00 AM',
    phaseName: 'Emergency Triage & Trauma',
    department: 'Emergency Department',
    steps: 5800,
    heartRate: 118,
    sweatLevel: 'Active Fluid Repellency',
    wrinkleState: 'Zero Creasing (99.9% Recoil)',
    note: 'Repeated patient transfers & IV line placements. BeauTech™ 4-way stretch flexes with zero armpit bind.',
  },
  {
    hour: 8,
    timeLabel: '03:00 PM',
    phaseName: 'Operating Theatre Block',
    department: 'Surgical Suite 3',
    steps: 10400,
    heartRate: 94,
    sweatLevel: 'High Breathability (142 CFM)',
    wrinkleState: 'Smooth Matte Finish',
    note: 'Under surgical lights for 3 hours. Breathable modal interior disperses heat and body moisture.',
  },
  {
    hour: 12,
    timeLabel: '07:00 PM',
    phaseName: 'Code Blue Resuscitation',
    department: 'ICU High Acuity',
    steps: 15200,
    heartRate: 135,
    sweatLevel: 'Antimicrobial Silver Defense Active',
    wrinkleState: 'Zero Knee Bagging',
    note: 'Chest compressions & rapid bedside reach. Silvadur™ silver ions continuously neutralize bacteria.',
  },
  {
    hour: 14,
    timeLabel: '09:00 PM',
    phaseName: 'Post-Shift Debrief & Sign-off',
    department: 'Clinicians Lounge',
    steps: 18450,
    heartRate: 78,
    sweatLevel: 'Dry & Fresh (Zero Odour)',
    wrinkleState: 'Looks Like Hour 01',
    note: '14 hours completed. Still looks immaculately tailored for post-shift coffee or commute home.',
  },
];

export const InteractiveFabricLab: React.FC = () => {
  // Current shift hour: 1 to 14
  const [currentHour, setCurrentHour] = useState<number>(8);
  
  // Active lab test tab
  const [activeTest, setActiveTest] = useState<'fluid' | 'stretch' | 'antimicrobial'>('fluid');
  
  // Interactive Fluid Test state
  const [fluidPoured, setFluidPoured] = useState<boolean>(false);
  const [fluidType, setFluidType] = useState<'saline' | 'blood' | 'coffee'>('saline');
  
  // Interactive Stretch Test state
  const [stretchLoad, setStretchLoad] = useState<number>(0);
  const [isBouncing, setIsBouncing] = useState<boolean>(false);

  // Find nearest shift phase
  const activePhase = SHIFT_PHASES.reduce((prev, curr) => 
    Math.abs(curr.hour - currentHour) < Math.abs(prev.hour - currentHour) ? curr : prev
  );

  const calculatedSteps = Math.round(1200 + (currentHour / 14) * 17250);

  const handleHourChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    setCurrentHour(val);
    sounds.playSliderTick();
  };

  const triggerFluidPour = (type: 'saline' | 'blood' | 'coffee') => {
    setFluidType(type);
    setFluidPoured(true);
    sounds.playSwatchClick();
    setTimeout(() => {
      setFluidPoured(false);
    }, 4000);
  };

  const triggerStretchRelease = () => {
    setIsBouncing(true);
    setStretchLoad(320);
    sounds.playSwatchClick();
    setTimeout(() => {
      setStretchLoad(0);
      setTimeout(() => setIsBouncing(false), 600);
    }, 800);
  };

  return (
    <section className="interactive-fabric-lab-section section-padding">
      <div className="container">
        
        {/* Editorial Section Header */}
        <div className="fabric-lab-header text-center">
          <span className="lab-badge">
            <Sparkles size={11} className="badge-sparkle" />
            AUSTRALIAN CLINICAL PERFORMANCE LAB
          </span>
          <h2 className="lab-main-title">
            The 14-Hour Shift Simulator.
          </h2>
          <p className="lab-subtitle">
            Most scrubs look fine for 2 hours. We engineered BeauTech™ to look and perform identically at Hour 14. Drag the shift timeline to inspect live clinical telemetry.
          </p>
        </div>

        {/* 1. Interactive 14-Hour Shift Telemetry Console */}
        <div className="shift-simulator-console">
          
          {/* Top Shift Phase Bar */}
          <div className="shift-phase-banner">
            <div className="phase-clock-group">
              <Clock size={16} className="clock-icon" />
              <span className="shift-hour-badge">Hour {currentHour < 10 ? `0${currentHour}` : currentHour} of 14</span>
              <span className="shift-wall-time">• {activePhase.timeLabel}</span>
            </div>
            
            <div className="phase-name-badge">
              <span className="live-pulse-dot" />
              <strong>{activePhase.phaseName}</strong>
              <span className="dept-tag">({activePhase.department})</span>
            </div>
          </div>

          {/* Large Interactive Scrub Slider */}
          <div className="shift-timeline-slider-wrap">
            <div className="timeline-milestones">
              {SHIFT_PHASES.map((phase) => (
                <button
                  key={phase.hour}
                  type="button"
                  className={`milestone-pill ${currentHour === phase.hour ? 'active' : ''}`}
                  onClick={() => {
                    setCurrentHour(phase.hour);
                    sounds.playSwatchClick();
                  }}
                >
                  <span className="milestone-time">{phase.timeLabel}</span>
                  <span className="milestone-name">{phase.phaseName.split(' ')[0]}</span>
                </button>
              ))}
            </div>

            <div className="slider-track-container">
              <input
                type="range"
                min={1}
                max={14}
                step={1}
                value={currentHour}
                onChange={handleHourChange}
                className="interactive-shift-slider"
                aria-label="Shift duration slider from 1 to 14 hours"
              />
              <div 
                className="slider-progress-fill" 
                style={{ width: `${((currentHour - 1) / 13) * 100}%` }}
              />
            </div>
            
            <div className="slider-hints-row">
              <span>Hour 01 • Fresh Handover</span>
              <span className="mid-hint">Hour 07 • Mid-Shift Peak</span>
              <span>Hour 14 • Sign-off</span>
            </div>
          </div>

          {/* Real-time Telemetry Metric Cards */}
          <div className="telemetry-grid">
            <div className="telemetry-card">
              <div className="card-top">
                <Footprints size={18} className="metric-icon" />
                <span className="metric-label">Hospital Steps</span>
              </div>
              <div className="metric-value">{calculatedSteps.toLocaleString()}</div>
              <div className="metric-caption">Non-stop clinical ward movement</div>
            </div>

            <div className="telemetry-card">
              <div className="card-top">
                <Activity size={18} className="metric-icon" />
                <span className="metric-label">Elastic Recoil</span>
              </div>
              <div className="metric-value">99.8%</div>
              <div className="metric-caption">BeauTech™ 4-way zero knee bagging</div>
            </div>

            <div className="telemetry-card">
              <div className="card-top">
                <ShieldCheck size={18} className="metric-icon" />
                <span className="metric-label">Silvadur™ Defense</span>
              </div>
              <div className="metric-value highlight-gold">100% Active</div>
              <div className="metric-caption">Continuous silver-ion odor barrier</div>
            </div>

            <div className="telemetry-card">
              <div className="card-top">
                <Wind size={18} className="metric-icon" />
                <span className="metric-label">Airflow Index</span>
              </div>
              <div className="metric-value">142 CFM</div>
              <div className="metric-caption">Micro-venting heat dispersion</div>
            </div>
          </div>

          {/* Clinical Shift Observation Note */}
          <div className="shift-clinical-note">
            <div className="note-avatar">
              <CheckCircle2 size={16} className="note-check" />
            </div>
            <div className="note-content">
              <strong>Ward Observation: </strong>
              <span>{activePhase.note}</span>
            </div>
          </div>
        </div>

        {/* 2. Interactive Stress Testing Bench */}
        <div className="fabric-stress-bench">
          <div className="bench-header-row">
            <div className="bench-title-block">
              <span className="bench-tag">
                <SlidersHorizontal size={13} style={{ display: 'inline', marginRight: 6 }} />
                INTERACTIVE FABRIC TESTING RIG
              </span>
              <h3 className="bench-title">Simulate Real Hospital Stress Tests.</h3>
            </div>

            {/* Test Selector Tabs */}
            <div className="bench-tab-pills" role="tablist">
              <button
                type="button"
                role="tab"
                aria-selected={activeTest === 'fluid'}
                className={`bench-tab-btn ${activeTest === 'fluid' ? 'active' : ''}`}
                onClick={() => {
                  setActiveTest('fluid');
                  sounds.playSwatchClick();
                }}
              >
                <Droplets size={14} />
                <span>Fluid Barrier</span>
              </button>
              
              <button
                type="button"
                role="tab"
                aria-selected={activeTest === 'stretch'}
                className={`bench-tab-btn ${activeTest === 'stretch' ? 'active' : ''}`}
                onClick={() => {
                  setActiveTest('stretch');
                  sounds.playSwatchClick();
                }}
              >
                <Activity size={14} />
                <span>360° Recoil Stretch</span>
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={activeTest === 'antimicrobial'}
                className={`bench-tab-btn ${activeTest === 'antimicrobial' ? 'active' : ''}`}
                onClick={() => {
                  setActiveTest('antimicrobial');
                  sounds.playSwatchClick();
                }}
              >
                <ShieldCheck size={14} />
                <span>Silvadur™ Ions</span>
              </button>
            </div>
          </div>

          {/* Interactive Test Chamber */}
          <div className="test-chamber-viewport">
            
            {/* Test 1: Fluid Repellency Chamber */}
            {activeTest === 'fluid' && (
              <div className="chamber-inner fluid-chamber animate-fade-in">
                <div className="chamber-visual-stage">
                  <div className={`fabric-surface ${fluidPoured ? `has-fluid fluid-${fluidType}` : ''}`}>
                    <div className="nanofiber-grid-pattern" />
                    
                    {/* Simulated Beading Droplets */}
                    {fluidPoured && (
                      <div className="beading-droplets-container">
                        <span className="droplet drop-1" />
                        <span className="droplet drop-2" />
                        <span className="droplet drop-3" />
                        <span className="droplet drop-4" />
                        <div className="beading-slide-effect">
                          <span>Hydrophobic Repel Action • Zero Absorption</span>
                        </div>
                      </div>
                    )}

                    {!fluidPoured && (
                      <div className="fabric-idle-hint">
                        <span>Tap a spill test button below to test BeauTech™ fluid barrier</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="chamber-controls-panel">
                  <h4>Hydrophobic Nanowoven Repellency</h4>
                  <p>
                    Hospital fluids (blood, saline, iodine, coffee) bead on the outer contact layer without soaking through to clinicians' skin.
                  </p>

                  <div className="spill-buttons-group">
                    <button
                      type="button"
                      className="spill-test-btn saline-btn"
                      onClick={() => triggerFluidPour('saline')}
                    >
                      <Droplets size={14} />
                      <span>Pour Clinical Saline</span>
                    </button>
                    <button
                      type="button"
                      className="spill-test-btn blood-btn"
                      onClick={() => triggerFluidPour('blood')}
                    >
                      <Droplets size={14} />
                      <span>Pour Blood Simulant</span>
                    </button>
                    <button
                      type="button"
                      className="spill-test-btn coffee-btn"
                      onClick={() => triggerFluidPour('coffee')}
                    >
                      <Droplets size={14} />
                      <span>Pour Shift Coffee</span>
                    </button>
                  </div>

                  <div className="test-stat-pills">
                    <div className="pill">
                      <strong>Contact Angle:</strong> 114° (Ultra-Hydrophobic)
                    </div>
                    <div className="pill">
                      <strong>Absorption Rate:</strong> 0.00 mL/min
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Test 2: Tensile Stretch & Instant Recoil */}
            {activeTest === 'stretch' && (
              <div className="chamber-inner stretch-chamber animate-fade-in">
                <div className="chamber-visual-stage">
                  <div 
                    className={`stretch-swatch-box ${isBouncing ? 'is-snapping-back' : ''}`}
                    style={{
                      transform: `scaleX(${1 + stretchLoad / 400}) scaleY(${1 - stretchLoad / 900})`,
                    }}
                  >
                    <div className="stretch-tension-lines" />
                    <div className="recoil-meter-badge">
                      <span>Tensile Load: {stretchLoad}% Stretch</span>
                    </div>
                  </div>
                </div>

                <div className="chamber-controls-panel">
                  <h4>BeauTech™ 4-Way Recoil Weave</h4>
                  <p>
                    Formulated with 3% high-tenacity elastane wound around viscose filaments. Stretch it across knees, elbows, and torso—it returns to original drape with 0.0mm sag.
                  </p>

                  <div className="stretch-slider-group">
                    <label>Drag Tensile Load:</label>
                    <input
                      type="range"
                      min={0}
                      max={350}
                      step={5}
                      value={stretchLoad}
                      onChange={(e) => {
                        setStretchLoad(parseInt(e.target.value, 10));
                        sounds.playSliderTick();
                      }}
                      className="interactive-shift-slider"
                    />
                  </div>

                  <div className="test-action-row">
                    <button
                      type="button"
                      className="btn btn-primary recoil-trigger-btn"
                      onClick={triggerStretchRelease}
                    >
                      <RotateCcw size={14} />
                      <span>Simulate Patient-Lift Knee Bend &amp; Recoil</span>
                    </button>
                  </div>

                  <div className="test-stat-pills">
                    <div className="pill">
                      <strong>Elastane Recoil:</strong> 99.8% recovery
                    </div>
                    <div className="pill">
                      <strong>Knee-Bagging Index:</strong> 0% (Tested 10,000 cycles)
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Test 3: Silvadur Antimicrobial Ion Defense */}
            {activeTest === 'antimicrobial' && (
              <div className="chamber-inner antimicrobial-chamber animate-fade-in">
                <div className="chamber-visual-stage">
                  <div className="silver-ions-cloud">
                    <div className="ion-particle ion-1">Ag⁺</div>
                    <div className="ion-particle ion-2">Ag⁺</div>
                    <div className="ion-particle ion-3">Ag⁺</div>
                    <div className="ion-particle ion-4">Ag⁺</div>
                    <div className="ion-particle ion-5">Ag⁺</div>
                    <div className="shield-ring" />
                    <div className="shield-label">
                      <span>99.9% Microbial Neutralization Shield</span>
                    </div>
                  </div>
                </div>

                <div className="chamber-controls-panel">
                  <h4>Silvadur™ Silver-Ion Technology</h4>
                  <p>
                    Polymer-bonded silver ions release precisely upon contact with bacteria and perspiration. Tested to maintain full antimicrobial potency after 60 industrial hospital wash cycles at 60°C.
                  </p>

                  <div className="antimicrobial-highlights-list">
                    <div className="hl-item">
                      <CheckCircle2 size={15} className="hl-icon" />
                      <span>Neutralizes odor-causing microbes before bacteria multiply</span>
                    </div>
                    <div className="hl-item">
                      <CheckCircle2 size={15} className="hl-icon" />
                      <span>Compliant with Australian TGA &amp; hospital laundering protocols</span>
                    </div>
                    <div className="hl-item">
                      <CheckCircle2 size={15} className="hl-icon" />
                      <span>Gentle on clinician skin; zero leaching onto skin barrier</span>
                    </div>
                  </div>

                  <div className="test-stat-pills">
                    <div className="pill">
                      <strong>Laundry Longevity:</strong> 60+ Hospital Wash Cycles
                    </div>
                    <div className="pill">
                      <strong>Bacterial Reduction:</strong> &gt; 99.9%
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Bottom Studio CTA Link */}
        <div className="fabric-lab-bottom-cta text-center">
          <Link to="/products/the-womens-nursing-scrub-set" className="btn btn-primary lab-cta-btn">
            <span>Explore The Women's Scrub Set</span>
            <ArrowRight size={15} />
          </Link>
          <Link to="/products/the-mens-nursing-scrub-set" className="btn btn-outline lab-cta-btn">
            <span>Explore The Men's Scrub Set</span>
            <ArrowRight size={15} />
          </Link>
        </div>

      </div>
    </section>
  );
};

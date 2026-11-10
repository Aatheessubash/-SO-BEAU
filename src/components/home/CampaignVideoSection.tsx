import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Play, Pause, Volume2, VolumeX, Maximize2, Sparkles, ArrowRight, ShieldCheck, Award } from 'lucide-react';
import { BrandLogo } from '../common/BrandLogo';
import '../../styles/components/CampaignVideoSection.scss';

export const CampaignVideoSection: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState('0:00');
  const [duration, setDuration] = useState('0:24');
  const [showControls, setShowControls] = useState(true);

  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Play / Pause Toggle
  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  // Mute / Unmute Toggle
  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  // Fullscreen Toggle
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      containerRef.current.requestFullscreen().catch((err) => {
        console.error('Fullscreen request failed:', err);
      });
    }
  };

  // Format seconds to mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Track playback time
  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const current = videoRef.current.currentTime;
    const dur = videoRef.current.duration;
    if (dur > 0) {
      setProgress((current / dur) * 100);
      setCurrentTime(formatTime(current));
    }
  };

  // When metadata loads
  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;
    setDuration(formatTime(videoRef.current.duration));
  };

  // Seek on click
  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    videoRef.current.currentTime = pos * videoRef.current.duration;
  };

  // Auto-hide controls after inactivity
  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3000);
  };

  useEffect(() => {
    return () => {
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    };
  }, []);

  return (
    <section className="campaign-video-section">
      <div className="container">
        {/* Section Header: Company Intro & Product Overview */}
        <div className="section-header-wrap">
          <div className="header-badge">
            <Sparkles size={13} className="sparkle-icon" />
            <span>About SO BEAU • Australian Medical Atelier</span>
          </div>
          <h2 className="section-title">
            WHERE CLINICAL EXCELLENCE MEETS MODERN FASHION
          </h2>
          <p className="section-subtitle">
            Founded in Melbourne by a medical doctor and fashion atelier team, SO BEAU redefines professional medical workwear. We design high-performance scrubs, tailored trousers, shift warm-up jackets, and modal underscrubs — engineered with proprietary BeauTech™ 4-way stretch and Silvadur™ antimicrobial protection for 14-hour hospital shifts and everyday life.
          </p>
        </div>

        {/* Product Category Range Showcase */}
        <div className="products-overview-bar">
          <span className="overview-label">Our Product Range:</span>
          <div className="overview-pills">
            <Link to="/collections/scrubs?category=womens-scrubs" className="overview-pill">
              Women's Scrub Sets
            </Link>
            <Link to="/collections/scrubs?category=mens-scrubs" className="overview-pill">
              Men's Scrub Sets
            </Link>
            <Link to="/collections/scrubs?category=lab-coats" className="overview-pill">
              Tailored Lab Coats
            </Link>
            <Link to="/collections/scrubs?category=underscrubs" className="overview-pill">
              Modal Underscrubs
            </Link>
            <Link to="/collections/scrubs" className="overview-pill">
              Shift Accessories
            </Link>
          </div>
        </div>

        {/* Clean Luxury Video Player Container */}
        <div
          ref={containerRef}
          className="campaign-video-container"
          onMouseMove={handleMouseMove}
          onMouseLeave={() => isPlaying && setShowControls(false)}
        >
          {/* Native HTML5 Video Element */}
          <video
            ref={videoRef}
            src="/video/VN20261109_081100.mp4"
            poster="/images/campaign-video-poster.jpg"
            className="campaign-video-player"
            autoPlay
            loop
            muted={isMuted}
            playsInline
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onClick={togglePlay}
          />

          {/* Luxury Edge Vignette */}
          <div className="theme-vignette-overlay" onClick={togglePlay} />

          {/* Top Brand Watermark Stamp */}
          <div className="video-brand-stamp">
            <div className="stamp-left">
              <BrandLogo variant="wordmark" theme="cream" height={26} />
              <span className="stamp-meta">AUSTRALIAN MEDICAL ATELIER &bull; SHIFT 2026</span>
            </div>
            <div className="stamp-right">
              <span className="active-theme-tag">BeauTech™ 4-Way Stretch</span>
            </div>
          </div>

          {/* Center Play Button (visible when paused) */}
          {!isPlaying && (
            <button
              type="button"
              className="center-play-button"
              onClick={togglePlay}
              aria-label="Play video"
            >
              <div className="play-circle-glow">
                <Play size={32} fill="currentColor" />
              </div>
              <span className="play-text">Resume Film</span>
            </button>
          )}

          {/* Bottom Branded HUD Controls */}
          <div className={`video-hud-controls ${showControls || !isPlaying ? 'visible' : ''}`}>
            {/* Scrubber Progress Bar */}
            <div className="progress-bar-container" onClick={handleSeek}>
              <div className="progress-bar-track">
                <div className="progress-bar-fill" style={{ width: `${progress}%` }}>
                  <span className="progress-handle" />
                </div>
              </div>
            </div>

            {/* Controls Toolbar */}
            <div className="controls-toolbar">
              <div className="controls-left">
                <button
                  type="button"
                  className="hud-btn"
                  onClick={togglePlay}
                  aria-label={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? <Pause size={18} /> : <Play size={18} fill="currentColor" />}
                  <span className="btn-label">{isPlaying ? 'Pause' : 'Play'}</span>
                </button>

                <button
                  type="button"
                  className={`hud-btn ${isMuted ? 'is-muted' : ''}`}
                  onClick={toggleMute}
                  aria-label={isMuted ? 'Unmute sound' : 'Mute sound'}
                >
                  {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                  <span className="btn-label">{isMuted ? 'Sound Off' : 'Sound On'}</span>
                </button>

                <div className="time-display">
                  <span>{currentTime}</span>
                  <span className="time-divider">/</span>
                  <span className="duration-text">{duration}</span>
                </div>
              </div>

              <div className="controls-right">
                <div className="badge-sound-tip desktop-only">
                  {isMuted ? 'Click "Sound Off" to hear original soundtrack' : 'Audio active'}
                </div>

                <button
                  type="button"
                  className="hud-btn"
                  onClick={toggleFullscreen}
                  aria-label="Toggle Fullscreen"
                  title="Fullscreen"
                >
                  <Maximize2 size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Grid Below Video */}
        <div className="video-features-grid">
          <div className="feature-item">
            <div className="feature-icon-circle">
              <ShieldCheck size={20} />
            </div>
            <div className="feature-info">
              <h4>TGA Australian Standard</h4>
              <p>Engineered to hospital fluid-barrier regulations with Silvadur™ antimicrobial silver technology.</p>
            </div>
          </div>

          <div className="feature-item">
            <div className="feature-icon-circle">
              <Sparkles size={20} />
            </div>
            <div className="feature-info">
              <h4>BeauTech™ 4-Way Recoil</h4>
              <p>Specialized knit weave moves fluidly during high-intensity patient care and prolonged shifts.</p>
            </div>
          </div>

          <div className="feature-item">
            <div className="feature-icon-circle">
              <Award size={20} />
            </div>
            <div className="feature-info">
              <h4>Melbourne Atelier Craft</h4>
              <p>Every piece is tailored with custom embroidery options and reinforced clinical stress points.</p>
            </div>
          </div>
        </div>

        {/* Bottom CTA Row */}
        <div className="video-cta-row">
          <Link to="/collections/scrubs" className="btn btn-primary video-cta-btn">
            <span>Shop The Featured Scrub Sets</span>
            <ArrowRight size={16} />
          </Link>
          <Link to="/pages/our-story" className="btn btn-outline video-cta-sec">
            <span>Discover The Brand Story</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

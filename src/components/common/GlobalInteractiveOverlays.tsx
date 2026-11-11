import React from 'react';
import { Sparkles, Volume2, VolumeX } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { FitFinderModal } from './FitFinderModal';
import { sounds } from '../../utils/soundEffects';

export const GlobalInteractiveOverlays: React.FC = () => {
  const { isFitFinderOpen, openFitFinder, closeFitFinder, soundEnabled, toggleSound } = useCart();

  return (
    <>
      {/* Fit Finder Interactive Modal */}
      <FitFinderModal isOpen={isFitFinderOpen} onClose={closeFitFinder} />

      {/* Floating Bottom Dock with Interactive Helpers */}
      <div className="floating-interaction-dock" aria-label="Interactive tools">
        {/* Fit Finder Trigger */}
        <button
          type="button"
          className="dock-pill-btn fit-finder-pill"
          onClick={() => {
            sounds.playSwatchClick();
            openFitFinder();
          }}
          aria-label="Find your fit in 30 seconds"
          title="Find your tailored size in 30 seconds"
        >
          <Sparkles size={14} className="sparkle-icon" />
          <span>Find My Fit in 30s</span>
        </button>

        {/* Tactile Audio FX Toggle */}
        <button
          type="button"
          className={`dock-pill-btn sound-toggle-pill ${soundEnabled ? 'sound-active' : ''}`}
          onClick={toggleSound}
          title={soundEnabled ? 'Tactile Audio FX: Active (Click to Mute)' : 'Tactile Audio FX: Muted (Click to Enable)'}
          aria-label="Toggle Sound Effects"
        >
          {soundEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
          <span className="sound-label">{soundEnabled ? 'Sound On' : 'Sound Off'}</span>
        </button>
      </div>
    </>
  );
};

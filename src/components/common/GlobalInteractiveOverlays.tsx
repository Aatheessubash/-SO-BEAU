import React from 'react';
import { useCart } from '../../context/CartContext';
import { FitFinderModal } from './FitFinderModal';

export const GlobalInteractiveOverlays: React.FC = () => {
  const { isFitFinderOpen, closeFitFinder } = useCart();

  return (
    <>
      {/* Fit Finder Interactive Modal */}
      <FitFinderModal isOpen={isFitFinderOpen} onClose={closeFitFinder} />
    </>
  );
};

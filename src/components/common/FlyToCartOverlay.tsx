import React from 'react';
import { useCart } from '../../context/CartContext';
import '../../styles/components/FlyToCartOverlay.scss';

export const FlyToCartOverlay: React.FC = () => {
  const { flyingItems } = useCart();

  if (flyingItems.length === 0) return null;

  return (
    <div className="fly-to-cart-container" aria-hidden="true">
      {flyingItems.map((item) => (
        <div
          key={item.id}
          className={`flying-item-node ${item.isFlying ? 'animate-fly' : ''}`}
          style={
            {
              '--start-x': `${item.startX}px`,
              '--start-y': `${item.startY}px`,
              '--target-x': `${item.targetX}px`,
              '--target-y': `${item.targetY}px`,
            } as React.CSSProperties
          }
        >
          <img src={item.imageUrl} alt="" className="flying-item-img" />
          <div className="flying-sparkle-trail" />
        </div>
      ))}
    </div>
  );
};

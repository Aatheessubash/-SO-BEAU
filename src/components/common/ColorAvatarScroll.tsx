import React, { useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { ProductColor } from '../../types';
import { sounds } from '../../utils/soundEffects';
import '../../styles/components/ColorAvatarScroll.scss';

interface ColorAvatarScrollProps {
  colors: ProductColor[];
  selectedColor: ProductColor;
  onSelectColor: (color: ProductColor) => void;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export const ColorAvatarScroll: React.FC<ColorAvatarScrollProps> = ({
  colors,
  selectedColor,
  onSelectColor,
  size = 'md',
  showLabel = true,
  className = '',
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const activeAvatarRef = useRef<HTMLButtonElement>(null);

  // Auto-scroll selected avatar into view smoothly
  useEffect(() => {
    if (activeAvatarRef.current && scrollRef.current) {
      activeAvatarRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      });
    }
  }, [selectedColor.code]);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = size === 'lg' ? 180 : size === 'sm' ? 100 : 140;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className={`color-avatar-scroll-wrapper size-${size} ${className}`}>
      {showLabel && (
        <div className="color-scroll-header">
          <div className="color-info-text">
            <span className="label-caption">Shade</span>
            <span className="active-color-name">{selectedColor.name}</span>
          </div>
          <span className="stock-pill">
            <span className="pulse-dot" /> AU Ready
          </span>
        </div>
      )}

      <div className="avatar-scroll-controls-container">
        {colors.length > 3 && (
          <button
            type="button"
            className="scroll-nav-arrow left"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleScroll('left');
            }}
            aria-label="Scroll colors left"
          >
            <ChevronLeft size={16} />
          </button>
        )}

        <div className="avatar-scroll-track" ref={scrollRef}>
          {colors.map((color) => {
            const isSelected = selectedColor.code === color.code;
            const modelImg = color.avatarImage || color.modelImage;

            return (
              <button
                key={color.code}
                ref={isSelected ? activeAvatarRef : null}
                type="button"
                className={`avatar-color-node ${isSelected ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  sounds.playSwatchClick();
                  onSelectColor(color);
                }}
                title={color.name}
              >
                <div className="avatar-ring-animator">
                  <div className="avatar-image-frame">
                    {modelImg ? (
                      <img
                        src={modelImg}
                        alt={`${color.name} model preview`}
                        className="avatar-model-thumb"
                        loading="lazy"
                      />
                    ) : (
                      <div
                        className="avatar-fallback-fill"
                        style={{ backgroundColor: color.hex }}
                      />
                    )}
                  </div>
                </div>

                {/* Micro Swatch Pip Badge */}
                <span
                  className="swatch-pip"
                  style={{ backgroundColor: color.hex }}
                >
                  {isSelected && <Check size={10} className="check-icon" />}
                </span>

                {size === 'lg' && (
                  <span className="avatar-mini-label">{color.name}</span>
                )}
              </button>
            );
          })}
        </div>

        {colors.length > 3 && (
          <button
            type="button"
            className="scroll-nav-arrow right"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleScroll('right');
            }}
            aria-label="Scroll colors right"
          >
            <ChevronRight size={16} />
          </button>
        )}
      </div>
    </div>
  );
};

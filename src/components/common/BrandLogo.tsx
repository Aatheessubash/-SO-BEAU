import React from 'react';

export interface BrandLogoProps {
  variant?: 'full' | 'wordmark' | 'monogram' | 'condensed' | 'spaced';
  theme?: 'forest' | 'cream' | 'gold' | 'white' | 'terracotta';
  height?: number;
  className?: string;
  showSparkle?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = 'full',
  theme = 'forest',
  height,
  className = '',
  showSparkle = true,
}) => {
  // Theme color mappings based on Official Brand Guidelines
  const colors = {
    forest: {
      text: '#1B3B2B',       // Deep Forest Green
      gold: '#C5A059',       // Muted Gold
      subtext: '#6E7570',    // Muted grey/forest
      accentLine: '#C5A059', // Muted Gold divider
    },
    cream: {
      text: '#FDFBF7',       // Warm Cream
      gold: '#D6B778',       // Light Muted Gold
      subtext: '#E7DEC2',    // Soft Beige
      accentLine: '#C5A059', // Muted Gold divider
    },
    gold: {
      text: '#C5A059',       // Muted Gold
      gold: '#D6B778',       // Light Gold highlight
      subtext: '#C5A059',
      accentLine: '#C5A059',
    },
    white: {
      text: '#FFFFFF',
      gold: '#C5A059',
      subtext: 'rgba(255, 255, 255, 0.75)',
      accentLine: '#C5A059',
    },
    terracotta: {
      text: '#8C554F',       // Soft Matte Clay
      gold: '#C5A059',
      subtext: '#E7DEC2',
      accentLine: '#C5A059',
    },
  }[theme];

  // 1. Monogram Icon ('S' + 4-Point Gold Star from Brand Pattern)
  if (variant === 'monogram') {
    const computedHeight = height || 40;
    return (
      <svg
        viewBox="0 0 100 100"
        height={computedHeight}
        width={computedHeight}
        className={`brand-logo monogram ${className}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Sobeau Monogram"
      >
        <defs>
          <linearGradient id={`goldGradMonogram-${theme}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#D6B778" />
            <stop offset="50%" stopColor="#C5A059" />
            <stop offset="100%" stopColor="#A6833D" />
          </linearGradient>
        </defs>
        {/* Monogram Serif 'S' */}
        <text
          x="44"
          y="70"
          fontFamily="'Cormorant Garamond', Garamond, Georgia, serif"
          fontSize="68"
          fontWeight="600"
          letterSpacing="-0.02em"
          fill={colors.text}
          textAnchor="middle"
        >
          S
        </text>
        {/* 4-Point Sparkle at top right of S */}
        {showSparkle && (
          <path
            d="M 74 24 C 74.8 29 76.8 31 82 32 C 76.8 33 74.8 35 74 40 C 73.2 35 71.2 33 66 32 C 71.2 31 73.2 29 74 24 Z"
            fill={`url(#goldGradMonogram-${theme})`}
          />
        )}
      </svg>
    );
  }

  // 2. Condensed Headline ("SO BEAU" from Campaign Sky Banner)
  if (variant === 'condensed') {
    const computedHeight = height || 44;
    return (
      <svg
        viewBox="0 0 240 60"
        height={computedHeight}
        className={`brand-logo condensed ${className}`}
        xmlns="http://www.w3.org/2000/svg"
        aria-label="SO BEAU"
      >
        <text
          x="120"
          y="44"
          fontFamily="'Plus Jakarta Sans', sans-serif"
          fontSize="42"
          fontWeight="800"
          letterSpacing="0.22em"
          fill={colors.text}
          textAnchor="middle"
        >
          SO BEAU
        </text>
      </svg>
    );
  }

  // 3. Spaced / Full Logo Variant with Tagline (Official Logo)
  if (variant === 'spaced') {
    const computedHeight = height || 48;
    const logoSrc = theme === 'cream'
      ? '/images/sobeau-logo-cream.png'
      : theme === 'white'
        ? '/images/sobeau-logo-white.png'
        : '/images/sobeau-logo.png';

    return (
      <img
        src={logoSrc}
        alt="Sobeau — So you. So beau."
        height={computedHeight}
        className={`brand-logo spaced theme-${theme} ${className}`}
        style={{
          height: `${computedHeight}px`,
          width: 'auto',
          display: 'inline-block',
          objectFit: 'contain',
          verticalAlign: 'middle',
        }}
        loading="eager"
      />
    );
  }

  // 4. Wordmark only (Bespoke ligature Sobeau + Sparkles on 'u')
  if (variant === 'wordmark') {
    const computedHeight = height || 36;
    const logoSrc = theme === 'cream'
      ? '/images/sobeau-wordmark-cream.png'
      : theme === 'white'
        ? '/images/sobeau-wordmark-white.png'
        : '/images/sobeau-wordmark.png';

    return (
      <img
        src={logoSrc}
        alt="Sobeau"
        height={computedHeight}
        className={`brand-logo wordmark theme-${theme} ${className}`}
        style={{
          height: `${computedHeight}px`,
          width: 'auto',
          display: 'inline-block',
          objectFit: 'contain',
          verticalAlign: 'middle',
        }}
        loading="eager"
      />
    );
  }

  // 5. Full Logo (Wordmark + 4-Point Stars + Tagline with gold divider rules)
  const computedHeight = height || 42;
  const logoSrc = theme === 'cream'
    ? '/images/sobeau-logo-cream.png'
    : theme === 'white'
      ? '/images/sobeau-logo-white.png'
      : '/images/sobeau-logo.png';

  return (
    <img
      src={logoSrc}
      alt="Sobeau — So you. So beau."
      height={computedHeight}
      className={`brand-logo full theme-${theme} ${className}`}
      style={{
        height: `${computedHeight}px`,
        width: 'auto',
        display: 'inline-block',
        objectFit: 'contain',
        verticalAlign: 'middle',
      }}
      loading="eager"
    />
  );
};

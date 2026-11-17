import React from 'react';

export interface BrandLogoProps {
  variant?: 'full' | 'wordmark' | 'monogram' | 'condensed' | 'spaced';
  theme?: 'forest' | 'cream' | 'gold' | 'white' | 'terracotta' | 'navy';
  height?: number;
  className?: string;
  showSparkle?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = 'full',
  theme = 'navy',
  height,
  className = '',
}) => {
  // Determine appropriate image asset based on theme
  let logoSrc = '/images/sobeau-logo.png';
  if (theme === 'white') {
    logoSrc = '/images/sobeau-logo-white.png';
  } else if (theme === 'cream') {
    logoSrc = '/images/sobeau-logo-cream.png';
  } else if (theme === 'navy' || theme === 'forest') {
    logoSrc = '/images/sobeau-logo-navy.png';
  }

  const computedHeight = height || (variant === 'wordmark' ? 32 : 36);

  return (
    <img
      src={logoSrc}
      alt="SOBEAU"
      height={computedHeight}
      className={`brand-logo ${variant} theme-${theme} ${className}`}
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

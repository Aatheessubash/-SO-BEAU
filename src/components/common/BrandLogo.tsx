import React from 'react';

export interface BrandLogoProps {
  variant?: 'full' | 'wordmark' | 'monogram' | 'condensed' | 'spaced';
  theme?: 'forest' | 'cream' | 'gold' | 'white' | 'terracotta' | 'navy';
  height?: number;
  className?: string;
  showSparkle?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  theme = 'navy',
  className = '',
}) => {
  return (
    <div
      className={`brand-atelier-lockup ${className}`}
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        textDecoration: 'none',
        lineHeight: 1,
      }}
    >
      <span
        style={{
          fontFamily: "'Cormorant Garamond', 'EB Garamond', Georgia, serif",
          fontSize: '1.45rem',
          fontWeight: 600,
          letterSpacing: '0.12em',
          color: theme === 'white' ? '#FFFFFF' : '#0F172A',
          textTransform: 'uppercase',
          lineHeight: 1,
        }}
      >
        SO BEAU
      </span>
      <span
        style={{
          fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif",
          fontSize: '0.52rem',
          fontWeight: 600,
          letterSpacing: '0.22em',
          color: theme === 'white' ? 'rgba(255,255,255,0.7)' : '#4B5563',
          textTransform: 'uppercase',
          marginTop: '3px',
          lineHeight: 1,
        }}
      >
        MELBOURNE ATELIER
      </span>
    </div>
  );
};

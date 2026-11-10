import React from 'react';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Product } from '../../types';
import { ProductCard } from '../product/ProductCard';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import '../../styles/components/CuratedCollections.scss';

interface CuratedCollectionsProps {
  products: Product[];
}

export const CuratedCollections: React.FC<CuratedCollectionsProps> = ({ products }) => {
  const { ref: sectionRef, isVisible } = useScrollReveal({ threshold: 0.1 });

  // Only the 2 scrub sets
  const scrubProducts = products.filter(
    (p) => p.category === 'womens-scrubs' || p.category === 'mens-scrubs'
  );

  return (
    <section id="products" className="curated-collections-section section-padding" ref={sectionRef}>
      <div className="container">
        {/* Clean Editorial Header */}
        <div className="section-header-row">
          <div className="header-text-block">
            <h2 className="text-section-title">
              {isVisible ? (
                <span className="line-reveal-wrapper">
                  <span className="line-reveal-inner" style={{ animationDelay: '0.1s' }}>
                    The Essential Scrub Sets.
                  </span>
                </span>
              ) : (
                'The Essential Scrub Sets.'
              )}
            </h2>
            <p className="header-desc">
              Engineered for female and male clinicians. Certified Australian hospital-grade performance with BeauTech™ 4-way stretch, Silvadur™ antimicrobial defense, and dedicated clinical utility pockets across rich signature colorways.
            </p>
          </div>
        </div>

        {/* 2-Column Luxury Grid for the 2 Sets */}
        <div className={`collection-grid ${isVisible ? 'reveal-mask-image' : ''}`}>
          {scrubProducts.map((product, idx) => (
            <ProductCard key={product.id} product={product} index={idx} disableHover />
          ))}
        </div>

        {/* Key Guarantees Row Below Products */}
        <div className="product-guarantees-row">
          <div className="guarantee-item">
            <ShieldCheck size={16} />
            <span>TGA Compliant Australian Medical Grade</span>
          </div>
          <div className="guarantee-item">
            <CheckCircle2 size={16} />
            <span>Tested for 60°C Hospital Washes</span>
          </div>
          <div className="guarantee-item">
            <CheckCircle2 size={16} />
            <span>Complimentary 30-Day Size Exchange</span>
          </div>
        </div>
      </div>
    </section>
  );
};

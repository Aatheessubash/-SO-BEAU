import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ShieldCheck, CheckCircle2, RotateCcw, Sparkles } from 'lucide-react';
import { api } from '../services/api';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { ProductCard } from '../components/product/ProductCard';
import { sounds } from '../utils/soundEffects';
import fallbackProducts from '../../server/data/products.json';
import '../styles/pages/ShopPage.scss';

export const ShopPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { isInWishlist } = useCart();

  const [products, setProducts] = useState<Product[]>(fallbackProducts as unknown as Product[]);
  const [loading, setLoading] = useState(false);

  // Read URL query params
  const categoryParam = searchParams.get('category') || 'all';
  const searchParam = searchParams.get('search') || '';
  const wishlistParam = searchParams.get('wishlist') === 'true';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const prodRes = await api.getProducts();
        if (prodRes.data && prodRes.data.length > 0) {
          setProducts(prodRes.data);
        }
      } catch (err) {
        console.error('Failed to load shop data', err);
      }
    };
    fetchData();
  }, []);

  const handleCategoryChange = (catId: string) => {
    sounds.playSwatchClick();
    const nextParams = new URLSearchParams(searchParams);
    if (catId === 'all') {
      nextParams.delete('category');
    } else {
      nextParams.set('category', catId);
    }
    setSearchParams(nextParams);
  };

  // Filter products cleanly based on category, search, or wishlist
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (categoryParam !== 'all' && p.category !== categoryParam) {
        return false;
      }
      if (searchParam && !p.name.toLowerCase().includes(searchParam.toLowerCase())) {
        return false;
      }
      if (wishlistParam && !isInWishlist(p.id)) {
        return false;
      }
      return true;
    });
  }, [products, categoryParam, searchParam, wishlistParam, isInWishlist]);

  const womensCount = products.filter((p) => p.category === 'womens-scrubs').length;
  const mensCount = products.filter((p) => p.category === 'mens-scrubs').length;

  return (
    <div className="shop-page shop-editorial-theme animate-fade-in">
      {/* 1. Clean, Spacious Header */}
      <header className="shop-header">
        <div className="container">
          <div className="header-meta-row">
            <span className="atelier-tag">
              <Sparkles size={12} className="tag-sparkle" />
              SO BEAU ATELIER • 2026 CLINICAL ROTATION
            </span>
          </div>

          <h1 className="shop-title">The Scrub Collection</h1>
          <p className="shop-subtitle">
            Certified Australian hospital-grade performance with BeauTech™ 4-way recoil stretch,
            Silvadur™ antimicrobial defense, and dedicated clinical utility.
          </p>

          {/* Clean Navigation & Filter Bar */}
          <div className="shop-toolbar">
            <div className="category-tabs" role="tablist" aria-label="Product categories">
              <button
                type="button"
                role="tab"
                aria-selected={categoryParam === 'all' && !wishlistParam}
                className={`tab-pill ${categoryParam === 'all' && !wishlistParam ? 'active' : ''}`}
                onClick={() => handleCategoryChange('all')}
              >
                All Editions <span className="tab-count">{products.length}</span>
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={categoryParam === 'womens-scrubs'}
                className={`tab-pill ${categoryParam === 'womens-scrubs' ? 'active' : ''}`}
                onClick={() => handleCategoryChange('womens-scrubs')}
              >
                Women's Set <span className="tab-count">{womensCount}</span>
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={categoryParam === 'mens-scrubs'}
                className={`tab-pill ${categoryParam === 'mens-scrubs' ? 'active' : ''}`}
                onClick={() => handleCategoryChange('mens-scrubs')}
              >
                Men's Set <span className="tab-count">{mensCount}</span>
              </button>
              {wishlistParam && (
                <button
                  type="button"
                  className="tab-pill active"
                  onClick={() => handleCategoryChange('all')}
                >
                  Saved Wishlist
                </button>
              )}
            </div>

            <div className="toolbar-status">
              <span className="status-indicator">
                <span className="status-dot" />
                Hospital Grade Ready
              </span>
              <span className="shades-count">8 Signature Shades</span>
            </div>
          </div>
        </div>
      </header>

      {/* 2. Professional, Spacious Product Grid */}
      <main className="shop-content container">
        {filteredProducts.length === 0 ? (
          <div className="shop-empty-state">
            <h3>No products found</h3>
            <p>Try resetting your filter or search query.</p>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => handleCategoryChange('all')}
            >
              View All Scrubs
            </button>
          </div>
        ) : (
          <div className="shop-products-grid">
            {filteredProducts.map((product, idx) => (
              <ProductCard key={product.id} product={product} index={idx} />
            ))}
          </div>
        )}

        {/* 3. Subtle Clinical Guarantees Strip */}
        <div className="shop-guarantees-banner">
          <div className="guarantee-item">
            <ShieldCheck size={18} className="guarantee-icon" />
            <div className="guarantee-text">
              <strong>TGA Medical Grade Compliant</strong>
              <span>Australian Hospital Standard</span>
            </div>
          </div>

          <div className="guarantee-item">
            <CheckCircle2 size={18} className="guarantee-icon" />
            <div className="guarantee-text">
              <strong>Silvadur™ Antimicrobial</strong>
              <span>Tested for 60°C Hospital Washes</span>
            </div>
          </div>

          <div className="guarantee-item">
            <RotateCcw size={18} className="guarantee-icon" />
            <div className="guarantee-text">
              <strong>Complimentary 30-Day Exchanges</strong>
              <span>Risk-free shift wear testing</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, ShoppingBag, Heart, Menu, X, ChevronDown } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { BrandLogo } from './BrandLogo';
import '../../styles/components/Navbar.scss';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const { totalItems, openCart, openSearch, wishlist, isCartBouncing } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <header className={`site-header ${isScrolled ? 'is-scrolled' : ''}`}>
      <div className="container header-container">
        {/* Mobile menu trigger button */}
        <button
          className="mobile-menu-trigger"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          type="button"
        >
          {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        {/* Brand Logo */}
        <div className="header-brand">
          <Link to="/" className="brand-logo-link" aria-label="SOBEAU Home">
            <BrandLogo variant="wordmark" theme="navy" height={36} />
          </Link>
        </div>

        {/* Desktop Primary Nav */}
        <nav className="desktop-nav" aria-label="Main Navigation">
          <Link 
            to="/collections/scrubs" 
            className="nav-link with-chevron"
          >
            <span>Shop Collections</span>
            <ChevronDown size={14} className="chevron-icon" />
          </Link>
          <Link 
            to="/collections/scrubs?category=womens-scrubs" 
            className="nav-link with-chevron"
          >
            <span>Women's</span>
            <ChevronDown size={14} className="chevron-icon" />
          </Link>
          <Link 
            to="/collections/scrubs?category=mens-scrubs" 
            className="nav-link with-chevron"
          >
            <span>Men's</span>
            <ChevronDown size={14} className="chevron-icon" />
          </Link>
          <a 
            href="/#try-the-look" 
            className="nav-link"
          >
            Try The Look Studio
          </a>
          <Link 
            to="/pages/our-story" 
            className="nav-link"
          >
            About Atelier
          </Link>
        </nav>

        {/* Header Right Actions */}
        <div className="header-actions">
          <button 
            type="button"
            className="action-btn" 
            onClick={openSearch}
            aria-label="Search collection"
            title="Search"
          >
            <Search size={20} />
          </button>

          <Link 
            to="/collections/scrubs?wishlist=true" 
            className="action-btn"
            aria-label="Wishlist"
            title="Wishlist"
          >
            <Heart size={20} />
            {wishlist.length > 0 && (
              <span className="action-badge">{wishlist.length}</span>
            )}
          </Link>

          <button 
            type="button"
            id="navbar-cart-btn"
            className={`action-btn cart-btn ${isCartBouncing ? 'animate-cart-bounce' : ''}`} 
            onClick={openCart}
            aria-label="Shopping bag"
            title="Shopping bag"
          >
            <ShoppingBag size={20} />
            {totalItems > 0 && (
              <span className={`action-badge ${isCartBouncing ? 'badge-pulse' : ''}`}>{totalItems}</span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      <div className={`mobile-nav-drawer ${isMobileMenuOpen ? 'open' : ''}`}>
        <nav className="mobile-nav-inner">
          <Link to="/collections/scrubs" className="mobile-nav-link">
            Shop Collections
          </Link>
          <Link to="/collections/scrubs?category=womens-scrubs" className="mobile-nav-sublink">
            Women's Scrubs
          </Link>
          <Link to="/collections/scrubs?category=mens-scrubs" className="mobile-nav-sublink">
            Men's Scrubs
          </Link>
          <a href="/#try-the-look" className="mobile-nav-sublink" onClick={() => setIsMobileMenuOpen(false)}>
            Try The Look Studio
          </a>
          <Link to="/pages/size-guide" className="mobile-nav-sublink">
            Australian Sizing Guide
          </Link>
          <div className="mobile-nav-divider" />
          <Link to="/pages/our-story" className="mobile-nav-link">
            About Atelier
          </Link>
          <Link to="/pages/contact" className="mobile-nav-link">
            Contact &amp; Hospital Teams
          </Link>
          <div className="mobile-nav-divider" />
          <div className="mobile-nav-extras">
            <button 
              type="button"
              className="mobile-action-btn" 
              onClick={() => { setIsMobileMenuOpen(false); openSearch(); }}
            >
              <Search size={18} />
              <span>Search</span>
            </button>
            <Link to="/collections/scrubs?wishlist=true" className="mobile-action-btn">
              <Heart size={18} />
              <span>Wishlist ({wishlist.length})</span>
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
};

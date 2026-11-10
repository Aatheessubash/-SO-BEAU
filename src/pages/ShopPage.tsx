import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Filter, SlidersHorizontal, X, Grid, LayoutGrid, Check, RotateCcw } from 'lucide-react';
import { api } from '../services/api';
import { Product, Category } from '../types';
import { ProductCard } from '../components/product/ProductCard';
import { useCart } from '../context/CartContext';
import '../styles/pages/ShopPage.scss';

const AVAILABLE_COLORS = [
  { name: 'Terracotta Clay', code: 'terracotta', hex: '#8C554F' },
  { name: 'Deep Forest Green', code: 'forest', hex: '#1B3B2B' },
  { name: 'Warm Cream', code: 'cream', hex: '#FDFBF7' },
  { name: 'Deep Charcoal', code: 'charcoal', hex: '#1E2022' },
  { name: 'French Navy', code: 'navy', hex: '#1D2A44' },
  { name: 'Soft Sage', code: 'sage', hex: '#7D9D8B' },
  { name: 'Warm Taupe', code: 'taupe', hex: '#A39382' },
  { name: 'Surgical Blue', code: 'surgical-blue', hex: '#4A7C9B' },
];

const AVAILABLE_SIZES = [
  'AU 4 (XXS)',
  'AU 6 (XS)',
  'AU 8 (S)',
  'AU 10 (M)',
  'AU 12 (L)',
  'AU 14 (XL)',
  'AU 16 (2XL)',
  'AU 18 (3XL)',
  'AU XS (36)',
  'AU S (38)',
  'AU M (40)',
  'AU L (42)',
  'AU XL (44)',
  'AU 2XL (46)',
  'AU 3XL (48)',
];

export const ShopPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { wishlist } = useCart();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [gridColumns, setGridColumns] = useState<2 | 3>(2);

  // Read URL query params
  const categoryParam = searchParams.get('category') || 'all';
  const sortParam = searchParams.get('sort') || 'featured';
  const searchParam = searchParams.get('search') || '';
  const wishlistParam = searchParams.get('wishlist') === 'true';

  // Local filter states
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedDiscount, setSelectedDiscount] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState<number>(200);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [prodRes, catRes] = await Promise.all([
          api.getProducts(),
          api.getCategories(),
        ]);
        if (prodRes.data) setProducts(prodRes.data);
        if (catRes.data) setCategories(catRes.data);
      } catch (err) {
        console.error('Failed to load shop data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Update Category param helper
  const handleCategoryChange = (catId: string) => {
    const nextParams = new URLSearchParams(searchParams);
    if (catId === 'all') {
      nextParams.delete('category');
    } else {
      nextParams.set('category', catId);
    }
    setSearchParams(nextParams);
  };

  // Update Sort param helper
  const handleSortChange = (sortVal: string) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set('sort', sortVal);
    setSearchParams(nextParams);
  };

  const toggleColor = (code: string) => {
    setSelectedColors((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
    );
  };

  const toggleSize = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const clearAllFilters = () => {
    setSelectedColors([]);
    setSelectedSizes([]);
    setSelectedDiscount(null);
    setMaxPrice(200);
    const nextParams = new URLSearchParams();
    setSearchParams(nextParams);
  };

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    let list = [...products];

    // Wishlist filter
    if (wishlistParam) {
      list = list.filter((p) => wishlist.includes(p.id));
    }

    // Category filter
    if (categoryParam && categoryParam !== 'all') {
      list = list.filter((p) => p.category.toLowerCase() === categoryParam.toLowerCase());
    }

    // Search query
    if (searchParam) {
      const q = searchParam.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.categoryName.toLowerCase().includes(q) ||
          p.colors.some((c) => c.name.toLowerCase().includes(q))
      );
    }

    // Color filter
    if (selectedColors.length > 0) {
      list = list.filter((p) =>
        p.colors.some((c) => selectedColors.includes(c.code))
      );
    }

    // Size filter
    if (selectedSizes.length > 0) {
      list = list.filter((p) =>
        p.sizes.some((s) => selectedSizes.includes(s))
      );
    }

    // Max Price
    list = list.filter((p) => p.price <= maxPrice);

    // Sorting
    switch (sortParam) {
      case 'price-asc':
        list.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        list.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        list.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        list.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      case 'featured':
      default:
        list.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
        break;
    }

    return list;
  }, [products, categoryParam, sortParam, searchParam, wishlistParam, selectedColors, selectedSizes, maxPrice, wishlist]);

  const activeCategoryObj = categories.find((c) => c.id === categoryParam);

  const hasActiveFilters =
    categoryParam !== 'all' ||
    selectedColors.length > 0 ||
    selectedSizes.length > 0 ||
    maxPrice < 200 ||
    wishlistParam ||
    searchParam;

  return (
    <div className="shop-page animate-fade-in">
      {/* Collection Header */}
      <div className="shop-header-banner">
        <div className="container">
          <div className="breadcrumbs-row">
            <Link to="/">Home</Link>
            <span>/</span>
            <span>Collections</span>
            <span>/</span>
            <span className="current">{activeCategoryObj ? activeCategoryObj.name : 'All Pieces'}</span>
          </div>

          <h1 className="shop-title">
            {wishlistParam
              ? 'Your Saved Pieces'
              : searchParam
              ? `Search: "${searchParam}"`
              : activeCategoryObj
              ? activeCategoryObj.name
              : 'Australian Medical Scrubs (2 Models)'}
          </h1>

          <p className="shop-tagline">
            {activeCategoryObj
              ? activeCategoryObj.tagline
              : 'Female & Male tailored healthcare silhouettes. Featuring model sizing & animated horizontal color avatar scroll.'}
          </p>
        </div>
      </div>

      <div className="container shop-body-container">
        {/* Horizontal Category Nav Chips (Matching User Image 8) */}
        <div className="shop-category-pills-bar">
          <button
            type="button"
            className={`cat-pill ${categoryParam === 'all' ? 'active' : ''}`}
            onClick={() => handleCategoryChange('all')}
          >
            All Scrubs
          </button>
          <button
            type="button"
            className={`cat-pill ${categoryParam === 'womens-scrubs' ? 'active' : ''}`}
            onClick={() => handleCategoryChange('womens-scrubs')}
          >
            Women's Scrubs
          </button>
          <button
            type="button"
            className={`cat-pill ${categoryParam === 'mens-scrubs' ? 'active' : ''}`}
            onClick={() => handleCategoryChange('mens-scrubs')}
          >
            Men's Scrubs
          </button>
        </div>

        {/* Top Control Bar */}
        <div className="shop-controls-bar">
          <button 
            className="mobile-filter-trigger"
            onClick={() => setIsMobileFiltersOpen(true)}
          >
            <SlidersHorizontal size={16} />
            <span>Filters ({selectedColors.length + selectedSizes.length + (categoryParam !== 'all' ? 1 : 0)})</span>
          </button>

          <span className="product-count-display">
            Showing <strong>{filteredProducts.length}</strong> {filteredProducts.length === 1 ? 'piece' : 'pieces'}
          </span>

          <div className="right-controls">
            {/* Grid density toggle */}
            <div className="grid-density-toggle desktop-only">
              <button 
                className={`grid-btn ${gridColumns === 2 ? 'active' : ''}`}
                onClick={() => setGridColumns(2)}
                aria-label="2 columns (large models)"
                title="2 columns view"
              >
                <Grid size={18} />
              </button>
              <button 
                className={`grid-btn ${gridColumns === 3 ? 'active' : ''}`}
                onClick={() => setGridColumns(3)}
                aria-label="3 columns"
                title="Compact view"
              >
                <LayoutGrid size={18} />
              </button>
            </div>

            {/* Sort Select */}
            <div className="sort-dropdown-wrap">
              <label htmlFor="shop-sort">Sort:</label>
              <select
                id="shop-sort"
                value={sortParam}
                onChange={(e) => handleSortChange(e.target.value)}
              >
                <option value="featured">Featured &amp; Bestsellers</option>
                <option value="newest">New Silhouettes</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Clinician Rating</option>
              </select>
            </div>
          </div>
        </div>

        {/* Active Filter Pills Bar */}
        {hasActiveFilters && (
          <div className="active-filter-pills-bar">
            {categoryParam !== 'all' && (
              <span className="filter-pill">
                Category: {categoryParam}
                <button onClick={() => handleCategoryChange('all')}><X size={12} /></button>
              </span>
            )}
            {searchParam && (
              <span className="filter-pill">
                Keyword: "{searchParam}"
                <button onClick={() => {
                  const np = new URLSearchParams(searchParams);
                  np.delete('search');
                  setSearchParams(np);
                }}><X size={12} /></button>
              </span>
            )}
            {wishlistParam && (
              <span className="filter-pill">
                Saved Pieces
                <button onClick={() => {
                  const np = new URLSearchParams(searchParams);
                  np.delete('wishlist');
                  setSearchParams(np);
                }}><X size={12} /></button>
              </span>
            )}
            {selectedColors.map((c) => (
              <span key={c} className="filter-pill">
                Shade: {c}
                <button onClick={() => toggleColor(c)}><X size={12} /></button>
              </span>
            ))}
            {selectedSizes.map((s) => (
              <span key={s} className="filter-pill">
                Size: {s}
                <button onClick={() => toggleSize(s)}><X size={12} /></button>
              </span>
            ))}
            {maxPrice < 200 && (
              <span className="filter-pill">
                Under ${maxPrice} AUD
                <button onClick={() => setMaxPrice(200)}><X size={12} /></button>
              </span>
            )}

            <button onClick={clearAllFilters} className="clear-all-filters-btn">
              <RotateCcw size={12} /> Clear All
            </button>
          </div>
        )}

        <div className="shop-layout-grid">
          {/* Desktop Filter Sidebar */}
          <aside className="shop-sidebar desktop-only">
            {/* Categories */}
            <div className="filter-group">
              <h4 className="filter-title">Category</h4>
              <ul className="category-list">
                <li>
                  <button
                    className={`cat-btn ${categoryParam === 'all' ? 'active' : ''}`}
                    onClick={() => handleCategoryChange('all')}
                  >
                    <span>All Collections</span>
                    <span className="cat-count">({products.length})</span>
                  </button>
                </li>
                {categories.map((cat) => (
                  <li key={cat.id}>
                    <button
                      className={`cat-btn ${categoryParam === cat.id ? 'active' : ''}`}
                      onClick={() => handleCategoryChange(cat.id)}
                    >
                      <span>{cat.name}</span>
                      <span className="cat-count">({cat.productCount})</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Colors */}
            <div className="filter-group">
              <h4 className="filter-title">Color Palette</h4>
              <div className="color-swatches-grid">
                {AVAILABLE_COLORS.map((col) => {
                  const isSelected = selectedColors.includes(col.code);
                  return (
                    <button
                      key={col.code}
                      className={`color-filter-btn ${isSelected ? 'selected' : ''}`}
                      onClick={() => toggleColor(col.code)}
                      title={col.name}
                    >
                      <span className="color-chip" style={{ backgroundColor: col.hex }}>
                        {isSelected && <Check size={11} color={col.code === 'white' ? '#171717' : '#FFFFFF'} />}
                      </span>
                      <span className="color-name">{col.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sizes */}
            <div className="filter-group">
              <h4 className="filter-title">Australian Size</h4>
              <div className="size-chips-grid">
                {AVAILABLE_SIZES.map((size) => {
                  const isSelected = selectedSizes.includes(size);
                  return (
                    <button
                      key={size}
                      className={`size-filter-chip ${isSelected ? 'selected' : ''}`}
                      onClick={() => toggleSize(size)}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Price Range Slider */}
            <div className="filter-group">
              <div className="price-header-row">
                <h4 className="filter-title">Maximum Price</h4>
                <span className="price-val">${maxPrice} AUD</span>
              </div>
              <input
                type="range"
                min="40"
                max="200"
                step="5"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="price-slider"
              />
              <div className="price-slider-limits">
                <span>$40 AUD</span>
                <span>$200 AUD</span>
              </div>
            </div>
          </aside>

          {/* Product Grid Area */}
          <main className="shop-products-main">
            {loading ? (
              <div className="shop-loading-state">
                <div className="spinner" />
                <p>Curating SO BEAU collection...</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="shop-empty-state">
                <h3>No pieces match your current filters</h3>
                <p>Try resetting color, size or category filters to explore all available scrubs.</p>
                <button onClick={clearAllFilters} className="btn btn-primary btn-sm">
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className={`grid-cols-${gridColumns} shop-product-grid`}>
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filters Drawer (Matching User Image 8) */}
      <div className={`mobile-filter-drawer ${isMobileFiltersOpen ? 'open' : ''}`}>
        <div className="mobile-filter-panel">
          <div className="mobile-filter-header">
            <h3>Filters</h3>
            <button onClick={() => setIsMobileFiltersOpen(false)} aria-label="Close filters" className="close-filter-btn">
              <X size={20} />
            </button>
          </div>

          <div className="mobile-filter-body">
            {/* 1. Discount Range Pills */}
            <div className="filter-group">
              <h4 className="filter-title">Discount Range</h4>
              <div className="discount-pills-row">
                {[10, 20, 30, 40, 50, 60].map((d) => (
                  <button
                    key={d}
                    type="button"
                    className={`discount-pill ${selectedDiscount === d ? 'active' : ''}`}
                    onClick={() => setSelectedDiscount(selectedDiscount === d ? null : d)}
                  >
                    {d}%
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Price Range */}
            <div className="filter-group">
              <div className="price-header-row">
                <h4 className="filter-title">Price Range</h4>
                <span className="price-val">${maxPrice} AUD</span>
              </div>
              <input
                type="range"
                min="50"
                max="200"
                step="5"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="price-slider"
              />
              <div className="price-slider-limits">
                <span>$50 AUD</span>
                <span>$200 AUD</span>
              </div>
            </div>

            {/* 3. Sizes */}
            <div className="filter-group">
              <h4 className="filter-title">Size</h4>
              <div className="size-chips-grid">
                {['XXS', 'XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'].map((size) => {
                  const matchSize = AVAILABLE_SIZES.find((s) => s.includes(size)) || size;
                  const isSelected = selectedSizes.some((s) => s.includes(size));
                  return (
                    <button
                      key={size}
                      type="button"
                      className={`size-filter-chip ${isSelected ? 'selected' : ''}`}
                      onClick={() => toggleSize(matchSize)}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 4. Color Swatches with Checkmark */}
            <div className="filter-group">
              <h4 className="filter-title">Color</h4>
              <div className="color-swatches-grid">
                {AVAILABLE_COLORS.map((col) => {
                  const isSelected = selectedColors.includes(col.code);
                  return (
                    <button
                      key={col.code}
                      type="button"
                      className={`color-filter-btn ${isSelected ? 'selected' : ''}`}
                      onClick={() => toggleColor(col.code)}
                      title={col.name}
                    >
                      <span className="color-chip" style={{ backgroundColor: col.hex }}>
                        {isSelected && <Check size={11} color="#FFFFFF" />}
                      </span>
                      <span className="color-name">{col.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="mobile-filter-footer">
            <button onClick={clearAllFilters} className="clear-all-btn">
              × Clear All
            </button>
            <button onClick={() => setIsMobileFiltersOpen(false)} className="btn btn-primary apply-filters-btn">
              Apply ({selectedColors.length + selectedSizes.length + (categoryParam !== 'all' ? 1 : 0) + (selectedDiscount ? 1 : 0) || filteredProducts.length})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

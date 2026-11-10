import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Search, X, ArrowRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { api } from '../../services/api';
import { Product } from '../../types';
import '../../styles/components/SearchModal.scss';

const POPULAR_SEARCHES = ["Women's Scrubs", "Men's Scrubs", 'Deep Charcoal', 'Soft Sage', 'French Navy', 'Warm Taupe'];

export const SearchModal: React.FC = () => {
  const { isSearchOpen, closeSearch } = useCart();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
      setResults([]);
    }
  }, [isSearchOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await api.getProducts({ search: query.trim() });
        setResults(res.data || []);
      } catch (err) {
        console.error('Search error', err);
      } finally {
        setIsLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isSearchOpen) return null;

  return (
    <div className="search-modal-overlay animate-fade-in" onClick={closeSearch}>
      <div className="search-modal-box animate-slide-in-down" onClick={(e) => e.stopPropagation()}>
        <div className="search-bar-row">
          <Search size={22} className="search-icon" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search scrubs, cuts, colours, or fabric technology..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="search-input"
          />
          {query && (
            <button onClick={() => setQuery('')} className="clear-btn" aria-label="Clear query">
              <X size={18} />
            </button>
          )}
          <button onClick={closeSearch} className="close-search-btn" aria-label="Close search">
            ESC
          </button>
        </div>

        {/* Popular searches suggestions */}
        {!query && (
          <div className="search-suggestions">
            <span className="suggestions-title">Trending Searches</span>
            <div className="suggestions-pills">
              {POPULAR_SEARCHES.map((term) => (
                <button
                  key={term}
                  className="suggestion-pill"
                  onClick={() => setQuery(term)}
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results */}
        <div className="search-results-area">
          {isLoading && <div className="search-loading">Searching SO BEAU collection...</div>}

          {!isLoading && query && results.length === 0 && (
            <div className="search-empty">
              <p>No pieces found matching "<strong>{query}</strong>".</p>
              <span className="search-tip">Try searching for terms like 'jogger', 'v-neck', 'sage', or 'modal'.</span>
            </div>
          )}

          {!isLoading && results.length > 0 && (
            <div className="results-grid">
              {results.slice(0, 6).map((product) => (
                <Link
                  key={product.id}
                  to={`/products/${product.slug}`}
                  onClick={closeSearch}
                  className="search-result-card"
                >
                  <div className="result-img-wrap">
                    <img src={product.images[0]} alt={product.name} />
                  </div>
                  <div className="result-info">
                    <span className="result-category">{product.categoryName}</span>
                    <h4 className="result-name">{product.name}</h4>
                    <span className="result-price">${product.price.toFixed(2)} AUD</span>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {results.length > 6 && (
            <div className="view-all-results">
              <Link
                to={`/collections/scrubs?search=${encodeURIComponent(query)}`}
                onClick={closeSearch}
                className="view-all-link"
              >
                View all {results.length} matching pieces <ArrowRight size={14} />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

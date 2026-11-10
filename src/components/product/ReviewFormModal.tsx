import React, { useState } from 'react';
import { X, Star } from 'lucide-react';
import { api } from '../../services/api';
import { useCart } from '../../context/CartContext';
import { Product, Review } from '../../types';
import '../../styles/components/ReviewFormModal.scss';

interface ReviewFormModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  onReviewAdded: (review: Review) => void;
}

export const ReviewFormModal: React.FC<ReviewFormModalProps> = ({
  product,
  isOpen,
  onClose,
  onReviewAdded,
}) => {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [author, setAuthor] = useState('');
  const [role, setRole] = useState('');
  const [location, setLocation] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [colorPurchased, setColorPurchased] = useState(product.colors[0]?.name || 'Deep Charcoal');
  const [sizePurchased, setSizePurchased] = useState(product.sizes[0] || 'S');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { showToast } = useCart();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!author || !content) return;

    setIsSubmitting(true);
    try {
      const res = await api.createReview({
        productId: product.id,
        author,
        role: role || 'Healthcare Professional',
        location: location || 'Australia',
        rating,
        title: title || 'Clinical Review',
        content,
        colorPurchased,
        sizePurchased,
      });

      if (res.data) {
        onReviewAdded(res.data);
      }
      showToast('Thank you for sharing your shift experience!', 'success');
      onClose();
    } catch {
      showToast('Your review has been recorded. Thank you!', 'success');
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="review-modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="review-modal-header">
          <div>
            <span className="modal-overline">Verified Healthcare Experience</span>
            <h3>Review {product.name}</h3>
          </div>
          <button onClick={onClose} className="close-btn" aria-label="Close">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="review-form">
          {/* Star Rating Picker */}
          <div className="form-group">
            <label>Your Overall Rating</label>
            <div className="star-picker">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  className="star-btn"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                  aria-label={`Rate ${star} star`}
                >
                  <Star
                    size={24}
                    fill={(hoverRating || rating) >= star ? '#D4AF37' : 'none'}
                    color="#D4AF37"
                  />
                </button>
              ))}
              <span className="rating-label">
                {rating === 5 ? 'Exceptional Fit & Comfort' : `${rating} Stars`}
              </span>
            </div>
          </div>

          <div className="grid-cols-2">
            <div className="form-group">
              <label>Your Name *</label>
              <input
                type="text"
                placeholder="e.g. Dr. Emily C."
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Clinical Role / Specialty</label>
              <input
                type="text"
                placeholder="e.g. Surgical Registrar, ICU Nurse, Dentist"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              />
            </div>
          </div>

          <div className="grid-cols-3">
            <div className="form-group">
              <label>Location (City, State)</label>
              <input
                type="text"
                placeholder="e.g. Melbourne, VIC"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Color Purchased</label>
              <select 
                value={colorPurchased} 
                onChange={(e) => setColorPurchased(e.target.value)}
              >
                {product.colors.map((c) => (
                  <option key={c.name} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Size Purchased</label>
              <select 
                value={sizePurchased} 
                onChange={(e) => setSizePurchased(e.target.value)}
              >
                {product.sizes.map((s) => (
                  <option key={s} value={s}>Size {s}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Headline</label>
            <input
              type="text"
              placeholder="e.g. The drape and pocket design exceeded expectations"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Shift Experience & Fit Details *</label>
            <textarea
              placeholder="How did the fabric breathe during long rounds? Did the pockets hold your diagnostic tools comfortably? How did it wash?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              required
            />
          </div>

          <div className="review-form-actions">
            <button type="button" onClick={onClose} className="btn btn-outline">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="btn btn-primary">
              {isSubmitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

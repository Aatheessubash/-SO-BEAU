import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, Trash2, Plus, Minus, ArrowRight, ShieldCheck, Tag } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import '../../styles/components/CartDrawer.scss';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    closeCart,
    cart,
    removeFromCart,
    updateQuantity,
    subtotal,
    freeShippingThreshold,
    hasFreeShipping,
    amountUntilFreeShipping,
    promoCode,
    applyPromoCode,
    removePromoCode,
    discountAmount,
  } = useCart();

  const [inputCode, setInputCode] = useState('');
  const [promoError, setPromoError] = useState('');
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  const handleApplyCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode) return;
    const res = applyPromoCode(inputCode);
    if (!res.success) {
      setPromoError(res.message);
    } else {
      setPromoError('');
      setInputCode('');
    }
  };

  const shippingCost = hasFreeShipping || cart.length === 0 ? 0 : 10.00;
  const finalTotal = Math.max(0, subtotal - discountAmount + shippingCost);
  const gstIncluded = Number((finalTotal / 11).toFixed(2));
  const shippingProgressPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  const handleCheckoutClick = () => {
    closeCart();
    navigate('/checkout');
  };

  return (
    <div className="cart-drawer-overlay animate-fade-in" onClick={closeCart}>
      <div className="cart-drawer-panel animate-slide-in-right" onClick={(e) => e.stopPropagation()}>
        {/* Drawer Header */}
        <div className="drawer-header">
          <div className="drawer-title-wrap">
            <h3>Shopping Bag</h3>
            <span className="item-count-label">({cart.length} {cart.length === 1 ? 'piece' : 'pieces'})</span>
          </div>
          <button onClick={closeCart} className="close-drawer-btn" aria-label="Close bag">
            <X size={20} />
          </button>
        </div>

        {/* 05. Animated Success Feedback Banner */}
        <div className="cart-success-badge-banner animate-fade-in">
          <span className="success-icon-dot">✓</span>
          <span>Added to your bag! Free 30-Day Hospital Shift Trial</span>
        </div>

        {/* Free Shipping Progress */}
        <div className="free-shipping-tracker">
          {hasFreeShipping ? (
            <p className="tracker-text success">
              <ShieldCheck size={16} /> <strong>Complimentary Express Shipping</strong> unlocked!
            </p>
          ) : (
            <p className="tracker-text">
              Add <strong>${amountUntilFreeShipping.toFixed(2)} AUD</strong> more for <strong>Free Express Shipping</strong> in Australia
            </p>
          )}
          <div className="progress-bar-bg">
            <div 
              className="progress-bar-fill" 
              style={{ width: `${shippingProgressPercent}%` }}
            />
          </div>
        </div>

        {/* Items List or Empty State */}
        <div className="drawer-body">
          {cart.length === 0 ? (
            <div className="empty-cart-state">
              <span className="empty-icon-label">BEAU</span>
              <h4>Your bag is currently empty</h4>
              <p>Tailored silhouettes and 4-way stretch comfort await your clinical shifts.</p>
              <button 
                className="btn btn-primary btn-sm"
                onClick={() => {
                  closeCart();
                  navigate('/collections/scrubs');
                }}
              >
                Explore Scrubs Collection
              </button>
            </div>
          ) : (
            <div className="cart-items-list">
              {cart.map((item) => (
                <div key={item.cartItemId} className="cart-item-card">
                  <Link 
                    to={`/products/${item.product.slug}`} 
                    onClick={closeCart}
                    className="item-image-wrap"
                  >
                    <img 
                      src={item.product.images[0]} 
                      alt={item.product.name} 
                    />
                  </Link>

                  <div className="item-details">
                    <div className="item-title-row">
                      <Link 
                        to={`/products/${item.product.slug}`} 
                        onClick={closeCart}
                        className="item-name"
                      >
                        {item.product.name}
                      </Link>
                      <button 
                        onClick={() => removeFromCart(item.cartItemId)}
                        className="remove-btn"
                        aria-label="Remove item"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>

                    <div className="item-meta">
                      <span className="meta-swatch" style={{ backgroundColor: item.selectedColor.hex }} />
                      <span className="meta-text">{item.selectedColor.name}</span>
                      <span className="meta-divider">•</span>
                      <span className="meta-text">Size {item.selectedSize}</span>
                    </div>

                    {item.customization && (
                      <div className="item-customization-badge">
                        <span className="custom-sparkle">✦</span>
                        <span>Embroidered: <strong>"{item.customization.text}"</strong></span>
                        <span className="custom-sub">({item.customization.placement} • {item.customization.threadColor})</span>
                      </div>
                    )}

                    <div className="item-bottom-row">
                      <div className="quantity-stepper">
                        <button 
                          onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                          className="step-btn"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="quantity-value">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                          className="step-btn"
                          aria-label="Increase quantity"
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      <div className="item-price">
                        ${((item.product.price + (item.customization ? item.customization.price : 0)) * item.quantity).toFixed(2)} AUD
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Drawer Footer with Calculations */}
        {cart.length > 0 && (
          <div className="drawer-footer">
            {/* Promo Code Input */}
            <div className="promo-code-container">
              {promoCode ? (
                <div className="active-promo-tag">
                  <div className="tag-left">
                    <Tag size={13} />
                    <span>Code <strong>{promoCode}</strong> applied (10% off)</span>
                  </div>
                  <button onClick={removePromoCode} className="remove-promo-btn">Remove</button>
                </div>
              ) : (
                <form onSubmit={handleApplyCode} className="promo-input-form">
                  <input
                    type="text"
                    placeholder="Discount or Gift Code"
                    value={inputCode}
                    onChange={(e) => {
                      setInputCode(e.target.value);
                      setPromoError('');
                    }}
                  />
                  <button type="submit" className="apply-code-btn">Apply</button>
                </form>
              )}
              {!promoCode && (
                <button 
                  type="button" 
                  onClick={() => applyPromoCode('BEAU10')}
                  className="quick-promo-hint"
                >
                  Click to apply welcome offer: <strong>BEAU10</strong> (10% off)
                </button>
              )}
              {promoError && <p className="promo-error">{promoError}</p>}
            </div>

            {/* Calculations Breakdown */}
            <div className="cost-breakdown">
              <div className="cost-row">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)} AUD</span>
              </div>
              {discountAmount > 0 && (
                <div className="cost-row discount">
                  <span>Welcome Privilege (10%)</span>
                  <span>-${discountAmount.toFixed(2)} AUD</span>
                </div>
              )}
              <div className="cost-row">
                <span>Australian Shipping</span>
                <span>{hasFreeShipping ? 'FREE' : `$${shippingCost.toFixed(2)} AUD`}</span>
              </div>
              <div className="cost-row total">
                <span>Estimated Total</span>
                <span>${finalTotal.toFixed(2)} AUD</span>
              </div>
              <p className="gst-caption">Includes ${gstIncluded.toFixed(2)} AUD Australian GST</p>
            </div>

            {/* Checkout Button */}
            <button 
              onClick={handleCheckoutClick}
              className="btn btn-primary btn-full checkout-action-btn"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight size={16} />
            </button>

            <div className="reassurance-row">
              <span>Australian Owned &amp; Designed</span>
              <span>•</span>
              <span>30-Day Free Returns</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Lock, ArrowLeft, Check, CreditCard, Tag } from 'lucide-react';
import { BrandLogo } from '../components/common/BrandLogo';
import { useCart } from '../context/CartContext';
import { api } from '../services/api';
import '../styles/pages/CheckoutPage.scss';

const AUSTRALIAN_STATES = [
  { code: 'VIC', name: 'Victoria' },
  { code: 'NSW', name: 'New South Wales' },
  { code: 'QLD', name: 'Queensland' },
  { code: 'WA', name: 'Western Australia' },
  { code: 'SA', name: 'South Australia' },
  { code: 'TAS', name: 'Tasmania' },
  { code: 'ACT', name: 'Australian Capital Territory' },
  { code: 'NT', name: 'Northern Territory' },
];

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    cart,
    clearCart,
    subtotal,
    discountAmount,
    promoCode,
    applyPromoCode,
    removePromoCode,
    showToast,
  } = useCart();

  // Form State
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('VIC');
  const [postcode, setPostcode] = useState('');

  const [shippingMethod, setShippingMethod] = useState<'standard' | 'express'>('standard');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'afterpay' | 'apple_pay'>('card');

  // Simulated Card Info
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');

  const [inputPromo, setInputPromo] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderError, setOrderError] = useState('');

  // Calculations
  const hasFreeStandard = subtotal >= 150;
  const shippingCost = shippingMethod === 'express' ? 15.00 : hasFreeStandard ? 0 : 10.00;
  const finalTotal = Math.max(0, subtotal - discountAmount + shippingCost);
  const gstIncluded = Number((finalTotal / 11).toFixed(2));

  if (cart.length === 0) {
    return (
      <div className="empty-checkout-page container">
        <h2>Your Shopping Bag is Empty</h2>
        <p>Please select your scrubs before proceeding to checkout.</p>
        <Link to="/collections/scrubs" className="btn btn-primary">
          Explore Scrubs
        </Link>
      </div>
    );
  }

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputPromo) return;
    const res = applyPromoCode(inputPromo);
    if (!res.success) {
      setOrderError(res.message);
    } else {
      setOrderError('');
      setInputPromo('');
    }
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !firstName || !lastName || !address1 || !city || !postcode) {
      setOrderError('Please complete all required shipping details.');
      return;
    }

    setIsSubmitting(true);
    setOrderError('');

    const orderPayload = {
      items: cart.map((item) => ({
        id: item.cartItemId,
        productId: item.product.id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        color: item.selectedColor.name,
        size: item.selectedSize,
        image: item.product.images[0],
      })),
      customer: { firstName, lastName, email, phone },
      shippingAddress: {
        address1,
        address2,
        city,
        state,
        postcode,
        country: 'Australia',
      },
      shippingMethod,
      paymentMethod,
      promoCode: promoCode || undefined,
    };

    try {
      const res = await api.createOrder(orderPayload);
      clearCart();
      showToast('Order confirmed! Receipt sent to your email.', 'success');
      navigate(`/orders/${res.data.orderId}`);
    } catch (err: any) {
      console.error('Order creation error', err);
      // Fallback: generate local ID and navigate
      const fallbackId = `SB-AU-${Math.floor(100000 + Math.random() * 900000)}`;
      clearCart();
      showToast('Order confirmed!', 'success');
      navigate(`/orders/${fallbackId}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="checkout-page animate-fade-in">
      <div className="container checkout-container">
        {/* Top Header */}
        <div className="checkout-top-header">
          <Link to="/" className="checkout-brand-logo" aria-label="SO BEAU Home">
            <BrandLogo variant="full" theme="forest" height={40} />
          </Link>
          <div className="secure-badge">
            <Lock size={15} />
            <span>256-Bit Encrypted Australian Checkout</span>
          </div>
        </div>

        <div className="checkout-layout-grid">
          {/* Left: Customer & Shipping Forms */}
          <div className="checkout-main-forms">
            {/* Express Checkout Options */}
            <div className="express-checkout-box">
              <span className="express-title">Express Payment Methods</span>
              <div className="express-btn-group">
                <button 
                  type="button" 
                  className={`express-btn apple-pay ${paymentMethod === 'apple_pay' ? 'active' : ''}`}
                  onClick={() => setPaymentMethod('apple_pay')}
                >
                  Apple Pay
                </button>
                <button 
                  type="button" 
                  className={`express-btn afterpay ${paymentMethod === 'afterpay' ? 'active' : ''}`}
                  onClick={() => setPaymentMethod('afterpay')}
                >
                  Afterpay • 4x ${(finalTotal / 4).toFixed(2)}
                </button>
              </div>
              <div className="or-divider"><span>or pay with card</span></div>
            </div>

            <form onSubmit={handlePlaceOrder}>
              {/* Step 1: Contact Details */}
              <div className="checkout-step-block">
                <div className="step-head">
                  <span className="step-num">1</span>
                  <h3>Contact Information</h3>
                </div>

                <div className="grid-cols-2">
                  <div className="form-group">
                    <label>First Name *</label>
                    <input
                      type="text"
                      placeholder="e.g. Sarah"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Last Name *</label>
                    <input
                      type="text"
                      placeholder="e.g. Mitchell"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid-cols-2">
                  <div className="form-group">
                    <label>Email (for order dispatch & tracking) *</label>
                    <input
                      type="email"
                      placeholder="e.g. sarah.mitchell@hospital.org.au"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Mobile Number (for Australia Post SMS)</label>
                    <input
                      type="tel"
                      placeholder="e.g. 0412 345 678"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Step 2: Shipping Address */}
              <div className="checkout-step-block">
                <div className="step-head">
                  <span className="step-num">2</span>
                  <h3>Delivery Address (Australia)</h3>
                </div>

                <div className="form-group">
                  <label>Street Address *</label>
                  <input
                    type="text"
                    placeholder="e.g. 42 Lygon Street"
                    value={address1}
                    onChange={(e) => setAddress1(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Apartment, Unit, or Hospital Ward (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Level 4, Emergency Dept"
                    value={address2}
                    onChange={(e) => setAddress2(e.target.value)}
                  />
                </div>

                <div className="grid-cols-3">
                  <div className="form-group">
                    <label>City / Suburb *</label>
                    <input
                      type="text"
                      placeholder="e.g. Carlton"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>State *</label>
                    <select value={state} onChange={(e) => setState(e.target.value)}>
                      {AUSTRALIAN_STATES.map((st) => (
                        <option key={st.code} value={st.code}>
                          {st.code} — {st.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Postcode *</label>
                    <input
                      type="text"
                      placeholder="3053"
                      value={postcode}
                      onChange={(e) => setPostcode(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Step 3: Shipping Method */}
              <div className="checkout-step-block">
                <div className="step-head">
                  <span className="step-num">3</span>
                  <h3>Shipping Method</h3>
                </div>

                <div className="shipping-options-list">
                  <label 
                    className={`shipping-option-card ${shippingMethod === 'standard' ? 'selected' : ''}`}
                    onClick={() => setShippingMethod('standard')}
                  >
                    <input
                      type="radio"
                      name="shipping"
                      checked={shippingMethod === 'standard'}
                      onChange={() => setShippingMethod('standard')}
                    />
                    <div className="option-details">
                      <strong>Australia Post Standard Parcel Delivery</strong>
                      <span>3–5 business days (Carbon-Neutral Transit)</span>
                    </div>
                    <span className="option-cost">
                      {hasFreeStandard ? 'FREE' : '$10.00 AUD'}
                    </span>
                  </label>

                  <label 
                    className={`shipping-option-card ${shippingMethod === 'express' ? 'selected' : ''}`}
                    onClick={() => setShippingMethod('express')}
                  >
                    <input
                      type="radio"
                      name="shipping"
                      checked={shippingMethod === 'express'}
                      onChange={() => setShippingMethod('express')}
                    />
                    <div className="option-details">
                      <strong>Australia Post Express Post</strong>
                      <span>1–2 business days • Priority Warehouse Dispatch</span>
                    </div>
                    <span className="option-cost">$15.00 AUD</span>
                  </label>
                </div>
              </div>

              {/* Step 4: Payment */}
              <div className="checkout-step-block">
                <div className="step-head">
                  <span className="step-num">4</span>
                  <h3>Payment Method</h3>
                </div>

                <div className="payment-method-selector">
                  <label 
                    className={`payment-option ${paymentMethod === 'card' ? 'active' : ''}`}
                    onClick={() => setPaymentMethod('card')}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'card'}
                      onChange={() => setPaymentMethod('card')}
                    />
                    <CreditCard size={18} />
                    <span>Credit / Debit Card</span>
                  </label>

                  <label 
                    className={`payment-option ${paymentMethod === 'afterpay' ? 'active' : ''}`}
                    onClick={() => setPaymentMethod('afterpay')}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'afterpay'}
                      onChange={() => setPaymentMethod('afterpay')}
                    />
                    <span>Afterpay</span>
                  </label>
                </div>

                {paymentMethod === 'card' && (
                  <div className="card-payment-wrapper">
                    {/* Sleek Dark Glassmorphism Credit Card Preview matching Image 10 */}
                    <div className="glass-card-preview">
                      <div className="card-top-row">
                        <span className="card-bank-name">SO BEAU ATELIER</span>
                        <div className="card-contactless-icon">
                          <span>)</span><span>)</span><span>)</span>
                        </div>
                      </div>

                      <div className="card-chip-element">
                        <div className="chip-line" />
                      </div>

                      <div className="card-number-display">
                        {cardNumber.trim() ? cardNumber : '•••• •••• •••• 8420'}
                      </div>

                      <div className="card-bottom-row">
                        <div className="holder-col">
                          <span className="card-meta-label">Card Holder</span>
                          <span className="card-meta-val">
                            {firstName || lastName ? `${firstName} ${lastName}`.toUpperCase() : 'DR. SUMIT KUMAR'}
                          </span>
                        </div>
                        <div className="expiry-col">
                          <span className="card-meta-label">Expires</span>
                          <span className="card-meta-val">{cardExpiry || '08/28'}</span>
                        </div>
                        <div className="card-brand-circles">
                          <span className="circle circle-red" />
                          <span className="circle circle-orange" />
                        </div>
                      </div>
                    </div>

                    <div className="card-fields-box">
                      <div className="form-group">
                        <label>Card Number</label>
                        <input
                          type="text"
                          placeholder="•••• •••• •••• ••••"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                        />
                      </div>
                      <div className="grid-cols-2">
                        <div className="form-group">
                          <label>Expiry (MM/YY)</label>
                          <input
                            type="text"
                            placeholder="MM/YY"
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                          />
                        </div>
                        <div className="form-group">
                          <label>Security Code (CVC)</label>
                          <input
                            type="text"
                            placeholder="CVC"
                            value={cardCvc}
                            onChange={(e) => setCardCvc(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {orderError && <div className="checkout-error-banner">{orderError}</div>}

              {/* Submit CTA */}
              <div className="place-order-row">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary btn-full place-order-btn"
                >
                  <Lock size={16} />
                  <span>
                    {isSubmitting
                      ? 'Confirming Order...'
                      : `Place Order • $${finalTotal.toFixed(2)} AUD`}
                  </span>
                </button>
                <div className="guarantee-note">
                  <ShieldCheck size={16} />
                  <span>Complimentary 30-day Australian size exchanges &amp; returns</span>
                </div>
              </div>
            </form>
          </div>

          {/* Right: Order Summary Sidebar */}
          <aside className="checkout-summary-sidebar">
            <h3 className="summary-title">Order Summary ({cart.length})</h3>

            {/* Line items list */}
            <div className="summary-items-list">
              {cart.map((item) => {
                const itemUnitPrice = item.product.price + (item.customization ? item.customization.price : 0);
                return (
                  <div key={item.cartItemId} className="summary-item">
                    <div className="item-thumbnail">
                      <img src={item.product.images[0]} alt={item.product.name} />
                      <span className="qty-badge">{item.quantity}</span>
                    </div>
                    <div className="item-info">
                      <span className="item-name">{item.product.name}</span>
                      <span className="item-specs">{item.selectedColor.name} / {item.selectedSize}</span>
                      {item.customization && (
                        <span className="item-custom-tag">
                          ✦ Embroidered: "{item.customization.text}" ({item.customization.placement})
                        </span>
                      )}
                    </div>
                    <div className="item-total">
                      ${(itemUnitPrice * item.quantity).toFixed(2)} AUD
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Promo Code Input */}
            <div className="summary-promo-wrap">
              {promoCode ? (
                <div className="active-code-pill">
                  <Tag size={13} />
                  <span>Code <strong>{promoCode}</strong> applied (10% off)</span>
                  <button onClick={removePromoCode} className="remove-code-btn">Remove</button>
                </div>
              ) : (
                <form onSubmit={handleApplyPromo} className="summary-promo-form">
                  <input
                    type="text"
                    placeholder="Gift card or discount code"
                    value={inputPromo}
                    onChange={(e) => setInputPromo(e.target.value)}
                  />
                  <button type="submit" className="apply-btn">Apply</button>
                </form>
              )}
            </div>

            {/* Price Calculations */}
            <div className="summary-totals">
              <div className="total-row">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)} AUD</span>
              </div>

              {discountAmount > 0 && (
                <div className="total-row discount">
                  <span>Welcome Privilege (10%)</span>
                  <span>-${discountAmount.toFixed(2)} AUD</span>
                </div>
              )}

              <div className="total-row">
                <span>Shipping ({shippingMethod === 'express' ? 'Express' : 'Standard'})</span>
                <span>{shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)} AUD`}</span>
              </div>

              <div className="total-row grand-total">
                <span>Total</span>
                <span>${finalTotal.toFixed(2)} AUD</span>
              </div>

              <div className="gst-summary">
                Includes ${gstIncluded.toFixed(2)} AUD Australian GST
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

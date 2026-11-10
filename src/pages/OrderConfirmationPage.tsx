import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, Package, Truck, ArrowRight, ShieldCheck, Mail } from 'lucide-react';
import { api } from '../services/api';
import { OrderRecord } from '../types';
import '../styles/pages/OrderConfirmationPage.scss';

export const OrderConfirmationPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<OrderRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!id) return;
      try {
        const res = await api.getOrder(id);
        if (res.data) setOrder(res.data);
      } catch {
        // Fallback demo order state if server memory is fresh
        setOrder({
          orderId: id,
          createdAt: new Date().toISOString(),
          status: 'Confirmed',
          currency: 'AUD',
          items: [
            {
              id: 'item-1',
              productId: 'sb-001',
              name: "The Women's Nursing Scrub Set",
              price: 158.0,
              quantity: 1,
              color: 'Deep Charcoal',
              size: 'AU 8 (S)',
              image: '/images/female/female-navy-front.jpg',
            },
            {
              id: 'item-2',
              productId: 'sb-002',
              name: "The Men's Nursing Scrub Set",
              price: 158.0,
              quantity: 1,
              color: 'French Navy',
              size: 'AU L (42)',
              image: '/images/male/male-navy-front.jpg',
            },
          ],
          customer: {
            firstName: 'Sarah',
            lastName: 'Mitchell',
            email: 'sarah.mitchell@hospital.org.au',
            phone: '0412 345 678',
          },
          shippingAddress: {
            address1: '42 Lygon Street',
            city: 'Carlton',
            state: 'VIC',
            postcode: '3053',
            country: 'Australia',
          },
          shippingMethod: 'express',
          paymentMethod: 'card',
          discountAmount: 18.60,
          itemsSubtotal: 186.00,
          shippingCost: 0,
          gstIncluded: 15.22,
          total: 167.40,
          estimatedDelivery: '1–2 business days (Australia Post Express)',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="order-confirm-loading container">
        <p>Loading order confirmation...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="order-confirm-notfound container">
        <h2>Order Not Found</h2>
        <p>We could not retrieve order reference {id}.</p>
        <Link to="/collections/scrubs" className="btn btn-primary">
          Return to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="order-confirmation-page animate-fade-in">
      <div className="container confirmation-container">
        {/* Success Header Banner */}
        <div className="confirmation-header-card">
          <CheckCircle2 size={48} className="success-icon" />
          <span className="order-num-label">Order Confirmed • Reference #{order.orderId}</span>
          <h1 className="confirmation-title">
            Thank you, {order.customer.firstName}. Your shift wardrobe is on its way.
          </h1>
          <p className="confirmation-lead">
            We've sent your itemised tax invoice and Australia Post tracking link to <strong>{order.customer.email}</strong>.
          </p>
        </div>

        {/* 2-Column Details Grid */}
        <div className="order-details-grid">
          {/* Left: Items breakdown */}
          <div className="order-items-col">
            <h3 className="col-title">Items Ordered</h3>
            <div className="items-list">
              {order.items.map((item, idx) => (
                <div key={idx} className="order-item-row">
                  <div className="item-img-wrap">
                    <img src={item.image} alt={item.name} />
                  </div>
                  <div className="item-details">
                    <h4 className="item-name">{item.name}</h4>
                    <span className="item-specs">
                      Shade: {item.color} • Size: {item.size} • Qty: {item.quantity}
                    </span>
                    <span className="item-price">
                      ${(item.price * item.quantity).toFixed(2)} AUD
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Financial summary */}
            <div className="order-financial-breakdown">
              <div className="fin-row">
                <span>Subtotal</span>
                <span>${order.itemsSubtotal.toFixed(2)} AUD</span>
              </div>
              {order.discountAmount > 0 && (
                <div className="fin-row discount">
                  <span>Welcome Discount</span>
                  <span>-${order.discountAmount.toFixed(2)} AUD</span>
                </div>
              )}
              <div className="fin-row">
                <span>Shipping ({order.shippingMethod.toUpperCase()})</span>
                <span>{order.shippingCost === 0 ? 'FREE' : `$${order.shippingCost.toFixed(2)} AUD`}</span>
              </div>
              <div className="fin-row total">
                <span>Total Paid</span>
                <span>${order.total.toFixed(2)} AUD</span>
              </div>
              <p className="gst-note">Includes ${order.gstIncluded.toFixed(2)} AUD Australian GST</p>
            </div>
          </div>

          {/* Right: Shipping & Next Steps */}
          <div className="order-shipping-col">
            <div className="info-box">
              <div className="box-head">
                <Truck size={18} />
                <h4>Delivery Details</h4>
              </div>
              <div className="address-block">
                <strong>{order.customer.firstName} {order.customer.lastName}</strong>
                <span>{order.shippingAddress.address1}</span>
                {order.shippingAddress.address2 && <span>{order.shippingAddress.address2}</span>}
                <span>
                  {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postcode}
                </span>
                <span>{order.shippingAddress.country}</span>
              </div>
              <div className="delivery-timing-badge">
                <Package size={15} />
                <span>Estimated Delivery: <strong>{order.estimatedDelivery}</strong></span>
              </div>
            </div>

            <div className="info-box">
              <div className="box-head">
                <ShieldCheck size={18} />
                <h4>The SO BEAU Shift Guarantee</h4>
              </div>
              <p className="guarantee-text">
                Try your scrubs on during real clinical routines. If you need a different size, length, or shade, our complimentary Australian returns portal has you covered for 30 days.
              </p>
              <Link to="/pages/returns" className="btn-text">
                How Our Free Exchange Portal Works &rarr;
              </Link>
            </div>

            <div className="next-actions-row">
              <Link to="/collections/scrubs" className="btn btn-primary btn-full">
                <span>Continue Exploring Collections</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

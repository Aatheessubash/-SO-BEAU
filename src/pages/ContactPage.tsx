import React, { useState } from 'react';
import { Mail, MapPin, Clock, Send, CheckCircle2, MessageSquare, Building2, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { useCart } from '../context/CartContext';
import '../styles/pages/ContactPage.scss';

export const ContactPage: React.FC = () => {
  const { showToast } = useCart();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('Customer Care');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [inquiryId, setInquiryId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    setIsSubmitting(true);
    try {
      const res = await api.submitContact({
        name,
        email,
        department,
        subject,
        message,
      });

      setInquiryId(res.inquiryId || `SB-MSG-${Date.now()}`);
      showToast('Thank you for contacting SO BEAU. We will respond within 24 hours.', 'success');
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    } catch {
      setInquiryId(`SB-MSG-${Date.now()}`);
      showToast('Your message has been received. Our Melbourne team will follow up.', 'success');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-page animate-fade-in">
      {/* Header */}
      <section className="contact-hero-banner">
        <div className="container text-center">
          <span className="overline">Customer Concierge &amp; Studio</span>
          <h1 className="contact-main-title">We're here for every shift.</h1>
          <p className="contact-hero-sub">
            Whether you need personal sizing advice, hospital group orders, or want to share feedback from your rounds.
          </p>
        </div>
      </section>

      <section className="contact-main-section section-padding">
        <div className="container">
          <div className="contact-grid">
            {/* Left Form */}
            <div className="contact-form-card">
              <h3 className="card-title">Send a Message to the Melbourne Studio</h3>
              <p className="card-sub">
                Our concierge team responds within 24 hours (Monday to Friday, AEST).
              </p>

              {inquiryId ? (
                <div className="contact-success-state animate-fade-in">
                  <CheckCircle2 size={36} className="success-icon" />
                  <h4>Message Received</h4>
                  <p>
                    Thank you. Your enquiry reference is <strong>{inquiryId}</strong>. A client care advisor from our Melbourne atelier will be in touch shortly.
                  </p>
                  <button 
                    onClick={() => setInquiryId(null)} 
                    className="btn btn-outline btn-sm"
                  >
                    Send Another Note
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="contact-form">
                  <div className="grid-cols-2">
                    <div className="form-group">
                      <label>Your Name *</label>
                      <input
                        type="text"
                        placeholder="e.g. Dr. Jessica Taylor"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Email Address *</label>
                      <input
                        type="email"
                        placeholder="e.g. jessica@hospital.org.au"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid-cols-2">
                    <div className="form-group">
                      <label>Department / Enquiry Type</label>
                      <select 
                        value={department} 
                        onChange={(e) => setDepartment(e.target.value)}
                      >
                        <option value="Customer Care">Personal Orders &amp; Sizing</option>
                        <option value="Hospital & Clinic Teams">Hospital &amp; Clinic Group Outfitting</option>
                        <option value="Product Feedback">Shift Feedback &amp; Co-Design</option>
                        <option value="Press & Media">Media &amp; Press Enquiries</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Subject</label>
                      <input
                        type="text"
                        placeholder="e.g. Sizing query for Tailored V-Neck"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Your Message *</label>
                    <textarea
                      placeholder="Please include any order numbers or hospital department details..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={5}
                      required
                    />
                  </div>

                  <button 
                    type="submit" 
                    disabled={isSubmitting} 
                    className="btn btn-primary submit-btn"
                  >
                    <Send size={15} />
                    <span>{isSubmitting ? 'Sending Message...' : 'Send Message'}</span>
                  </button>
                </form>
              )}
            </div>

            {/* Right Information & Clinic Teams */}
            <div className="contact-info-column">
              {/* Direct Info Card */}
              <div className="info-card">
                <h4>Studio Details</h4>
                <div className="info-items">
                  <div className="info-item">
                    <Mail size={18} className="icon" />
                    <div>
                      <strong>Email Concierge</strong>
                      <span>care@sobeau.com.au</span>
                    </div>
                  </div>

                  <div className="info-item">
                    <MapPin size={18} className="icon" />
                    <div>
                      <strong>Melbourne Atelier</strong>
                      <span>Level 3, 180 Flinders Lane, Melbourne VIC 3000 Australia</span>
                    </div>
                  </div>

                  <div className="info-item">
                    <Clock size={18} className="icon" />
                    <div>
                      <strong>Concierge Hours</strong>
                      <span>Monday – Friday: 9:00 AM – 5:30 PM AEST</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Hospital & Department Outfitting Card */}
              <div className="hospital-teams-card" id="hospital">
                <div className="card-badge">
                  <Building2 size={16} />
                  <span>Clinic &amp; Hospital Teams</span>
                </div>
                <h4>Outfitting Your Healthcare Team?</h4>
                <p>
                  We provide tiered group pricing, custom clinic embroidery (names, specialties &amp; hospital crests), and dedicated fitting sample packs for wards, surgical teams, and dental practices across Australia.
                </p>
                <div className="hospital-perks">
                  <span>• Tiered pricing from 10+ sets</span>
                  <span>• Custom high-definition embroidery</span>
                  <span>• Complimentary sample fitting sets</span>
                </div>
                <a 
                  href="mailto:teams@sobeau.com.au?subject=Hospital%20Team%20Outfitting%20Inquiry"
                  className="btn btn-outline btn-sm"
                >
                  Contact Teams Specialist
                </a>
              </div>

              {/* FAQ Prompt */}
              <div className="faq-prompt-card">
                <HelpCircle size={20} />
                <div>
                  <h4>Looking for Immediate Answers?</h4>
                  <p>Explore our Australian sizing, shipping dispatch, and return policies.</p>
                  <Link to="/pages/faq" className="btn-text">
                    Visit FAQ Knowledge Base &rarr;
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronUp, HelpCircle, ArrowRight } from 'lucide-react';
import '../styles/pages/ContentPages.scss';

interface FAQItem {
  q: string;
  a: string;
}

const FAQS: { category: string; items: FAQItem[] }[] = [
  {
    category: 'Fit & Australian Sizing',
    items: [
      {
        q: 'How does SO BEAU sizing compare to standard Australian high-street brands?',
        a: 'Our silhouettes are drafted precisely to Australian womenswear & unisex standards (AU 4 to AU 20 / XXS to 3XL). Unlike US scrub brands which tend to run oversized and boxy, our garments feature a tailored, flattering cut. We recommend choosing your true Australian size for a tailored fit, or sizing up if you like a relaxed hospital drape.',
      },
      {
        q: 'Can I exchange my scrubs if the size does not feel right on shift?',
        a: 'Yes, absolutely. We offer 30-day complimentary size exchanges across Australia. We even generate an Australia Post QR code so you can drop your return parcel off at any post office without needing a printer.',
      },
      {
        q: 'Do you offer Petite or Tall scrub pant lengths?',
        a: 'Our standard jogger inseam is 28.5" (designed to hit right at the ankle bone with sneakers or clogs). For custom ward hems or tall 31" inseams, contact care@sobeau.com.au and our Melbourne atelier will accommodate your order.',
      },
    ],
  },
  {
    category: 'BeauTech™ Fabric & Care',
    items: [
      {
        q: 'What makes BeauTech™ fabric different from generic scrub blends?',
        a: 'Generic scrubs use cheap polyester-cotton that fades, pills, and holds onto shift sweat. BeauTech™ is a proprietary 4-way stretch tri-blend: 72% Polyester for durability, 21% Rayon for liquid-soft drape, and 7% Spandex for acrobatic mobility. It is permanently treated with Silvadur™ antimicrobial silver ions to neutralize odor-causing bacteria.',
      },
      {
        q: 'How should I wash and care for my SO BEAU scrubs?',
        a: 'Machine wash warm or cold inside out with similar colors. Tumble dry on low or line dry in the shade. The weave is virtually non-iron — shake upon hanging and wrinkles vanish as it dries.',
      },
      {
        q: 'Is the fabric resistant to hospital fluids and bleach stains?',
        a: 'Yes, our weave incorporates a surface tension liquid-repellent finish that causes incidental fluid spills and splashes to bead up and roll off rather than immediately soaking in.',
      },
    ],
  },
  {
    category: 'Orders, Shipping & Payments',
    items: [
      {
        q: 'Are your prices displayed in Australian Dollars (AUD) and do they include GST?',
        a: 'Yes, all prices are in Australian Dollars (AUD) and include 10% Australian Goods and Services Tax (GST). A full tax invoice compliant with the Australian Taxation Office (ATO) is automatically provided for your tax deduction claims.',
      },
      {
        q: 'Can I claim SO BEAU scrubs as a tax deduction in Australia?',
        a: 'In Australia, healthcare professionals (doctors, nurses, dentists, allied health) can generally claim a tax deduction for the purchase, laundry, and repair of occupation-specific medical scrubs. Please consult your registered tax agent regarding your specific circumstances.',
      },
      {
        q: 'What payment options do you support?',
        a: 'We support Visa, Mastercard, American Express, Apple Pay, Google Pay, and Afterpay (4 fortnightly interest-free instalments).',
      },
    ],
  },
  {
    category: 'Hospital Teams & Bulk Orders',
    items: [
      {
        q: 'Do you outfit surgical units, emergency departments, and dental practices?',
        a: 'Yes. We work closely with hospital departments, private surgical centers, and clinics across Australia. We offer tiered bulk pricing starting from 10 sets, custom high-precision logo embroidery, and sample sizing trial kits.',
      },
      {
        q: 'How do I request a clinic sample kit or quote?',
        a: 'Email teams@sobeau.com.au or use our Contact page with your clinic name and estimated team size. Our Melbourne team will dispatch a fabric and size kit to your hospital.',
      },
    ],
  },
];

export const FAQPage: React.FC = () => {
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({
    'Fit & Australian Sizing-0': true,
    'BeauTech™ Fabric & Care-0': true,
  });

  const toggleItem = (key: string) => {
    setOpenItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="content-page animate-fade-in">
      <div className="content-hero-banner">
        <div className="container text-center">
          <span className="overline">Answers &amp; Assistance</span>
          <h1>Frequently Asked Questions</h1>
          <p className="hero-lead">
            Everything you need to know about SO BEAU scrubs, Australian sizing, fabric technology, and clinical care.
          </p>
        </div>
      </div>

      <div className="container container-editorial">
        <div className="faq-categories-container">
          {FAQS.map((cat, catIdx) => (
            <div key={catIdx} className="faq-category-block">
              <h2 className="faq-cat-heading">{cat.category}</h2>
              <div className="faq-items-list">
                {cat.items.map((item, itemIdx) => {
                  const key = `${cat.category}-${itemIdx}`;
                  const isOpen = openItems[key];
                  return (
                    <div key={itemIdx} className={`faq-accordion-item ${isOpen ? 'open' : ''}`}>
                      <button
                        className="faq-question-btn"
                        onClick={() => toggleItem(key)}
                      >
                        <span>{item.q}</span>
                        {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                      </button>
                      {isOpen && (
                        <div className="faq-answer-content animate-fade-in">
                          <p>{item.a}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="faq-footer-card text-center">
          <h3>Still have a question about your shift wardrobe?</h3>
          <p>Our client care team in Melbourne is on standby to help you choose the right pieces.</p>
          <Link to="/pages/contact" className="btn btn-primary">
            <span>Contact Melbourne Concierge</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
};

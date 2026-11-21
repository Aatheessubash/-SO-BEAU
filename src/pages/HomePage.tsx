import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ChevronRight, ShieldCheck, MoveRight } from 'lucide-react';
import { api } from '../services/api';
import { Product } from '../types';
import productsFallback from '../../server/data/products.json';

const reviews = [
  {
    quote: 'Finally, scrubs that fit like high-end designer pieces. The drape is flattering, the fabric breathes during high-stress resus calls, and the waistband stays in place through a long shift.',
    name: 'Dr. Sarah Mitchell',
    role: 'Emergency Medicine Registrar',
    hospital: 'Royal Melbourne Hospital',
    shade: 'Deep Charcoal · AU 8',
  },
  {
    quote: 'The 4-way stretch has no resistance. The dedicated shears pocket and phone zip pocket are perfectly positioned for the pace of trauma resuscitation.',
    name: 'Marcus Evans',
    role: 'Trauma Resuscitation Nurse',
    hospital: "St Vincent's Hospital, Sydney",
    shade: 'Deep Charcoal · AU L',
  },
  {
    quote: 'Standing in theatre for an eight-hour procedure requires fabric that does not hold moisture or restrict shoulder reach. SO BEAU gave me back my personal style.',
    name: 'Dr. Anika Patel',
    role: 'Surgical Registrar',
    hospital: 'Princess Alexandra Hospital',
    shade: 'Soft Sage · AU 10',
  },
];

const explorerFeatures = [
  {
    id: 'pockets',
    number: '01',
    title: 'Clinical storage, considered',
    copy: 'Dedicated trauma-shear storage, reinforced bar-tacks and purpose-positioned pockets keep essential tools close without interrupting the silhouette.',
    image: '/images/female/female-top-pocket-detail.jpg',
    label: 'TRAUMA-SHEAR POCKET',
  },
  {
    id: 'fabric',
    number: '02',
    title: 'A considered fabric system',
    copy: 'BeauTech™ 4-way recoil stretch is paired with Silvadur™ antimicrobial silver technology for breathable comfort through demanding shifts.',
    image: '/images/female/female-fabric-tech.png',
    label: 'BEAUTECH™ + SILVADUR™',
  },
  {
    id: 'movement',
    number: '03',
    title: 'Freedom in every movement',
    copy: 'Ergonomic shaping, stretch panels and carefully placed seams support bending, reaching and long hours on your feet.',
    image: '/images/female/female-pants-fit.jpg',
    label: 'RIBBED ERGONOMICS',
  },
];

export const HomePage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(productsFallback as unknown as Product[]);
  const [activeFeature, setActiveFeature] = useState(0);

  useEffect(() => {
    let mounted = true;
    api.getProducts().then((res) => {
      if (mounted && res.data?.length) setProducts(res.data);
    }).catch(() => {
      // Keep the archived product catalogue available when the API is offline.
    });
    return () => { mounted = false; };
  }, []);

  const featuredProducts = useMemo(() => products.slice(0, 4), [products]);
  const feature = explorerFeatures[activeFeature];

  return (
    <div className="quiet-home">
      <section className="qh-hero">
        <div className="qh-hero-media">
          <video
            className="qh-hero-video"
            src="/video/VN20261109_081100.mp4"
            poster="/images/campaign-video-poster.jpg"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
          />
          <div className="qh-hero-wash" />
          <img className="qh-hero-cutout" src="/images/hero-models-cutout.png" alt="SO BEAU medical apparel, tailored for clinical work" fetchPriority="high" />
        </div>
        <div className="qh-hero-copy">
          <span className="qh-eyebrow">MELBOURNE ATELIER · CLINICAL APPAREL</span>
          <h1>Precision in practice.<br /><em>Ease in every movement.</em></h1>
          <p>Medical apparel shaped by the rhythm of clinical work and the quiet confidence of considered design.</p>
          <div className="qh-hero-actions">
            <Link to="/collections/scrubs" className="qh-button qh-button-dark">Explore the collection <ArrowUpRight size={15} /></Link>
            <Link to="/pages/our-story" className="qh-text-link">Discover the atelier <MoveRight size={15} /></Link>
          </div>
          <div className="qh-hero-note"><span /> BEAUTECH™ 4-WAY STRETCH <span /> SILVADUR™ ANTIMICROBIAL TECHNOLOGY</div>
        </div>
        <div className="qh-hero-index">01 / 04 <span>THE CLINICAL EDITION</span></div>
      </section>

      <section className="qh-intro qh-container">
        <div className="qh-section-label">01 — THE COLLECTION</div>
        <div className="qh-intro-grid">
          <h2>Workwear, <em>reconsidered.</em></h2>
          <p>Every line has a purpose. Every detail earns its place. SO BEAU brings together tailored silhouettes, considered materials and practical engineering for the people who care for others.</p>
        </div>
      </section>

      <section className="qh-products qh-container">
        <div className="qh-section-heading">
          <div><span className="qh-eyebrow">THE SO BEAU WARDROBE</span><h2>Pieces for the <em>long shift.</em></h2></div>
          <Link to="/collections/scrubs" className="qh-text-link">View all pieces <MoveRight size={15} /></Link>
        </div>
        <div className="qh-product-grid">
          {featuredProducts.map((product, index) => (
            <Link to={`/products/${product.slug}`} className="qh-product" key={product.id}>
              <div className="qh-product-image">
                <img src={product.images?.[0] || '/images/campaign-video-poster.jpg'} alt={product.name} loading={index > 1 ? 'lazy' : 'eager'} />
                <span className="qh-product-number">0{index + 1}</span>
                <span className="qh-product-arrow"><ArrowUpRight size={17} /></span>
              </div>
              <div className="qh-product-meta"><span>{product.categoryName || 'ATELIER COLLECTION'}</span><span>${Number(product.price).toFixed(0)} AUD</span></div>
              <h3>{product.name}</h3>
              <p>{product.headline || 'Tailored clinical apparel'}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="qh-engineering">
        <div className="qh-engineering-image">
          <img src={feature.image} alt={feature.label} loading="lazy" />
          <span className="qh-image-caption">FIG. {feature.number} / GARMENT ENGINEERING</span>
        </div>
        <div className="qh-engineering-copy">
          <span className="qh-eyebrow">02 — THE ANATOMY OF A BETTER SHIFT</span>
          <h2>Designed around<br /><em>the work you do.</em></h2>
          <p className="qh-engineering-lead">Function is not an afterthought. It is built into the pattern.</p>
          <div className="qh-feature-tabs" role="tablist" aria-label="Clinical garment features">
            {explorerFeatures.map((item, index) => (
              <button key={item.id} type="button" role="tab" aria-selected={activeFeature === index} className={activeFeature === index ? 'is-active' : ''} onClick={() => setActiveFeature(index)}>
                <span>{item.number}</span>{item.label}<ChevronRight size={15} />
              </button>
            ))}
          </div>
          <div className="qh-feature-detail" role="tabpanel">
            <h3>{feature.title}</h3>
            <p>{feature.copy}</p>
          </div>
          <Link to="/pages/our-story" className="qh-text-link">Explore our design philosophy <MoveRight size={15} /></Link>
        </div>
      </section>

      <section className="qh-proof qh-container">
        <div className="qh-section-label">03 — CLINICAL PERFORMANCE</div>
        <div className="qh-proof-grid">
          <div><strong>14<span>h</span></strong><p>Designed for the demands of extended hospital shifts</p></div>
          <div><strong>4<span>-way</span></strong><p>BeauTech™ recoil stretch for unrestricted movement</p></div>
          <div><strong>60<span>°C</span></strong><p>Tested for industrial hospital sanitisation cycles</p></div>
          <div><strong>7<span> / 10</span></strong><p>Purpose-built pocket systems across women's and men's sets</p></div>
        </div>
        <p className="qh-proof-note"><ShieldCheck size={15} /> Product and performance details are presented as specified in the SO BEAU master archive.</p>
      </section>

      <section className="qh-testimonials">
        <div className="qh-container">
          <div className="qh-section-heading">
            <div><span className="qh-eyebrow">04 — FROM THE CLINICAL COMMUNITY</span><h2>Considered by those <em>who know.</em></h2></div>
            <span className="qh-rating">★★★★★ <small>VERIFIED PRACTITIONER REVIEWS</small></span>
          </div>
          <div className="qh-review-grid">
            {reviews.map((review) => (
              <article className="qh-review" key={review.name}>
                <div className="qh-stars">★★★★★ <span>5.0 / 5</span></div>
                <blockquote>“{review.quote}”</blockquote>
                <div className="qh-review-person"><strong>{review.name}</strong><span>{review.role}</span><span>{review.hospital}</span><small>VERIFIED PURCHASE · {review.shade}</small></div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="qh-closing qh-container">
        <span className="qh-eyebrow">SO YOU. SO BEAU.</span>
        <h2>Find your fit.<br /><em>Find your way of working.</em></h2>
        <Link to="/collections/scrubs" className="qh-button qh-button-dark">Shop the collection <ArrowUpRight size={15} /></Link>
      </section>
    </div>
  );
};

export default HomePage;

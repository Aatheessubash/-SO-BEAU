import React from 'react';
import '../../styles/components/InstagramFeed.scss';

const INSTA_POSTS = [
  {
    id: 1,
    img: '/dummy_images/insta-male-doctor-scrubs.png',
    handle: '@the_resus_nurse',
    tag: "Men's Athletic Scrub in Slate Blue",
  },
  {
    id: 2,
    img: '/dummy_images/female-doctor-navy-portrait.png',
    handle: '@dr_sarah_melb',
    tag: "Women's Nursing Scrub in French Navy",
  },
  {
    id: 3,
    img: '/dummy_images/insta-terracotta-scrubs.png',
    handle: '@cosmetic_dr_mia',
    tag: 'Terracotta Clay Relaxed Scrub Fit',
  },
  {
    id: 4,
    img: '/dummy_images/modern-nurse-scrub-styles.png',
    handle: '@paeds_chloe',
    tag: 'Modern Hospital Fit in Heather Navy',
  },
  {
    id: 5,
    img: '/dummy_images/insta-rose-clay-scrubs.png',
    handle: '@dermal_atelier_syd',
    tag: 'Rose Clay Clinical Uniform Set',
  },
  {
    id: 6,
    img: '/dummy_images/burgundy-emergency-scrubs.png',
    handle: '@anaesthetic_alex',
    tag: 'Deep Burgundy Emergency Edition',
  },
];

export const InstagramFeed: React.FC = () => {
  return (
    <section className="insta-feed-section">
      <div className="container">
        <div className="insta-header text-center">
          <span className="overline">The Clinical Collective &bull; #SOBEAUATELIER</span>
          <h2 className="insta-title">Worn across Australia's hospitals &amp; clinics.</h2>
          <p className="insta-subtitle">
            Join thousands of doctors, surgeons, nurses, and clinicians redefining clinical presence with uncompromising comfort and tailoring.
          </p>
          <a 
            href="https://instagram.com" 
            target="_blank" 
            rel="noreferrer" 
            className="insta-handle-link"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
              <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
            </svg>
            <span>@sobeau.atelier &bull; Follow Our Melbourne Studio</span>
          </a>
        </div>
      </div>

      <div className="insta-grid">
        {INSTA_POSTS.map((post) => (
          <div key={post.id} className="insta-tile">
            <img src={post.img} alt={post.tag} loading="lazy" />
            <div className="insta-tile-overlay">
              <span className="handle-text">{post.handle}</span>
              <span className="tag-text">{post.tag}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

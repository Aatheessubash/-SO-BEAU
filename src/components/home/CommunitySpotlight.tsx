import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Sparkles, MessageSquare, ThumbsUp } from 'lucide-react';
import '../../styles/components/CommunitySpotlight.scss';

const TESTIMONIALS = [
  {
    id: 1,
    quote:
      "In paediatrics, your scrub top is often the first thing a terrified child looks at. The softer, warm taupe and sage hues feel calm and human rather than clinical and sterile. The stretch also lets me kneel on the floor comfortably during play therapy.",
    author: 'Dr. Sophie Campbell',
    role: "Paediatric Fellow, Royal Children's Hospital",
    city: 'Melbourne, VIC',
    image: '/dummy_images/female-doctor-taupe-suit.png',
    scrubStyle: "The Women's Nursing Scrub Set in Warm Taupe",
  },
  {
    id: 2,
    quote:
      "I suggested the dedicated phone pocket and custom cargo embroidery option during the clinical trial. Seeing it implemented with heavy-duty bar-tacks blew my mind. SO BEAU genuinely listens to clinicians on the floor.",
    author: 'Marcus Evans',
    role: 'Trauma Resuscitation Nurse',
    city: 'Sydney, NSW',
    image: '/dummy_images/insta-male-doctor-scrubs.png',
    scrubStyle: "The Men's Nursing Scrub Set in Deep Charcoal",
  },
  {
    id: 3,
    quote:
      "Standing in theatre for an 8-hour laparotomy requires fabric that doesn't hold moisture or restrict your shoulder reach. SO BEAU gave me back my personal style without compromising on surgical sterility or comfort.",
    author: 'Dr. Anika Patel',
    role: 'Surgical Registrar',
    city: 'Brisbane, QLD',
    image: '/dummy_images/modern-nurse-scrub-styles.png',
    scrubStyle: "The Women's Nursing Scrub Set in Soft Sage",
  },
  {
    id: 4,
    quote:
      "During rapid emergency aeromedical retrievals, equipment accessibility is everything. The deep zippered jogger compartments and breathable raglan seams keep me calm and agile when seconds matter.",
    author: 'Liam O’Connor',
    role: 'Flight Retrieval Paramedic, CareFlight',
    city: 'Darwin, NT',
    image: '/dummy_images/burgundy-emergency-scrubs.png',
    scrubStyle: "The Men's Nursing Scrub Set in Burgundy",
  },
];

export const CommunitySpotlight: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
  };

  const current = TESTIMONIALS[currentIndex];

  return (
    <section className="community-spotlight-section section-padding">
      <div className="container">
        <div className="spotlight-header-row">
          <div>
            <span className="overline">The Co-Design Collective</span>
            <h2 className="text-section-title">Built with you. Worn by you.</h2>
            <p className="spotlight-subtext">
              "Your stories. Your ideas. Our next creation."
            </p>
          </div>

          <div className="carousel-nav-arrows">
            <button onClick={handlePrev} className="arrow-btn" aria-label="Previous quote">
              <ChevronLeft size={20} />
            </button>
            <span className="counter-label">{currentIndex + 1} / {TESTIMONIALS.length}</span>
            <button onClick={handleNext} className="arrow-btn" aria-label="Next quote">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Featured Clinician Spotlight Card */}
        <div className="clinician-spotlight-card animate-fade-in" key={current.id}>
          <div className="spotlight-image-col">
            <img src={current.image} alt={current.author} />
            <div className="style-tag">
              <span>Wears: <strong>{current.scrubStyle}</strong></span>
            </div>
          </div>

          <div className="spotlight-quote-col">
            <span className="quote-icon">“</span>
            <blockquote className="spotlight-quote-text">
              {current.quote}
            </blockquote>

            <div className="clinician-meta">
              <h4 className="clinician-name">{current.author}</h4>
              <p className="clinician-role">{current.role}</p>
              <span className="clinician-city">{current.city}</span>
            </div>

            <div className="community-action-row">
              <Link to="/pages/community" className="btn btn-primary btn-sm">
                <MessageSquare size={14} />
                <span>Submit Your Shift Idea</span>
              </Link>
              <Link to="/pages/community#ideas" className="btn btn-outline btn-sm">
                <ThumbsUp size={14} />
                <span>Vote On Prototypes</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

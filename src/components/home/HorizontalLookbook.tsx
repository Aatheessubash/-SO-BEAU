import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowRight, Sparkles } from 'lucide-react';
import '../../styles/components/HorizontalLookbook.scss';

interface LookbookSlide {
  id: string;
  tag: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  colorName: string;
  colorHex: string;
  productSlug: string;
  shiftHours: string;
}

const LOOKBOOK_SLIDES: LookbookSlide[] = [
  {
    id: 'look-1',
    tag: 'Look 01 • The ICU Ward',
    title: 'French Navy',
    subtitle: 'High-Acuity Theatre & Ward Rounds',
    description:
      'Engineered for 14-hour non-stop movement. Architectural V-neck and deep utility pockets keep diagnostic shears and pagers firmly locked in place.',
    image: '/dummy_images/lookbook-indigo-scrubs.png',
    colorName: 'French Navy',
    colorHex: '#1D2A44',
    productSlug: 'the-womens-nursing-scrub-set',
    shiftHours: '14 Hours Tested',
  },
  {
    id: 'look-2',
    tag: 'Look 02 • Emergency Resus',
    title: 'Deep Charcoal',
    subtitle: 'Athletic Raglan & Cargo Joggers',
    description:
      'Concealed Mandarin V-placket with zero restriction during chest compressions and patient transfers. Integrated smartphone side pocket.',
    image: '/dummy_images/charcoal-clinical-suit.png',
    colorName: 'Deep Charcoal',
    colorHex: '#1E2022',
    productSlug: 'the-mens-nursing-scrub-set',
    shiftHours: '12 Hours Tested',
  },
  {
    id: 'look-3',
    tag: 'Look 03 • Paediatrics & Allied Health',
    title: 'Soft Sage',
    subtitle: 'Calming Earth Tones & Gentle Drape',
    description:
      'Human-centered design that removes cold sterile tension in children’s hospital wards. 4-way ergonomic knee-bend stretch.',
    image: '/dummy_images/soft-sage-scrub-set.png',
    colorName: 'Soft Sage',
    colorHex: '#7D9D8B',
    productSlug: 'the-womens-nursing-scrub-set',
    shiftHours: '14 Hours Tested',
  },
  {
    id: 'look-4',
    tag: 'Look 04 • Clinical Leadership',
    title: 'Warm Taupe',
    subtitle: 'Melbourne Atelier Tailored Architecture',
    description:
      'Subtle drape whether tucked or untucked. Liquid-repellent barrier shield that resists accidental clinical fluid splashes.',
    image: '/dummy_images/female-doctor-taupe-suit.png',
    colorName: 'Warm Taupe',
    colorHex: '#A39382',
    productSlug: 'the-womens-nursing-scrub-set',
    shiftHours: '16 Hours Tested',
  },
  {
    id: 'look-5',
    tag: 'Look 05 • Trauma Recovery',
    title: 'Surgical Blue',
    subtitle: 'Sterile Discipline & Broad Mobility',
    description:
      'Silvadur™ antimicrobial silver ions destroy odor-causing bacteria before it starts. Tested for 60°C hospital wash sanitisation.',
    image: '/dummy_images/surgical-blue-scrubs.png',
    colorName: 'Surgical Blue',
    colorHex: '#4A7C9B',
    productSlug: 'the-mens-nursing-scrub-set',
    shiftHours: '14 Hours Tested',
  },
];

export const HorizontalLookbook: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      const maxScroll = scrollWidth - clientWidth;
      const progress = maxScroll > 0 ? (scrollLeft / maxScroll) * 100 : 0;
      setScrollProgress(progress);

      const slideWidth = 420;
      const index = Math.min(
        LOOKBOOK_SLIDES.length - 1,
        Math.max(0, Math.round(scrollLeft / slideWidth))
      );
      setActiveSlideIndex(index);
    }
  };

  const scrollByAmount = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const amount = direction === 'left' ? -440 : 440;
      scrollRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener('scroll', handleScroll, { passive: true });
    return () => el.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="horizontal-lookbook-section section-padding">
      <div className="container lookbook-header-container">
        <div className="lookbook-header-row">
          <div>
            <div className="lookbook-badge">
              <Sparkles size={12} />
              <span>Shift Edition • Lookbook 2026</span>
            </div>
            <h2 className="lookbook-title">
              Form meets function. <br />
              <em>Across every hospital ward.</em>
            </h2>
          </div>

          <div className="lookbook-controls-group">
            <span className="lookbook-counter">
              <strong>0{activeSlideIndex + 1}</strong> / 0{LOOKBOOK_SLIDES.length}
            </span>
            <div className="lookbook-arrows">
              <button
                type="button"
                className="lookbook-nav-btn"
                onClick={() => scrollByAmount('left')}
                aria-label="Previous lookbook piece"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                type="button"
                className="lookbook-nav-btn"
                onClick={() => scrollByAmount('right')}
                aria-label="Next lookbook piece"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* 03. Scroll Progress Bar */}
        <div className="lookbook-progress-track">
          <div className="lookbook-progress-bar" style={{ width: `${Math.max(12, scrollProgress)}%` }} />
        </div>
      </div>

      {/* 03. Horizontal Scrolling Gallery */}
      <div className="lookbook-scroll-wrapper" ref={scrollRef}>
        <div className="lookbook-track">
          {LOOKBOOK_SLIDES.map((slide, idx) => {
            const isActive = idx === activeSlideIndex;
            return (
              <div
                key={slide.id}
                className={`lookbook-card ${isActive ? 'is-active-card' : ''}`}
              >
                <div className="card-photo-viewport">
                  <img
                    src={slide.image}
                    alt={`${slide.title} Lookbook Editorial`}
                    className="lookbook-photo"
                    loading="lazy"
                  />
                  <div className="card-photo-gradient" />

                  {/* Top Left Tag */}
                  <div className="card-top-tag">
                    <span className="shift-hours-chip">{slide.shiftHours}</span>
                    <span
                      className="swatch-dot"
                      style={{ backgroundColor: slide.colorHex }}
                      title={slide.colorName}
                    />
                  </div>

                  {/* Bottom Text Overlay */}
                  <div className="card-info-overlay">
                    <span className="slide-tag">{slide.tag}</span>
                    <h3 className="slide-title">{slide.title}</h3>
                    <span className="slide-subtitle">{slide.subtitle}</span>
                    <p className="slide-desc">{slide.description}</p>

                    <Link to={`/products/${slide.productSlug}`} className="slide-link-btn">
                      <span>Explore Scrub Set</span>
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

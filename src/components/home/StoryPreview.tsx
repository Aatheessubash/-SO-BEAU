import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import '../../styles/components/StoryPreview.scss';

export const StoryPreview: React.FC = () => {
  return (
    <section id="about-brand" className="story-preview-section section-padding">
      <div className="container">
        <div className="story-preview-grid">
          {/* Dual Visual Collage */}
          <div className="story-collage-col">
            <div className="collage-tile tile-clinic">
              <img 
                src="/images/female/female-navy-front.jpg" 
                alt="Doctor in clinical environment" 
              />
              <span className="tile-label">The Hospital Wards</span>
            </div>
            <div className="collage-tile tile-atelier">
              <img 
                src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=800&q=80" 
                alt="Fashion studio fabrics and draping" 
              />
              <span className="tile-label">The Melbourne Atelier</span>
            </div>
          </div>

          {/* Editorial Text */}
          <div className="story-text-col">
            <span className="overline">About Our Brand • The Origin</span>
            <h2 className="story-title">
              Two worlds. <br />
              <em>One beautiful idea.</em>
            </h2>

            <p className="story-paragraph lead">
              She's a doctor. He's got fashion in the family. She brings home stories from the hospital. He brings a million ideas. Somewhere between the two, SO BEAU happened.
            </p>

            <p className="story-paragraph">
              Long shifts, coffee gone cold, running around all day — she's seen it all. And with a little boutique inspiration running through the family, one question kept coming up:
            </p>

            <blockquote className="story-callout-quote">
              "Why can't scrubs be as comfortable as your favourite outfit and look just as good?"
            </blockquote>

            <p className="story-paragraph">
              So beau is a contemporary lifestyle brand empowering you to be yourself, in and beyond the workplace. Designed for stylish medical scrubs and future lifestyle apparel, blending functionality with elevated everyday style.
            </p>

            <div className="story-cta-wrap">
              <Link to="/pages/our-story" className="btn btn-primary">
                <span>About Our Brand &rarr;</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

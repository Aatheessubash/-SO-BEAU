import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Star } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ProductColor } from '../../types';
import { Hero3DAtmosphere } from './Hero3DAtmosphere';
import '../../styles/components/Hero.scss';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export interface HeroProps {
  activeGender?: 'womens' | 'mens';
  currentColor?: ProductColor;
}

export const Hero: React.FC<HeroProps> = ({
  activeGender = 'womens',
  currentColor,
}) => {
  const heroSectionRef = useRef<HTMLElement>(null);
  const modelStageRef = useRef<HTMLDivElement>(null);
  const heroImageRef = useRef<HTMLImageElement>(null);
  const shadowRef = useRef<HTMLDivElement>(null);

  const heroImageSrc = currentColor?.modelImage || (
    activeGender === 'womens'
      ? '/images/female/female-surgical-blue-front.png'
      : '/images/male/male-surgical-blue-front.png'
  );

  // Smooth cinematic entrance animation: Slide in gracefully from the right
  // Only play on initial mount, or when the user is actively viewing the Hero section (scrollY < 200)
  const isInitialMount = useRef(true);
  useEffect(() => {
    if (!heroImageRef.current) return;

    if (isInitialMount.current) {
      isInitialMount.current = false;
      gsap.fromTo(
        heroImageRef.current,
        {
          x: 90,
          opacity: 0,
        },
        {
          x: 0,
          opacity: 1,
          duration: 0.85,
          ease: 'power2.out',
          clearProps: 'transform,opacity',
        }
      );
      return;
    }

    // When color changes while viewing the hero, subtle smooth crossfade slide
    if (typeof window !== 'undefined' && window.scrollY < 200) {
      gsap.fromTo(
        heroImageRef.current,
        {
          x: 50,
          opacity: 0.2,
        },
        {
          x: 0,
          opacity: 1,
          duration: 0.45,
          ease: 'power2.out',
          clearProps: 'transform,opacity',
        }
      );
    }
  }, [heroImageSrc]);

  // GSAP ScrollTrigger Parallax Fall & Centering into "TRY THE LOOK."
  // Runs ONCE on mount to maintain stable coordinate tracking without thrashing on swatch selection
  useEffect(() => {
    if (!heroSectionRef.current || !modelStageRef.current) return;

    // Respect prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      const cove = document.querySelector('.studio-cove-viewport');
      if (cove) cove.classList.add('is-docked');
      return;
    }

    const stage = modelStageRef.current;
    const heroSection = heroSectionRef.current;

    // Helper: calculate flight target vector from hero model to carousel center card
    const computeFlight = () => {
      const heroImg = stage.querySelector('.hero-stage-image') as HTMLElement | null;
      const centerCard = document.querySelector('.card-center-selected') as HTMLElement | null;
      const cove = document.querySelector('.studio-cove-viewport') as HTMLElement | null;

      if (!heroImg) {
        return {
          deltaX: -window.innerWidth * 0.38,
          deltaY: 650,
          targetScale: 0.84,
        };
      }

      // Base unscaled rect of hero image
      const curX = Number(gsap.getProperty(stage, 'x')) || 0;
      const curY = Number(gsap.getProperty(stage, 'y')) || 0;
      const curScale = Number(gsap.getProperty(stage, 'scale')) || 1;

      const heroRect = heroImg.getBoundingClientRect();
      const heroW = heroRect.width / curScale;
      const heroCenterX = (heroRect.left - curX) + heroW / 2;
      const heroBottom = (heroRect.bottom - curY + window.scrollY);

      let targetCenterX = heroCenterX - (window.innerWidth > 1024 ? 540 : 0);
      let targetBottom = heroBottom + 650;
      let targetScale = 0.84;

      if (centerCard) {
        const cardRect = centerCard.getBoundingClientRect();
        targetCenterX = cardRect.left + cardRect.width / 2;
        targetBottom = cardRect.bottom + window.scrollY;
        targetScale = cardRect.width / heroW;
      } else if (cove) {
        const coveRect = cove.getBoundingClientRect();
        targetCenterX = coveRect.left + coveRect.width / 2;
        targetBottom = coveRect.bottom + window.scrollY - 30;
      }

      return {
        deltaX: targetCenterX - heroCenterX,
        deltaY: targetBottom - heroBottom,
        targetScale: Math.max(0.72, Math.min(1.0, targetScale)),
      };
    };

    let hasLanded = false;

    // Initial state check on mount (e.g. if loaded mid-page)
    const initialCove = document.querySelector('.studio-cove-viewport');
    if (typeof window !== 'undefined' && window.scrollY > 450) {
      hasLanded = true;
      initialCove?.classList.add('is-docked');
      gsap.set(stage, { visibility: 'hidden', opacity: 0 });
    } else {
      hasLanded = false;
      initialCove?.classList.remove('is-docked');
      gsap.set(stage, { x: 0, y: 0, scale: 1, visibility: 'visible', opacity: 1 });
    }

    // ScrollTrigger: Animates exclusively on SCROLL DOWN into Carousel dock
    const st = ScrollTrigger.create({
      trigger: heroSection,
      start: 'top top',
      end: '+=680', // Completes flight gracefully as carousel moves into view
      scrub: 0.8,
      onUpdate: (self) => {
        const p = self.progress;
        const dir = self.direction; // 1 = scrolling down, -1 = scrolling up
        const coveEl = document.querySelector('.studio-cove-viewport');

        // 1. AT TOP OF HERO (p <= 0.08 or scrollY < 120):
        // Hero model resting at home. Carousel center figure strictly hidden.
        if (p <= 0.08 || window.scrollY < 120) {
          hasLanded = false;
          coveEl?.classList.remove('is-docked');
          gsap.set(stage, { x: 0, y: 0, scale: 1, visibility: 'visible', opacity: 1 });
          return;
        }

        // 2. DOCKED IN CAROUSEL (p >= 0.88 or scrollY >= 620):
        // Carousel center figure is active. Hero floating stage MUST BE STRICTLY HIDDEN!
        if (p >= 0.88 || window.scrollY >= 620) {
          hasLanded = true;
          coveEl?.classList.add('is-docked');
          gsap.set(stage, { visibility: 'hidden', opacity: 0 });
          return;
        }

        // 3. SCROLLING DOWN (dir === 1): Smooth flight glide from Hero to Carousel dock
        if (dir === 1 && !hasLanded) {
          const flight = computeFlight();
          const curX = flight.deltaX * p;
          const curY = flight.deltaY * p;
          const curScale = 1 + (flight.targetScale - 1) * p;

          coveEl?.classList.remove('is-docked');
          gsap.set(stage, {
            x: curX,
            y: curY,
            scale: curScale,
            visibility: 'visible',
            opacity: 1,
          });
          return;
        }

        // 4. SCROLLING UP (dir === -1): NO FLIGHT ANIMATION ON SCROLL UP (per prompt instructions)
        // Keep carousel docked until scrolled all the way back up into hero view.
        if (dir === -1 || hasLanded) {
          if (p > 0.15 && window.scrollY >= 150) {
            coveEl?.classList.add('is-docked');
            gsap.set(stage, { visibility: 'hidden', opacity: 0 });
          } else {
            hasLanded = false;
            coveEl?.classList.remove('is-docked');
            gsap.set(stage, { x: 0, y: 0, scale: 1, visibility: 'visible', opacity: 1 });
          }
        }
      },
    });

    const handleResize = () => {
      ScrollTrigger.refresh();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      st.kill();
    };
  }, []);

  return (
    <section ref={heroSectionRef} className="hero-editorial-section" aria-label="Hero Spotlight">
      {/* Three.js 3D Atmospheric Depth & Muted Gold Motes */}
      <Hero3DAtmosphere />

      {/* Far Left Vertical Pagination Dots */}
      <div className="hero-vertical-pagination left-pagination" aria-hidden="true">
        <span className="page-dot" />
        <span className="page-dot" />
        <span className="page-dot is-active" />
        <span className="page-dot" />
        <span className="page-dot" />
      </div>

      {/* Main Split Grid */}
      <div className="hero-split-container">
        {/* Left Editorial Text Column */}
        <div className="hero-editorial-left">
          <div className="hero-content-inner">
            {/* Eyebrow */}
            <span className="hero-eyebrow">SO BEAU</span>

            {/* Editorial Serif Headline */}
            <h1 className="hero-editorial-title">
              <span className="title-line">CLINICAL SOPHISTICATION,</span>
              <span className="title-line">ELEVATED.</span>
            </h1>

            {/* Supporting Clinical Description */}
            <p className="hero-editorial-description">
              Hospital-grade tailored scrubs engineered with BeauTech 4-way recoil stretch and Silvadur antimicrobial defense for 14-hour hospital shifts and everyday presence.
            </p>

            {/* Solid Rectangular CTA Button matching mockup */}
            <div className="hero-cta-button-group">
              <Link
                to="/collections/scrubs"
                className="hero-monolith-btn"
              >
                CHAT TO NOW
              </Link>
            </div>
          </div>
        </div>

        {/* Right Stage with Centered Model on Clean Luxury Background */}
        <div className="hero-editorial-right">
          {/* Model Visual Stage with GSAP Parallax Fall */}
          <div ref={modelStageRef} className="hero-visual-stage gsap-parallax-active">
            <img
              ref={heroImageRef}
              src={heroImageSrc}
              alt={currentColor ? `SO BEAU ${currentColor.name} Clinical Scrub Set` : "SO BEAU Clinical Scrub Set"}
              className="hero-stage-image"
              loading="eager"
            />
            {/* Ground Contact Shadow */}
            <div ref={shadowRef} className="model-ground-shadow" aria-hidden="true" />
          </div>

          {/* Far Right Vertical Pagination Dots */}
          <div className="hero-vertical-pagination right-pagination" aria-hidden="true">
            <span className="page-dot" />
            <span className="page-dot" />
            <span className="page-dot is-active" />
            <span className="page-dot" />
            <span className="page-dot" />
          </div>

          {/* Floating Circular Chat Widget Trigger */}
          <div className="hero-floating-chat-bubble" title="Chat with Atelier Specialist" aria-label="Open Chat">
            <MessageSquare size={19} color="#FFFFFF" />
          </div>
        </div>
      </div>
    </section>
  );
};

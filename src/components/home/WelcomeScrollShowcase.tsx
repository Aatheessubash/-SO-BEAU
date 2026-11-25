import React, { useEffect, useRef, useState, useCallback } from 'react';
import { ArrowDown, Sparkles } from 'lucide-react';
import '../../styles/components/WelcomeScrollShowcase.scss';

const TOTAL_FRAMES = 555;
const KEYFRAME_STRIDE = 12; // Fast initial skeleton coverage across 1..555
const MAX_CONCURRENT_LOADS = 6;
const SMOOTHING_LAMBDA = 4.2; // Lower = slower, silkier, more cinematic inertia while scrolling

const getFrameUrl = (frameIndex: number): string => {
  const clamped = Math.max(1, Math.min(TOTAL_FRAMES, frameIndex));
  return `/Frames/frame${String(clamped).padStart(5, '0')}.webp`;
};

interface StoryChapter {
  id: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  start: number;
  end: number;
  theme: 'dark' | 'light';
}

const STORY_CHAPTERS: StoryChapter[] = [
  {
    id: 'fiber',
    eyebrow: 'WELCOME TO SO BEAU • MELBOURNE ATELIER',
    title: 'ENGINEERED FROM THE FIBER UP.',
    subtitle: 'Scroll to unfold BeauTech™ 4-way recoil stretch and Silvadur™ antimicrobial craft.',
    start: 0,
    end: 0.23,
    theme: 'dark',
  },
  {
    id: 'architecture',
    eyebrow: '02 / ARCHITECTURAL TAILORING',
    title: 'SCULPTED IN 3D PRECISION.',
    subtitle: 'Ergonomic 10-pocket clinical geometry and reinforced flatlock seams built for 14-hour shifts.',
    start: 0.23,
    end: 0.52,
    theme: 'light',
  },
  {
    id: 'silhouette',
    eyebrow: '03 / WEIGHTLESS DRAPE',
    title: 'MOTION WITHOUT COMPROMISE.',
    subtitle: 'Zero boxy cuts — tailored Australian drape engineered to move effortlessly with every stride.',
    start: 0.52,
    end: 0.78,
    theme: 'light',
  },
  {
    id: 'palette',
    eyebrow: '04 / THE CLINICAL PALETTE',
    title: 'SIX SIGNATURE SHADES.',
    subtitle: 'Continue scrolling into the Atelier Spotlight and Try The Look Studio.',
    start: 0.78,
    end: 1.01,
    theme: 'light',
  },
];

export const WelcomeScrollShowcase: React.FC = () => {
  const runwayRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const tiltLayerRef = useRef<HTMLDivElement>(null);

  const imageCacheRef = useRef<Map<number, HTMLImageElement>>(new Map());
  const loadingSetRef = useRef<Set<number>>(new Set());
  const priorityQueueRef = useRef<number[]>([]);
  const activeLoadsRef = useRef<number>(0);

  const targetProgressRef = useRef<number>(0);
  const smoothProgressRef = useRef<number>(0);
  const scrollDirRef = useRef<number>(1);
  const lastDrawnFrameRef = useRef<number>(-1);
  const lastWindowCenterRef = useRef<number>(-999);
  const canvasSizeRef = useRef<{ w: number; h: number }>({ w: 0, h: 0 });
  const rafIdRef = useRef<number | null>(null);

  const [activeChapterIndex, setActiveChapterIndex] = useState<number>(0);
  const [displayProgress, setDisplayProgress] = useState<number>(0);
  const [firstFrameReady, setFirstFrameReady] = useState<boolean>(false);
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);

  // Sync canvas backing dimensions only on mount / resize (zero layout reads during 60fps scrub)
  const syncCanvasSize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    const targetW = Math.round(rect.width * dpr);
    const targetH = Math.round(rect.height * dpr);
    if (canvas.width !== targetW || canvas.height !== targetH) {
      canvas.width = targetW;
      canvas.height = targetH;
    }
    canvasSizeRef.current = { w: targetW, h: targetH };
  }, []);

  // Draw full frame (100% top-to-bottom & left-to-right visible, zero cropping)
  // with seamless 2px edge-color extension so ultra-wide/tall screens stay full-bleed with no black bars
  const drawImageToCanvas = useCallback((img: HTMLImageElement) => {
    const canvas = canvasRef.current;
    if (!canvas || !img.complete || img.naturalWidth === 0) return;

    if (canvasSizeRef.current.w === 0 || canvasSizeRef.current.h === 0) {
      syncCanvasSize();
    }
    const { w: targetW, h: targetH } = canvasSizeRef.current;
    if (targetW === 0 || targetH === 0) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    const imgW = img.naturalWidth;
    const imgH = img.naturalHeight;
    const imgAspect = imgW / imgH;
    const canvasAspect = targetW / targetH;

    if (canvasAspect > imgAspect) {
      // Viewport is wider than 16:9: fit 100% height so top & bottom are NEVER cropped
      const drawH = targetH;
      const drawW = Math.round(targetH * imgAspect);
      const offsetX = Math.round((targetW - drawW) / 2);

      if (offsetX > 0) {
        // Fill side margins from the pure top-left & top-right studio corner pixels (8x8)
        // so garments/sleeves near the frame edges NEVER smear into the side margins
        ctx.drawImage(img, 2, 2, 8, 8, 0, 0, offsetX + 1, targetH);
        ctx.drawImage(
          img,
          imgW - 10,
          2,
          8,
          8,
          offsetX + drawW - 1,
          0,
          targetW - (offsetX + drawW) + 1,
          targetH
        );
      }
      ctx.drawImage(img, 0, 0, imgW, imgH, offsetX, 0, drawW, drawH);
    } else {
      // Viewport is taller than 16:9: fit 100% width so left & right are NEVER cropped
      const drawW = targetW;
      const drawH = Math.round(targetW / imgAspect);
      const offsetY = Math.round((targetH - drawH) / 2);

      if (offsetY > 0) {
        ctx.drawImage(img, 2, 2, 8, 8, 0, 0, targetW, offsetY + 1);
        ctx.drawImage(
          img,
          2,
          imgH - 10,
          8,
          8,
          0,
          offsetY + drawH - 1,
          targetW,
          targetH - (offsetY + drawH) + 1
        );
      }
      ctx.drawImage(img, 0, 0, imgW, imgH, 0, offsetY, drawW, drawH);
    }
  }, [syncCanvasSize]);

  // Find nearest already-decoded frame so scrubbing never flashes blank
  const findNearestLoadedFrame = useCallback((desired: number): { frame: number; img: HTMLImageElement } | null => {
    const cache = imageCacheRef.current;
    const exact = cache.get(desired);
    if (exact && exact.complete && exact.naturalWidth > 0) {
      return { frame: desired, img: exact };
    }

    let bestFrame = -1;
    let bestDist = Infinity;
    for (const [frameNum, img] of cache.entries()) {
      if (!img.complete || img.naturalWidth === 0) continue;
      const dist = Math.abs(frameNum - desired);
      if (dist < bestDist) {
        bestDist = dist;
        bestFrame = frameNum;
      }
    }

    if (bestFrame !== -1) {
      const img = cache.get(bestFrame);
      if (img) return { frame: bestFrame, img };
    }
    return null;
  }, []);

  // Pump concurrency-limited image preloader queue
  const pumpQueue = useCallback(() => {
    while (activeLoadsRef.current < MAX_CONCURRENT_LOADS && priorityQueueRef.current.length > 0) {
      const nextFrame = priorityQueueRef.current.shift()!;
      if (imageCacheRef.current.has(nextFrame) || loadingSetRef.current.has(nextFrame)) {
        continue;
      }

      loadingSetRef.current.add(nextFrame);
      activeLoadsRef.current += 1;

      const img = new Image();
      img.decoding = 'async';
      img.src = getFrameUrl(nextFrame);

      img.onload = () => {
        const finalizeFrame = () => {
          loadingSetRef.current.delete(nextFrame);
          activeLoadsRef.current -= 1;
          imageCacheRef.current.set(nextFrame, img);

          if (nextFrame === 1) {
            setFirstFrameReady(true);
          }

          // If this frame is closer to current desired frame than what's drawn, redraw immediately
          const desired = Math.max(1, Math.min(TOTAL_FRAMES, Math.round(smoothProgressRef.current * (TOTAL_FRAMES - 1)) + 1));
          if (
            lastDrawnFrameRef.current === -1 ||
            Math.abs(nextFrame - desired) <= Math.abs(lastDrawnFrameRef.current - desired)
          ) {
            drawImageToCanvas(img);
            lastDrawnFrameRef.current = nextFrame;
          }

          pumpQueue();
        };

        // Pre-decode PNG off the main thread so canvas drawImage is <0.3ms with zero jank
        if (typeof img.decode === 'function') {
          img.decode().then(finalizeFrame).catch(finalizeFrame);
        } else {
          finalizeFrame();
        }
      };

      img.onerror = () => {
        loadingSetRef.current.delete(nextFrame);
        activeLoadsRef.current -= 1;
        pumpQueue();
      };
    }
  }, [drawImageToCanvas]);

  const enqueueFrame = useCallback((frameNum: number, highPriority = false) => {
    const clamped = Math.max(1, Math.min(TOTAL_FRAMES, frameNum));
    if (imageCacheRef.current.has(clamped) || loadingSetRef.current.has(clamped)) return;

    if (highPriority) {
      priorityQueueRef.current.unshift(clamped);
    } else {
      priorityQueueRef.current.push(clamped);
    }
  }, []);

  // Load dense 1-to-1 frame look-ahead window in scroll direction so motion never steps
  const prioritizeWindow = useCallback((centerFrame: number, direction: number) => {
    const dir = direction >= 0 ? 1 : -1;
    // Prioritize 35 consecutive frames ahead of scroll direction + 15 behind
    const batch: number[] = [];
    for (let i = 0; i <= 35; i++) {
      batch.push(centerFrame + i * dir);
    }
    for (let i = 1; i <= 15; i++) {
      batch.push(centerFrame - i * dir);
    }
    for (let i = batch.length - 1; i >= 0; i--) {
      enqueueFrame(batch[i], true);
    }
    pumpQueue();
  }, [enqueueFrame, pumpQueue]);

  // Initial multi-pass preload strategy & reduced-motion detection
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);

    const handleMotionChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener?.('change', handleMotionChange);

    // 1. Highest priority: first 45 consecutive frames for instant silky scroll start + end frame
    enqueueFrame(TOTAL_FRAMES, true);
    for (let f = 45; f >= 1; f--) {
      enqueueFrame(f, true);
    }

    if (!mq.matches) {
      // 2. Coarse skeleton keyframes across entire 555-frame sequence
      for (let f = 1; f <= TOTAL_FRAMES; f += KEYFRAME_STRIDE) {
        enqueueFrame(f, false);
      }
      // 3. Medium pass (every 4th frame)
      for (let f = 1; f <= TOTAL_FRAMES; f += 4) {
        enqueueFrame(f, false);
      }
      // 4. Fine pass (every 2nd frame)
      for (let f = 1; f <= TOTAL_FRAMES; f += 2) {
        enqueueFrame(f, false);
      }
      // 5. Full 1-to-1 frame completion for zero-step cinema smoothness
      for (let f = 1; f <= TOTAL_FRAMES; f += 1) {
        enqueueFrame(f, false);
      }
    }

    pumpQueue();

    return () => {
      mq.removeEventListener?.('change', handleMotionChange);
    };
  }, [enqueueFrame, pumpQueue]);

  // Scroll listener + frame-rate independent silky rAF canvas renderer
  useEffect(() => {
    if (reducedMotion) {
      const loaded = findNearestLoadedFrame(TOTAL_FRAMES) || findNearestLoadedFrame(1);
      if (loaded) drawImageToCanvas(loaded.img);
      return;
    }

    let lastUiSync = 0;
    let lastFrameTime = performance.now();

    const updateTargetFromScroll = () => {
      const runway = runwayRef.current;
      if (!runway) return;

      const rect = runway.getBoundingClientRect();
      const navbarOffset = parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue('--navbar-height')
      ) || 72;
      const stickyViewportH = window.innerHeight - navbarOffset;
      const scrollableDistance = Math.max(1, runway.offsetHeight - stickyViewportH);
      const scrolled = Math.max(0, -(rect.top - navbarOffset));
      const progress = Math.max(0, Math.min(1, scrolled / scrollableDistance));

      if (progress !== targetProgressRef.current) {
        scrollDirRef.current = progress > targetProgressRef.current ? 1 : -1;
      }
      targetProgressRef.current = progress;
    };

    const tick = (now: number) => {
      const dt = Math.min(0.05, Math.max(0.001, (now - lastFrameTime) / 1000));
      lastFrameTime = now;

      const diff = targetProgressRef.current - smoothProgressRef.current;
      // Frame-rate independent exponential smoothing for slow, velvety cinema playback
      if (Math.abs(diff) > 0.0001) {
        const alpha = 1 - Math.exp(-SMOOTHING_LAMBDA * dt);
        smoothProgressRef.current += diff * alpha;
      } else {
        smoothProgressRef.current = targetProgressRef.current;
      }

      const p = smoothProgressRef.current;
      const desiredFrame = Math.max(1, Math.min(TOTAL_FRAMES, Math.round(p * (TOTAL_FRAMES - 1)) + 1));

      // Keep look-ahead queue fresh as user scrubs
      if (Math.abs(desiredFrame - lastWindowCenterRef.current) >= 6) {
        lastWindowCenterRef.current = desiredFrame;
        prioritizeWindow(desiredFrame, scrollDirRef.current);
      }

      if (desiredFrame !== lastDrawnFrameRef.current) {
        const match = findNearestLoadedFrame(desiredFrame);
        if (match && match.frame !== lastDrawnFrameRef.current) {
          drawImageToCanvas(match.img);
          lastDrawnFrameRef.current = match.frame;
        }
      }

      // Throttle React state HUD updates (~15fps) so canvas stays locked at 60fps
      if (now - lastUiSync > 65) {
        lastUiSync = now;
        const pct = Math.round(p * 100);
        setDisplayProgress((prev) => (prev !== pct ? pct : prev));

        const chapterIdx = STORY_CHAPTERS.findIndex((c) => p >= c.start && p < c.end);
        const safeIdx = chapterIdx === -1 ? STORY_CHAPTERS.length - 1 : chapterIdx;
        setActiveChapterIndex((prev) => (prev !== safeIdx ? safeIdx : prev));
      }

      rafIdRef.current = requestAnimationFrame(tick);
    };

    const handleResize = () => {
      syncCanvasSize();
      updateTargetFromScroll();
      const current = findNearestLoadedFrame(Math.max(1, lastDrawnFrameRef.current));
      if (current) drawImageToCanvas(current.img);
    };

    syncCanvasSize();
    updateTargetFromScroll();
    window.addEventListener('scroll', updateTargetFromScroll, { passive: true });
    window.addEventListener('resize', handleResize);
    rafIdRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('scroll', updateTargetFromScroll);
      window.removeEventListener('resize', handleResize);
      if (rafIdRef.current !== null) cancelAnimationFrame(rafIdRef.current);
    };
  }, [reducedMotion, syncCanvasSize, drawImageToCanvas, findNearestLoadedFrame, prioritizeWindow]);

  // Subtle GPU-composited 3D pointer tilt on the stage
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reducedMotion || !tiltLayerRef.current || window.innerWidth < 1024) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    tiltLayerRef.current.style.setProperty('--pointer-rx', `${(-ny * 3.2).toFixed(2)}deg`);
    tiltLayerRef.current.style.setProperty('--pointer-ry', `${(nx * 4.2).toFixed(2)}deg`);
  };

  const handlePointerLeave = () => {
    if (!tiltLayerRef.current) return;
    tiltLayerRef.current.style.setProperty('--pointer-rx', '0deg');
    tiltLayerRef.current.style.setProperty('--pointer-ry', '0deg');
  };

  const scrollToHero = () => {
    const heroEl = document.getElementById('hero-spotlight');
    if (heroEl) {
      heroEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const activeChapter = STORY_CHAPTERS[activeChapterIndex] || STORY_CHAPTERS[0];

  return (
    <>
      {/* Native CSS Scroll-Driven Reading Progress Bar (scroll(root block)) */}
      <div className="welcome-root-progress" aria-hidden="true" />

      <section
        ref={runwayRef}
        className={`welcome-scroll-runway ${reducedMotion ? 'is-reduced-motion' : ''}`}
        aria-label="Welcome to SO BEAU 3D Scroll Showcase"
      >
        <div
          className="welcome-sticky-stage"
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
        >
          {/* 3D Perspective Stage driven by CSS Scroll-Driven ViewTimeline + pointer micro-tilt */}
          <div className="welcome-3d-viewport">
            <div ref={tiltLayerRef} className="welcome-3d-frame">
              {/* High-DPI Frame Sequence Canvas */}
              <canvas
                ref={canvasRef}
                className={`welcome-sequence-canvas ${firstFrameReady ? 'is-ready' : ''}`}
                aria-label="SO BEAU 3D scrub construction sequence from BeauTech weave to complete collection"
              />

              {/* Immediate Poster Fallback while Frame 1 decodes */}
              {!firstFrameReady && (
                <img
                  src={getFrameUrl(reducedMotion ? TOTAL_FRAMES : 1)}
                  alt="SO BEAU BeauTech Weave"
                  className="welcome-poster-fallback"
                  loading="eager"
                />
              )}

              {/* Top Editorial Welcome Overlay (crystal clear — no mist/shades over image) */}
              <div className={`welcome-header-overlay ${activeChapter.theme === 'dark' ? 'theme-dark' : 'theme-light'}`}>
                <div className="welcome-chapter-copy" key={activeChapter.id}>
                  <span className="welcome-eyebrow">
                    <Sparkles size={12} aria-hidden="true" />
                    <span>{activeChapter.eyebrow}</span>
                  </span>
                  <h1 className="welcome-headline">{activeChapter.title}</h1>
                  <p className="welcome-subline">{activeChapter.subtitle}</p>
                </div>

                {/* Top-Right Quick Action: Jump directly to Hero Spotlight */}
                <button
                  type="button"
                  className="welcome-skip-btn"
                  onClick={scrollToHero}
                  aria-label="Skip welcome animation to Hero section"
                >
                  <span>Explore Spotlight</span>
                  <ArrowDown size={14} aria-hidden="true" />
                </button>
              </div>

              {/* Center-Bottom Scroll Prompt (fades away cleanly on scroll via CSS ViewTimeline) */}
              {!reducedMotion && displayProgress < 12 && (
                <div className="welcome-scroll-cue" aria-hidden="true">
                  <span className="scroll-mouse">
                    <span className="scroll-wheel" />
                  </span>
                  <span className="scroll-cue-label">Scroll to Animate 3D</span>
                </div>
              )}

              {/* Bottom-Right Minimal Atelier Chapter HUD (clear of bottom-left frame text) */}
              {!reducedMotion && (
                <div
                  className={`welcome-hud-pill ${activeChapter.theme === 'dark' ? 'theme-dark' : 'theme-light'}`}
                  aria-hidden="true"
                >
                  <span className="hud-step">
                    0{activeChapterIndex + 1} / 0{STORY_CHAPTERS.length}
                  </span>
                  <span className="hud-track">
                    <span
                      className="hud-fill"
                      style={{ transform: `scaleX(${Math.max(0.02, displayProgress / 100)})` }}
                    />
                  </span>
                  <span className="hud-percent">{displayProgress}%</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

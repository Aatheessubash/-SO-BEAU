import React, { 
  useState, 
  useEffect, 
  useRef, 
  useCallback, 
  useImperativeHandle, 
  forwardRef 
} from 'react';
import '../../styles/components/CircularCarousel.scss';

export interface CircularCarouselItemState {
  index: number;
  isCenter: boolean;
  isNearLeft: boolean;
  isNearRight: boolean;
  isOuterLeft: boolean;
  isOuterRight: boolean;
  isFarLeft: boolean;
  isFarRight: boolean;
  isLeft: boolean; // Backward-compatible: isNearLeft || isOuterLeft || isFarLeft
  isRight: boolean; // Backward-compatible: isNearRight || isOuterRight || isFarRight
  isVisible: boolean; // True for the 7 visible variants
  angle: number; // Net angle in degrees relative to front center (-180 to +180)
  absAngle: number;
  offset: number; // Continuous item offset from center (-3.5 to +3.5)
  absOffset: number;
  facingFactor: number; // cos(netAngle) from -1 to 1
  scale: number;
  opacity: number;
  zIndex: number;
}

export interface CircularCarouselRef {
  rotateToIndex: (index: number, withAnimation?: boolean) => void;
  next: () => void;
  prev: () => void;
  getCurrentIndex: () => number;
}

export interface CircularCarouselProps<T = any> {
  items: T[];
  renderItem: (item: T, state: CircularCarouselItemState) => React.ReactNode;
  initialIndex?: number;
  activeIndex?: number;
  onIndexChange?: (index: number, item: T) => void;
  className?: string;
  radius?: number; // Distance in Z for the 3D cylindrical ring
  enableDrag?: boolean;
  enableWheel?: boolean;
}

export const CircularCarousel = forwardRef<CircularCarouselRef, CircularCarouselProps>(
  function CircularCarousel<T>(
    {
      items,
      renderItem,
      initialIndex = 0,
      activeIndex: controlledIndex,
      onIndexChange,
      className = '',
      radius: customRadius,
      enableDrag = true,
      enableWheel = true,
    }: CircularCarouselProps<T>,
    ref: React.Ref<CircularCarouselRef>
  ) {
    const total = items.length;
    const anglePerItem = total > 0 ? 360 / total : 45;

    // Track active index
    const [currentIndex, setCurrentIndex] = useState(initialIndex);
    const currentIndexRef = useRef<number>(initialIndex);
    currentIndexRef.current = currentIndex;

    const lastReportedIndexRef = useRef<number>(initialIndex);
    const activeIndex = controlledIndex !== undefined ? controlledIndex : currentIndex;

    // Continuous 3D rotation state (in degrees)
    const [rotation, setRotation] = useState<number>(() => -initialIndex * anglePerItem);
    const rotationRef = useRef<number>(-initialIndex * anglePerItem);
    rotationRef.current = rotation;

    // Responsive 3D Amphitheater Radius
    const [radius, setRadius] = useState<number>(() => {
      if (customRadius) return customRadius;
      if (typeof window === 'undefined') return 500;
      const w = window.innerWidth;
      if (w < 640) return 250;
      if (w < 1024) return 380;
      return 500;
    });

    useEffect(() => {
      if (customRadius) {
        setRadius(customRadius);
        return;
      }
      const handleResize = () => {
        const w = window.innerWidth;
        if (w < 640) setRadius(250);
        else if (w < 1024) setRadius(380);
        else setRadius(500);
      };
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, [customRadius]);

    const viewportRef = useRef<HTMLDivElement>(null);
    const cylinderRef = useRef<HTMLDivElement>(null);
    const rafIdRef = useRef<number | null>(null);
    const wheelTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Pointer Physics Tracking
    const isDraggingRef = useRef<boolean>(false);
    const isUndecidedRef = useRef<boolean>(false);
    const dragStartXRef = useRef<number>(0);
    const dragStartYRef = useRef<number>(0);
    const lastXRef = useRef<number>(0);
    const lastTimeRef = useRef<number>(0);
    const velocityRef = useRef<number>(0);
    const totalDragDistanceRef = useRef<number>(0);

    // Apple Spring Easing (cubic-bezier 0.16, 1, 0.3, 1 approximation: 1 - (1 - t)^3.8)
    const smoothRotateTo = useCallback((targetAngle: number, onComplete?: () => void) => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);

      const startAngle = rotationRef.current;
      const delta = targetAngle - startAngle;

      if (Math.abs(delta) < 0.05) {
        rotationRef.current = targetAngle;
        setRotation(targetAngle);
        const normalized = ((-targetAngle % 360) + 360) % 360;
        const finalIndex = Math.round(normalized / anglePerItem) % total;
        if (currentIndexRef.current !== finalIndex) {
          currentIndexRef.current = finalIndex;
          setCurrentIndex(finalIndex);
        }
        if (lastReportedIndexRef.current !== finalIndex) {
          lastReportedIndexRef.current = finalIndex;
          onIndexChange?.(finalIndex, items[finalIndex]);
        }
        onComplete?.();
        return;
      }

      // Dynamic duration based on delta distance (320ms - 520ms)
      const duration = Math.min(520, Math.max(320, Math.abs(delta) * 5.2));
      const startTime = performance.now();

      const animate = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Apple fluid spring / quintic ease-out: rapid acceleration, imperceptible settling
        const ease = 1 - Math.pow(1 - progress, 3.8);
        const current = startAngle + delta * ease;

        rotationRef.current = current;
        setRotation(current);

        const normalized = ((-current % 360) + 360) % 360;
        const currentIdx = Math.round(normalized / anglePerItem) % total;
        if (currentIndexRef.current !== currentIdx) {
          currentIndexRef.current = currentIdx;
          setCurrentIndex(currentIdx);
        }

        if (progress < 1) {
          rafIdRef.current = requestAnimationFrame(animate);
        } else {
          rotationRef.current = targetAngle;
          setRotation(targetAngle);
          const finalIndex = (((Math.round(-targetAngle / anglePerItem) % total) + total) % total);
          if (currentIndexRef.current !== finalIndex) {
            currentIndexRef.current = finalIndex;
            setCurrentIndex(finalIndex);
          }
          if (lastReportedIndexRef.current !== finalIndex) {
            lastReportedIndexRef.current = finalIndex;
            onIndexChange?.(finalIndex, items[finalIndex]);
          }
          onComplete?.();
        }
      };

      rafIdRef.current = requestAnimationFrame(animate);
    }, [anglePerItem, total, onIndexChange, items]);

    // Shortest-path circular rotation
    const rotateToIndex = useCallback((targetIdx: number) => {
      const currentRot = rotationRef.current;
      const targetBase = -targetIdx * anglePerItem;
      const diff = (((targetBase - currentRot) % 360) + 540) % 360 - 180;
      const targetAngle = currentRot + diff;
      smoothRotateTo(targetAngle);
    }, [anglePerItem, smoothRotateTo]);

    const next = useCallback(() => {
      const nextIdx = (activeIndex + 1) % total;
      rotateToIndex(nextIdx);
    }, [activeIndex, total, rotateToIndex]);

    const prev = useCallback(() => {
      const prevIdx = (activeIndex - 1 + total) % total;
      rotateToIndex(prevIdx);
    }, [activeIndex, total, rotateToIndex]);

    // Expose ref API
    useImperativeHandle(ref, () => ({
      rotateToIndex,
      next,
      prev,
      getCurrentIndex: () => activeIndex,
    }), [rotateToIndex, next, prev, activeIndex]);

    // Inertia Momentum Loop
    const startMomentum = useCallback(() => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);

      const friction = 0.92;
      const minVelocity = 0.04;

      const momentumLoop = () => {
        if (Math.abs(velocityRef.current) > minVelocity) {
          rotationRef.current += velocityRef.current;
          velocityRef.current *= friction;
          setRotation(rotationRef.current);

          const normalized = ((-rotationRef.current % 360) + 360) % 360;
          const currentIdx = Math.round(normalized / anglePerItem) % total;
          if (currentIndexRef.current !== currentIdx) {
            currentIndexRef.current = currentIdx;
            setCurrentIndex(currentIdx);
          }

          rafIdRef.current = requestAnimationFrame(momentumLoop);
        } else {
          const nearestIndex = Math.round(-rotationRef.current / anglePerItem);
          const targetSnap = -nearestIndex * anglePerItem;
          smoothRotateTo(targetSnap);
        }
      };

      rafIdRef.current = requestAnimationFrame(momentumLoop);
    }, [anglePerItem, total, smoothRotateTo]);

    // Cleanup on unmount
    useEffect(() => {
      return () => {
        if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
        if (wheelTimeoutRef.current) clearTimeout(wheelTimeoutRef.current);
      };
    }, []);

    // Pointer Events with Apple HIG Gesture Disambiguation
    const handlePointerDown = (e: React.PointerEvent) => {
      if (!enableDrag) return;
      if (e.button !== 0 && e.pointerType === 'mouse') return;

      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);

      isDraggingRef.current = false;
      isUndecidedRef.current = true;
      dragStartXRef.current = e.clientX;
      dragStartYRef.current = e.clientY;
      lastXRef.current = e.clientX;
      lastTimeRef.current = performance.now();
      velocityRef.current = 0;
      totalDragDistanceRef.current = 0;
      // Note: We do NOT set pointer capture here to prevent hijacking vertical scroll
    };

    const handlePointerMove = (e: React.PointerEvent) => {
      // Gesture Disambiguation Deadzone
      if (isUndecidedRef.current) {
        const dx = e.clientX - dragStartXRef.current;
        const dy = e.clientY - dragStartYRef.current;
        const dist = Math.hypot(dx, dy);

        // 8px slop threshold
        if (dist < 8) return;

        isUndecidedRef.current = false;

        // If predominantly vertical, user intends to scroll page; release carousel!
        if (Math.abs(dy) > Math.abs(dx)) {
          isDraggingRef.current = false;
          return;
        }

        // Horizontal intent confirmed: engage carousel drag and capture pointer
        isDraggingRef.current = true;
        try {
          viewportRef.current?.setPointerCapture(e.pointerId);
        } catch {
          // ignore
        }
      }

      if (!isDraggingRef.current) return;

      const currentX = e.clientX;
      const now = performance.now();
      const deltaX = currentX - lastXRef.current;
      const dt = Math.max(now - lastTimeRef.current, 1);

      totalDragDistanceRef.current += Math.abs(deltaX);

      // Calibrated 1:1 finger tracking
      const sensitivity = anglePerItem / (radius * 0.75);
      rotationRef.current += deltaX * sensitivity;
      velocityRef.current = (deltaX / dt) * 16 * sensitivity;

      lastXRef.current = currentX;
      lastTimeRef.current = now;

      setRotation(rotationRef.current);

      const normalized = ((-rotationRef.current % 360) + 360) % 360;
      const currentIdx = Math.round(normalized / anglePerItem) % total;
      if (currentIndexRef.current !== currentIdx) {
        currentIndexRef.current = currentIdx;
        setCurrentIndex(currentIdx);
      }
    };

    const handlePointerUp = (e: React.PointerEvent) => {
      isUndecidedRef.current = false;

      if (!isDraggingRef.current) {
        return;
      }
      isDraggingRef.current = false;

      if (viewportRef.current) {
        try {
          viewportRef.current.releasePointerCapture(e.pointerId);
        } catch {
          // ignore
        }
      }

      if (totalDragDistanceRef.current < 8) {
        const nearestIndex = Math.round(-rotationRef.current / anglePerItem);
        smoothRotateTo(-nearestIndex * anglePerItem);
        return;
      }

      startMomentum();
    };

    // Wheel / Trackpad Handling (Zero Vertical Scroll Hijacking)
    const handleWheel = (e: React.WheelEvent) => {
      if (!enableWheel) return;

      const absX = Math.abs(e.deltaX);
      const absY = Math.abs(e.deltaY);

      // If the scroll gesture is vertical or predominantly vertical, do NOT touch it!
      // Let it pass through to Lenis and window vertical page scroll smoothly.
      if (absY >= absX * 0.85 || absX < 4) {
        return;
      }

      // Only handle intentional horizontal gestures (trackpad horizontal swipe)
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);

      const sensitivity = 0.08;
      const nextRot = rotationRef.current - e.deltaX * sensitivity;
      rotationRef.current = nextRot;
      setRotation(nextRot);

      const normalized = ((-nextRot % 360) + 360) % 360;
      const currentIdx = Math.round(normalized / anglePerItem) % total;
      if (currentIndexRef.current !== currentIdx) {
        currentIndexRef.current = currentIdx;
        setCurrentIndex(currentIdx);
      }

      if (wheelTimeoutRef.current) {
        clearTimeout(wheelTimeoutRef.current);
      }
      wheelTimeoutRef.current = setTimeout(() => {
        const nearestIndex = Math.round(-rotationRef.current / anglePerItem);
        smoothRotateTo(-nearestIndex * anglePerItem);
      }, 140);
    };

    // Card Tap Handler
    const handleCardClick = (idx: number, e: React.MouseEvent) => {
      if (totalDragDistanceRef.current >= 8) {
        e.preventDefault();
        return;
      }
      rotateToIndex(idx);
    };

    return (
      <div 
        ref={viewportRef}
        className={`react-bits-circular-carousel-viewport ${className}`}
        role="region"
        aria-roledescription="carousel"
        aria-label="3D Circular Carousel"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onWheel={handleWheel}
      >
        {/* 3D Stage Anchor */}
        <div 
          ref={cylinderRef}
          className="circular-carousel-cylinder"
        >
          {items.map((item, idx) => {
            const baseAngle = idx * anglePerItem;
            const netAngle = (((baseAngle + rotation) % 360) + 540) % 360 - 180;
            const absAngle = Math.abs(netAngle);
            const facingFactor = Math.cos((netAngle * Math.PI) / 180);
            
            // Continuous offset from center (-3.5 to +3.5 for visible cards)
            const offset = netAngle / anglePerItem;
            const absOffset = Math.abs(offset);

            // 7 Variants Classification
            const isCenter = absOffset < 0.5;
            const isNearLeft = offset <= -0.5 && offset > -1.5;
            const isNearRight = offset >= 0.5 && offset < 1.5;
            const isOuterLeft = offset <= -1.5 && offset > -2.5;
            const isOuterRight = offset >= 1.5 && offset < 2.5;
            const isFarLeft = offset <= -2.5 && offset > -3.5;
            const isFarRight = offset >= 2.5 && offset < 3.5;

            const isLeft = isNearLeft || isOuterLeft || isFarLeft;
            const isRight = isNearRight || isOuterRight || isFarRight;

            // 7 cards are visible on the stage arc
            const isVisible = absOffset < 3.5;

            // 3D Amphitheater Arc Coordinates
            const arcAngleDeg = offset * 26;
            const arcAngleRad = (arcAngleDeg * Math.PI) / 180;

            const posX = Math.sin(arcAngleRad) * radius;
            const posZ = (Math.cos(arcAngleRad) - 1) * radius;
            const rotY = arcAngleDeg * 0.52;

            // Scale Curve
            const scale = isCenter 
              ? 1.36 
              : Math.max(0.44, 0.88 - (absOffset / 3.5) * 0.46);

            // Opacity Curve
            let opacity = 0;
            if (absOffset <= 0.5) {
              opacity = 1.0;
            } else if (absOffset <= 1.5) {
              opacity = 1.0 - ((absOffset - 0.5) / 1.0) * 0.58;
            } else if (absOffset <= 2.5) {
              opacity = 0.42 - ((absOffset - 1.5) / 1.0) * 0.17;
            } else if (absOffset <= 3.3) {
              opacity = 0.25 - ((absOffset - 2.5) / 0.8) * 0.11;
            } else if (absOffset <= 3.6) {
              opacity = 0.14 * (1 - (absOffset - 3.3) / 0.3);
            } else {
              opacity = 0;
            }

            // Layered z-index
            const zIndex = isCenter ? 150 : Math.round(90 - absOffset * 20);

            return (
              <div
                key={`circular-card-${idx}`}
                className={`circular-carousel-card-wrapper ${
                  isCenter 
                    ? 'card-center-selected' 
                    : isNearLeft || isNearRight
                      ? 'card-side-near' 
                      : isOuterLeft || isOuterRight
                        ? 'card-side-outer'
                        : isFarLeft || isFarRight
                          ? 'card-side-far'
                          : 'card-hidden'
                }`}
                style={{
                  transform: `translate3d(${posX}px, 0, ${posZ}px) rotateY(${rotY}deg) scale(${scale})`,
                  zIndex,
                  opacity,
                  visibility: isVisible ? 'visible' : 'hidden',
                  pointerEvents: isVisible ? 'auto' : 'none',
                }}
                onClick={(e) => handleCardClick(idx, e)}
              >
                {renderItem(item, {
                  index: idx,
                  isCenter,
                  isNearLeft,
                  isNearRight,
                  isOuterLeft,
                  isOuterRight,
                  isFarLeft,
                  isFarRight,
                  isLeft,
                  isRight,
                  isVisible,
                  angle: netAngle,
                  absAngle,
                  offset,
                  absOffset,
                  facingFactor,
                  scale,
                  opacity,
                  zIndex,
                })}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
);

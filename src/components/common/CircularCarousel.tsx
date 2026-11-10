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
    const activeIndex = controlledIndex !== undefined ? controlledIndex : currentIndex;

    // Continuous 3D rotation state (in degrees)
    const [rotation, setRotation] = useState<number>(() => -initialIndex * anglePerItem);
    const rotationRef = useRef<number>(-initialIndex * anglePerItem);
    rotationRef.current = rotation;

    // Responsive 3D Amphitheater Radius (tuned for larger model figures)
    const [radius, setRadius] = useState<number>(() => {
      if (customRadius) return customRadius;
      if (typeof window === 'undefined') return 500;
      const w = window.innerWidth;
      if (w < 640) return 250;
      if (w < 1024) return 380;
      return 500; // Desktop: expansive stage radius for larger model figures
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

    // Pointer Physics Tracking
    const isDraggingRef = useRef<boolean>(false);
    const dragStartXRef = useRef<number>(0);
    const lastXRef = useRef<number>(0);
    const lastTimeRef = useRef<number>(0);
    const velocityRef = useRef<number>(0);
    const totalDragDistanceRef = useRef<number>(0);

    // Spring Lerp Animation Engine
    const smoothRotateTo = useCallback((targetAngle: number) => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);

      const animate = () => {
        const current = rotationRef.current;
        const diff = targetAngle - current;

        if (Math.abs(diff) < 0.1) {
          rotationRef.current = targetAngle;
          setRotation(targetAngle);
          const normalized = ((-targetAngle % 360) + 360) % 360;
          const newIndex = Math.round(normalized / anglePerItem) % total;
          setCurrentIndex(newIndex);
          if (onIndexChange) onIndexChange(newIndex, items[newIndex]);
          return;
        }

        const step = diff * 0.16;
        const nextAngle = current + step;
        rotationRef.current = nextAngle;
        setRotation(nextAngle);

        const normalized = ((-nextAngle % 360) + 360) % 360;
        const currentIdx = Math.round(normalized / anglePerItem) % total;
        setCurrentIndex(currentIdx);

        rafIdRef.current = requestAnimationFrame(animate);
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

      const friction = 0.91;
      const minVelocity = 0.05;

      const momentumLoop = () => {
        if (Math.abs(velocityRef.current) > minVelocity) {
          rotationRef.current += velocityRef.current;
          velocityRef.current *= friction;
          setRotation(rotationRef.current);

          const normalized = ((-rotationRef.current % 360) + 360) % 360;
          const currentIdx = Math.round(normalized / anglePerItem) % total;
          setCurrentIndex(currentIdx);

          rafIdRef.current = requestAnimationFrame(momentumLoop);
        } else {
          const nearestIndex = Math.round(-rotationRef.current / anglePerItem);
          const targetSnap = -nearestIndex * anglePerItem;
          smoothRotateTo(targetSnap);
        }
      };

      rafIdRef.current = requestAnimationFrame(momentumLoop);
    }, [anglePerItem, total, smoothRotateTo]);

    // Pointer Events (Touch & Drag)
    const handlePointerDown = (e: React.PointerEvent) => {
      if (!enableDrag) return;
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);

      isDraggingRef.current = true;
      dragStartXRef.current = e.clientX;
      lastXRef.current = e.clientX;
      lastTimeRef.current = performance.now();
      velocityRef.current = 0;
      totalDragDistanceRef.current = 0;

      if (viewportRef.current) {
        viewportRef.current.setPointerCapture(e.pointerId);
      }
    };

    const handlePointerMove = (e: React.PointerEvent) => {
      if (!isDraggingRef.current) return;

      const currentX = e.clientX;
      const now = performance.now();
      const deltaX = currentX - lastXRef.current;
      const dt = Math.max(now - lastTimeRef.current, 1);

      totalDragDistanceRef.current += Math.abs(deltaX);

      // Direct 1:1 finger tracking calibrated by radius
      const sensitivity = anglePerItem / (radius * 0.65);
      rotationRef.current += deltaX * sensitivity;
      velocityRef.current = (deltaX / dt) * 16 * sensitivity;

      lastXRef.current = currentX;
      lastTimeRef.current = now;

      setRotation(rotationRef.current);

      const normalized = ((-rotationRef.current % 360) + 360) % 360;
      const currentIdx = Math.round(normalized / anglePerItem) % total;
      setCurrentIndex(currentIdx);
    };

    const handlePointerUp = (e: React.PointerEvent) => {
      if (!isDraggingRef.current) return;
      isDraggingRef.current = false;

      if (viewportRef.current) {
        try {
          viewportRef.current.releasePointerCapture(e.pointerId);
        } catch {
          // ignore
        }
      }

      if (totalDragDistanceRef.current < 6) {
        const nearestIndex = Math.round(-rotationRef.current / anglePerItem);
        smoothRotateTo(-nearestIndex * anglePerItem);
        return;
      }

      startMomentum();
    };

    // Wheel / Trackpad Handling
    const handleWheel = (e: React.WheelEvent) => {
      if (!enableWheel) return;
      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      if (Math.abs(delta) < 4) return;

      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);

      const sensitivity = 0.12;
      rotationRef.current -= delta * sensitivity;
      setRotation(rotationRef.current);

      const normalized = ((-rotationRef.current % 360) + 360) % 360;
      const currentIdx = Math.round(normalized / anglePerItem) % total;
      setCurrentIndex(currentIdx);

      if ((handleWheel as any).timeout) {
        clearTimeout((handleWheel as any).timeout);
      }
      (handleWheel as any).timeout = setTimeout(() => {
        const nearestIndex = Math.round(-rotationRef.current / anglePerItem);
        smoothRotateTo(-nearestIndex * anglePerItem);
      }, 180);
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

            // 7 Variants Classification:
            // 1. Center (Selected): offset in (-0.5, +0.5)
            // 2. Near Left: offset in (-1.5, -0.5]
            // 3. Near Right: offset in [0.5, 1.5)
            // 4. Outer Left: offset in (-2.5, -1.5]
            // 5. Outer Right: offset in [1.5, 2.5)
            // 6. Far Left: offset in (-3.5, -2.5]
            // 7. Far Right: offset in [2.5, 3.5)
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

            // 3D Amphitheater Arc Coordinates:
            const arcAngleDeg = offset * 26;
            const arcAngleRad = (arcAngleDeg * Math.PI) / 180;

            const posX = Math.sin(arcAngleRad) * radius;
            const posZ = (Math.cos(arcAngleRad) - 1) * radius;
            const rotY = arcAngleDeg * 0.52;

            // Scale Curve:
            // Center is heroically ZOOMED (scale 1.36)
            // Others are distinctly smaller (Near: ~0.75, Outer: ~0.62, Far: ~0.48)
            const scale = isCenter 
              ? 1.36 
              : Math.max(0.44, 0.88 - (absOffset / 3.5) * 0.46);

            // Opacity Curve:
            // Center is 100% visible (1.0)
            // Others are "little bit low visible" (Near: ~0.42, Outer: ~0.25, Far: ~0.14)
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

            // Layered z-index (Center is 150, foreground, others stepped down)
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

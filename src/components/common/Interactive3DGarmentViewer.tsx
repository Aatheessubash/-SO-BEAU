import React, { useRef, useState, useMemo, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Float } from '@react-three/drei';
import * as THREE from 'three';
import { RotateCcw, Sparkles, Check, ZoomIn, Eye, Activity, ShieldCheck } from 'lucide-react';
import '../../styles/components/Interactive3DGarmentViewer.scss';

// Official SOBEAU Atelier Colorways
export interface GarmentColorway {
  name: string;
  code: string;
  hex: string;
}

export const ATELIER_COLORWAYS: GarmentColorway[] = [
  { name: 'Surgical Blue', code: 'surgical-blue', hex: '#4A7C9B' },
  { name: 'French Navy', code: 'navy', hex: '#1D2A44' },
  { name: 'Plum Noir', code: 'plum', hex: '#4A2838' },
  { name: 'Warm Taupe', code: 'taupe', hex: '#A39382' },
  { name: 'Deep Charcoal', code: 'charcoal', hex: '#1E2022' },
  { name: 'Terracotta Clay', code: 'terracotta', hex: '#8C554F' },
  { name: 'Sage Green', code: 'sage', hex: '#4D5D53' },
];

// Procedural Micro-Weave Fabric Bump Map Texture
function useFabricTexture() {
  return useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#808080';
      ctx.fillRect(0, 0, 128, 128);

      // Fine diagonal technical twill weave pattern
      ctx.strokeStyle = '#999999';
      ctx.lineWidth = 1;
      for (let i = -128; i < 256; i += 4) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i + 128, 128);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(i + 128, 0);
        ctx.lineTo(i, 128);
        ctx.stroke();
      }
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(16, 16);
    return texture;
  }, []);
}

// 3D Procedural Tailored Scrub Garment Model
interface ScrubModelProps {
  colorHex: string;
  isStretching: boolean;
}

const ScrubModel: React.FC<ScrubModelProps> = ({ colorHex, isStretching }) => {
  const groupRef = useRef<THREE.Group>(null);
  const fabricTexture = useFabricTexture();

  // Create high-fashion fabric material with subtle technical sheen
  const fabricMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(colorHex),
      roughness: 0.72,
      metalness: 0.04,
      sheen: 0.45,
      sheenColor: new THREE.Color('#FFFFFF'),
      bumpMap: fabricTexture,
      bumpScale: 0.012,
      clearcoat: 0.06,
      clearcoatRoughness: 0.3,
    });
  }, [colorHex, fabricTexture]);

  // Accent trims (Drawstring & Stethoscope Metallic Accent)
  const trimMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#FFFFFF',
      roughness: 0.5,
    });
  }, []);

  const stethTubingMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#111827',
      roughness: 0.4,
    });
  }, []);

  const stethMetalMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#D1D5DB',
      metalness: 0.9,
      roughness: 0.2,
    });
  }, []);

  // Subtle breathing / stretch pulse animation frame
  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    if (isStretching) {
      // 4-Way Recoil Stretch pulse simulation
      const stretchFactor = 1 + Math.sin(t * 4) * 0.07;
      groupRef.current.scale.set(stretchFactor, 1, 1 / (stretchFactor * 0.8));
    } else {
      // Gentle natural posture breath
      const breath = 1 + Math.sin(t * 1.5) * 0.008;
      groupRef.current.scale.set(breath, breath, breath);
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.15, 0]}>
      {/* ==================================================== */}
      {/* 1. TAILORED V-NECK SCRUB TOP                          */}
      {/* ==================================================== */}

      {/* Main Contoured Torso */}
      <mesh position={[0, 0.72, 0]} material={fabricMaterial} castShadow receiveShadow>
        <cylinderGeometry args={[0.44, 0.41, 0.95, 32]} />
      </mesh>

      {/* Shoulder Yoke Darting */}
      <mesh position={[0, 1.15, 0]} material={fabricMaterial} castShadow>
        <cylinderGeometry args={[0.54, 0.44, 0.22, 32]} />
      </mesh>

      {/* Architectural Contoured V-Neck Collar Trim */}
      <group position={[0, 1.16, 0.38]}>
        {/* Left V-Band */}
        <mesh position={[-0.09, -0.05, 0]} rotation={[0, 0, 0.55]} material={fabricMaterial}>
          <boxGeometry args={[0.045, 0.26, 0.06]} />
        </mesh>
        {/* Right V-Band */}
        <mesh position={[0.09, -0.05, 0]} rotation={[0, 0, -0.55]} material={fabricMaterial}>
          <boxGeometry args={[0.045, 0.26, 0.06]} />
        </mesh>
        {/* Underlayer Striped Inset (Subtle Atelier Detail) */}
        <mesh position={[0, -0.02, -0.02]} material={trimMaterial}>
          <planeGeometry args={[0.14, 0.14]} />
        </mesh>
      </group>

      {/* Left Sleeve */}
      <group position={[-0.56, 1.05, 0]} rotation={[0, 0, 0.35]}>
        <mesh material={fabricMaterial} castShadow>
          <cylinderGeometry args={[0.15, 0.165, 0.38, 24]} />
        </mesh>
        {/* Sleeve Contrast Hem Cuff */}
        <mesh position={[0, -0.18, 0]} material={trimMaterial}>
          <cylinderGeometry args={[0.166, 0.166, 0.03, 24]} />
        </mesh>
      </group>

      {/* Right Sleeve */}
      <group position={[0.56, 1.05, 0]} rotation={[0, 0, -0.35]}>
        <mesh material={fabricMaterial} castShadow>
          <cylinderGeometry args={[0.15, 0.165, 0.38, 24]} />
        </mesh>
        {/* Sleeve Contrast Hem Cuff */}
        <mesh position={[0, -0.18, 0]} material={trimMaterial}>
          <cylinderGeometry args={[0.166, 0.166, 0.03, 24]} />
        </mesh>
      </group>

      {/* Clinical Chest Shears Pocket */}
      <group position={[-0.2, 0.88, 0.42]}>
        <mesh material={fabricMaterial}>
          <boxGeometry args={[0.14, 0.16, 0.025]} />
        </mesh>
        {/* Contrast Pocket Hem */}
        <mesh position={[0, 0.08, 0]} material={trimMaterial}>
          <boxGeometry args={[0.142, 0.015, 0.026]} />
        </mesh>
      </group>

      {/* Clinical Shears Loop / Badge Clip Detail */}
      <mesh position={[0.22, 0.94, 0.41]} material={trimMaterial}>
        <boxGeometry args={[0.025, 0.07, 0.02]} />
      </mesh>

      {/* ==================================================== */}
      {/* 2. ERGONOMIC JOGGER PANT LEGS                        */}
      {/* ==================================================== */}

      {/* High-Rise Comfort Yoga Knit Waistband */}
      <mesh position={[0, 0.22, 0]} material={fabricMaterial} castShadow>
        <cylinderGeometry args={[0.43, 0.42, 0.14, 32]} />
      </mesh>

      {/* Contrast Waistband Drawcord Ties */}
      <group position={[0, 0.22, 0.43]}>
        <mesh position={[-0.03, -0.08, 0]} rotation={[0, 0, 0.15]} material={trimMaterial}>
          <cylinderGeometry args={[0.012, 0.012, 0.18, 12]} />
        </mesh>
        <mesh position={[0.03, -0.08, 0]} rotation={[0, 0, -0.15]} material={trimMaterial}>
          <cylinderGeometry args={[0.012, 0.012, 0.18, 12]} />
        </mesh>
        {/* Knot */}
        <mesh position={[0, 0.01, 0]} material={trimMaterial}>
          <sphereGeometry args={[0.026, 12, 12]} />
        </mesh>
      </group>

      {/* Left Pant Leg (Articulated Inseam) */}
      <group position={[-0.21, -0.42, 0]}>
        {/* Upper Thigh */}
        <mesh position={[0, 0.18, 0]} material={fabricMaterial} castShadow>
          <cylinderGeometry args={[0.19, 0.165, 0.58, 24]} />
        </mesh>
        {/* Lower Calf with Taper */}
        <mesh position={[0, -0.32, 0]} material={fabricMaterial} castShadow>
          <cylinderGeometry args={[0.165, 0.13, 0.52, 24]} />
        </mesh>
        {/* Ribbed Ankle Jogger Cuff */}
        <mesh position={[0, -0.58, 0]} material={trimMaterial}>
          <cylinderGeometry args={[0.135, 0.135, 0.07, 24]} />
        </mesh>
        {/* Athletic Sneaker Silhouette */}
        <mesh position={[0, -0.66, 0.06]} material={trimMaterial}>
          <boxGeometry args={[0.16, 0.09, 0.32]} />
        </mesh>
      </group>

      {/* Right Pant Leg (Articulated Inseam) */}
      <group position={[0.21, -0.42, 0]}>
        {/* Upper Thigh */}
        <mesh position={[0, 0.18, 0]} material={fabricMaterial} castShadow>
          <cylinderGeometry args={[0.19, 0.165, 0.58, 24]} />
        </mesh>
        {/* Lower Calf with Taper */}
        <mesh position={[0, -0.32, 0]} material={fabricMaterial} castShadow>
          <cylinderGeometry args={[0.165, 0.13, 0.52, 24]} />
        </mesh>
        {/* Ribbed Ankle Jogger Cuff */}
        <mesh position={[0, -0.58, 0]} material={trimMaterial}>
          <cylinderGeometry args={[0.135, 0.135, 0.07, 24]} />
        </mesh>
        {/* Athletic Sneaker Silhouette */}
        <mesh position={[0, -0.66, 0.06]} material={trimMaterial}>
          <boxGeometry args={[0.16, 0.09, 0.32]} />
        </mesh>
      </group>

      {/* ==================================================== */}
      {/* 3. SIGNATURE CLINICAL STETHOSCOPE ACCESSORY          */}
      {/* ==================================================== */}
      <group position={[0, 0.96, 0.39]}>
        {/* Stethoscope Neck Loop */}
        <mesh material={stethTubingMaterial}>
          <torusGeometry args={[0.24, 0.016, 12, 32, Math.PI]} rotation={[Math.PI, 0, 0]} />
        </mesh>
        {/* Chestpiece / Bell */}
        <group position={[0.12, -0.16, 0.04]}>
          <mesh material={stethMetalMaterial}>
            <cylinderGeometry args={[0.045, 0.045, 0.02, 24]} rotation={[Math.PI / 2, 0, 0]} />
          </mesh>
        </group>
      </group>
    </group>
  );
};

// Studio Lighting Rig
const StudioLighting: React.FC = () => {
  return (
    <>
      {/* Atelier Warm Key Spotlight */}
      <spotLight
        position={[4, 7, 5]}
        intensity={2.2}
        angle={0.5}
        penumbra={0.65}
        color="#FFFFFF"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0001}
      />

      {/* Ambient Cool Fill Light */}
      <directionalLight position={[-4, 3, 3]} intensity={1.1} color="#E9EBEF" />

      {/* Muted Gold Atelier Rim Light (Edge Definition) */}
      <directionalLight position={[0, 4, -5]} intensity={1.6} color="#B6A17B" />

      {/* Subtle Under-Stage Floor Bounce */}
      <pointLight position={[0, -1.2, 0]} intensity={0.4} color="#FAF9F6" />

      {/* Global Environment Tone */}
      <ambientLight intensity={0.65} />
    </>
  );
};

interface Interactive3DGarmentViewerProps {
  initialColorHex?: string;
  onColorChange?: (colorway: GarmentColorway) => void;
  title?: string;
  className?: string;
  showColorControls?: boolean;
  height?: string | number;
}

export const Interactive3DGarmentViewer: React.FC<Interactive3DGarmentViewerProps> = ({
  initialColorHex = '#4A7C9B',
  onColorChange,
  title = "SO BEAU Atelier 3D Inspection",
  className = '',
  showColorControls = true,
  height = '520px',
}) => {
  const [activeColor, setActiveColor] = useState<string>(initialColorHex);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [isStretching, setIsStretching] = useState<boolean>(false);
  const controlsRef = useRef<any>(null);

  // Sync external color change
  useEffect(() => {
    if (initialColorHex) {
      setActiveColor(initialColorHex);
    }
  }, [initialColorHex]);

  const handleSelectColor = (cw: GarmentColorway) => {
    setActiveColor(cw.hex);
    onColorChange?.(cw);
  };

  const handleResetCamera = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  };

  const currentColorway =
    ATELIER_COLORWAYS.find((c) => c.hex.toLowerCase() === activeColor.toLowerCase()) ||
    ATELIER_COLORWAYS[0];

  return (
    <div className={`interactive-3d-garment-container ${className}`} style={{ height }}>
      {/* 3D WebGL Canvas Stage */}
      <div className="canvas-wrapper">
        <Canvas
          shadows
          camera={{ position: [0, 0.18, 3.8], fov: 38 }}
          dpr={[1, 1.8]}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
          }}
        >
          <StudioLighting />

          <Suspense fallback={null}>
            <Float speed={1.2} rotationIntensity={0.08} floatIntensity={0.12}>
              <ScrubModel colorHex={activeColor} isStretching={isStretching} />
            </Float>

            {/* Ground Contact Shadow */}
            <ContactShadows
              position={[0, -1.05, 0]}
              opacity={0.45}
              scale={4.8}
              blur={2.4}
              far={2.2}
              color="#0A1422"
            />
          </Suspense>

          {/* Smooth Interactive Orbit Controls with Inertia */}
          <OrbitControls
            ref={controlsRef}
            target={[0, 0.18, 0]}
            enablePan={false}
            enableZoom={true}
            minDistance={2.4}
            maxDistance={5.6}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI / 1.75}
            autoRotate={autoRotate}
            autoRotateSpeed={1.2}
            enableDamping={true}
            dampingFactor={0.07}
          />
        </Canvas>
      </div>

      {/* Floating 3D Atelier Glass HUD Overlays */}
      <div className="garment-hud-overlay">
        {/* Top Header Row */}
        <div className="hud-top-bar">
          <div className="hud-badge">
            <Sparkles size={12} className="sparkle-icon" />
            <span>REAL-TIME 3D ATELIER</span>
          </div>

          <div className="hud-actions-group">
            {/* Auto Orbit Toggle */}
            <button
              type="button"
              className={`hud-tool-btn ${autoRotate ? 'active' : ''}`}
              onClick={() => setAutoRotate(!autoRotate)}
              title={autoRotate ? 'Pause 360° Orbit' : 'Resume 360° Orbit'}
              aria-label="Toggle 360 rotation"
            >
              <RotateCcw size={14} className={autoRotate ? 'spin-icon' : ''} />
              <span>{autoRotate ? '360° Orbiting' : 'Orbit Paused'}</span>
            </button>

            {/* 4-Way Recoil Stretch Test Button */}
            <button
              type="button"
              className={`hud-tool-btn ${isStretching ? 'active' : ''}`}
              onClick={() => setIsStretching(!isStretching)}
              title="Test BeauTech™ 4-Way Recoil Stretch Simulation"
              aria-label="Toggle Stretch Simulation"
            >
              <Activity size={14} />
              <span>{isStretching ? 'Recoil Active' : 'Test Recoil Stretch'}</span>
            </button>

            {/* Reset Camera Button */}
            <button
              type="button"
              className="hud-tool-btn"
              onClick={handleResetCamera}
              title="Reset Front View Camera"
              aria-label="Reset Camera"
            >
              <ZoomIn size={14} />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Bottom Interactive HUD: Color Selector & Clinical Callout */}
        <div className="hud-bottom-bar">
          {showColorControls && (
            <div className="hud-colorways-glass">
              <span className="colorway-label">
                Colorway: <strong>{currentColorway.name}</strong>
              </span>

              <div className="swatches-rack" role="radiogroup" aria-label="3D Model Colorway">
                {ATELIER_COLORWAYS.map((cw) => {
                  const isSelected = cw.hex.toLowerCase() === activeColor.toLowerCase();
                  return (
                    <button
                      key={cw.code}
                      type="button"
                      role="radio"
                      aria-checked={isSelected}
                      className={`hud-swatch-circle ${isSelected ? 'is-active' : ''}`}
                      style={{ backgroundColor: cw.hex }}
                      onClick={() => handleSelectColor(cw)}
                      title={`${cw.name} (Click to apply in 3D)`}
                    >
                      {isSelected && <Check size={11} strokeWidth={3} className="check-mark" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Clinical Verification Chip */}
          <div className="hud-clinical-pill">
            <ShieldCheck size={14} className="shield-icon" />
            <span>BeauTech™ 4-Way Stretch & Silvadur™ Antimicrobial</span>
          </div>
        </div>
      </div>
    </div>
  );
};

import { useEffect, useRef, useState, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import LegoScene from './components/3d/LegoScene';
import ScrollOverlay from './components/ui/ScrollOverlay';
import Navbar from './components/ui/Navbar';
import BuildingDetailModal from './components/ui/BuildingDetailModal';
import { TOTAL_SCROLL_HEIGHT, SCROLL_PHASES } from './utils/constants';
import './styles/index.css';

/* ── Loading screen ── */
function LoadingScreen({ visible }) {
  return (
    <div className={`loading-screen ${!visible ? 'fade-out' : ''}`} aria-hidden={!visible}>
      <div className="loading-bricks">
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className="loading-brick" />
        ))}
      </div>
      <span className="loading-text">Building your world…</span>
    </div>
  );
}

function App() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [hoveredBuilding, setHoveredBuilding] = useState(null);
  const [focusTarget, setFocusTarget] = useState(null);
  const [loaded, setLoaded] = useState(false);

  /* Dismiss loader after first render */
  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 1200);
    return () => clearTimeout(t);
  }, []);

  /* Scroll tracking */
  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const prog = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      setScrollProgress(prog);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleBuildingClick = useCallback((building) => {
    setSelectedBuilding(building);
    setFocusTarget([building.position[0], building.size.h / 2, building.position[2]]);
  }, []);

  const handleBuildingHover = useCallback((building, isHovered) => {
    setHoveredBuilding(isHovered ? building : null);
  }, []);

  const handleModalClose = useCallback(() => {
    setSelectedBuilding(null);
    setFocusTarget(null);
  }, []);

  const cityPhase = scrollProgress >= SCROLL_PHASES.CITY_REVEAL.start;

  return (
    <>
      {/* Loading screen */}
      <LoadingScreen visible={!loaded} />

      {/* Fixed 3D canvas */}
      <div className="canvas-container">
        <Canvas
          shadows
          gl={{ antialias: true, powerPreference: 'high-performance', alpha: false }}
          camera={{ fov: 52, near: 0.1, far: 500, position: [0, 4, 9] }}
          dpr={[1, 1.5]}
          onCreated={({ gl }) => {
            gl.setClearColor('#FFFFFF', 1);
          }}
        >
          <LegoScene
            scrollProgress={scrollProgress}
            focusTarget={focusTarget}
            onFocusDone={() => {}}
            onBuildingClick={handleBuildingClick}
            onBuildingHover={handleBuildingHover}
            selectedBuilding={selectedBuilding}
          />
        </Canvas>
      </div>

      {/* UI layers */}
      <Navbar scrollProgress={scrollProgress} />
      <ScrollOverlay scrollProgress={scrollProgress} />

      {/* Hover label */}
      {hoveredBuilding && cityPhase && (
        <div className="hover-label">
          <span className="hover-label__tag">{hoveredBuilding.tag}</span>
          <span className="hover-label__name">{hoveredBuilding.label}</span>
        </div>
      )}

      {/* Building drawer */}
      <BuildingDetailModal building={selectedBuilding} onClose={handleModalClose} />

      {/* Ghost scroll driver */}
      <div style={{ height: TOTAL_SCROLL_HEIGHT, pointerEvents: 'none' }} aria-hidden="true" />
    </>
  );
}

export default App;

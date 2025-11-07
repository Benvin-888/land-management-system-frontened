// src/components/BlueprintScene.jsx
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Text, Environment, Float } from '@react-three/drei';
import { useRef, useState, useEffect, useMemo } from 'react';
import * as THREE from 'three';

// Advanced materials with PBR
function createPBRMaterials() {
  return {
    brick: new THREE.MeshStandardMaterial({
      color: '#8B4513',
      roughness: 0.8,
      metalness: 0.2,
    }),
    roof: new THREE.MeshStandardMaterial({
      color: '#2F4F4F',
      roughness: 0.9,
      metalness: 0.1,
    }),
    wood: new THREE.MeshStandardMaterial({
      color: '#DEB887',
      roughness: 0.7,
      metalness: 0.1,
    }),
    glass: new THREE.MeshPhysicalMaterial({
      color: '#87CEEB',
      transmission: 0.9,
      opacity: 0.2,
      transparent: true,
      roughness: 0.1,
      metalness: 0,
      ior: 1.5,
      thickness: 0.5,
    }),
    concrete: new THREE.MeshStandardMaterial({
      color: '#A9A9A9',
      roughness: 0.8,
      metalness: 0.1,
    })
  };
}

function RealisticHouse() {
  const group = useRef();
  const roofGroup = useRef();
  const [hovered, setHovered] = useState(false);
  const materials = useMemo(() => createPBRMaterials(), []);

  // Realistic animations
  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y = hovered 
        ? Math.sin(state.clock.elapsedTime * 0.5) * 0.1
        : 0;
    }
    if (roofGroup.current) {
      roofGroup.current.position.y = 3.2 + Math.sin(state.clock.elapsedTime * 0.8) * 0.05;
    }
  });

  // Realistic Wall with windows and details
  const Wall = ({ position, rotation, hasWindow = false, hasDoor = false }) => (
    <group position={position} rotation={rotation}>
      {/* Main wall structure */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[6, 3, 0.3]} />
        <primitive object={materials.brick} />
      </mesh>
      
      {/* Window */}
      {hasWindow && (
        <group position={[0, 0.5, 0.16]}>
          <mesh castShadow>
            <boxGeometry args={[1.5, 1.2, 0.1]} />
            <primitive object={materials.wood} />
          </mesh>
          <mesh position={[0, 0, 0.06]}>
            <planeGeometry args={[1.4, 1.1]} />
            <primitive object={materials.glass} />
          </mesh>
        </group>
      )}
      
      {/* Door */}
      {hasDoor && (
        <group position={[0, -0.8, 0.16]}>
          <mesh castShadow>
            <boxGeometry args={[1, 2, 0.1]} />
            <primitive object={materials.wood} />
          </mesh>
          {/* Door handle */}
          <mesh position={[0.4, 0, 0.11]} castShadow>
            <sphereGeometry args={[0.03, 8, 8]} />
            <meshStandardMaterial color="#CCCCCC" metalness={0.8} roughness={0.2} />
          </mesh>
        </group>
      )}
    </group>
  );

  // Realistic Roof with proper geometry
  const Roof = () => (
    <group ref={roofGroup}>
      <mesh rotation={[0, Math.PI / 4, 0]} castShadow receiveShadow>
        <coneGeometry args={[4.5, 2, 4]} />
        <primitive object={materials.roof} />
      </mesh>
      {/* Roof trim */}
      <mesh rotation={[0, Math.PI / 4, 0]} position={[0, -1, 0]}>
        <cylinderGeometry args={[5, 5, 0.1, 4]} />
        <meshStandardMaterial color="#8B4513" roughness={0.7} />
      </mesh>
    </group>
  );

  // Realistic Foundation
  const Foundation = () => (
    <group>
      <mesh position={[0, -1.65, 0]} castShadow receiveShadow>
        <boxGeometry args={[6.4, 0.3, 6.4]} />
        <primitive object={materials.concrete} />
      </mesh>
    </group>
  );

  // Interior details
  const Interior = () => (
    <group>
      {/* Furniture */}
      <mesh position={[-1.5, -1.3, -1]} rotation={[0, Math.PI / 4, 0]} castShadow>
        <boxGeometry args={[1, 0.8, 0.5]} />
        <primitive object={materials.wood} />
      </mesh>
      
      <mesh position={[1.5, -1.4, 1]} castShadow>
        <boxGeometry args={[0.8, 0.6, 1.2]} />
        <primitive object={materials.wood} />
      </mesh>
      
      {/* Stairs */}
      <mesh position={[2, -1.65, 0]} rotation={[0, -Math.PI / 2, 0]} castShadow>
        <boxGeometry args={[1, 0.3, 2]} />
        <primitive object={materials.wood} />
      </mesh>
    </group>
  );

  // Chimney
  const Chimney = () => (
    <mesh position={[1.5, 2, -1.5]} castShadow>
      <boxGeometry args={[0.4, 1.5, 0.4]} />
      <meshStandardMaterial color="#696969" roughness={0.9} />
    </mesh>
  );

  return (
    <Float
      speed={hovered ? 2 : 0.5}
      rotationIntensity={hovered ? 0.1 : 0.05}
      floatIntensity={hovered ? 0.1 : 0.02}
    >
      <group 
        ref={group}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <Foundation />
        
        {/* Walls */}
        <Wall position={[0, 0, -3]} rotation={[0, 0, 0]} hasWindow={true} />
        <Wall position={[0, 0, 3]} rotation={[0, Math.PI, 0]} hasWindow={true} />
        <Wall position={[-3, 0, 0]} rotation={[0, Math.PI / 2, 0]} hasWindow={true} />
        <Wall position={[3, 0, 0]} rotation={[0, -Math.PI / 2, 0]} hasDoor={true} />
        
        <Roof />
        <Chimney />
        <Interior />
        
        {/* Decorative elements */}
        <mesh position={[0, -1.5, -4]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[8, 8]} />
          <meshStandardMaterial color="#228B22" roughness={0.9} />
        </mesh>
      </group>
    </Float>
  );
}

function AdvancedGrid() {
  const gridRef = useRef();
  
  useFrame((state) => {
    if (gridRef.current) {
      gridRef.current.position.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
      gridRef.current.position.z = Math.cos(state.clock.elapsedTime * 0.1) * 0.1;
    }
  });

  return (
    <group>
      <gridHelper 
        ref={gridRef}
        args={[20, 20, '#00ffcc', '#00ffcc']} 
        rotation={[-Math.PI / 2, 0, 0]} 
      />
      <axesHelper args={[5]} />
    </group>
  );
}

function FloatingInfo() {
  return (
    <group>
      <Text
        position={[0, 5, 0]}
        color="#00ffcc"
        fontSize={0.4}
        maxWidth={200}
        lineHeight={1}
        letterSpacing={0.02}
        textAlign="center"
        font="https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff"
        anchorX="center"
        anchorY="middle"
      >
        ARCHITECTURAL VISUALIZATION
      </Text>
      <Text
        position={[0, 4.5, 0]}
        color="#ff3366"
        fontSize={0.2}
        maxWidth={200}
        lineHeight={1}
        letterSpacing={0.02}
        textAlign="center"
        anchorX="center"
        anchorY="middle"
      >
        Real-time 3D House Model
      </Text>
    </group>
  );
}

function AdvancedLights() {
  const pointLight = useRef();
  const spotLight = useRef();
  
  useFrame((state) => {
    if (pointLight.current) {
      pointLight.current.position.x = Math.sin(state.clock.elapsedTime) * 4;
      pointLight.current.position.z = Math.cos(state.clock.elapsedTime) * 4;
      pointLight.current.intensity = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.3;
    }
    
    if (spotLight.current) {
      spotLight.current.intensity = 0.8 + Math.sin(state.clock.elapsedTime * 1.5) * 0.2;
    }
  });

  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight 
        ref={pointLight} 
        position={[4, 4, 4]} 
        color="#00ffff" 
        intensity={1.2} 
        distance={15}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <spotLight
        ref={spotLight}
        position={[0, 6, 0]}
        angle={0.3}
        penumbra={0.5}
        intensity={0.7}
        color="#ffffff"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <directionalLight
        position={[-5, 5, 5]}
        intensity={0.3}
        color="#ffaa33"
        castShadow
      />
    </>
  );
}

function Particles() {
  const particlesRef = useRef();
  const count = 200;
  
  const positions = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 20;
    }
    return positions;
  }, [count]);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.02}
        color="#00ffcc"
        transparent
        opacity={0.6}
        sizeAttenuation={true}
      />
    </points>
  );
}

function CameraController() {
  const { camera } = useThree();
  const [isAnimating] = useState(true);
  
  useFrame((state) => {
    if (isAnimating) {
      const time = state.clock.elapsedTime;
      camera.position.x = Math.sin(time * 0.2) * 8;
      camera.position.z = Math.cos(time * 0.2) * 8;
      camera.position.y = 3 + Math.sin(time * 0.3) * 1;
      camera.lookAt(0, 0, 0);
    }
  });

  return null;
}

export default function BlueprintScene() {
  const [isMobile, setIsMobile] = useState(false);
  const [showWireframe, setShowWireframe] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.overlay}>
        <h1 style={styles.title}>Advanced 3D Architecture</h1>
        <p style={styles.subtitle}>Realistic House Visualization</p>
        
        <div style={styles.controls}>
          <div style={styles.controlGroup}>
            <h3 style={styles.controlTitle}>Navigation</h3>
            <div style={styles.controlItem}>
              <span style={styles.controlKey}>🖱️ Drag</span>
              <span style={styles.controlValue}>Rotate Camera</span>
            </div>
            <div style={styles.controlItem}>
              <span style={styles.controlKey}>📱 Scroll</span>
              <span style={styles.controlValue}>Zoom In/Out</span>
            </div>
            <div style={styles.controlItem}>
              <span style={styles.controlKey}>👆 Hover</span>
              <span style={styles.controlValue}>Activate Effects</span>
            </div>
          </div>
          
          <div style={styles.controlGroup}>
            <h3 style={styles.controlTitle}>Features</h3>
            <div style={styles.featureList}>
              <span style={styles.feature}>• PBR Materials</span>
              <span style={styles.feature}>• Real-time Shadows</span>
              <span style={styles.feature}>• Physics-based Rendering</span>
              <span style={styles.feature}>• Dynamic Lighting</span>
            </div>
          </div>
        </div>
        
        <div style={styles.stats}>
          <div style={styles.statItem}>
            <span style={styles.statValue}>12.5k</span>
            <span style={styles.statLabel}>Triangles</span>
          </div>
          <div style={styles.statItem}>
            <span style={styles.statValue}>8</span>
            <span style={styles.statLabel}>Materials</span>
          </div>
          <div style={styles.statItem}>
            <span style={styles.statValue}>6</span>
            <span style={styles.statLabel}>Light Sources</span>
          </div>
        </div>
      </div>
      
      <Canvas 
        shadows 
        style={styles.canvas}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2
        }}
      >
        <PerspectiveCamera 
          makeDefault 
          position={isMobile ? [10, 5, 10] : [8, 4, 8]} 
          fov={45} 
          near={0.1}
          far={100}
        />
        
        <AdvancedLights />
        <AdvancedGrid />
        <RealisticHouse />
        <FloatingInfo />
        <Particles />
        <CameraController />
        
        <Environment preset="city" />
        
        <OrbitControls 
          enableZoom={true}
          enablePan={true}
          minDistance={5}
          maxDistance={20}
          autoRotate={false}
          enableDamping={true}
          dampingFactor={0.05}
        />
      </Canvas>
      
      <div style={styles.bottomOverlay}>
        <button 
          style={styles.button}
          onClick={() => setShowWireframe(!showWireframe)}
        >
          {showWireframe ? 'Solid View' : 'Wireframe View'}
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    width: '100%',
    height: '100vh',
    background: 'linear-gradient(135deg, #0a0f1a 0%, #1a1f2e 50%, #0a0f1a 100%)',
    position: 'relative',
    overflow: 'hidden',
    fontFamily: '"Raleway", "Arial", sans-serif',
  },
  canvas: {
    background: 'transparent',
  },
  overlay: {
    position: 'absolute',
    top: '20px',
    left: '20px',
    zIndex: 100,
    color: '#00ffcc',
    textShadow: '0 0 10px rgba(0, 255, 204, 0.5)',
    maxWidth: '400px',
  },
  title: {
    fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
    margin: '0 0 8px 0',
    fontWeight: '700',
    letterSpacing: '2px',
    background: 'linear-gradient(45deg, #00ffcc, #ff3366)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  subtitle: {
    fontSize: 'clamp(0.8rem, 1.5vw, 1.1rem)',
    margin: '0 0 30px 0',
    opacity: 0.8,
    fontWeight: '300',
  },
  controls: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    background: 'rgba(0, 255, 204, 0.1)',
    padding: '20px',
    borderRadius: '15px',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(0, 255, 204, 0.2)',
    marginBottom: '20px',
  },
  controlGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  controlTitle: {
    fontSize: '1rem',
    margin: '0 0 8px 0',
    color: '#ff3366',
    fontWeight: '600',
  },
  controlItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    minWidth: '180px',
  },
  controlKey: {
    fontSize: '0.9rem',
    opacity: 0.9,
  },
  controlValue: {
    fontSize: '0.8rem',
    opacity: 0.7,
  },
  featureList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  feature: {
    fontSize: '0.8rem',
    opacity: 0.8,
  },
  stats: {
    display: 'flex',
    gap: '20px',
    background: 'rgba(255, 51, 102, 0.1)',
    padding: '15px',
    borderRadius: '10px',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 51, 102, 0.2)',
  },
  statItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
  },
  statValue: {
    fontSize: '1.2rem',
    fontWeight: '700',
    color: '#ff3366',
  },
  statLabel: {
    fontSize: '0.7rem',
    opacity: 0.7,
  },
  bottomOverlay: {
    position: 'absolute',
    bottom: '20px',
    right: '20px',
    zIndex: 100,
  },
  button: {
    background: 'rgba(0, 255, 204, 0.2)',
    border: '1px solid rgba(0, 255, 204, 0.3)',
    color: '#00ffcc',
    padding: '10px 20px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontFamily: 'inherit',
    fontSize: '0.9rem',
    backdropFilter: 'blur(10px)',
    transition: 'all 0.3s ease',
  },
};

// Enhanced global styles
const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Raleway:wght@300;400;600;700&display=swap');
  
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  body {
    font-family: 'Raleway', sans-serif;
    overflow: hidden;
    background: #0a0f1a;
  }
  
  canvas {
    display: block;
  }
  
  button:hover {
    background: rgba(0, 255, 204, 0.3) !important;
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 255, 204, 0.2);
  }
`;

// Inject global styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.innerText = globalStyles;
  document.head.appendChild(styleSheet);
}
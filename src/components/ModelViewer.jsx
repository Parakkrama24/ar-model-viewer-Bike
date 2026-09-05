import { Canvas } from '@react-three/fiber'
import {
  ContactShadows,
  OrbitControls,
} from '@react-three/drei'

import BikeModel from './BikeModel'
import SceneLighting from './SceneLighting'

export default function ModelViewer() {
  // Adjust camera position based on screen size
  const isMobile = window.innerWidth < 640

  return (
    <Canvas
      camera={{
        position: isMobile ? [4, 2, 6] : [3, 1.8, 5],
        fov: isMobile ? 50 : 45,
      }}
      gl={{
        antialias: true,
      }}
    >

      <SceneLighting />

      <BikeModel
        rotation={[0, Math.PI / 2, 0]}
      />

      <ContactShadows
        position={[0, 0, 0]}
        opacity={0.5}
        scale={10}
        blur={2}
        far={4}
      />

      <OrbitControls
        enablePan={false}
        minDistance={isMobile ? 3 : 2}
        maxDistance={isMobile ? 10 : 8}
        enableDamping
        dampingFactor={0.05}
        rotateSpeed={isMobile ? 0.5 : 1}
        zoomSpeed={isMobile ? 0.8 : 1}
      />

    </Canvas>
  )
}
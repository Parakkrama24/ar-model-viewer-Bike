import { Canvas } from '@react-three/fiber'
import {
  ContactShadows,
  OrbitControls,
} from '@react-three/drei'

import BikeModel from './BikeModel'
import SceneLighting from './SceneLighting'

export default function ModelViewer() {
  return (
    <Canvas
      camera={{
        position: [3, 1.8, 5],
        fov: 45,
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
        minDistance={2}
        maxDistance={8}
      />

    </Canvas>
  )
}
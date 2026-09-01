import { Environment } from '@react-three/drei'

export default function SceneLighting() {
  return (
    <>
      <ambientLight intensity={0.5} />

      <directionalLight
        position={[5, 6, 5]}
        intensity={2}
      />

      <directionalLight
        position={[-4, 3, -4]}
        intensity={1}
      />

      <Environment
        preset="warehouse"
        background={false}
      />
    </>
  )
}
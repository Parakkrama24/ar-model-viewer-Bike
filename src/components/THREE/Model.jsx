import { useGLTF } from "@react-three/drei"

export function Model() {
  const { scene } = useGLTF('/models/bike.glb')

  return <primitive object={scene} scale={2} rotation={[0, Math.PI, 0]} position={[0, 0, 0]}/>
}
import { useGLTF } from '@react-three/drei'

const MODEL_PATH =
  '/models/model_101/BikeModel_01_steady.gltf'

export default function BikeModel(props) {
  const { scene } = useGLTF(MODEL_PATH)

  return (
    <primitive
      object={scene}
      {...props}
    />
  )
}

useGLTF.preload(MODEL_PATH)
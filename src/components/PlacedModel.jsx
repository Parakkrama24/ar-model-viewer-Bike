import { useEffect, useRef } from 'react'
import { useGLTF } from '@react-three/drei'

export default function PlacedModel({ matrix }) {
  const ref = useRef()

  const { scene } = useGLTF(
    '/models/model01/Model_01_steady.gltf'
  )

  useEffect(() => {
    if (!matrix || !ref.current) {
      return
    }

    matrix.decompose(
      ref.current.position,
      ref.current.quaternion,
      ref.current.scale
    )

    // Temporary scale
    ref.current.scale.setScalar(0.1)
  }, [matrix])

  if (!matrix) {
    return null
  }

  return (
    <primitive
      ref={ref}
      object={scene}
    />
  )
}
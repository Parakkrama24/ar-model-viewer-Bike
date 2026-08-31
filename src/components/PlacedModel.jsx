import { useEffect, useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

export default function PlacedModel({ matrix }) {
  const groupRef = useRef()

  const { scene } = useGLTF(
    '/models/model_101/BikeModel_01_steady.gltf'
  )

  // Calculate model offset once.
  const offset = useRef(null)

  useEffect(() => {
    const box = new THREE.Box3().setFromObject(scene)

    const center = new THREE.Vector3()

    box.getCenter(center)

    offset.current = new THREE.Vector3(
      -center.x,
      -box.min.y,
      -center.z
    )
  }, [scene])

  // Apply AR placement ONLY when matrix changes.
  useEffect(() => {
    if (!matrix || !groupRef.current) {
      return
    }

    matrix.decompose(
      groupRef.current.position,
      groupRef.current.quaternion,
      groupRef.current.scale
    )

    // Preserve the model's original scale.
    groupRef.current.scale.setScalar(1)
  }, [matrix])

  if (!matrix || !offset.current) {
    return null
  }

  return (
    <group ref={groupRef}>

      <primitive
        object={scene}
        position={offset.current}
      />

    </group>
  )
}
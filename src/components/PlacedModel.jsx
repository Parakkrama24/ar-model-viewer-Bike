import { useEffect, useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

export default function PlacedModel({ matrix }) {
  const groupRef = useRef()

  const { scene } = useGLTF(
    '/models/model_101/BikeModel_01_steady.gltf'
  )

  useEffect(() => {
    if (!matrix || !groupRef.current) {
      return
    }

    matrix.decompose(
      groupRef.current.position,
      groupRef.current.quaternion,
      groupRef.current.scale
    )

    // Keep the original model size
    groupRef.current.scale.setScalar(1)
  }, [matrix])

  /*
   * Calculate the model bounding box.
   */
  const box = new THREE.Box3().setFromObject(scene)

  const center = new THREE.Vector3()
  const size = new THREE.Vector3()

  box.getCenter(center)
  box.getSize(size)

  /*
   * Move the model so:
   *
   * X = centered
   * Z = centered
   * Y = bottom touches the AR plane
   */
  const offset = new THREE.Vector3(
    -center.x,
    -box.min.y,
    -center.z
  )

  if (!matrix) {
    return null
  }

  return (
    <group ref={groupRef}>

      <primitive
        object={scene}
        position={offset}
      />

    </group>
  )
}
import { useEffect, useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

const MODEL_ROTATION = [0, Math.PI / 2, 0]

export default function PlacedModel({ matrix }) {
  const groupRef = useRef()
  const modelRef = useRef()

  const { scene } = useGLTF(
    '/models/model_101/BikeModel_01_steady.gltf'
  )

  /*
   * Normalize the model after applying
   * its local rotation.
   */
  useEffect(() => {
    if (!modelRef.current) {
      return
    }

    const model = modelRef.current

    // Make sure Three.js has updated all transforms.
    model.updateMatrixWorld(true)

    const box = new THREE.Box3().setFromObject(model)

    /*
     * Move the model vertically so that
     * its lowest point is exactly Y = 0.
     */
    model.position.y -= box.min.y

    model.updateMatrixWorld(true)

    console.log('Ground offset:', -box.min.y)
  }, [scene])

  /*
   * Apply the AR placement transform.
   *
   * This only changes when the user places
   * the model.
   */
  useEffect(() => {
    if (!matrix || !groupRef.current) {
      return
    }

    matrix.decompose(
      groupRef.current.position,
      groupRef.current.quaternion,
      groupRef.current.scale
    )

    // Keep original model scale.
    groupRef.current.scale.setScalar(1)
  }, [matrix])

  if (!matrix) {
    return null
  }

  return (
    <group ref={groupRef}>

      <group
        ref={modelRef}
        rotation={MODEL_ROTATION}
      >
        <primitive
          object={scene}
        />
      </group>

    </group>
  )
}
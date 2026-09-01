import { useEffect, useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

const MODEL_PATH =
  '/models/model_101/BikeModel_01_steady.gltf'

const MODEL_ROTATION = [0, Math.PI / 2, 0]

export default function PlacedModel({
  matrix,
  onModelClick,
}) {
  const groupRef = useRef()
  const modelRef = useRef()

  const { scene } = useGLTF(MODEL_PATH)

  /*
   * Ground the model after applying
   * its local rotation.
   */
  useEffect(() => {
    if (!modelRef.current) {
      return
    }

    const model = modelRef.current

    model.updateMatrixWorld(true)

    const box = new THREE.Box3()
      .setFromObject(model)

    model.position.y -= box.min.y

    model.updateMatrixWorld(true)

  }, [scene])

  /*
   * Apply the frozen AR placement.
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
          onClick={(event) => {
            event.stopPropagation()
            onModelClick?.()
          }}
        />

      </group>

    </group>
  )
}

useGLTF.preload(MODEL_PATH)
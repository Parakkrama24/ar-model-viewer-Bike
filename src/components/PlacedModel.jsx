import { useEffect, useRef, useState } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

const MODEL_ROTATION = [0, Math.PI / 2, 0]

export default function PlacedModel({
  matrix,
  modelPath,
  onModelClick,
}) {
  const groupRef = useRef()
  const modelRef = useRef()

  const { scene } = useGLTF(modelPath)

  /*
   * Box that wraps the bike, expressed in the placement group's
   * own space. Used as the tap target — the bike's own geometry is
   * too thin to reliably hit with a finger tap in AR.
   */
  const [hitBox, setHitBox] = useState(null)

  /*
   * Ground the model after applying
   * its local rotation.
   */
  useEffect(() => {
    if (!modelRef.current || !groupRef.current) {
      return
    }

    const model = modelRef.current

    model.updateMatrixWorld(true)

    const box = new THREE.Box3()
      .setFromObject(model)

    model.position.y -= box.min.y

    model.updateMatrixWorld(true)

    /* Re-measure once grounded, relative to the placement group. */
    const grounded = new THREE.Box3()
      .setFromObject(model)
      .applyMatrix4(
        new THREE.Matrix4()
          .copy(groupRef.current.matrixWorld)
          .invert()
      )

    const size = grounded.getSize(new THREE.Vector3())
    const center = grounded.getCenter(new THREE.Vector3())

    setHitBox({
      size: [size.x, size.y, size.z],
      center: [center.x, center.y, center.z],
    })

  }, [scene, modelPath])

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

      {/*
        Invisible-but-raycastable collider. It must stay `visible`,
        because three's raycaster skips hidden objects — so it is
        made see-through with opacity 0 instead.
      */}
      {hitBox && (
        <mesh
          position={hitBox.center}
          onClick={(event) => {
            event.stopPropagation()
            onModelClick?.()
          }}
        >
          <boxGeometry args={hitBox.size} />
          <meshBasicMaterial
            transparent
            opacity={0}
            depthWrite={false}
          />
        </mesh>
      )}

    </group>
  )
}

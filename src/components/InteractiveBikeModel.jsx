import { useEffect, useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

/*
 * Interactive bike model with clickable parts
 * Detects clicks on individual meshes and triggers callbacks
 */

const MODEL_ROTATION = [0, Math.PI / 2, 0]

export default function InteractiveBikeModel({
  modelPath,
  matrix,
  onModelClick,
  onPartClick,
}) {
  const groupRef = useRef()
  const modelRef = useRef()
  const { scene } = useGLTF(modelPath)
  const clickablePartsRef = useRef(new Map())

  // Ground the model and setup clickable parts
  useEffect(() => {
    if (!modelRef.current || !groupRef.current) {
      return
    }

    const model = modelRef.current

    model.updateMatrixWorld(true)

    const box = new THREE.Box3().setFromObject(model)
    model.position.y -= box.min.y
    model.updateMatrixWorld(true)

    // Traverse model to find and setup clickable parts
    clickablePartsRef.current.clear()

    model.traverse((child) => {
      if (child.isMesh) {
        const partName = child.name.toLowerCase()

        // Detect tire/wheel parts (common naming patterns)
        const isTire =
          partName.includes('tire') ||
          partName.includes('wheel') ||
          partName.includes('tyre') ||
          partName.includes('rim')

        // Detect other parts
        const isFrame = partName.includes('frame')
        const isEngine = partName.includes('engine') || partName.includes('motor')
        const isSeat = partName.includes('seat')
        const isHandlebar = partName.includes('handlebar') || partName.includes('handle')

        if (isTire || isFrame || isEngine || isSeat || isHandlebar) {
          clickablePartsRef.current.set(child.uuid, {
            name: child.name,
            type: isTire ? 'tire' : isFrame ? 'frame' : isEngine ? 'engine' : isSeat ? 'seat' : 'handlebar',
            mesh: child
          })

          // Make cursor pointer on hover (if not in XR)
          child.userData.interactive = true
        }
      }
    })

    console.log('Clickable parts found:', Array.from(clickablePartsRef.current.values()))

  }, [scene, modelPath])

  // Apply placement matrix
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

  const handleClick = (event) => {
    event.stopPropagation()

    // Check if a specific part was clicked
    if (event.object && event.object.uuid) {
      const partInfo = clickablePartsRef.current.get(event.object.uuid)

      if (partInfo) {
        console.log('Part clicked:', partInfo)
        onPartClick?.(partInfo)
        return
      }
    }

    // Otherwise, treat as general model click
    onModelClick?.()
  }

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
          object={scene.clone()}
          onClick={handleClick}
        />
      </group>
    </group>
  )
}

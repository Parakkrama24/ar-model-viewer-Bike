import { useMemo } from 'react'
import * as THREE from 'three'
import ARUIButton from './ARUIButton'

/*
 * Navigation buttons that are anchored to the placed model in world space
 * These buttons appear on the left and right of the model's position
 */

export default function ARNavigationButtons({
  placedMatrix,
  onPrevious,
  onNext,
}) {
  // Calculate button positions based on model placement
  const { leftPosition, rightPosition } = useMemo(() => {
    if (!placedMatrix) {
      return { leftPosition: [0, 0, 0], rightPosition: [0, 0, 0] }
    }

    const pos = new THREE.Vector3()
    const quat = new THREE.Quaternion()
    const scale = new THREE.Vector3()

    placedMatrix.decompose(pos, quat, scale)

    // Position buttons in world space to the left and right of the model
    // Buttons are at ground level (y = 0.5) and offset by ±1.2 meters
    const leftPos = [pos.x - 1.2, 0.5, pos.z]
    const rightPos = [pos.x + 1.2, 0.5, pos.z]

    return {
      leftPosition: leftPos,
      rightPosition: rightPos,
    }
  }, [placedMatrix])

  if (!placedMatrix) {
    return null
  }

  return (
    <group>
      {/* Left navigation button */}
      <ARUIButton
        type="left"
        position={leftPosition}
        onClick={onPrevious}
        scale={0.3}
      />

      {/* Right navigation button */}
      <ARUIButton
        type="right"
        position={rightPosition}
        onClick={onNext}
        scale={0.3}
      />
    </group>
  )
}

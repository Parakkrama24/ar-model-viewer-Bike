import { useXRHitTest } from '@react-three/xr'
import { useRef } from 'react'
import { Matrix4 } from 'three'

export default function ARHitTest({ onHit }) {
  const reticleRef = useRef()
  const matrixRef = useRef(new Matrix4())

  useXRHitTest(
    (results, getWorldMatrix) => {
      if (results.length === 0) {
        if (reticleRef.current) {
          reticleRef.current.visible = false
        }

        return
      }

      getWorldMatrix(
        matrixRef.current,
        results[0]
      )

      if (reticleRef.current) {
        matrixRef.current.decompose(
          reticleRef.current.position,
          reticleRef.current.quaternion,
          reticleRef.current.scale
        )

        reticleRef.current.visible = true
      }

      onHit(matrixRef.current)
    },
    'viewer',
    'plane'
  )

  return (
    <mesh
      ref={reticleRef}
      visible={false}
    >
      <ringGeometry
        args={[0.08, 0.12, 32]}
      />

      <meshBasicMaterial />
    </mesh>
  )
}
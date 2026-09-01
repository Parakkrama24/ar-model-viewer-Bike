import { useXRHitTest } from '@react-three/xr'
import { useRef } from 'react'
import { Matrix4, Vector3, Quaternion } from 'three'

// Reusable scratch objects — avoids per-frame allocations
const _pos   = new Vector3()
const _quat  = new Quaternion()
const _scale = new Vector3()

export default function ARHitTest({
  onHit,
  placed,
}) {
  const reticleRef = useRef()
  const matrixRef  = useRef(new Matrix4())

  useXRHitTest(
    (results, getWorldMatrix) => {

      if (placed) {
        if (reticleRef.current) {
          reticleRef.current.visible = false
        }
        return
      }

      if (results.length === 0) {
        if (reticleRef.current) {
          reticleRef.current.visible = false
        }
        return
      }

      getWorldMatrix(matrixRef.current, results[0])

      if (reticleRef.current) {
        // ✅ Extract ONLY position from the hit matrix.
        //    We intentionally discard quaternion so the static
        //    rotation={[-Math.PI/2,0,0]} on the mesh is preserved,
        //    keeping the ring flat on the floor.
        matrixRef.current.decompose(_pos, _quat, _scale)
        reticleRef.current.position.copy(_pos)
        reticleRef.current.visible = true
      }

      onHit(matrixRef.current)
    },
    { space: 'viewer', entityTypes: ['plane'] }
  )

  return (
    <mesh
      ref={reticleRef}
      visible={false}
      rotation={[-Math.PI / 2, 0, 0]}
    >
      <ringGeometry args={[0.08, 0.12, 32]} />

      {/*
        ✅ color="white" so it shows against any surface.
        ✅ side={2} = DoubleSide so it's visible from any angle.
      */}
      <meshBasicMaterial color="white" side={2} />
    </mesh>
  )
}
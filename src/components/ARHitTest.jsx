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

  // ✅ Correct API (confirmed from installed .d.ts):
  //    useXRHitTest(callback, relativeTo, trackableType)
  //    arg 2 = 'viewer'  → originates from camera/viewer
  //    arg 3 = ['plane'] → only detect floors, tables, etc.
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
        // Only copy position from hit matrix.
        // Quaternion is intentionally discarded so the static
        // rotation={[-Math.PI/2, 0, 0]} on the mesh is preserved,
        // keeping the ring flat on the floor at all times.
        matrixRef.current.decompose(_pos, _quat, _scale)
        reticleRef.current.position.copy(_pos)
        reticleRef.current.visible = true
      }

      onHit(matrixRef.current)
    },
    'viewer',    // relativeTo  (2nd positional arg)
    ['plane']    // trackableType (3rd positional arg)
  )

  return (
    <mesh
      ref={reticleRef}
      visible={false}
      rotation={[-Math.PI / 2, 0, 0]}
    >
      <ringGeometry args={[0.08, 0.12, 32]} />

      {/* white + DoubleSide → visible against any surface from any angle */}
      <meshBasicMaterial color="white" side={2} />
    </mesh>
  )
}
import { useXRHitTest } from '@react-three/xr'
import { useRef } from 'react'
import { Matrix4, Vector3 } from 'three'

export default function ARHitTest() {
  const reticleRef = useRef()

  const matrix = useRef(new Matrix4())
  const position = useRef(new Vector3())

  useXRHitTest(
    (results, getWorldMatrix) => {
      if (results.length === 0) {
        reticleRef.current.visible = false
        return
      }

      getWorldMatrix(matrix.current, results[0])

      position.current.setFromMatrixPosition(matrix.current)

      reticleRef.current.position.copy(position.current)

      reticleRef.current.visible = true
    },
    'viewer',
    'plane'
  )

  return (
    <mesh
      ref={reticleRef}
      rotation={[-Math.PI / 2, 0, 0]}
      visible={false}
    >
      <ringGeometry args={[0.08, 0.12, 32]} />
      <meshBasicMaterial color="white" />
    </mesh>
  )
}
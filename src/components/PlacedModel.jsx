import { useEffect, useRef } from 'react'

export default function PlacedModel({ matrix }) {
  const ref = useRef()

  useEffect(() => {
    if (!matrix || !ref.current) {
      return
    }

    matrix.decompose(
      ref.current.position,
      ref.current.quaternion,
      ref.current.scale
    )
  }, [matrix])

  if (!matrix) {
    return null
  }

  return (
    <mesh ref={ref}>
      <boxGeometry args={[0.2, 0.2, 0.2]} />
      <meshStandardMaterial />
    </mesh>
  )
}
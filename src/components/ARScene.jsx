import { useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import {
  XR,
  createXRStore,
  useXRInputSourceEvent,
} from '@react-three/xr'

import SceneLighting from './SceneLighting'
import ARHitTest from './ARHitTest'
import PlacedModel from './PlacedModel'

const xrStore = createXRStore({
  offerSession: 'immersive-ar',
})

function ARPlacement({
  hitMatrixRef,
  onPlace,
}) {
  useXRInputSourceEvent(
    'all',
    'select',
    () => {
      if (!hitMatrixRef.current) {
        return
      }

      onPlace(
        hitMatrixRef.current.clone()
      )
    },
    [onPlace]
  )

  return null
}

export default function ARScene() {
  const hitMatrixRef = useRef(null)

  const [placedMatrix, setPlacedMatrix] =
    useState(null)

  const handleHit = (matrix) => {
    hitMatrixRef.current = matrix
  }

  const handlePlace = (matrix) => {
    setPlacedMatrix(matrix)
  }

  return (
    <Canvas>

      <XR store={xrStore}>

        <SceneLighting />

        <ARHitTest
          onHit={handleHit}
        />

        <ARPlacement
          hitMatrixRef={hitMatrixRef}
          onPlace={handlePlace}
        />

        <PlacedModel
          matrix={placedMatrix}
        />

      </XR>

    </Canvas>
  )
}

export { xrStore }
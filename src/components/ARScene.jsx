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
import ARInfoCard from './ARInfoCard'

const xrStore = createXRStore()

function ARPlacement({
  hitMatrixRef,
  placed,
  onPlace,
}) {
  useXRInputSourceEvent(
    'all',
    'select',
    () => {
      if (placed) {
        return
      }

      if (!hitMatrixRef.current) {
        return
      }

      onPlace(
        hitMatrixRef.current.clone()
      )
    },
    [placed, onPlace]
  )

  return null
}

export default function ARScene() {

  const [showInfo, setShowInfo]       = useState(false)
  const hitMatrixRef                  = useRef(null)
  const [placedMatrix, setPlacedMatrix] = useState(null)

  const handleHit = (matrix) => {
    hitMatrixRef.current = matrix
  }

  const handlePlace = (matrix) => {
    setPlacedMatrix(matrix)
  }

  return (
    <div className="relative h-full w-full">

      <Canvas xr={xrStore}>
        <XR store={xrStore}>

          {/* AR lighting */}
          <SceneLighting />

          {/* Hit testing — shows reticle until placed */}
          <ARHitTest
            onHit={handleHit}
            placed={placedMatrix !== null}
          />

          {/* First tap → placement */}
          <ARPlacement
            hitMatrixRef={hitMatrixRef}
            placed={placedMatrix !== null}
            onPlace={handlePlace}
          />

          {/* Bike model — tap it to toggle the info card */}
          <PlacedModel
            matrix={placedMatrix}
            onModelClick={() => setShowInfo((open) => !open)}
          />

          {/*
            Floating info card — built from real scene geometry
            (a canvas texture on a plane), anchored above the bike.
            It must NOT use drei's <Html>: DOM nodes are never
            composited into an immersive-ar session, so that version
            only ever appeared on the non-AR home screen.
          */}
          <ARInfoCard
            placedMatrix={placedMatrix}
            visible={showInfo}
            onClose={() => setShowInfo(false)}
          />

        </XR>
      </Canvas>

    </div>
  )
}

export { xrStore }

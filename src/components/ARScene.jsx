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
import ARUIButton from './ARUIButton'
import { BIKE_MODELS, DEFAULT_MODEL_INDEX } from '../config/models'

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
  const [currentModelIndex, setCurrentModelIndex] = useState(DEFAULT_MODEL_INDEX)

  const handleHit = (matrix) => {
    hitMatrixRef.current = matrix
  }

  const handlePlace = (matrix) => {
    setPlacedMatrix(matrix)
  }

  const handleNextModel = () => {
    setCurrentModelIndex((prev) => (prev + 1) % BIKE_MODELS.length)
  }

  const handlePrevModel = () => {
    setCurrentModelIndex((prev) => (prev - 1 + BIKE_MODELS.length) % BIKE_MODELS.length)
  }

  const handleExitAR = () => {
    xrStore.exitAR()
  }

  const currentModel = BIKE_MODELS[currentModelIndex]

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
            modelPath={currentModel.path}
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
            modelData={currentModel}
          />

          {/* 3D UI Buttons - visible in AR immersive mode */}

          {/* Back button - top left of view */}
          <ARUIButton
            type="back"
            position={[-0.8, 0.9, -2]}
            onClick={handleExitAR}
            scale={0.18}
          />

          {/* Model navigation buttons - visible after placement */}
          {placedMatrix && (
            <>
              {/* Left arrow */}
              <ARUIButton
                type="left"
                position={[-0.9, 0, -2]}
                onClick={handlePrevModel}
                scale={0.15}
              />

              {/* Right arrow */}
              <ARUIButton
                type="right"
                position={[0.9, 0, -2]}
                onClick={handleNextModel}
                scale={0.15}
              />
            </>
          )}

        </XR>
      </Canvas>

    </div>
  )
}

export { xrStore }

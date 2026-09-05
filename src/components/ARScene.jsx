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

        </XR>
      </Canvas>

      {/* AR Controls - Back button (always visible) */}
      <div className="absolute top-4 left-4 z-50">
        <button
          onClick={handleExitAR}
          className="bg-black/60 backdrop-blur-sm text-white px-4 py-3 rounded-full flex items-center gap-2 hover:bg-black/80 transition-all shadow-lg"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span className="text-sm font-medium">Exit AR</span>
        </button>
      </div>

      {/* Model slider controls - visible after placement */}
      {placedMatrix && (
        <>
          {/* Bottom indicator */}
          <div className="absolute bottom-8 left-0 right-0 flex justify-center items-center gap-3 pointer-events-none z-40">
            <div className="bg-black/60 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-3 shadow-lg">
              <span className="text-white text-sm font-medium">{currentModel.name}</span>
              <div className="flex gap-2">
                {BIKE_MODELS.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentModelIndex ? 'bg-white w-6' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Left/Right navigation buttons */}
          <div className="absolute top-1/2 left-4 -translate-y-1/2 z-50">
            <button
              onClick={handlePrevModel}
              className="bg-black/60 backdrop-blur-sm text-white p-4 rounded-full hover:bg-black/80 transition-all shadow-lg"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          </div>

          <div className="absolute top-1/2 right-4 -translate-y-1/2 z-50">
            <button
              onClick={handleNextModel}
              className="bg-black/60 backdrop-blur-sm text-white p-4 rounded-full hover:bg-black/80 transition-all shadow-lg"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </>
      )}

    </div>
  )
}

export { xrStore }

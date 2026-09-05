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

  // Touch tracking for swipe detection
  const touchStartRef = useRef(null)
  const touchEndRef = useRef(null)

  const handleHit = (matrix) => {
    hitMatrixRef.current = matrix
  }

  const handlePlace = (matrix) => {
    setPlacedMatrix(matrix)
  }

  // Swipe detection handlers
  const handleTouchStart = (e) => {
    if (!placedMatrix) return // Only allow swipe after model is placed
    touchStartRef.current = e.touches[0].clientX
  }

  const handleTouchMove = (e) => {
    if (!placedMatrix) return
    touchEndRef.current = e.touches[0].clientX
  }

  const handleTouchEnd = () => {
    if (!placedMatrix || !touchStartRef.current || !touchEndRef.current) return

    const distance = touchStartRef.current - touchEndRef.current
    const threshold = 50 // Minimum swipe distance in pixels

    if (Math.abs(distance) > threshold) {
      if (distance > 0) {
        // Swipe left - next model
        setCurrentModelIndex((prev) => (prev + 1) % BIKE_MODELS.length)
      } else {
        // Swipe right - previous model
        setCurrentModelIndex((prev) => (prev - 1 + BIKE_MODELS.length) % BIKE_MODELS.length)
      }
    }

    // Reset
    touchStartRef.current = null
    touchEndRef.current = null
  }

  const currentModel = BIKE_MODELS[currentModelIndex]

  return (
    <div
      className="relative h-full w-full"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >

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

      {/* Model slider indicator */}
      {placedMatrix && (
        <div className="absolute bottom-8 left-0 right-0 flex justify-center items-center gap-3 pointer-events-none">
          <div className="bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-3">
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
      )}

    </div>
  )
}

export { xrStore }

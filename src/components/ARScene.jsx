import { useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import {
  XR,
  createXRStore,
  useXRInputSourceEvent,
} from '@react-three/xr'

import SceneLighting from './SceneLighting'
import ARHitTest from './ARHitTest'
import InteractiveBikeModel from './InteractiveBikeModel'
import ARInfoCard from './ARInfoCard'
import ARPartDetailsCard from './ARPartDetailsCard'
import ARUIButton from './ARUIButton'
import ARNavigationButtons from './ARNavigationButtons'
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
  const [selectedPart, setSelectedPart] = useState(null)

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

  const handleCloseApp = () => {
    // Exit AR mode first
    xrStore.exitAR()

    // Close the application/browser tab
    // Try multiple methods for cross-browser compatibility
    try {
      // Method 1: Try to close window (works if opened by script)
      window.close()

      // Method 2: If that doesn't work, try navigating away
      setTimeout(() => {
        // Navigate to about:blank as fallback
        window.location.href = 'about:blank'
      }, 100)
    } catch (e) {
      console.log('Unable to close window programmatically')
      // Last resort: just exit AR and let user close manually
    }
  }

  const handlePartClick = (partInfo) => {
    console.log('Part clicked in ARScene:', partInfo)
    setSelectedPart(partInfo)
    // Close the main info card if it's open
    setShowInfo(false)
  }

  const handleShowOverallDetails = () => {
    // Show the overall bike details card
    setShowInfo(true)
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

          {/* Interactive Bike model — tap parts for details, tap elsewhere for info card */}
          <InteractiveBikeModel
            matrix={placedMatrix}
            modelPath={currentModel.path}
            onModelClick={() => setShowInfo((open) => !open)}
            onPartClick={handlePartClick}
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

          {/* Close button - fixed in camera space, top right */}
          <ARUIButton
            type="close"
            position={[0.85, 0.95, -2]}
            onClick={handleCloseApp}
            scale={0.22}
          />

          {/* Model navigation buttons - anchored to model in world space */}
          <ARNavigationButtons
            placedMatrix={placedMatrix}
            onPrevious={handlePrevModel}
            onNext={handleNextModel}
          />

          {/* 3D Part Details Card - shows when a specific part is clicked */}
          <ARPartDetailsCard
            partInfo={selectedPart}
            placedMatrix={placedMatrix}
            onClose={() => setSelectedPart(null)}
            onShowOverallDetails={handleShowOverallDetails}
          />

        </XR>
      </Canvas>

    </div>
  )
}

export { xrStore }

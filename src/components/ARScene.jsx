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


  const [showInfo, setShowInfo] = useState(false)
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
    <div className="relative h-full w-full">

      <Canvas>
        <XR store={xrStore}>

          {/* AR lighting */}
          <SceneLighting />

          {/* Hit testing */}
          <ARHitTest
            onHit={handleHit}
            placed={placedMatrix !== null}
          />

          {/* First tap = placement */}
          <ARPlacement
            hitMatrixRef={hitMatrixRef}
            placed={placedMatrix !== null}
            onPlace={handlePlace}
          />

          {/* Second tap = model information */}
          <PlacedModel
            matrix={placedMatrix}
            onModelClick={() => setShowInfo(true)}
          />

        </XR>
      </Canvas>


      {/* 👇 PUT THE POPUP HERE */}
      {showInfo && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 p-5">

          <div className="w-full max-w-sm overflow-hidden rounded-2xl bg-white text-gray-900 shadow-2xl">

            <img
              src="/models/model_101/image.png"
              alt="Bike"
              className="h-52 w-full object-cover"
            />

            <div className="p-5">

              <h2 className="text-2xl font-bold">
                Bike Model 01
              </h2>

              <p className="mt-2 text-sm text-gray-600">
                Premium motorcycle model
              </p>

              <div className="mt-4 space-y-2 text-sm">

                <div className="flex justify-between">
                  <span>Length</span>
                  <span>2.29 m</span>
                </div>

                <div className="flex justify-between">
                  <span>Height</span>
                  <span>1.29 m</span>
                </div>

                <div className="flex justify-between">
                  <span>Width</span>
                  <span>0.87 m</span>
                </div>

              </div>

              <button
                onClick={() => setShowInfo(false)}
                className="mt-5 w-full rounded-xl bg-gray-900 py-3 font-semibold text-white"
              >
                Continue AR
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  )
}

export { xrStore }
import { useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import {
  XR,
  createXRStore,
  useXRInputSourceEvent,
} from '@react-three/xr'
import { Matrix4 } from 'three'

import ARHitTest from './components/ARHitTest'
import PlacedModel from './components/PlacedModel'

const xrStore = createXRStore({
  offerSession: 'immersive-ar',
})

function ARPlacement({ hitMatrixRef, onPlace }) {
  useXRInputSourceEvent(
    'all',
    'select',
    () => {
      if (!hitMatrixRef.current) {
        return
      }

      // Freeze the current hit-test transform.
      const placementMatrix = hitMatrixRef.current.clone()

      onPlace(placementMatrix)
    },
    [onPlace]
  )

  return null
}

function App() {
  // Current surface detected by AR.
  // This changes every frame WITHOUT causing React renders.
  const hitMatrixRef = useRef(null)

  // This changes only when the user places the model.
  const [placedMatrix, setPlacedMatrix] = useState(null)

  const handleHit = (matrix) => {
    hitMatrixRef.current = matrix
  }

  const handlePlace = (matrix) => {
    setPlacedMatrix(matrix)
  }

  return (
    <main className="relative h-screen w-screen bg-gray-950">

      <Canvas>

        <XR store={xrStore}>

          <ambientLight intensity={1} />

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

      <div className="absolute bottom-12 left-1/2 -translate-x-1/2">

        <button
          onClick={() => xrStore.enterAR()}
          className="rounded-xl bg-blue-600 px-6 py-3 font-medium text-white shadow-lg transition hover:bg-blue-500"
        >
          View in AR
        </button>

      </div>

    </main>
  )
}

export default App
import { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import {
  XR,
  createXRStore,
  useXRInputSourceEvent,
} from '@react-three/xr'

import ARHitTest from './components/ARHitTest'
import PlacedModel from './components/PlacedModel'

const xrStore = createXRStore({
  offerSession: 'immersive-ar',
})

function ARPlacement({ hitMatrix, onPlace }) {
  useXRInputSourceEvent(
    'all',
    'select',
    () => {
      if (!hitMatrix) {
        return
      }

      onPlace(hitMatrix.clone())
    },
    [hitMatrix, onPlace]
  )

  return null
}

function App() {
  const [hitMatrix, setHitMatrix] = useState(null)
  const [placedMatrix, setPlacedMatrix] = useState(null)

  const handleHit = (matrix) => {
    setHitMatrix(matrix.clone())
  }

  const handlePlace = (matrix) => {
    if (!matrix) {
      return
    }

    setPlacedMatrix(matrix.clone())
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
            hitMatrix={hitMatrix}
            onPlace={handlePlace}
          />

          <PlacedModel
            matrix={placedMatrix}
          />

        </XR>

      </Canvas>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2">

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
import { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import {
  XR,
  createXRStore,
} from '@react-three/xr'

import ARHitTest from './components/ARHitTest'
import PlacedModel from './components/PlacedModel'
import { useXRInputSourceEvent } from '@react-three/xr'

const xrStore = createXRStore({
  offerSession: 'immersive-ar',
})

function ARPlacement({ hitMatrix, onPlace }) {
  useXRInputSourceEvent(
    'select',
    () => {
      if (!hitMatrix) {
        return
      }

      onPlace(hitMatrix.clone())
    }
  )

  return null
}

function App() {
  const [hitMatrix, setHitMatrix] = useState(null)
  const [placedMatrix, setPlacedMatrix] = useState(null)

  const handleHit = (matrix) => {
    setHitMatrix(matrix.clone())
  }

  const handlePlace = () => {
    if (!hitMatrix) {
      return
    }

    setPlacedMatrix(hitMatrix.clone())
  }

  return (
    <main className="relative h-screen w-screen bg-gray-950">

      <Canvas>

        <XR store={xrStore}>

          <ambientLight intensity={1} />

          <ARHitTest onHit={handleHit} />

          <ARPlacement
            hitMatrix={hitMatrix}
            onPlace={handlePlace}
          />


          <PlacedModel matrix={placedMatrix} />

        </XR>

      </Canvas>

      <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-3">

        <button
          onClick={() => xrStore.enterAR()}
          className="rounded-xl bg-blue-600 px-6 py-3 font-medium text-white shadow-lg"
        >
          View in AR
        </button>

        <button
          onClick={handlePlace}
          disabled={!hitMatrix}
          className="rounded-xl bg-white px-6 py-3 font-medium text-black shadow-lg disabled:opacity-40"
        >
          Place
        </button>

      </div>

    </main>
  )
}

export default App
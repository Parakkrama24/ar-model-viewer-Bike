import { useState } from 'react'

import ModelViewer from './components/ModelViewer'
import ARScene, {
  xrStore,
} from './components/ARScene'

function App() {
  const [isAR, setIsAR] = useState(false)

  const handleEnterAR = async () => {
    setIsAR(true)

    await xrStore.enterAR()
  }

  return (
    <main className="relative h-screen w-screen bg-gray-950 text-white">

      {!isAR && (
        <>
          <header className="absolute left-0 right-0 top-0 z-10 flex h-16 items-center justify-between border-b border-white/10 bg-black/30 px-6 backdrop-blur-md">

            <h1 className="text-lg font-semibold">
              AR Model Viewer
            </h1>

          </header>

          <section className="h-full w-full">
            <ModelViewer />
          </section>

          <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2">

            <button
              onClick={handleEnterAR}
              className="rounded-xl bg-blue-600 px-8 py-3 font-semibold text-white shadow-xl transition hover:bg-blue-500"
            >
              View in AR
            </button>

          </div>
        </>
      )}

      {isAR && (
        <div className="fixed inset-0">
          <ARScene />
        </div>
      )}

    </main>
  )
}

export default App
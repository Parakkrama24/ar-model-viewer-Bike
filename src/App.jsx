import { useState } from 'react'

import ModelViewer from './components/ModelViewer'
import ARScene, { xrStore } from './components/ARScene'

function App() {
  const [isAR, setIsAR] = useState(false)
  const [arError, setArError] = useState(null)
  const [arLoading, setArLoading] = useState(false)

  const handleEnterAR = async () => {
    setArError(null)
    setArLoading(true)

    // 1. Check WebXR AR support first
    const supported = await navigator.xr
      ?.isSessionSupported('immersive-ar')
      .catch(() => false)

    if (!supported) {
      setArError(
        'AR is not supported on this device or browser. ' +
        'Please use Chrome on Android or Safari on iOS over HTTPS.'
      )
      setArLoading(false)
      return
    }

    try {
      // 2. enterAR() works because <ARScene> is already mounted below
      await xrStore.enterAR()
      setIsAR(true)
    } catch (e) {
      console.error('AR failed to start:', e)
      setArError('Failed to start AR: ' + (e?.message ?? 'Unknown error'))
    } finally {
      setArLoading(false)
    }
  }

  return (
    <main className="relative h-screen w-screen bg-gray-950 text-white">

      {/*
        ARScene is ALWAYS mounted so the Canvas + XR store are
        initialised before enterAR() is called.
        We hide it visually when the normal viewer is showing.
      */}
      <div className={`fixed inset-0 ${isAR ? 'z-0' : 'invisible pointer-events-none'}`}>
        <ARScene />
      </div>

      {/* Normal 3-D viewer overlay — hidden once AR starts */}
      {!isAR && (
        <>
          <header className="absolute left-0 right-0 top-0 z-10 flex h-14 sm:h-16 items-center justify-between border-b border-white/10 bg-black/30 px-4 sm:px-6 backdrop-blur-md">
            <h1 className="text-base sm:text-lg font-semibold">AR Model Viewer</h1>
          </header>

          <section className="h-full w-full">
            <ModelViewer />
          </section>

          <div className="absolute bottom-6 sm:bottom-8 left-0 right-0 z-10 flex flex-col items-center gap-3 px-4">

            <button
              onClick={handleEnterAR}
              disabled={arLoading}
              className="w-full max-w-xs rounded-xl bg-blue-600 px-6 sm:px-8 py-3 sm:py-4 font-semibold text-white shadow-xl transition hover:bg-blue-500 disabled:opacity-60 disabled:cursor-not-allowed text-sm sm:text-base"
            >
              {arLoading ? 'Starting AR…' : 'View in AR'}
            </button>

            {arError && (
              <p className="max-w-xs rounded-lg bg-red-600/80 px-4 py-2 text-center text-xs sm:text-sm text-white backdrop-blur">
                {arError}
              </p>
            )}

          </div>
        </>
      )}

    </main>
  )
}

export default App
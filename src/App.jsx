import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei'
import { Ground } from "./components/THREE/Ground.jsx"
import { Model } from './components/THREE/Model.jsx';
import {
  Environment,
} from '@react-three/drei'
import { XR, createXRStore } from '@react-three/xr'
import ARHitTest from './components/ARHitTest.jsx';

const xrStore = createXRStore({
  offerSession:'immersive-ar'
})

function App() {
  return (
    <main className="h-screen w-screen bg-gray-950 text-white">
      <header className=' flex h-16 items-center justify-between border-b border-gray-800 px-6'>
        <h1 className='text-lg font-semibold'>
          AR Model Viewer
        </h1>
        <button className='rounded-lg bg-gray-400 px-4 py-2 text-sm hover:bg-gray-700'>
          Upload Model
        </button>
      </header>

      {/* 3D Viewer */}
      <section className="relative h-[calc(100vh-4rem)]">

        <Canvas camera={{ position: [0, 0, 5] }}>

          <XR store={xrStore}>

            {/* <ambientLight intensity={2} />
            <Model />
            <Environment preset="studio" />
            <OrbitControls
              enablePan={false}
              minDistance={2}
              maxDistance={10}
            />
            <Ground /> */}
                <ARHitTest />
            
          </XR>
        </Canvas>

        {/* Bottom controls */}
        <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2 rounded-2xl border border-white/10 bg-black/60 p-2 shadow-xl backdrop-blur-md">

          <button
            className="rounded-xl px-4 py-2 text-sm transition hover:bg-white/10"
          >
            Reset
          </button>

          <button
            onClick={() => xrStore.enterAR()}
            className="rounded-xl bg-blue-600 px-5 py-3 font-medium text-white shadow-lg transition hover:bg-blue-500"
          >
            View in AR
          </button>

        </div>

      </section>
    </main>
  );
}

export default App;
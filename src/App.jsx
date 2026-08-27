import { Canvas } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei'

function Model() {
  const { scene } = useGLTF('/models/bike.glb')

  return <primitive object={scene} />
}


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
          <ambientLight intensity={20} />
          <Model/>
        </Canvas>

        {/* Bottom controls */}
        <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-3">

          <button className="rounded-xl bg-gray-800 px-5 py-3 text-sm font-medium shadow-lg hover:bg-gray-700">
            Reset
          </button>

          <button className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-medium shadow-lg hover:bg-blue-500">
            View in AR
          </button>

        </div>

      </section>
   </main>
  );
}

export default App;
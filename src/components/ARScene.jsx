import { XR, createXRStore } from '@react-three/xr'

const xrStore = createXRStore()

export default function ARScene() {
  return (
    <XR store={xrStore}>
      
    </XR>
  )
}
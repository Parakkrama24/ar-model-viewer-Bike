import { useEffect } from 'react'
import { useGLTF } from '@react-three/drei'

/*
 * Utility component to inspect GLTF model structure
 * This logs all mesh names and hierarchy to console
 */

const MODEL_PATH = '/models/model_101/BikeModel_01_steady.gltf'

function traverseModel(object, depth = 0) {
  const indent = '  '.repeat(depth)
  console.log(`${indent}${object.type}: "${object.name}"`, object)

  if (object.children) {
    object.children.forEach(child => traverseModel(child, depth + 1))
  }
}

export default function ModelInspector() {
  const { scene } = useGLTF(MODEL_PATH)

  useEffect(() => {
    console.log('=== GLTF Model Structure ===')
    traverseModel(scene)
    console.log('=== End Model Structure ===')
  }, [scene])

  return null
}

useGLTF.preload(MODEL_PATH)

import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/*
 * 3D UI Button that renders inside the XR canvas
 * Uses canvas texture to draw button graphics that are visible in AR
 */

const BUTTON_W = 200
const BUTTON_H = 200

function drawButton(ctx, type, isHovered) {
  const W = BUTTON_W
  const H = BUTTON_H
  const PAD = 30

  ctx.clearRect(0, 0, W, H)

  // Button background
  const bgAlpha = isHovered ? 0.8 : 0.6
  ctx.fillStyle = `rgba(0, 0, 0, ${bgAlpha})`
  ctx.beginPath()
  ctx.arc(W / 2, H / 2, W / 2 - 10, 0, Math.PI * 2)
  ctx.fill()

  // Border glow
  ctx.strokeStyle = isHovered ? 'rgba(59, 130, 246, 0.9)' : 'rgba(59, 130, 246, 0.5)'
  ctx.lineWidth = 4
  ctx.stroke()

  ctx.fillStyle = '#ffffff'
  ctx.strokeStyle = '#ffffff'
  ctx.lineWidth = 3
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'

  // Draw icon based on type
  if (type === 'close') {
    // X icon (close)
    const size = 35
    ctx.lineWidth = 4
    ctx.beginPath()
    ctx.moveTo(W / 2 - size, H / 2 - size)
    ctx.lineTo(W / 2 + size, H / 2 + size)
    ctx.stroke()

    ctx.beginPath()
    ctx.moveTo(W / 2 + size, H / 2 - size)
    ctx.lineTo(W / 2 - size, H / 2 + size)
    ctx.stroke()
  } else if (type === 'left') {
    // Left chevron - larger and thicker
    ctx.lineWidth = 5
    ctx.beginPath()
    ctx.moveTo(W / 2 + 20, H / 2 - 40)
    ctx.lineTo(W / 2 - 25, H / 2)
    ctx.lineTo(W / 2 + 20, H / 2 + 40)
    ctx.stroke()
  } else if (type === 'right') {
    // Right chevron - larger and thicker
    ctx.lineWidth = 5
    ctx.beginPath()
    ctx.moveTo(W / 2 - 20, H / 2 - 40)
    ctx.lineTo(W / 2 + 25, H / 2)
    ctx.lineTo(W / 2 - 20, H / 2 + 40)
    ctx.stroke()
  }
}

export default function ARUIButton({
  type = 'close',
  position = [0, 0, -1],
  onClick,
  scale = 0.2
}) {
  const meshRef = useRef()
  const canvasRef = useRef()
  const textureRef = useRef()
  const isHoveredRef = useRef(false)

  // Create canvas texture
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = BUTTON_W
    canvas.height = BUTTON_H
    canvasRef.current = canvas

    const ctx = canvas.getContext('2d')
    drawButton(ctx, type, false)

    const tex = new THREE.CanvasTexture(canvas)
    tex.colorSpace = THREE.SRGBColorSpace
    textureRef.current = tex
    return tex
  }, [type])

  // Billboard effect - always face camera
  useFrame((state) => {
    if (!meshRef.current) return

    const cam = state.camera.position
    const mesh = meshRef.current

    // Calculate angle to camera
    mesh.lookAt(cam)
  })

  const handlePointerOver = () => {
    isHoveredRef.current = true
    if (canvasRef.current && textureRef.current) {
      const ctx = canvasRef.current.getContext('2d')
      drawButton(ctx, type, true)
      textureRef.current.needsUpdate = true
    }
  }

  const handlePointerOut = () => {
    isHoveredRef.current = false
    if (canvasRef.current && textureRef.current) {
      const ctx = canvasRef.current.getContext('2d')
      drawButton(ctx, type, false)
      textureRef.current.needsUpdate = true
    }
  }

  const handleClick = (event) => {
    event.stopPropagation()
    onClick?.()
  }

  return (
    <mesh
      ref={meshRef}
      position={position}
      scale={[scale, scale, scale]}
      onClick={handleClick}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      renderOrder={1000}
    >
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial
        map={texture}
        transparent
        toneMapped={false}
        depthTest={false}
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/*
 * 3D Part Details Card for AR view
 * Shows specific part information (tire, engine, etc.) as a 3D canvas texture
 */

const CARD_W = 600
const CARD_H = 750
const WORLD_W = 0.5
const WORLD_H = WORLD_W * (CARD_H / CARD_W)

const FONT = "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath()
  if (ctx.roundRect) {
    ctx.roundRect(x, y, w, h, r)
    return
  }
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}

function getPartDetails(partInfo) {
  if (!partInfo) return null

  switch (partInfo.type) {
    case 'tire':
      return {
        title: 'Tire Specifications',
        icon: '🛞',
        details: [
          { label: 'Type', value: 'Sport Radial' },
          { label: 'Size', value: '120/70 ZR17' },
          { label: 'Pressure', value: '36 PSI' },
          { label: 'Brand', value: 'Michelin Pilot' },
        ]
      }
    case 'engine':
      return {
        title: 'Engine Details',
        icon: '⚙️',
        details: [
          { label: 'Type', value: 'V-Twin' },
          { label: 'Displacement', value: '1000cc' },
          { label: 'Power', value: '145 HP' },
          { label: 'Torque', value: '110 Nm' },
        ]
      }
    case 'frame':
      return {
        title: 'Frame Information',
        icon: '🔧',
        details: [
          { label: 'Material', value: 'Aluminum Alloy' },
          { label: 'Type', value: 'Twin-Spar' },
          { label: 'Weight', value: '12.5 kg' },
          { label: 'Color', value: 'Matte Black' },
        ]
      }
    case 'seat':
      return {
        title: 'Seat Details',
        icon: '🪑',
        details: [
          { label: 'Type', value: 'Sport' },
          { label: 'Material', value: 'Premium Leather' },
          { label: 'Height', value: '820 mm' },
          { label: 'Comfort', value: 'Dual-density' },
        ]
      }
    default:
      return {
        title: partInfo.name || 'Part Details',
        icon: 'ℹ️',
        details: [
          { label: 'Part Name', value: partInfo.name },
          { label: 'Type', value: partInfo.type },
        ]
      }
  }
}

function paintPartCard(ctx, partInfo) {
  const partDetails = getPartDetails(partInfo)
  if (!partDetails) return

  const W = CARD_W
  const H = CARD_H
  const PAD = 30
  const RADIUS = 36

  ctx.clearRect(0, 0, W, H)

  // Card body
  ctx.save()
  roundRect(ctx, 0, 0, W, H, RADIUS)
  ctx.clip()

  // Background gradient
  const bgGrad = ctx.createLinearGradient(0, 0, 0, H)
  bgGrad.addColorStop(0, 'rgba(15, 23, 42, 0.96)')
  bgGrad.addColorStop(1, 'rgba(8, 10, 24, 0.96)')
  ctx.fillStyle = bgGrad
  ctx.fillRect(0, 0, W, H)

  // Header section
  const headerH = 110
  const headerGrad = ctx.createLinearGradient(0, 0, 0, headerH)
  headerGrad.addColorStop(0, 'rgba(59, 130, 246, 0.25)')
  headerGrad.addColorStop(1, 'rgba(59, 130, 246, 0.05)')
  ctx.fillStyle = headerGrad
  ctx.fillRect(0, 0, W, headerH)

  // Icon
  ctx.font = `64px ${FONT}`
  ctx.textAlign = 'left'
  ctx.textBaseline = 'middle'
  ctx.fillText(partDetails.icon, PAD, headerH / 2)

  // Title
  ctx.fillStyle = '#ffffff'
  ctx.font = `700 32px ${FONT}`
  ctx.fillText(partDetails.title, PAD + 90, headerH / 2)

  // Details section
  let y = headerH + 45
  const ROW_H = 65

  partDetails.details.forEach(({ label, value }, i) => {
    const mid = y + ROW_H * i + ROW_H / 2

    // Label
    ctx.textAlign = 'left'
    ctx.fillStyle = 'rgba(255, 255, 255, 0.65)'
    ctx.font = `500 26px ${FONT}`
    ctx.fillText(label, PAD, mid)

    // Value
    ctx.textAlign = 'right'
    ctx.fillStyle = '#93c5fd'
    ctx.font = `700 28px ${FONT}`
    ctx.fillText(value, W - PAD, mid)

    // Divider line
    if (i < partDetails.details.length - 1) {
      const lineY = y + ROW_H * (i + 1) - 5
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(PAD, lineY)
      ctx.lineTo(W - PAD, lineY)
      ctx.stroke()
    }
  })

  y += ROW_H * partDetails.details.length + 35

  // Overall Details button with info icon
  const btnH = 75
  const btnGrad = ctx.createLinearGradient(PAD, y, W - PAD, y + btnH)
  btnGrad.addColorStop(0, '#10b981')
  btnGrad.addColorStop(1, '#059669')
  ctx.fillStyle = btnGrad
  roundRect(ctx, PAD, y, W - PAD * 2, btnH, 26)
  ctx.fill()

  ctx.fillStyle = '#ffffff'
  ctx.font = `700 26px ${FONT}`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('ℹ️  Overall Details', W / 2, y + btnH / 2)

  ctx.restore()

  // Border glow
  ctx.strokeStyle = 'rgba(59, 130, 246, 0.4)'
  ctx.lineWidth = 3
  roundRect(ctx, 1.5, 1.5, W - 3, H - 3, RADIUS)
  ctx.stroke()
}

export default function ARPartDetailsCard({ partInfo, placedMatrix, onClose, onShowOverallDetails }) {
  const groupRef = useRef()
  const targetPositionRef = useRef(new THREE.Vector3())

  // Canvas-backed texture
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = CARD_W
    canvas.height = CARD_H

    paintPartCard(canvas.getContext('2d'), partInfo)

    const tex = new THREE.CanvasTexture(canvas)
    tex.colorSpace = THREE.SRGBColorSpace
    tex.anisotropy = 8
    return tex
  }, [partInfo])

  useEffect(() => {
    return () => texture.dispose()
  }, [texture])

  // Position card near the clicked part
  const { position, connectionHeight } = useMemo(() => {
    if (!placedMatrix || !partInfo?.mesh) {
      return { position: [0, 0, 0], connectionHeight: 0 }
    }

    // Get the world position of the clicked mesh
    const meshWorldPos = new THREE.Vector3()
    partInfo.mesh.getWorldPosition(meshWorldPos)

    // Offset the card position relative to the part
    // Position it to the side and above the part
    const offset = new THREE.Vector3(0.4, 0.5, 0.2)
    const cardPos = meshWorldPos.clone().add(offset)

    // Calculate connection line height (from card bottom to part)
    const height = cardPos.y - meshWorldPos.y - WORLD_H / 2

    return {
      position: [cardPos.x, cardPos.y, cardPos.z],
      connectionHeight: Math.max(0.1, height) // Minimum height
    }
  }, [placedMatrix, partInfo])

  // Update target position when part changes
  useEffect(() => {
    if (position) {
      targetPositionRef.current.set(position[0], position[1], position[2])
    }
  }, [position])

  // Billboard and smooth animation
  useFrame((state, delta) => {
    const group = groupRef.current
    if (!group) return

    // Smooth position transition
    const k = 1 - Math.pow(0.001, delta)
    group.position.lerp(targetPositionRef.current, k * 0.5)

    // Billboard - face camera
    const cam = state.camera.position
    group.rotation.y = Math.atan2(
      cam.x - group.position.x,
      cam.z - group.position.z
    )

    // Scale animation
    const target = partInfo ? 1 : 0.85
    group.scale.setScalar(
      THREE.MathUtils.lerp(group.scale.x, target, k)
    )
  })

  if (!partInfo || !placedMatrix) {
    return null
  }

  return (
    <group ref={groupRef} position={position} scale={0.85}>
      {/* Connection line from card to the clicked part */}
      <mesh position={[0, -WORLD_H / 2 - connectionHeight / 2, 0]}>
        <cylinderGeometry args={[0.004, 0.002, connectionHeight, 8]} />
        <meshBasicMaterial
          color="#3b82f6"
          transparent
          opacity={0.6}
          depthTest={false}
        />
      </mesh>

      {/* Arrow pointer at the end of the line */}
      <mesh position={[0, -WORLD_H / 2 - connectionHeight, 0]} rotation={[0, 0, 0]}>
        <coneGeometry args={[0.015, 0.03, 8]} />
        <meshBasicMaterial
          color="#3b82f6"
          transparent
          opacity={0.7}
          depthTest={false}
        />
      </mesh>

      {/* The card */}
      <mesh
        renderOrder={999}
        onClick={(event) => {
          event.stopPropagation()
          // Close part details and show overall details
          onClose?.()
          onShowOverallDetails?.()
        }}
      >
        <planeGeometry args={[WORLD_W, WORLD_H]} />
        <meshBasicMaterial
          map={texture}
          transparent
          toneMapped={false}
          depthTest={false}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  )
}

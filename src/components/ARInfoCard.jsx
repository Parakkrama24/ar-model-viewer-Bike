import { useEffect, useMemo, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/*
 * The info card is drawn into a 2-D canvas and mapped onto a plane,
 * so it is REAL scene geometry.
 *
 * drei's <Html> was used before — that renders DOM nodes on top of the
 * page, which the WebXR compositor never shows in an immersive-ar
 * session (it only appeared on the non-AR home screen).
 */

const CARD_W = 600          // texture px
const CARD_H = 900          // texture px
const WORLD_W = 0.44        // metres
const WORLD_H = WORLD_W * (CARD_H / CARD_W)

const CARD_IMAGE = '/models/model_101/Image.png'

const TITLE    = 'Bike Model 01'
const SUBTITLE = 'PREMIUM MOTORCYCLE'

const SPECS = [
  { label: 'Engine', value: '750 cc' },
  { label: 'Length', value: '2.29 m' },
  { label: 'Height', value: '1.29 m' },
  { label: 'Width',  value: '0.87 m' },
  { label: 'Weight', value: '178 kg' },
]

const FONT = "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"

/* ------------------------------------------------------------------ */

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

/*
 * Draw the whole card. `photo` may be null while the
 * hero image is still loading — everything else still renders.
 */
function paintCard(ctx, photo) {
  const W = CARD_W
  const H = CARD_H
  const PAD = 40
  const RADIUS = 44
  const IMG_H = 310

  ctx.clearRect(0, 0, W, H)

  /* Card body — rounded, clips everything after it. */
  ctx.save()
  roundRect(ctx, 0, 0, W, H, RADIUS)
  ctx.clip()

  ctx.fillStyle = 'rgba(8, 10, 24, 0.94)'
  ctx.fillRect(0, 0, W, H)

  /* Hero image, cover-fitted into the top strip. */
  if (photo) {
    const scale = Math.max(W / photo.width, IMG_H / photo.height)
    const dw = photo.width * scale
    const dh = photo.height * scale
    ctx.drawImage(photo, (W - dw) / 2, (IMG_H - dh) / 2, dw, dh)
  } else {
    ctx.fillStyle = '#101528'
    ctx.fillRect(0, 0, W, IMG_H)
  }

  /* Fade the photo into the body. */
  const fade = ctx.createLinearGradient(0, IMG_H * 0.45, 0, IMG_H)
  fade.addColorStop(0, 'rgba(8,10,24,0)')
  fade.addColorStop(1, 'rgba(8,10,24,0.92)')
  ctx.fillStyle = fade
  ctx.fillRect(0, 0, W, IMG_H)

  /* "AR" badge. */
  ctx.fillStyle = 'rgba(59,130,246,0.9)'
  roundRect(ctx, W - PAD - 78, 24, 78, 44, 22)
  ctx.fill()
  ctx.fillStyle = '#ffffff'
  ctx.font = `700 22px ${FONT}`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('AR', W - PAD - 39, 47)

  /* Title block. */
  ctx.textAlign = 'left'
  ctx.textBaseline = 'alphabetic'
  ctx.fillStyle = '#ffffff'
  ctx.font = `700 42px ${FONT}`
  ctx.fillText(TITLE, PAD, IMG_H + 62)

  ctx.fillStyle = 'rgba(147,197,253,0.85)'
  ctx.font = `600 22px ${FONT}`
  ctx.fillText(SUBTITLE, PAD, IMG_H + 98)

  /* Spec table. */
  let y = IMG_H + 140
  ctx.strokeStyle = 'rgba(255,255,255,0.10)'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(PAD, y)
  ctx.lineTo(W - PAD, y)
  ctx.stroke()

  const ROW_H = 58
  SPECS.forEach(({ label, value }, i) => {
    const mid = y + ROW_H * i + ROW_H / 2 + 6

    ctx.textAlign = 'left'
    ctx.fillStyle = 'rgba(255,255,255,0.5)'
    ctx.font = `500 24px ${FONT}`
    ctx.fillText(label, PAD, mid)

    ctx.textAlign = 'right'
    ctx.fillStyle = '#93c5fd'
    ctx.font = `700 26px ${FONT}`
    ctx.fillText(value, W - PAD, mid)

    if (i < SPECS.length - 1) {
      const lineY = y + ROW_H * (i + 1)
      ctx.strokeStyle = 'rgba(255,255,255,0.06)'
      ctx.beginPath()
      ctx.moveTo(PAD, lineY)
      ctx.lineTo(W - PAD, lineY)
      ctx.stroke()
    }
  })

  y += ROW_H * SPECS.length + 34

  /* Close button. */
  const btnH = 90
  const btn = ctx.createLinearGradient(PAD, y, W - PAD, y + btnH)
  btn.addColorStop(0, '#3b82f6')
  btn.addColorStop(1, '#1d4ed8')
  ctx.fillStyle = btn
  roundRect(ctx, PAD, y, W - PAD * 2, btnH, 28)
  ctx.fill()

  ctx.fillStyle = '#ffffff'
  ctx.font = `700 28px ${FONT}`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('✕  Tap to Close', W / 2, y + btnH / 2)

  ctx.restore()

  /* Border glow, drawn on top of the clip. */
  ctx.strokeStyle = 'rgba(99,179,237,0.35)'
  ctx.lineWidth = 4
  roundRect(ctx, 2, 2, W - 4, H - 4, RADIUS)
  ctx.stroke()
}

/* ------------------------------------------------------------------ */

export default function ARInfoCard({ placedMatrix, visible, onClose }) {
  const groupRef = useRef()
  const [photo, setPhoto] = useState(null)

  /* Load the hero photo. `photo` flips null → image exactly once. */
  useEffect(() => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => setPhoto(img)
    img.src = CARD_IMAGE
  }, [])

  /*
   * Canvas-backed texture. Rebuilt (rather than mutated) when the
   * photo arrives, which happens at most once.
   */
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = CARD_W
    canvas.height = CARD_H

    paintCard(canvas.getContext('2d'), photo)

    const tex = new THREE.CanvasTexture(canvas)
    tex.colorSpace = THREE.SRGBColorSpace
    tex.anisotropy = 8
    return tex
  }, [photo])

  useEffect(() => {
    return () => texture.dispose()
  }, [texture])

  /* Anchor above the placed bike. */
  const position = useMemo(() => {
    if (!placedMatrix) {
      return [0, 0, 0]
    }

    const pos = new THREE.Vector3()
    const quat = new THREE.Quaternion()
    const scl = new THREE.Vector3()

    placedMatrix.decompose(pos, quat, scl)

    return [pos.x, pos.y + 1.45, pos.z]
  }, [placedMatrix])

  /*
   * Billboard around Y only (card stays upright) plus a short
   * pop-in so it does not snap into existence.
   */
  useFrame((state, delta) => {
    const group = groupRef.current

    if (!group) {
      return
    }

    const cam = state.camera.position
    group.rotation.y = Math.atan2(
      cam.x - group.position.x,
      cam.z - group.position.z
    )

    const target = visible ? 1 : 0.85
    const k = 1 - Math.pow(0.001, delta)
    group.scale.setScalar(
      THREE.MathUtils.lerp(group.scale.x, target, k)
    )
  })

  if (!visible || !placedMatrix) {
    return null
  }

  return (
    <group ref={groupRef} position={position} scale={0.85}>

      {/* Stem linking the card back down to the bike. */}
      <mesh position={[0, -WORLD_H / 2 - 0.09, 0]}>
        <cylinderGeometry args={[0.004, 0.004, 0.18, 8]} />
        <meshBasicMaterial
          color="#3b82f6"
          transparent
          opacity={0.55}
          depthTest={false}
        />
      </mesh>

      {/* The card itself. */}
      <mesh
        renderOrder={999}
        onClick={(event) => {
          event.stopPropagation()
          onClose?.()
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

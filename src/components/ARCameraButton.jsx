import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * 3D Camera Button for AR Photo Capture
 * Renders a camera icon button in AR space with hover effects
 */

const BUTTON_SIZE = 256;

function drawCameraButton(ctx, isHovered) {
  ctx.clearRect(0, 0, BUTTON_SIZE, BUTTON_SIZE);

  // Button circle background
  const bgAlpha = isHovered ? 0.9 : 0.7;
  ctx.fillStyle = `rgba(37, 99, 235, ${bgAlpha})`; // blue-600
  ctx.beginPath();
  ctx.arc(128, 128, 110, 0, Math.PI * 2);
  ctx.fill();

  // Outer ring glow
  ctx.strokeStyle = isHovered ? 'rgba(59, 130, 246, 0.9)' : 'rgba(59, 130, 246, 0.6)';
  ctx.lineWidth = 8;
  ctx.stroke();

  // Camera icon
  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 6;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  // Camera body (rounded rectangle)
  const bodyX = 68;
  const bodyY = 88;
  const bodyWidth = 120;
  const bodyHeight = 80;
  const radius = 12;

  ctx.beginPath();
  ctx.moveTo(bodyX + radius, bodyY);
  ctx.lineTo(bodyX + bodyWidth - radius, bodyY);
  ctx.quadraticCurveTo(bodyX + bodyWidth, bodyY, bodyX + bodyWidth, bodyY + radius);
  ctx.lineTo(bodyX + bodyWidth, bodyY + bodyHeight - radius);
  ctx.quadraticCurveTo(bodyX + bodyWidth, bodyY + bodyHeight, bodyX + bodyWidth - radius, bodyY + bodyHeight);
  ctx.lineTo(bodyX + radius, bodyY + bodyHeight);
  ctx.quadraticCurveTo(bodyX, bodyY + bodyHeight, bodyX, bodyY + bodyHeight - radius);
  ctx.lineTo(bodyX, bodyY + radius);
  ctx.quadraticCurveTo(bodyX, bodyY, bodyX + radius, bodyY);
  ctx.closePath();
  ctx.fill();

  // Camera lens (circle)
  ctx.fillStyle = isHovered ? '#e0e7ff' : '#dbeafe';
  ctx.beginPath();
  ctx.arc(128, 128, 28, 0, Math.PI * 2);
  ctx.fill();

  // Lens inner ring
  ctx.strokeStyle = '#60a5fa';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(128, 128, 22, 0, Math.PI * 2);
  ctx.stroke();

  // Flash (small rectangle on top)
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(105, 68, 16, 12);

  // Viewfinder (small rectangle on top-left)
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 3;
  ctx.strokeRect(75, 70, 18, 10);
}

export default function ARCameraButton({ position = [0, 0, -1], scale = 0.3, onClick }) {
  const meshRef = useRef();
  const canvasRef = useRef();
  const textureRef = useRef();
  const isHoveredRef = useRef(false);

  // Create canvas texture
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = BUTTON_SIZE;
    canvas.height = BUTTON_SIZE;
    canvasRef.current = canvas;

    const ctx = canvas.getContext('2d');
    drawCameraButton(ctx, false);

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    textureRef.current = tex;
    return tex;
  }, []);

  // Billboard effect - always face camera
  useFrame((state) => {
    if (!meshRef.current) return;

    const cam = state.camera.position;
    const mesh = meshRef.current;

    // Look at camera
    mesh.lookAt(cam);
  });

  const handlePointerOver = () => {
    isHoveredRef.current = true;
    if (canvasRef.current && textureRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      drawCameraButton(ctx, true);
      textureRef.current.needsUpdate = true;
    }
  };

  const handlePointerOut = () => {
    isHoveredRef.current = false;
    if (canvasRef.current && textureRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      drawCameraButton(ctx, false);
      textureRef.current.needsUpdate = true;
    }
  };

  const handleClick = (event) => {
    event.stopPropagation();
    onClick?.();
  };

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
  );
}

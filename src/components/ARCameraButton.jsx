import { useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * 3D Camera Button for AR Photo Capture
 * Renders a camera icon button in AR space with hover effects
 */
export default function ARCameraButton({ position = [0, 0, 0], scale = 1, onClick }) {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);
  const { camera } = useThree();

  // Create canvas texture for camera icon
  const texture = useRef();
  if (!texture.current) {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    // Draw button background
    const drawButton = (isHovered) => {
      ctx.clearRect(0, 0, 256, 256);

      // Button circle background
      ctx.fillStyle = isHovered ? '#3b82f6' : '#2563eb'; // blue-600 / blue-500
      ctx.beginPath();
      ctx.arc(128, 128, 100, 0, Math.PI * 2);
      ctx.fill();

      // Outer ring for depth
      ctx.strokeStyle = isHovered ? '#1d4ed8' : '#1e40af'; // blue-700 / blue-800
      ctx.lineWidth = 8;
      ctx.stroke();

      // Camera icon
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 6;

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
      ctx.fillStyle = isHovered ? '#e0e7ff' : '#dbeafe'; // indigo-100 / blue-100
      ctx.beginPath();
      ctx.arc(128, 128, 28, 0, Math.PI * 2);
      ctx.fill();

      // Lens inner ring
      ctx.strokeStyle = '#60a5fa'; // blue-400
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
    };

    drawButton(false);
    texture.current = new THREE.CanvasTexture(canvas);
    texture.current.needsUpdate = true;

    // Store canvas and context for updates
    texture.current.canvas = canvas;
    texture.current.context = ctx;
    texture.current.drawButton = drawButton;
  }

  // Update texture on hover state change
  useState(() => {
    if (texture.current && texture.current.drawButton) {
      texture.current.drawButton(hovered);
      texture.current.needsUpdate = true;
    }
  }, [hovered]);

  // Billboard effect - always face camera
  useFrame(() => {
    if (meshRef.current) {
      const button = meshRef.current;
      const targetPosition = camera.position.clone();
      targetPosition.y = button.position.y;
      button.lookAt(targetPosition);

      // Gentle scale animation on hover
      const targetScale = hovered ? scale * 1.1 : scale;
      button.scale.lerp(
        new THREE.Vector3(targetScale, targetScale, targetScale),
        0.15
      );

      // Update texture if hover state changed
      if (texture.current && texture.current.drawButton) {
        texture.current.drawButton(hovered);
        texture.current.needsUpdate = true;
      }
    }
  });

  const handleClick = (e) => {
    e.stopPropagation();
    if (onClick) onClick();
  };

  return (
    <mesh
      ref={meshRef}
      position={position}
      onPointerDown={handleClick}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      <planeGeometry args={[0.4, 0.4]} />
      <meshBasicMaterial
        map={texture.current}
        transparent
        opacity={0.95}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

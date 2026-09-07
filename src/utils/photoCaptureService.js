/**
 * Photo Capture Service
 * Handles screenshot capture from WebXR session and download functionality
 */

/**
 * Captures a screenshot from the WebGL canvas
 * @param {WebGLRenderer} renderer - Three.js renderer
 * @param {string} filename - Optional filename for download
 * @returns {Promise<string>} - Data URL of captured image
 */
export async function captureARPhoto(renderer, filename = 'ar-bike-photo') {
  try {
    // Get the canvas element from the renderer
    const canvas = renderer.domElement;

    // Ensure the canvas is preserving drawing buffer
    // This should be set in the Canvas component with `gl={{ preserveDrawingBuffer: true }}`

    // Convert canvas to blob for better quality
    const dataURL = canvas.toDataURL('image/png', 1.0);

    // Create timestamp for unique filename
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const finalFilename = `${filename}_${timestamp}.png`;

    // Trigger download
    downloadImage(dataURL, finalFilename);

    return dataURL;
  } catch (error) {
    console.error('Error capturing AR photo:', error);
    throw error;
  }
}

/**
 * Downloads an image from a data URL
 * @param {string} dataURL - Image data URL
 * @param {string} filename - Filename for download
 */
function downloadImage(dataURL, filename) {
  const link = document.createElement('a');
  link.href = dataURL;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Shares photo using Web Share API (if available)
 * @param {string} dataURL - Image data URL
 * @param {string} title - Share title
 * @returns {Promise<boolean>} - Success status
 */
export async function shareARPhoto(dataURL, title = 'My AR Bike Photo') {
  try {
    // Check if Web Share API is available
    if (!navigator.share || !navigator.canShare) {
      console.warn('Web Share API not available, falling back to download');
      return false;
    }

    // Convert data URL to blob
    const blob = await (await fetch(dataURL)).blob();
    const file = new File([blob], 'ar-bike-photo.png', { type: 'image/png' });

    // Check if we can share files
    if (navigator.canShare({ files: [file] })) {
      await navigator.share({
        files: [file],
        title: title,
        text: 'Check out this AR bike photo!',
      });
      return true;
    }

    return false;
  } catch (error) {
    if (error.name !== 'AbortError') {
      console.error('Error sharing photo:', error);
    }
    return false;
  }
}

/**
 * Creates a visual flash effect for photo capture feedback
 * @returns {HTMLDivElement} - Flash overlay element
 */
export function createFlashEffect() {
  const flash = document.createElement('div');
  flash.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: white;
    opacity: 0;
    pointer-events: none;
    z-index: 9999;
    transition: opacity 0.1s ease-out;
  `;

  document.body.appendChild(flash);

  // Trigger flash animation
  requestAnimationFrame(() => {
    flash.style.opacity = '0.9';
    setTimeout(() => {
      flash.style.opacity = '0';
      setTimeout(() => {
        document.body.removeChild(flash);
      }, 150);
    }, 100);
  });

  return flash;
}

/**
 * Plays camera shutter sound (optional enhancement)
 * @returns {void}
 */
export function playShutterSound() {
  try {
    // Create a simple beep sound using Web Audio API
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 800;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
  } catch (error) {
    console.warn('Could not play shutter sound:', error);
  }
}

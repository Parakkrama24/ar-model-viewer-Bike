import { useState, useEffect } from 'react'

/*
 * 2D popup that shows part-specific details
 * Positioned at bottom-right with smooth animations
 * Works in AR mode (rendered outside XR canvas)
 */

export default function PartDetailsPopup({ partInfo, onClose }) {
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (partInfo) {
      // Trigger animation after mount
      setTimeout(() => setIsAnimating(true), 10)
    } else {
      setIsAnimating(false)
    }
  }, [partInfo])

  if (!partInfo) {
    return null
  }

  const handleClose = () => {
    setIsAnimating(false)
    setTimeout(() => onClose?.(), 300) // Wait for animation to complete
  }

  // Get part-specific details
  const getPartDetails = () => {
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
            { label: 'Comfort', value: 'Dual-density foam' },
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

  const partDetails = getPartDetails()

  return (
    <div className="fixed inset-0 pointer-events-none z-50 flex items-end justify-end p-4 sm:p-6">
      <div
        className={`pointer-events-auto bg-gradient-to-br from-gray-900 to-black border-2 border-blue-500/30 rounded-2xl shadow-2xl max-w-sm w-full transform transition-all duration-300 ease-out ${
          isAnimating ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-8 opacity-0 scale-95'
        }`}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 sm:px-6 py-3 sm:py-4 rounded-t-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl sm:text-3xl">{partDetails.icon}</span>
            <h3 className="text-white font-bold text-base sm:text-lg">{partDetails.title}</h3>
          </div>
          <button
            onClick={handleClose}
            className="text-white/80 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-lg"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-3">
          {partDetails.details.map((detail, index) => (
            <div
              key={index}
              className="flex justify-between items-center py-2 border-b border-white/10 last:border-0"
            >
              <span className="text-gray-400 text-sm sm:text-base font-medium">{detail.label}</span>
              <span className="text-white text-sm sm:text-base font-semibold">{detail.value}</span>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-4 sm:px-6 pb-4 sm:pb-6">
          <button
            onClick={handleClose}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 sm:py-3 rounded-xl transition-colors text-sm sm:text-base"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

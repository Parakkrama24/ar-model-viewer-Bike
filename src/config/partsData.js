// Configuration for bike parts and their details
// This can be customized per model

export const PARTS_DATA = {
  tire: {
    title: 'Tire Specifications',
    icon: '🛞',
    details: [
      { label: 'Type', value: 'Sport Radial' },
      { label: 'Size', value: '120/70 ZR17' },
      { label: 'Pressure', value: '36 PSI' },
      { label: 'Brand', value: 'Michelin Pilot' },
    ]
  },
  engine: {
    title: 'Engine Details',
    icon: '⚙️',
    details: [
      { label: 'Type', value: 'V-Twin' },
      { label: 'Displacement', value: '1000cc' },
      { label: 'Power', value: '145 HP' },
      { label: 'Torque', value: '110 Nm' },
    ]
  },
  frame: {
    title: 'Frame Information',
    icon: '🔧',
    details: [
      { label: 'Material', value: 'Aluminum Alloy' },
      { label: 'Type', value: 'Twin-Spar' },
      { label: 'Weight', value: '12.5 kg' },
      { label: 'Color', value: 'Matte Black' },
    ]
  },
  seat: {
    title: 'Seat Details',
    icon: '🪑',
    details: [
      { label: 'Type', value: 'Sport' },
      { label: 'Material', value: 'Premium Leather' },
      { label: 'Height', value: '820 mm' },
      { label: 'Comfort', value: 'Dual-density foam' },
    ]
  },
  handlebar: {
    title: 'Handlebar Specs',
    icon: '🎮',
    details: [
      { label: 'Type', value: 'Clip-on Sport' },
      { label: 'Material', value: 'Aluminum' },
      { label: 'Width', value: '720 mm' },
      { label: 'Finish', value: 'Anodized Black' },
    ]
  }
}

// Patterns to detect parts from mesh names
export const PART_PATTERNS = {
  tire: ['tire', 'wheel', 'tyre', 'rim'],
  engine: ['engine', 'motor', 'cylinder'],
  frame: ['frame', 'chassis'],
  seat: ['seat', 'saddle'],
  handlebar: ['handlebar', 'handle', 'grip']
}

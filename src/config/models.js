// AR Model Configuration
export const BIKE_MODELS = [
  {
    id: 1,
    name: 'Sport Bike',
    path: '/models/model_101/BikeModel_01_steady.gltf',
    image: '/models/model_101/Image.png',
    specs: {
      engine: '1000cc V-Twin',
      length: '2100mm',
      height: '1100mm',
      width: '800mm',
      weight: '190kg'
    }
  },
  {
    id: 2,
    name: 'Carbon Frame Bike',
    path: '/models/model_102/carbon_frame_bike.glb',
    image: '/models/model_101/Image.png', // Using same image for now
    specs: {
      engine: '1200cc Inline-4',
      length: '2050mm',
      height: '1050mm',
      width: '750mm',
      weight: '175kg'
    }
  }
];

export const DEFAULT_MODEL_INDEX = 0;

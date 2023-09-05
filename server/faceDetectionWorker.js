const faceapi = require('face-api.js');
const {
  Worker, isMainThread, parentPort, workerData,
} = require('worker_threads');
const canvas = require('canvas'); // Import canvas here
// Other imports and setup
// Other necessary imports and loading of face-api.js models
const { Canvas, Image, ImageData } = canvas;
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

if (!isMainThread) {
  console.log('Worker thread starting...');
  // Your worker thread code here

  // Load face-api.js models if not already loaded
  async function loadModels() {
    await faceapi.nets.ssdMobilenetv1.loadFromDisk('models');
    await faceapi.nets.faceLandmark68Net.loadFromDisk('models');
  }
  async function detectFaces(imagePath) {
    // Load models if not already loaded
    if (!faceapi.nets.ssdMobilenetv1.isLoaded) {
      await loadModels();
    }
  
    const img = await canvas.loadImage(imagePath);
    const detections = await faceapi.detectAllFaces(img).withFaceLandmarks();
    return detections.length; // Return the number of detected faces
  }
  
  parentPort.on('message', async (message) => {
    if (message.type === 'detectFaces') {
      const imagePath = message.imagePath;
      // Perform face detection
      const detectedFacesCount = await detectFaces(imagePath);
      // Send results back to the main thread
      parentPort.postMessage({ type: 'detectionResult', detectedFacesCount });
    }
  });
}

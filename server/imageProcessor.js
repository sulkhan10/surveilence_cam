// imageProcessor.js

const fs = require('fs');
const faceapi = require('face-api.js');
const canvas = require('canvas');
const { Canvas, Image, ImageData } = canvas;
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

// Load models and other initialization tasks here
async function loadModels() {
  await faceapi.nets.ssdMobilenetv1.loadFromDisk('models');
  await faceapi.nets.faceLandmark68Net.loadFromDisk('models');
}

// Detect faces using face-api.js
async function detectFaces(imagePath) {
  const img = await canvas.loadImage(imagePath);
  const detections = await faceapi.detectAllFaces(img).withFaceLandmarks();
  return detections.length; // Return the number of detected faces
}

// Process the image and detect faces
async function processImageAndDetectFaces(imagePath) {
  try {
    await loadModels();
    const detectedFacesCount = await detectFaces(imagePath);

    if (detectedFacesCount > 0) {
      console.log('Face detected!');
      // Perform face comparison and API calls here
    } else {
      console.log('No faces detected.');
    }

    // Cleanup and delete the image file
    fs.unlinkSync(imagePath);
  } catch (error) {
    console.error('Error processing image:', error);
  }
}

// Listen for messages from the parent process
process.on('message', (message) => {
    processImageAndDetectFaces(message.imagePath);
  });

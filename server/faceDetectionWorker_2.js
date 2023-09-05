const fs = require('fs');
const { loadModels, detectFaces } = require('./server_26'); // Replace with the actual paths

process.on('message', async (message) => {
  if (message.type === 'startDetection') {
    const imagePath = message.imagePath;
    console.log('imagePath', imagePath);
    console.log('message', message);
    try {
      // Load face-api.js models
      await loadModels();

      // Perform face detection on the image
      const detectedFacesCount = await detectFaces(imagePath);
      
      if (detectedFacesCount > 0) {
        // Convert the image to base64
        const imageData = fs.readFileSync(imagePath, 'base64');

        // Notify the main process about the result
        process.send({ type: 'facesDetected', imageData });
        // fs.unlinkSync(imagePath);
      } else {
        // fs.unlinkSync(imagePath);
        process.send({ type: 'noFacesDetected' });
      }
    } catch (error) {
      process.send({ type: 'error', error: error.message });
    }
  }
});

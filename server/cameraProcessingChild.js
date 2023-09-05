const { CAMERA_PARAMS } = process.env;
const cameraParams = JSON.parse(CAMERA_PARAMS);

// Load necessary modules and functions
const { workerData, parentPort, isMainThread } = require('worker_threads');
const fs = require('fs').promises;
const axios = require('axios'); // You may need to load other modules as well
// Load other modules and functions if needed
async function faceCompareChina(params) {
    try {
      console.log("params", params);
      const body = {
        groupID: "1",
        dbIDs: ["1", "2", "22", "101", "testcideng"],
      };
  
      const response = await axios.post(
        "https://faceengine.deepcam.cn/pipeline/api/face/match",
        {
          ...body,
          ...params,
        }
      );
  
      console.log(response.data);
  
      if (response.data.data) {
        const paramApiLocal = {
          name: response.data.data.imageID,
          image: "data:image/jpeg;base64," + params.imageData,
          deviceId: params.deviceId,
        };
  
        const result = await axios.post(
          "https://dev.transforme.co.id/gema_admin_api/visitor_log/insert.php",
          paramApiLocal
        );
  
        console.log("result", result);
      }
    } catch (error) {
      console.error("Error in faceCompareChina:", error);
    }
  }
// Define the worker thread logic
async function workerThreadLogic() {
  // Perform camera processing as before
  // ... (previous camera processing logic)

  // After capturing the image, perform faceCompareChina
  if (detectedFacesCount > 0) {
    console.log("Face detected!");

    // Convert the image to base64
    const imageData = fs.readFileSync(imagePath, "base64");

    // Prepare parameters for faceCompareChina
    const faceCompareParams = {
      imageData: imageData,
      deviceId: cameraParams.deviceId,
    };

    // Call the faceCompareChina function
    await faceCompareChina(faceCompareParams);
  } else {
    console.log("No faces detected.");
  }
}

// Call the worker thread logic function
workerThreadLogic();

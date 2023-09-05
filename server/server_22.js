const spawn = require("child_process").spawn;
const { join } = require("path");
const faceapi = require("face-api.js");
const canvas = require("canvas");
const { Canvas, Image } = canvas;
const fs = require("fs"); // Import the Node.js file system module

// Load face-api.js models
async function loadModels() {
  await faceapi.nets.ssdMobilenetv1.loadFromDisk(join(__dirname, "models"));
  await faceapi.nets.faceLandmark68Net.loadFromDisk(join(__dirname, "models"));
}
async function processImageAndDetectFaces(buffer) {
    try {
      const image = new Image();
      console.log("image", buffer);
      image.onload = async () => {
        const canvas = new Canvas();
        const context = canvas.getContext("2d");
  
        // Set canvas dimensions to match image dimensions
        canvas.width = image.width;
        canvas.height = image.height;
  
        // Draw the image onto the canvas
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
  
        // Convert the canvas to a PNG image
        const pngBuffer = await convertBufferToPNG(canvas.toBuffer());
  
        // Load the PNG image buffer
        const frame = await canvas.loadImage(pngBuffer);
  
        // Detect faces in the image
        const isFaceDetected = await detectFacesInImage(frame);
        console.log("isFaceDetected", isFaceDetected);
      };
  
      image.src = buffer;
    } catch (error) {
      console.error("An error occurred while processing image:", error);
    }
  }
// Function to detect faces in an image
async function detectFacesInImage(image) {
  const detections = await faceapi
    .detectAllFaces(image)
    .withFaceLandmarks()
    .withFaceDescriptors();
  return detections.length > 0;
}

// Start live camera processing
async function startLiveCamera() {
  const resultCameraData = [
    {
      deviceName: "soeta1",
      urlRTSP: "rtsp://SIMCAM:VK6SXA@192.168.1.120/live",
      IpAddress: "192.168.1.120",
    },
  ];

  console.log("resultCameraData", resultCameraData);
  await loadModels(); // Load face-api.js models

  for (const obj of resultCameraData) {
    const cmd_ffmpeg = "/usr/local/bin/ffmpeg";
    const args_parameter = [
      "-i",
      obj.urlRTSP,
      "-vf",
      "fps=1", // Set the frame rate to 1 frame per second for demo purposes
      "-f",
      "image2pipe", // Output frames as images to pipe
      "-vcodec",
      "png", // Use PNG format for output images
      "-",
    ];

    try {
      const processHLS = spawn(cmd_ffmpeg, args_parameter);

      // ... Your other imports and functions ...

      processHLS.stdout.on("data", async function (data) {
        try {
       
        //   console.log("buffer", buffer);
          const interval = setInterval(async () => {
            try {
              // Replace this with your actual data retrieval logic
              const base64String = data.toString("base64");
              const buffer = Buffer.from(base64String, "base64");

              // Process the image and detect faces
              await processImageAndDetectFaces(buffer);
            } catch (error) {
              console.error("An error occurred in the interval:", error);
            }
          }, 10000); // 3000 milliseconds = 3 seconds
        } catch (error) {
          console.error(
            "An error occurred while processing frame data:",
            error
          );
        }
      });

      //   processHLS.stderr.on("data", function (data) {
      //     console.error("FFmpeg process error:", data.toString());
      //   });

      processHLS.on("error", function (error) {
        console.error("FFmpeg process error:", error);
      });

      processHLS.on("close", function (code) {
        console.log("FFmpeg process closed with code " + code);
      });
    } catch (error) {
      console.error("An error occurred while spawning FFmpeg:", error);
    }
  }
}

startLiveCamera();

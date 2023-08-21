const spawn = require("child_process").spawn;
const { join } = require("path");
const Recorder = require("node-rtsp-recorder").Recorder;
const axios = require("axios");
const fs = require("fs").promises;

const faceapi = require('face-api.js');
const canvas = require('canvas');
const { Canvas, Image, ImageData } = canvas;
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

// ... (Previous code)

// Load the face-api.js models
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

// Convert an image file to base64
async function imageToBase64(imagePath) {
  try {
    const imageData = await fs.readFile(imagePath);
    return imageData.toString("base64");
  } catch (error) {
    console.error("Error converting image to base64:", error);
    return null;
  }
}

// ... (Rest of the code)



async function faceCompareChina(params) {
  try {
    const body = {
      groupID: "1",
      dbIDs: ["1", "2", "22", "101", "testcideng"],
    };

    const response = await axios.post("https://faceengine.deepcam.cn/pipeline/api/face/match", {
      ...body,
      ...params,
    });

    console.log(response.data);
    
    if (response.data.data) {
      const paramApiLocal = {
        name: response.data.data.imageID,
        image: "data:image/jpeg;base64," + params.imageData,
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

async function startLiveCamera() {
  const resultCameraData = [
    {
      deviceName: "soeta1",
      urlRTSP: "rtsp://SIMCAM:VK6SXA@192.168.1.120/live",
      IpAddress: "192.168.1.120"
    }
  ];

  console.log("resultCameraData", resultCameraData);

  for (const obj of resultCameraData) {
    const pathStream = join(__dirname, `./videos/stream/${obj.IpAddress}_.m3u8`);
    const cmd_ffmpeg = "/usr/local/bin/ffmpeg";

    const args_parameter = [
      "-i",
      obj.urlRTSP,
      "-fflags",
      "flush_packets",
      "-max_delay",
      "2",
      "-flags",
      "global_header",
      "-hls_time",
      "2",
      "-hls_list_size",
      "3",
      "-vcodec",
      "copy",
      "-y",
      pathStream,
    ];

    try {
      const processHLS = spawn(cmd_ffmpeg, args_parameter);

      processHLS.stderr.setEncoding("utf8");
      processHLS.stderr.on("data", function (data) {
        console.log("FFmpeg stderr: " + data);
      });

      processHLS.on("close", function (code) {
        console.log("FFmpeg process closed with code " + code);
      });

      const rec = new Recorder({
        url: obj.urlRTSP,
        folder: join(__dirname, "/videos/record"),
        name: obj.deviceName.replace(/\s/g, ""),
        directoryPathFormat: "YYYYMMDD",
        fileNameFormat: "HHmmss",
        type: 'video',
        audioCodec: 'aac',
        timeLimit: 60,
        videoCodec: 'h264',
      });

      rec.startRecording();

      const snapshot = new Recorder({
        url: obj.urlRTSP,
        folder: join(__dirname, "/snapshots"),
        name: obj.deviceName.replace(/\s/g, ""),
        directoryPathFormat: "YYYYMMDD",
        fileNameFormat: "HHmmss",
        type: 'image',
        imageFormat: 'jpg',
        imageQuality: 100,
        imageWidth: 1280,
        imageHeight: 720,
      });

      const captureInterval = 5000; // Capture an image every 5 seconds

      async function captureAndLogImage() {
        try {
          // Capture the image
          await snapshot.captureImage();
      
          // Get the current timestamp for constructing the path
          const currentDate = new Date();
          const yyyymmdd = `${currentDate.getFullYear()}${(currentDate.getMonth() + 1).toString().padStart(2, '0')}${currentDate.getDate().toString().padStart(2, '0')}`;
          const hhmmss = `${currentDate.getHours().toString().padStart(2, '0')}${currentDate.getMinutes().toString().padStart(2, '0')}${currentDate.getSeconds().toString().padStart(2, '0')}`;
      
          // Construct the image path
          const imagePath = join(
            snapshot.folder,
            snapshot.name,
            yyyymmdd,
            'image',
            `${hhmmss}.jpg`
          );
      
          // Log the image path and capture time
          console.log('Captured image:', imagePath, 'at', currentDate);
      
          // Wait for a delay before detecting faces
          await new Promise(resolve => setTimeout(resolve, 5000)); // Adjust delay as needed
      
          // Load face-api.js models
          await loadModels();
      
          // Perform face detection on the image
          const detectedFacesCount = await detectFaces(imagePath);
          if (detectedFacesCount > 0) {
            console.log('Face detected!');
            
            // Convert the image to base64
            const fs = require('fs');
            const imageData = fs.readFileSync(imagePath, 'base64');
            
            // console.log('Image in base64:', imageData);
            
            // Now, you can proceed with your face comparison and API calls
            faceCompareChina({
              imageData: imageData,
            });
          } else {
            console.log('No faces detected.');
          }
        } catch (error) {
          console.error('Error capturing and logging image:', error);
        }
      }
      

      setInterval(async () => {
        await captureAndLogImage();
      }, captureInterval);
    } catch (error) {
      console.error("An error occurred:", error);
    }
  }
}

startLiveCamera();

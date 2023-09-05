const spawn = require("child_process").spawn;
const { join } = require("path");
const axios = require("axios");
const fs = require("fs").promises;
const Recorder = require("node-rtsp-recorder").Recorder;
const faceapi = require('face-api.js');
const canvas = require('canvas');
const { Canvas, Image, ImageData } = canvas;
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

// Load the face-api.js models
async function loadModels() {
  await faceapi.nets.ssdMobilenetv1.loadFromDisk('models');
  await faceapi.nets.faceLandmark68Net.loadFromDisk('models');
}

// Detect faces using face-api.js
async function detectFaces(imagePath) {
  const img = await canvas.loadImage(imagePath);
  const detections = await faceapi.detectAllFaces(img).withFaceLandmarks();
  return detections.length;
}

async function processImageAndDetectFacesWorker(imagePath) {
    try {
      const detectedFacesCount = await detectFaces(imagePath);
      if (detectedFacesCount > 0) {
        console.log('Face detected!');
        const imageData = await fs.readFile(imagePath, 'base64');
        await faceCompareChina({
          imageData: imageData,
        });
        await fs.unlink(imagePath);
      } else {
        console.log('No faces detected.');
        await fs.unlink(imagePath);
        console.log('Image file deleted.');
      }
    } catch (error) {
      console.error('Error processing and detecting faces in worker:', error);
    }
  }
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
      };

      const result = await axios.post(
        "https://dev.transforme.co.id/gema_admin_api/visitor_log/insert.php",
        paramApiLocal
      );

      console.log("result", result.data);
    }
  } catch (error) {
    console.error("Error in faceCompareChina:", error);
  }
}

async function startLiveCamera(params) {
//   const resultCameraData = [
//     {
//       deviceName: "Kamera 1",
//       urlRTSP: "rtsp://192.168.18.15:554/ch0_0.h264",
//       IpAddress: "192.168.18.15",
//       deviceId : '92929dca03cf2da2bfdeb995a714d5a6'
//     },
//   ];
  let resultCameraData = JSON.parse(params.listViewCameraData);

  console.log("resultCameraData", resultCameraData);

  for (const obj of resultCameraData) {
    const pathStream = join(
      __dirname,
      `./videos/stream/${obj.IpAddress}_.m3u8`
    );
    const cmd_ffmpeg = "/usr/local/bin/ffmpeg";

    var args_parameter = [
      "-i",
      obj.urlRTSP,
      "-fflags",
      "flush_packets",
      "-max_delay",
      "2",
      "-flags",
      "-global_header",
      "-hls_time",
      "2",
      "-hls_list_size",
      "3",
      // "-vf",
      // "detect_face=detect.json",
      "-vcodec",
      "copy",
      "-y",
      pathStream,
    ];

    try {
      const processHLS = spawn(cmd_ffmpeg, args_parameter);

      processHLS.stderr.setEncoding("utf8");
      processHLS.stderr.on("data", function (data) {
        // console.log("FFmpeg stderr: " + data);
      });

      processHLS.on("close", function (code) {
        console.log("FFmpeg process closed with code " + code);
      });

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

      const captureInterval = 1000; // Capture an image every 1 second

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
          await new Promise(resolve => setTimeout(resolve, 1000)); // Adjust delay as needed

          // Load face-api.js models
          await loadModels();

          // Perform face detection on the image
          await processImageAndDetectFaces(imagePath);
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

// ... (other code)

let faceRegLive = async (params) => {
    if (cluster.isMaster) {
        let resultCameraData = JSON.parse(params.listViewCameraData);

        console.log("resultCameraData", resultCameraData);
      
        for (const obj of resultCameraData) {
          const pathStream = join(
            __dirname,
            `./videos/stream/${obj.IpAddress}_.m3u8`
          );
          const cmd_ffmpeg = "/usr/local/bin/ffmpeg";
      
          var args_parameter = [
            "-i",
            obj.urlRTSP,
            "-fflags",
            "flush_packets",
            "-max_delay",
            "2",
            "-flags",
            "-global_header",
            "-hls_time",
            "2",
            "-hls_list_size",
            "3",
            // "-vf",
            // "detect_face=detect.json",
            "-vcodec",
            "copy",
            "-y",
            pathStream,
          ];
      
          try {
            const processHLS = spawn(cmd_ffmpeg, args_parameter);
      
            processHLS.stderr.setEncoding("utf8");
            processHLS.stderr.on("data", function (data) {
              // console.log("FFmpeg stderr: " + data);
            });
      
            processHLS.on("close", function (code) {
              console.log("FFmpeg process closed with code " + code);
            });
      
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
      
            const captureInterval = 1000; // Capture an image every 1 second
      
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

                
      // If the current process is the master, create worker processes
      for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
      }
    } else {
      // This block will be executed in worker processes
  
      // Load models and start camera processing
      loadModels()
        .then(() => {
          // Worker process only handles face detection
          setInterval(async () => {
            // Capture and detect faces in the image
            try {
              // Capture the image
              await captureAndLogImage();
    
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
              await new Promise(resolve => setTimeout(resolve, 1000)); // Adjust delay as needed
    
              // Load face-api.js models
              await loadModels();
    
              // Perform face detection on the image using the worker function
              await processImageAndDetectFacesWorker(imagePath);
            } catch (error) {
              console.error('Error capturing and processing image in worker:', error);
            }
          }, captureInterval);
        })
        .catch(error => {
          console.error("Error in worker process:", error);
          process.exit(1); // Exit the worker process on error
        });
    }
  }
  
  module.exports = faceRegLive;

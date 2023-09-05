const spawn = require("child_process").spawn;
const { join } = require("path");
const Recorder = require("node-rtsp-recorder").Recorder;
const axios = require("axios");
const fs = require("fs").promises;
const faceapi = require("face-api.js");
const canvas = require("canvas");
const { Canvas, Image, ImageData } = canvas;
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

// ... (Previous code)

async function loadModels() {
  await faceapi.nets.ssdMobilenetv1.loadFromDisk("models");
  await faceapi.nets.faceLandmark68Net.loadFromDisk("models");
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

      console.log("result", result);
    }
  } catch (error) {
    console.error("Error in faceCompareChina:", error);
  }
}

// ... (Other functions)

async function startCameraProcessing(obj) {
  try {
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

    const processHLS = spawn(cmd_ffmpeg, args_parameter);
    processHLS.stderr.setEncoding("utf8");
    processHLS.stderr.on("data", function (data) {
      console.log("FFmpeg stderr: " + data);
    });

    processHLS.on("close", function (code) {
      console.log("FFmpeg process closed with code " + code);
    });
    await loadModels();

    const snapshot = new Recorder({
      url: obj.urlRTSP,
      folder: join(__dirname, "/snapshots"),
      name: obj.deviceName.replace(/\s/g, ""),
      directoryPathFormat: "YYYYMMDD",
      fileNameFormat: "HHmmss",
      type: "image",
      imageFormat: "jpg",
      imageQuality: 100,
      imageWidth: 1280,
      imageHeight: 720,
    });
    const captureInterval = 5000; // Capture an image every 1 second
    async function captureAndProcessImage() {
      try {
        await snapshot.captureImage();
        const currentDate = new Date();
        const yyyymmdd = `${currentDate.getFullYear()}${(
          currentDate.getMonth() + 1
        )
          .toString()
          .padStart(2, "0")}${currentDate
          .getDate()
          .toString()
          .padStart(2, "0")}`;
        const hhmmss = `${currentDate
          .getHours()
          .toString()
          .padStart(2, "0")}${currentDate
          .getMinutes()
          .toString()
          .padStart(2, "0")}${currentDate
          .getSeconds()
          .toString()
          .padStart(2, "0")}`;

        // Construct the image path
        const imagePath = join(
          snapshot.folder,
          snapshot.name,
          yyyymmdd,
          "image",
          `${hhmmss}.jpg`
        );
        await new Promise((resolve) => setTimeout(resolve, 5000)); // Adjust delay as needed
        const imageData = await imageToBase64(imagePath);

        const detectedFacesCount = await detectFaces(imagePath);
        if (detectedFacesCount > 0) {
          console.log("Face detected!");
          await faceCompareChina({ imageData });
          // await fs.unlink(imagePath);
        } else {
          console.log("No faces detected.");
          // await fs.unlink(imagePath);
        }
      } catch (error) {
        console.error("Error capturing and processing image:", error);
      }
    }

    setInterval(async () => {
      await captureAndProcessImage();
    }, captureInterval);
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

async function startLiveCamera() {
  const resultCameraData = [
    // ... (camera configuration)
    {
      deviceName: "Kamera 1",
      urlRTSP: "rtsp://admin:admindev123@192.168.1.18:8554",
      IpAddress: "192.168.1.18",
      deviceId: "92929dca03cf2da2bfdeb995a714d5a6",
    },
  ];

  for (const obj of resultCameraData) {
    await startCameraProcessing(obj);
  }
}

startLiveCamera();

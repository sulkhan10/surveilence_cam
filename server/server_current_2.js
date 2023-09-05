// import Recorder, { RecorderEvents } from "rtsp-video-recorder";

Stream = require("node-rtsp-stream");
var moment = require("moment");
var axios = require("axios");
var spawn = require("child_process").spawn;
const util = require("util");
const exec = util.promisify(require("child_process").exec);
const { join, resolve } = require("path");
const findRemoveSync = require("find-remove");
const Recorder = require("node-rtsp-recorder").Recorder;
const FileHandler = require("rtsp-downloader").FileHandler;
const fs = require("fs");
const readdir = util.promisify(fs.readdir);
const unlink = util.promisify(fs.unlink);
const fh = new FileHandler();
const SambaClient = require("samba-client");
const webSocketsServerPort = 4000;
const webSocketServer = require("websocket").server;
const http = require("http");

const { Worker, isMainThread, parentPort } = require('worker_threads');
const path = require('path');


const faceapi = require("face-api.js");
const canvas = require("canvas");
const { Canvas, Image, ImageData } = canvas;
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

// Load the face-api.js models
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

const server = http.createServer(function (request, response) {
  // console.log("request starting...", new Date());
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "OPTIONS, POST, GET",
    "Access-Control-Max-Age": 2592000, // 30 days

    /** add other headers as per requirement */
  };
  if (request.method === "OPTIONS") {
    response.writeHead(204, headers);
    response.end();
    return;
  }
  var filePath = "./videos/stream" + request.url;
 
  fs.readFile(filePath, function (error, content) {
    response.writeHead(200, { "Access-Control-Allow-Origin": "*" });
    if (error) {
      if (error.code == "ENOENT") {
        fs.readFile("./404.html", function (error, content) {
          response.end(content, "utf-8");
        });
      } else {
        response.writeHead(500);
        response.end(
          "Sorry, check with the site admin for error: " + error.code + " ..\n"
        );
        response.end();
      }
    } else {
      response.end(content, "utf-8");
    }
  });
});
server.listen(webSocketsServerPort);
console.log("Listening on port " + webSocketsServerPort);
const wsServer = new webSocketServer({
  httpServer: server,
});

const format1 = "YYYY-MM-DD";
var date = new Date();
var DateNow = moment(date).format(format1);
//console.log(DateNow.replace(/-/g, ""));
var dateBefor1Day = new Date(DateNow);
dateBefor1Day.setDate(dateBefor1Day.getDate() - 1);
var S1day = dateBefor1Day.toISOString().slice(0, 10);
// console.log(S1day.replace(/-/g, ""));

var stream = null;
var StreamDataLiveView = null;
var dataStreamCamera = null;
var processHLS = null;

// Generates unique ID for every new connection
const getUniqueID = () => {
  const s4 = () =>
    Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  return s4() + s4() + "-" + s4();
};

const clients = {};
wsServer.on("request", function (request) {
  var userID = getUniqueID();
  console.log(
    new Date() +
      " Recieved a new connection from origin " +
      request.origin +
      "."
  );
  var conn = request.accept(null, request.origin);
  clients[userID] = conn;
  console.log(
    "connected: " + userID + " in " + Object.getOwnPropertyNames(clients)
  );
  conn.on("message", function (message) {
    if (message.type !== "utf8") {
      return;
    }
    var data = JSON.parse(message.utf8Data);
    var method = data["method"];
    var params = data["params"];
    if (method === "startDiscovery") {
      startDiscovery(conn);
    } else if (method === "connect") {
      StreamCamera(conn, params);
    } else if (method === "disconnected") {
      StopCamera(conn, params);
    } else if (method === "startLiveView") {
      startLiveCamera(conn, params);
    } else if (method === "disconnectedLive") {
      StopCameraLive(conn, params);
    } else if (method === "addStreaming") {
      saveCameraList(dataStreamCamera, params.dataStream);
    } else if (method === "getIpAddressFromMacAddress") {
      doGetIpAddresFromMacAddres(conn, params);
    }
  });
  // user disconnected
  conn.on("close", function (conn) {
    console.log(new Date() + " Peer " + userID + " disconnected.");
    delete clients[userID];
  });
});

function startDiscovery(conn) {
  let res = { id: "startDiscovery", result: "cek websocket server start" };
  conn.send(JSON.stringify(res));
  console.log("cek startDiscovery", res);
}

function startLiveCamera(conn, params) {
   
  let dataParam = JSON.parse(params.listViewCameraData);
 

  console.log("param data", dataParam);

  if (dataParam.length > 0) {
    var dataCameraLive = [];

    dataParam.map((obj, i) => {
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
          console.log("FFmpeg stderr: " + data);
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
          type: "image",
          imageFormat: "jpg",
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
          

            // Log the image path and capture time
            console.log("Captured image:", imagePath, "at", currentDate);

            // Wait for a delay before detecting faces
            await new Promise((resolve) => setTimeout(resolve, 5000)); // Adjust delay as needed

            // Load face-api.js models
            // await loadModels();

            // Perform face detection on the image
            // if (isMainThread) {
              // Create a new face detection worker
              const faceDetectionWorker = new Worker('./faceDetectionWorker.js');
              faceDetectionWorker.postMessage({ type: 'detectFaces', imagePath });
            
              // Listen for messages from the worker
              faceDetectionWorker.on('message', (message) => {
                if (message.type === 'detectionResult') {
                  // Handle the detection result received from the worker
                  const detectedFacesCount = message.detectedFacesCount;
                  console.log('Detected faces:', detectedFacesCount);
                  if (detectedFacesCount > 0) {
                    console.log("Face detected!");
      
                    // Convert the image to base64
                    const imageData = fs.readFileSync(imagePath, "base64");
      
                    // Now, you can proceed with your face comparison and API calls
                    faceCompareChina({
                      imageData: imageData,
                      deviceId : obj.deviceId,
                    });
                  } else {
                    console.log("No faces detected.");
                   
                  }
                
                }
              });
            
              // Send messages to the worker to trigger face detection
              // const imagePath = 'path/to/image.jpg';
            
              // Your other existing main thread code
              // ...
            // } else {
            //   // Worker Thread Code
            //   parentPort.on('message', (message) => {
            //     if (message.type === 'detectFaces') {
            //       const detectedFacesCount = detectFaces(message.imagePath);
            //       parentPort.postMessage({ type: 'detectionResult', detectedFacesCount });
            //       if (detectedFacesCount > 0) {
            //         console.log("Face detected!");
      
            //         // Convert the image to base64
            //         const imageData = fs.readFileSync(imagePath, "base64");
      
            //         // Now, you can proceed with your face comparison and API calls
            //         faceCompareChina({
            //           imageData: imageData,
            //           deviceId : obj.deviceId,
            //         });
            //       } else {
            //         console.log("No faces detected.");
                   
            //       }
            //     }
            //   });
            // }
            // const detectedFacesCount = await detectFaces(imagePath);
            // if (detectedFacesCount > 0) {
            //   console.log("Face detected!");

            //   // Convert the image to base64
            //   const imageData = fs.readFileSync(imagePath, "base64");

            //   // Now, you can proceed with your face comparison and API calls
            //   faceCompareChina({
            //     imageData: imageData,
            //     deviceId : obj.deviceId,
            //   });
            // } else {
            //   console.log("No faces detected.");
             
            // }
          } catch (error) {
            console.error("Error capturing and logging image:", error);
          }
        }

        setInterval(async () => {
          await captureAndLogImage();
        }, captureInterval);
      } catch (error) {
        console.error("An error occurred:", error);
      }
    });
  }

}

setInterval(() => {
  var result = findRemoveSync("./videos/stream", {
    age: { seconds: 30 },
    extensions: ".ts",
  });
  var result = findRemoveSync("./snapshots", {
    age: { seconds: 120 },
    extensions: ".jpg",
  });
  // console.log(result);
}, 5000);


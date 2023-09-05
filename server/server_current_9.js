Stream = require("node-rtsp-stream");
var moment = require("moment");
var axios = require("axios");
const { join, resolve } = require("path");
const findRemoveSync = require("find-remove");
const Recorder = require("node-rtsp-recorder").Recorder;
const fs = require("fs").promises;

const webSocketsServerPort = 4001;
const webSocketServer = require("websocket").server;
const http = require("http");

const faceapi = require("face-api.js");
const canvas = require("canvas");
const { Canvas, Image, ImageData } = canvas;
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

async function loadModels() {
  await faceapi.nets.ssdMobilenetv1.loadFromDisk("models");
  await faceapi.nets.faceLandmark68Net.loadFromDisk("models");
}

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
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "OPTIONS, POST, GET",
    "Access-Control-Max-Age": 2592000, // 30 days
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
var dateBefor1Day = new Date(DateNow);
dateBefor1Day.setDate(dateBefor1Day.getDate() - 1);

var dataStreamCamera = null;

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

function startLiveCamera(conn, params) {
  let dataParam = JSON.parse(params.listViewCameraData);

  console.log("param data", dataParam);

  if (dataParam.length > 0) {
    for (const obj of dataParam) {
      try {
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
            await loadModels();

            const fs = require("fs");
            const detectedFacesCount = await detectFaces(imagePath);
            if (detectedFacesCount > 0) {
              console.log("Face detected!");
              const imageData = fs.readFileSync(imagePath, "base64");
              faceCompareChina({
                imageData: imageData,
                deviceId: obj.deviceId,
              });
            } else {
              console.log("No faces detected.");
            }
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
    }
  }
}

setInterval(() => {
  var result = findRemoveSync("./videos/stream", {
    age: { seconds: 30 },
    extensions: ".ts",
  });
  var result = findRemoveSync("./snapshots", {
    age: { seconds: 300 },
    extensions: ".jpg",
  });
}, 5000);

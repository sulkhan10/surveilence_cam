const { join } = require("path");
const Recorder = require("node-rtsp-recorder").Recorder;
const FileHandler = require("rtsp-downloader").FileHandler;
const fs = require("fs");
const fh = new FileHandler();
Stream = require("node-rtsp-stream");
const webSocketsServerPort = 8000;
const webSocketServer = require("websocket").server;
const http = require("http");
const server = http.createServer();
server.listen(webSocketsServerPort);
console.log("Listening on port " + webSocketsServerPort);
const wsServer = new webSocketServer({
  httpServer: server,
});

var stream = null;
var StremDataLiveView = null;

// Generates unique ID for every new connection
const getUniqueID = () => {
  const s4 = () =>
    Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  return s4() + s4() + "-" + s4();
};

// I'm maintaining all active connections in this object
const clients = {};
// I'm maintaining all active users in this object
const users = {};
// The current editor content is maintained here.
let editorContent = null;
// User activity history.
let userActivity = [];

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
      // StartRecorder(conn, params);
    } else if (method === "disconnected") {
      StopCamera(conn, params);
    } else if (method === "startLiveView") {
      startLiveCamera(conn, params);
    } else if (method === "disconnectedLive") {
      StopCameraLive(conn, params);
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

function StreamCamera(conn, params) {
  console.log("parameter", params);
  var wsPortCamera = 6789;
  stream = new Stream({
    name: "defaultCamera",
    // streamUrl: "rtsp://YOUR_IP:PORT",
    streamUrl: params.url_rtsp,
    wsPort: wsPortCamera,
    ffmpegOptions: {
      // options ffmpeg flags
      "-f": "mpegts", // output file format.
      "-codec:v": "mpeg1video", // video codec
      "-b:v": "1000k", // video bit rate
      "-stats": "",
      "-r": 25, // frame rate
      "-s": "640x480", // video size
      "-bf": 0,
      // audio
      "-codec:a": "mp2", // audio codec
      "-ar": 44100, // sampling rate (in Hz)(in Hz)
      "-ac": 1, // number of audio channels
      "-b:a": "128k", // audio bit rate
    },
  });

  let res = {
    id: "startStreaming",
    result: params.url_rtsp,
    wsPort: wsPortCamera,
  };
  conn.send(JSON.stringify(res));
}

function StartRecorder(conn, params) {
  var rec = new Recorder({
    url: params.url_rtsp,
    timeLimit: 60 * 15, // 15 minutes
    folderSizeLimit: 5,
    folder: join(__dirname, "/videos/"),
    name: "defaultCamera",
    directoryPathFormat: "YYYY-MM-DD",
    fileNameFormat: "YYYY-M-D-h-mm-ss",
  });

  rec.startRecording();
  setTimeout(() => {
    console.log("Stopping Recording");
    rec.stopRecording();
    rec = null;
  }, 30000);
}

function StopCamera(conn, params) {
  if (stream !== null) {
    stream.stop();
    let res = {
      id: "stopJsmpeg",
      result: params,
    };
    conn.send(JSON.stringify(res));
  }
}

function StopCameraLive(conn, params) {
  console.log("cek ah deuh", StremDataLiveView);
  if (StremDataLiveView !== null) {
    StremDataLiveView.map((obj, idx) => {
      obj.LiveStream.stop();
    });
    // stream.stop();
  }
}

function startLiveCamera(conn, params) {
  let dataParam = params.listViewCameraData;
  if (dataParam.length > 0) {
    var dataCameraLive = [];
    dataParam.map((obj, i) => {
      var wsPortCamera = 7000 + i;
      console.log("cek port camera", wsPortCamera);
      stream = new Stream({
        name: obj.deviceName,
        streamUrl: obj.urlRTSP,
        wsPort: 7000 + i,
        ffmpegOptions: {
          // options ffmpeg flags
          "-f": obj.outputFileFormat, // output file format.
          "-codec:v": obj.videoCodec, // video codec
          "-b:v": obj.videoBitRate, // video bit rate
          "-stats": "",
          "-r": obj.frameRate, // frame rate
          "-s": obj.videoSize, // video size
          "-bf": 0,
          // audio
          "-codec:a": "mp2", // audio codec
          "-ar": 44100, // sampling rate (in Hz)(in Hz)
          "-ac": 1, // number of audio channels
          "-b:a": "128k", // audio bit rate
        },
      });
      dataCameraLive.push({ LiveStream: stream });
      console.log(dataCameraLive);

      StremDataLiveView = dataCameraLive;
      // console.log("cek stream all", streamAll);
    });
    let res = {
      id: "streamCameraList",
      result: dataParam,
      dataStream: StremDataLiveView,
    };
    conn.send(JSON.stringify(res));
  }
}

// (function () {
//   var rec = new Recorder({
//     url: "rtsp://admin:admin@192.168.0.102:554/11",
//     timeLimit: 60 * 15, // 15 minutes
//     folderSizeLimit: 5,
//     folder: join(__dirname, "/videos/"),
//     name: "cam1",
//     directoryPathFormat: "MMM-Do-YY",
//     fileNameFormat: "YYYY-M-D-h-mm-ss",
//   });

//   var rec2 = new Recorder({
//     url: "rtsp://admin:admin@192.168.0.102:554/11",
//     folder: join(__dirname, "/imgs/"),
//     name: "cam1",
//     type: "image",
//   });

//   rec.startRecording();
//   setTimeout(() => {
//     console.log("Stopping Recording");
//     rec.stopRecording();
//     rec = null;
//   }, 30000);

//   rec2.captureImage(() => {
//     console.log("Image Captured");
//   });
// })();

// stream = new Stream({
//   name: "Bunny",
//   // streamUrl: "rtsp://YOUR_IP:PORT",
//   streamUrl: "rtsp://admin:admin@192.168.0.102:554/11",
//   wsPort: 6789,
//   ffmpegOptions: {
//     // options ffmpeg flags
//     "-f": "mpegts", // output file format.
//     "-codec:v": "mpeg1video", // video codec
//     "-b:v": "1000k", // video bit rate
//     "-stats": "",
//     "-r": 25, // frame rate
//     "-s": "640x480", // video size
//     "-bf": 0,
//     // audio
//     "-codec:a": "mp2", // audio codec
//     "-ar": 44100, // sampling rate (in Hz)(in Hz)
//     "-ac": 1, // number of audio channels
//     "-b:a": "128k", // audio bit rate
//   },
// });

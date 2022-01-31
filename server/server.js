// import Recorder, { RecorderEvents } from "rtsp-video-recorder";
Stream = require("node-rtsp-stream");
var spawn = require("child_process").spawn;
const { join } = require("path");
const findRemoveSync = require("find-remove");
const Recorder = require("node-rtsp-recorder").Recorder;
const FileHandler = require("rtsp-downloader").FileHandler;
const fs = require("fs");
const fh = new FileHandler();

const webSocketsServerPort = 4000;
const webSocketServer = require("websocket").server;
const http = require("http");
const server = http.createServer(function (request, response) {
  console.log("request starting...", new Date());
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "OPTIONS, POST, GET",
    "Access-Control-Max-Age": 2592000, // 30 days

    /** add other headers as per requirement */
  };
  if (request.method === "OPTIONS") {
    respose.writeHead(204, headers);
    response.end();
    return;
  }
  var filePath = "./videos/stream" + request.url;
  console.log("cek filePath:", filePath);
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

var stream = null;
var StremDataLiveView = null;

var processHLS = null;

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
      // FFMPEGtestingDevice(conn, params);
      // StartRecorder(conn, params);
    } else if (method === "disconnected") {
      StopCamera(conn, params);
    } else if (method === "startLiveView") {
      startLiveCamera(conn, params);
    } else if (method === "disconnectedLive") {
      StopCameraLive(conn, params);
    } else if (method === "addStreaming") {
      FFMPEGstreamCamera(conn, params);
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

function FFMPEGstreamCamera(conn, params) {
  let dt = params.dataStream;
  var cmd_ffmpeg = "ffmpeg";
  var args_parameter = [
    "-i",
    dt.urlRTSP,
    "-fflags",
    "flush_packets",
    "-max_delay",
    "2",
    "-flags",
    "-global_header",
    "-hls_time",
    "5",
    "-hls_list_size",
    "3",
    "-r",
    dt.frameRate,
    "-s",
    dt.videoSize,
    "-vcodec",
    "copy",
    "-y",
    "./videos/stream/" + dt.IpAddress + "_.m3u8",
  ];

  processHLS = spawn(cmd_ffmpeg, args_parameter);

  processHLS.stdout.on("data", function (data) {
    console.log("cek data output", data);
  });

  processHLS.stderr.setEncoding("utf8");
  processHLS.stderr.on("data", function (data) {
    console.log(data);
  });

  processHLS.on("close", function () {
    console.log("finished");
  });
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

setInterval(() => {
  var result = findRemoveSync("./videos/stream", {
    age: { seconds: 30 },
    extensions: ".ts",
  });
  // console.log(result);
}, 5000);

// var cmd_ffmpeg = "ffmpeg";
// var args_parameter = [
//   "-i",
//   "rtsp://SIMCAM:RJCFCV@192.168.0.104/live",
//   "-fflags",
//   "flush_packets",
//   "-max_delay",
//   "5",
//   "-flags",
//   "-global_header",
//   "-hls_time",
//   "5",
//   "-hls_list_size",
//   "3",
//   "-vcodec",
//   "copy",
//   "-y",
//   "./videos/stream/rumah.m3u8",
// ];

// var processHLS = spawn(cmd_ffmpeg, args_parameter);

// processHLS.stdout.on("data", function (data) {
//   console.log("cek data output", data);
// });

// processHLS.stderr.setEncoding("utf8");
// processHLS.stderr.on("data", function (data) {
//   console.log("read data " + data);
// });

// processHLS.on("close", function (data) {
//   console.log("finished " + data);
// });

// var cmd_ffmpeg2 = "ffmpeg";
// var args_parameter2 = [
//   "-rtsp_transport",
//   "tcp",
//   "-i",
//   "rtsp://admin:admin@192.168.0.102:554/11",
//   "-r",
//   "10",
//   "-t",
//   "60",
//   "-vcodec",
//   "copy",
//   "-y",
//   "./videos/record/%Y%m%d-%H%M.mp4",
// ];

// var processHLS2 = spawn(cmd_ffmpeg2, args_parameter2);

// processHLS2.stdout.on("data", function (data) {
//   console.log("cek data output", data);
// });

// processHLS2.stderr.setEncoding("utf8");
// processHLS2.stderr.on("data", function (data) {
//   console.log(data);
// });

// processHLS2.on("close", function (data) {
//   console.log("finished" + data);
// });

// var cmd_ffmpeg2 = "ffmpeg";
// var args_parameter2 = [
//   "-i",
//   "rtsp://SIMCAM:RJCFCV@192.168.0.104/live",
//   "-fflags",
//   "flush_packets",
//   "-max_delay",
//   "5",
//   "-flags",
//   "-global_header",
//   "-hls_time",
//   "5",
//   "-hls_list_size",
//   "3",
//   "-vcodec",
//   "copy",
//   "-y",
//   "./videos/camera/192.168.0.104.m3u8",
// ];

// var processHLS2 = spawn(cmd_ffmpeg2, args_parameter2);

// processHLS2.stdout.on("data", function (data) {
//   console.log("cek data output", data);
// });

// processHLS2.stderr.setEncoding("utf8");
// processHLS2.stderr.on("data", function (data) {
//   console.log(data);
// });

// processHLS2.on("close", function () {
//   console.log("finished");
// });

var cmd_ffmpeg = "ffmpeg";
var args_parameter = [
  "-i",
  "rtsp://admin:admin@192.168.0.102:554/11",
  "-map",
  "0",
  "-fflags",
  "flush_packets",
  "-max_delay",
  "2",
  "-flags",
  "-global_header",
  "-hls_time",
  "3",
  "-hls_list_size",
  "3",
  "-vcodec",
  "copy",
  "-y",
  "./videos/stream/192.168.0.102_.m3u8",
  // "-i",
  // "rtsp://admin:admin@192.168.0.102:554/11",
  // "-map",
  // "1",
  // "-rtsp_transport",
  // "tcp",
  // "-r",
  // "10",
  // "-t",
  // "60",
  // "-vcodec",
  // "copy",
  // "-y",
  // "./videos/record/rec_192.168.0.102_.mp4",
];

var processHLS = spawn(cmd_ffmpeg, args_parameter);

processHLS.stdout.on("data", function (data) {
  console.log("cek data output", data);
});

processHLS.stderr.setEncoding("utf8");
processHLS.stderr.on("data", function (data) {
  console.log(data);
});

processHLS.on("close", function () {
  console.log("finished");
});

var cmd_ffmpeg2 = "ffmpeg";
var args_parameter2 = [
  "-i",
  "rtsp://SIMCAM:RJCFCV@192.168.0.104/live",
  "-map",
  "0",
  "-fflags",
  "flush_packets",
  "-max_delay",
  "2",
  "-flags",
  "-global_header",
  "-hls_time",
  "3",
  "-hls_list_size",
  "3",
  "-vcodec",
  "copy",
  "-y",
  "./videos/stream/192.168.0.104_.m3u8",
  // "-i",
  // "rtsp://SIMCAM:RJCFCV@192.168.0.104/live",
  // "-map",
  // "1",
  // "-fflags",
  // "flush_packets",
  // "-max_delay",
  // "2",
  // "-flags",
  // "-global_header",
  // "-hls_time",
  // "10",
  // "-hls_list_size",
  // "3",
  // "-vcodec",
  // "copy",
  // "-y",
  // "./videos/record/rec_192.168.0.104_.m3u8",
];

var processHLS2 = spawn(cmd_ffmpeg2, args_parameter2);

processHLS2.stdout.on("data", function (data) {
  console.log("cek data output", data);
});

processHLS2.stderr.setEncoding("utf8");
processHLS2.stderr.on("data", function (data) {
  console.log(data);
});

processHLS2.on("close", function () {
  console.log("finished");
});

// const recorder = new Recorder(
//   "rtsp://SIMCAM:RJCFCV@192.168.0.104/live",
//   "/videos/record",
//   {
//     title: "Test Camera",
//   }
// );

// var rec = new Recorder({
//   url: "rtsp://admin:admin@192.168.0.102:554/11",
//   timeLimit: 60 * 15, // 15 minutes
//   folderSizeLimit: 5,
//   folder: join(__dirname, "/videos/"),
//   name: "ipcamera",
//   directoryPathFormat: "YYYY-MM-DD",
//   fileNameFormat: "YYYY-MM-DD-hh-mm-ss",
// });

// rec.startRecording();
// setTimeout(() => {
//   console.log("Stopping Recording");
//   rec.stopRecording();
//   rec = null;
// }, 30000);

// recorder.on(RecorderEvents.STARTED, (payload) => {
//   assert.equal(payload, {
//     uri: "rtsp://admin:admin@192.168.0.102:554/11",
//     destination: "/media/Recorder",
//     playlist: "playlist.mp4",
//     title: "Test Camera",
//     filePattern: "%Y.%m.%d/%H.%M.%S",
//     segmentTime: 600,
//     noAudio: false,
//     ffmpegBinary: "ffmpeg",
//   });
// });

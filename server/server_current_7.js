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
const { dir } = require("console");
const { toMAC, toIP } = require("@network-utils/arp-lookup");
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
  // var filePath = "./videos/stream" + request.url;
  // console.log("cek filePath:", filePath);
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

var clientSMB = new SambaClient({
  address: "//192.168.0.117/camstorage",
  username: "camera",
  password: "Cideng87c",
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

function doGetIpAddresFromMacAddres(conn, params) {
  console.log("get state mac address:", params);
  getIpAddresFromMacAddres(params.mac_address)
    .then((response) => {
      console.log(response);
      if (response !== null || response !== undefined) {
        let res = {
          id: "result_ip_address",
          result: response,
        };
        conn.send(JSON.stringify(res));
      } else {
        let res = {
          id: "result_ip_address",
          result: "Null",
        };
        conn.send(JSON.stringify(res));
      }
    })
    .catch((err) => {
      console.log(err);
      let res = {
        id: "result_ip_address",
        result: "Error",
      };
      conn.send(JSON.stringify(res));
    });
}

function StreamCamera(conn, params) {
  console.log("parameter", params);
  var digits = "0123456789";
  let randomport = "";
  for (let i = 0; i < 3; i++) {
    randomport += digits[Math.floor(Math.random() * 10)];
  }
  var wsPortCamera = 6 + randomport;
  console.log("cek randomport", wsPortCamera);
  stream = new Stream({
    name: "defaultCamera",
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
  if (StreamDataLiveView !== null) {
    StreamDataLiveView.map((obj, idx) => {
      obj.LiveStream.stop();
    });
    stream.stop();
  }
}

var processHLS = null;

function startLiveCamera(conn, params) {
  let dataParam = JSON.parse(params.listViewCameraData);
    // let resultCameraData = [
    //   {
    //     deviceName: "Camera 1",
    //     urlRTSP: "rtsp://SIMCAM:EWVN1D@192.168.1.63/live",
    //     // outputFileFormat: "mp4",
    //     // videoCodec: "h264",
    //     // videoBitRate: "500k",
    //     // frameRate: 30,
    //     // videoSize: "1280x720",
    //     IpAddress: "192.168.1.63"
    //   }
    // ];
  
    console.log("param data", dataParam);
    
    if (dataParam.length>0) {
          var dataCameraLive = [];

      dataParam.map((obj, i) => {
        var pathStream = "./videos/stream/" + obj.IpAddress + "_.m3u8";
        // var cmd_ffmpeg = "ffmpeg";
        var cmd_ffmpeg = "/usr/local/bin/ffmpeg";
        // var cmd_ffmpeg = "/Users/bernard/Desktop/SimcamAdmin/server/ffmpeg";

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
  
        processHLS = spawn(cmd_ffmpeg, args_parameter);
  
        processHLS.stdout.on("data", function (data) {
          // console.log("cek data output", data);
        });
  
        processHLS.stderr.setEncoding("utf8");
        processHLS.stderr.on("data", function (data) {
          //console.log("read data " + data);
        });
  
        processHLS.on("close", function (data) {
          console.log("finished " + data);
          // processHLS = null;
          // rec.stopRecording();
          // saveCameraList(arrDataCamera, null);
        });
  
        // clientSMB.mkdir(obj.deviceName.replace(/\s/g, ""));
  
        // var rec = new Recorder({
        //   url: obj.urlRTSP,
        //   folder: join(__dirname, "/videos/record"),
        //   name: obj.deviceName.replace(/\s/g, ""),
        //   directoryPathFormat: "YYYYMMDD",
        //   fileNameFormat: "HHmmss",
        // });
        // rec.startRecording();
        
      });
    }
  }



setInterval(() => {
  var result = findRemoveSync("./videos/stream", {
    age: { seconds: 30 },
    extensions: ".ts",
  });
  // console.log(result);
}, 5000);

//==============GET DATA CAMERA FROM DATABASE==========================//
// axios({
//   method: "post",
//   url: webserviceurl + "/viewList.php",
//   data: {},
//   headers: {
//     "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
//   },
// })
//   .then((response) => {
//     // console.log("cek data camera List", response.data);
//     if (response.data.status === "OK") {
//       if (response.data.records.length > 0) {
//         (dataStreamCamera = response.data.records),
//           saveCameraList(response.data.records, null);
//       }
//     }
//   })
//   .catch((error) => {
//     console.log(error);
//   });
//=======================================================================//

async function getIpAddresFromMacAddres(mac_address) {
  try {
    const MAC = mac_address;
    const response = await toIP(MAC);
    return response;
  } catch (error) {
    throw error;
  }
}

function saveCameraList(dataCamera, newCamera) {
  console.log("=====START LIVE VIEW CAMERA=====");
  var arrDataCamera = dataCamera === null ? [] : dataCamera;
  if (newCamera !== null) {
    if (dataCamera !== null) {
      var resultCameraData = dataCamera.filter(
        (obj) => obj.IpAddress === newCamera.IpAddress
      );
    } else {
      var resultCameraData = [];
    }
    if (resultCameraData.length === 0) {
      arrDataCamera.push(newCamera);
      arrDataCamera.map((obj, i) => {
        var pathStream = "./videos/stream/" + obj.IpAddress + "_.m3u8";
        var cmd_ffmpeg = "/usr/local/bin/ffmpeg";
        // var cmd_ffmpeg = "ffmpeg";
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

        processHLS = spawn(cmd_ffmpeg, args_parameter);

        processHLS.stdout.on("data", function (data) {
          // console.log("cek data output", data);
        });

        processHLS.stderr.setEncoding("utf8");
        processHLS.stderr.on("data", function (data) {
          //console.log("read data " + data);
        });

        processHLS.on("close", function (data) {
          console.log("finished " + data);
          // processHLS = null;
          // rec.stopRecording();
          // saveCameraList(arrDataCamera, null);
        });

        // clientSMB.mkdir(obj.deviceName.replace(/\s/g, ""));

        // var rec = new Recorder({
        //   url: obj.urlRTSP,
        //   folder: join(__dirname, "/videos/record"),
        //   name: obj.deviceName.replace(/\s/g, ""),
        //   directoryPathFormat: "YYYYMMDD",
        //   fileNameFormat: "HHmmss",
        // });
        // rec.startRecording();
      });
    }
  } else {
    arrDataCamera = dataCamera;
    arrDataCamera.map((obj, i) => {
      var pathStream = "./videos/stream/" + obj.IpAddress + "_.m3u8";
      var cmd_ffmpeg = "ffmpeg";
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
        "-vcodec",
        "copy",
        "-y",
        pathStream,
      ];

      processHLS = spawn(cmd_ffmpeg, args_parameter);

      processHLS.stdout.on("data", function (data) {
        // console.log("cek data output", data);
      });

      processHLS.stderr.setEncoding("utf8");
      processHLS.stderr.on("data", function (data) {
        // console.log("read data " + data);
      });

      processHLS.on("close", function (data) {
        console.log("finished " + data);
        // processHLS = null;
        // rec.stopRecording();
        // saveCameraList(arrDataCamera, null);
      });

      var rec = new Recorder({
        url: obj.urlRTSP,
        folder: join(__dirname, "/videos/record"),
        name: obj.deviceName.replace(/\s/g, ""),
        directoryPathFormat: "YYYYMMDD",
        fileNameFormat: "HHmmss",
      });
      rec.startRecording();
    });
  }

  // setTimeout(function () {
  //   CreateFolderNAS(arrDataCamera);
  // }, 6000);

  // setTimeout(function () {
  //   console.log(
  //     "====START READ FILE CAMERA VIDEO RECORD FROM LOCAL SERVER===="
  //   );
  //   doReadFileFromLocal(arrDataCamera);
  // }, 120000);
}

function CreateFolderNAS(arrDataCamera) {
  if (arrDataCamera.length > 0) {
    arrDataCamera.forEach((obj) => {
      return cmdSmbClientMkdirNAS(obj.deviceName);
    });
  }
}

async function cmdSmbClientMkdirNAS(deviceName) {
  let createDir;
  try {
    createDir = await clientSMB.mkdir(
      deviceName.replace(/\s/g, "") + "/" + DateNow.replace(/-/g, "")
    );
  } catch (err) {
    console.log(err);
  }
}

function doReadFileFromLocal(arrDataCamera) {
  const basePath = "./videos/record";
  if (arrDataCamera.length > 0) {
    arrDataCamera.forEach((obj) => {
      const dirPath = "/" + obj.deviceName.replace(/\s/g, "");
      const datetime = "/" + DateNow.replace(/-/g, "") + "/video/";
      var fullPath = basePath + dirPath + datetime;
      return readFileLocal(fullPath, obj.deviceName);
    });
  }
}

async function readFileLocal(fullPath, DeviceName) {
  let files;
  try {
    files = await readdir(fullPath);
  } catch (err) {
    console.log(err);
  }
  if (files === undefined || files === null || files.length === 0) {
    console.log(
      "===== FILE FROM DIRECTORY EMPTY " + fullPath,
      files + " ====="
    );
  } else {
    console.log(
      "===== GET FILE FROM DIRECTORY PATH: " + fullPath,
      files + " ====="
    );
    return runCmdSendFileSmbClient(
      files.slice(0, -1),
      DeviceName.replace(/\s/g, ""),
      DateNow.replace(/-/g, "")
    );
  }
}

async function runCmdSendFileSmbClient(datafiles, deviceName, dateNow) {
  var dirPath =
    "/home/cideng87/ServerCamera/videos/record/" +
    deviceName +
    "/" +
    dateNow +
    "/video/" +
    ";";
  var sendPath = "/" + deviceName + "/" + dateNow + ";";

  var fullPathRemove =
    "/home/cideng87/ServerCamera/videos/record/" +
    deviceName +
    "/" +
    dateNow +
    "/video/";

  console.log("SEND ALL FILE TO NAS STORAGE" + dirPath, datafiles);
  if (datafiles.length > 0) {
    let stdout;
    let stderr;
    datafiles.map(async (file, i) => {
      try {
        stdout,
          (stderr = await exec(
            "smbclient -U camera '//192.168.0.117/camstorage' Cideng87c --command" +
              " 'cd " +
              sendPath +
              " lcd " +
              dirPath +
              " put " +
              file +
              "'"
          ));
        console.log("stdout:", stdout);
        console.log("stderr:", stderr);
        if (stderr.stderr !== "") {
          return doRemoveFile(fullPathRemove, file);
        }
      } catch (e) {
        console.error(e);
      }
    });
  }
}

async function doRemoveFile(dirPath, file) {
  let removeFile;
  try {
    removeFile = await unlink(dirPath + file);
  } catch (err) {
    console.log(err);
  }
  if (removeFile !== undefined || removeFile !== null || removeFile !== "") {
    console.log("DONE, REMOVE FILE FROM LOCAL: " + dirPath + file);
  }
}

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
// const fs = require("fs");
const fs = require("fs").promises;
const { Worker, isMainThread, parentPort } = require('worker_threads');


const readdir = util.promisify(fs.readdir);
const unlink = util.promisify(fs.unlink);
const fh = new FileHandler();
const SambaClient = require("samba-client");
const webSocketsServerPort = 4000;
const webSocketServer = require("websocket").server;
const http = require("http");
const { dir } = require("console");
const { toMAC, toIP } = require("@network-utils/arp-lookup");

parentPort.on('message', async (message) => {
    if (message.command === 'startCameras') {
      try {
        // Start camera processing using message.cameraParams
        await startCameraProcessing(message.cameraParams);
  
        // parentPort.postMessage({ status: 'completed' });
      } catch (error) {
        console.error('Error in worker:', error);
        parentPort.postMessage({ status: 'error', error: error.message });
      }
    }
  });

async function startCameraProcessing(cameraParams) {
    const { urlRTSP, IpAddress } = cameraParams;
  
    const pathStream = join(
      __dirname,
      `./videos/stream/${IpAddress}_.m3u8`
    );
    const cmd_ffmpeg = '/usr/local/bin/ffmpeg';
  
    const args_parameter = [
      '-i',
      urlRTSP,
      '-fflags',
      'flush_packets',
      '-max_delay',
      '2',
      '-flags',
      '-global_header',
      '-hls_time',
      '2',
      '-hls_list_size',
      '3',
      '-vcodec',
      'copy',
      '-y',
      pathStream,
    ];
  
    // Rest of your camera processing logic here
    const processHLS = spawn(cmd_ffmpeg, args_parameter);
    
    processHLS.stderr.setEncoding("utf8");
    processHLS.stderr.on("data", function (data) {
      console.log("FFmpeg stderr: " + data);
    });

    processHLS.on("close", function (code) {
      console.log("FFmpeg process closed with code " + code);
    });

  }
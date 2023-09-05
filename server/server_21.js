const spawn = require("child_process").spawn;
const { join } = require("path");
const cv2 = require("opencv4nodejs");

async function startLiveCamera() {
  const resultCameraData = [
    {
      deviceName: "soeta1",
      urlRTSP: "rtsp://SIMCAM:VK6SXA@192.168.1.120/live",
      IpAddress: "192.168.1.120",
    },
  ];

  console.log("resultCameraData", resultCameraData);

  for (const obj of resultCameraData) {
    const pathStream = join(
      __dirname,
      `./videos/stream/${obj.IpAddress}_.m3u8`
    );
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
      "-c:v",
      "libx264",
      "-f",
      "image2pipe", // Output frames as images to pipe
      "-",
    ];

    try {
      const processHLS = spawn(cmd_ffmpeg, args_parameter);

      processHLS.stdout.on("data", function (data) {
        const frame = cv2.imdecode(data);
        if (frame) {
          // Perform face detection on the frame
          const classifier = new cv2.CascadeClassifier(cv2.HAAR_FRONTALFACE_ALT2);
          const faces = classifier.detectMultiScale(frame);

          if (faces.length > 0) {
            console.log("Face detected!");
          }
        }
      });

      processHLS.on("close", function (code) {
        console.log("FFmpeg process closed with code " + code);
      });
    } catch (error) {
      console.error("An error occurred:", error);
    }
  }
}

startLiveCamera();

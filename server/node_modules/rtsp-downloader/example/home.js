const {join} = require('path');
const Recorder = require('../lib/index').Recorder
const FileHandler = require('../lib/index').FileHandler;
const fs = require('fs');

const fh = new FileHandler();

(function(){

  var rec = new Recorder({
    url: 'rtsp://admin:hello1234@192.168.0.112:554/h264/ch1/sub/av_stream',
    timeLimit: 60 * 15, // 15 minutes
    folderSizeLimit : 30,
    folder: join(__dirname , '/videos/'),
    name: 'cam1',
  });

  rec.startRecording();

})();

// vim:ts=2:sw=2:sts=2

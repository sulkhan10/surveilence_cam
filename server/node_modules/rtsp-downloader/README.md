# rtsp-downloader

![](https://nodei.co/npm/rtsp-downloader.png?downloads=true&downloadRank=true&stars=true)

@auther jayli

Records RTSP Audio/Visual Streams to local disk using ffmpeg. Make sure [ffmpeg](http://ffmpeg.org/) is installed.

### Install

    npm i --save rtsp-downloader

### Run test script

Local script:`../example/home.js` or run:

    npm start

### Usegae

    const Recorder = require('rtsp-downloader').Recorder
    const FileHandler = require('rtsp-downloader').FileHandler;

### Example

    const Recorder = require('rtsp-downloader').Recorder

    var rec = new Recorder({
        url: 'rtsp://192.168.1.12:8554/unicast',
        timeLimit: 60, // time in seconds for each segmented video file
        folder: '/Users/tmp/videos',
        folderSizeLimit : 10, // 10 G
        name: 'cam1',
    })
    // Starts Recording
    rec.startRecording();

### Recording Audio

    const Recorder = require('rtsp-downloader').Recorder

    var rec = new Recorder({
        url: 'rtsp://192.168.1.12:8554/unicast',
        timeLimit: 60, // time in seconds for each segmented video file
        folder: '/Users/tmp/videos',
        name: 'cam1',
        type: 'audio',
    })

    rec.startRecording();

    // stop recording
    setTimeout(() => {
        console.log('Stopping Recording')
        rec.stopRecording()
        rec = null
    }, 125000)

### Capturing Image

    const Recorder = require('rtsp-downloader').Recorder

    var rec = new Recorder({
        url: 'rtsp://192.168.1.12:8554/unicast',
        folder: '/Users/tmp/imgs/',
        name: 'cam1',
        type: 'image',
    })

    rec.captureImage(() => {
        console.log('Image Captured')
    })

### Managing Media Directory

    const FileHandler = require('rtsp-downloader').FileHandler;
    const fh = new FileHandler()

    // RETURNS DIRECTORY SIZE
    fh.getDirectorySize('/Users/tmp/videos/', (err, value) => {
        if (err) {
            console.log('Error Occured')
            console.log(err)
            return true
        }
        console.log('Folder Size is ' + value)
    })

    // REMOVES ALL MEDIA FILES
    fh.removeDirectory('/Users/tmp/videos/*', () => {
        console.log('Done')
    });

### Setting custom filename formats

    const Recorder = require('rtsp-downloader').Recorder

    var rec = new Recorder({
        url: 'rtsp://192.168.1.12:8554/unicast',
        timeLimit: 60, // time in seconds for each segmented video file
        folder: '/Users/tmp/videos',
        name: 'cam1',
        directoryPathFormat: 'MMM-D-YYYY',
        fileNameFormat: 'M-D-h-mm-ss',
    });

    // Default directoryPathFormat : MMM-Do-YY
    // Default fileNameFormat : YYYY-M-D-h-mm-ss
    // Refer to https://momentjscom.readthedocs.io/en/latest/moment/04-displaying/01-format/
    //  for custom formats.
    // Starts Recording
    rec.startRecording();

const FaceApiRtspStream = require('fvi-node-face-api-rtsp-stream');
// const RtspStream = require('node-rtsp-stream'); // Make sure you have 'node-rtsp-stream' installed via npm

const instance = new FaceApiRtspStream({
    name: 'ID',
    url: 'rtsp://SIMCAM:VK6SXA@192.168.1.120/live',
    port: 554,
    scoreThreshold: 0.5, // Changed 'score' to 'scoreThreshold'

});

instance.on('error', e => console.error(e));
instance.on('warn', message => console.log(message));
instance.on('data', event => console.log(event));
instance.on('detect', event => console.log(event));
instance.on('start', event => console.log(event));
instance.on('stop', event => console.log(event));

instance.start()
    .then(res => console.log('Initialized'))
    .catch(e => console.error(e));

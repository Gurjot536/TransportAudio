/* Frontend that receives audio data in websocket and plays it */
var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
var sampleRate = 44100;
var channels = 2;
var packetsBeforePlay = 3;
var bufferTime = (2048/sampleRate) * packetsBeforePlay;
var myArrayBuffer;


var localhost = '192.168.1.72'
var wsPort = 8000;
var counter = 0;

//opens new websocket and receives the blob of audio data from receiver.js
var openSocket = () => {
    var ws = new WebSocket(`ws://${localhost}:${wsPort}/`);
    var lastTime = Date.now();
    ws.addEventListener('message', event =>{
        event.data.arrayBuffer().then(buffer=>{
            var input = new Int16Array(buffer);
            if(counter == 0){
                myArrayBuffer = audioCtx.createBuffer(channels, bufferTime * sampleRate, sampleRate);
            }
            for (var channel = 0; channel < channels; channel++) {
                var nowBuffering = myArrayBuffer.getChannelData(channel);
                for (var i = 0; i < input.length/channels; i++) {
                    nowBuffering[i+(input.length/channels)*counter] = input[(channels-channel-1)+channels*i]/32767;
                }
            }
            lastTime = Date.now();
            counter++;
            if(counter == packetsBeforePlay){
                //play audio
                var source = audioCtx.createBufferSource();
                source.buffer = myArrayBuffer;
                source.connect(audioCtx.destination);
                source.start();
                counter = 0;
            }
        });
    });

    ws.addEventListener('open',()=> {
        var clear = setInterval(()=>{
            //if downtime detected, create new websocket
            if((Date.now() - lastTime) > 100){
                ws.close();
                openSocket();
                clearInterval(clear);
            }
        }, 2000);
    });
};

openSocket();
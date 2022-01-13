/* Receives audio data in udp socket and forwards it to frontend*/
const path = require('path');
const udp = require('dgram');
const ws = require('ws');
const express = require('express');


const serverName = '192.168.1.72';
const serverPort = 12000;
const port = 3000;
const wsPort = 8000;
const clientApp = path.join(__dirname, 'client');

let app = express();
app.use('/',express.static(clientApp, {extensions: ['html']}));
app.listen(port, () => {
	console.log(`App Started. Listening on ${serverName}:${port}, serving ${clientApp}`);
});
const wSocket = new ws.Server({port: wsPort});

var rec = udp.createSocket('udp4');
rec.bind(serverPort);

wSocket.on('connection', (ws, req)=>{
    console.log('Web Socket is open');
    console.log('Number of sockets: '+wSocket.clients.size);
    rec.on('message', (msg, info)=>{
        ws.send(msg);
    });
});
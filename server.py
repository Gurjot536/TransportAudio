#records audio using pyaudio and transmits it using UDP socket
#commented line refer to directly creating a websocket to the frontend (latency is an issue)
#also requires the Stereo Mix audio driver
import pyaudio
import socket
from socket import AF_INET, SOCK_DGRAM
#import asyncio
#import websockets

chunk = 2048
sample_format = pyaudio.paInt16
channels = 2
fs = 44100

serverName = socket.gethostbyname_ex(socket.getfqdn())[2][1]
print(serverName)
serverPort = 12000
wsPort = 8000

p = pyaudio.PyAudio()
serverSocket = socket.socket(AF_INET, SOCK_DGRAM)

dev_index = 0

for i in range(p.get_device_count()):
    dev = p.get_device_info_by_index(i)
    if (dev['name'] == 'Stereo Mix (Realtek(R) Audio)' and dev['hostApi'] == 0):
        dev_index = dev['index']

stream = p.open(format = sample_format,
                channels = channels,
                rate = fs,
                input = True,
                input_device_index = dev_index,
                frames_per_buffer = chunk)

#directly sending through websocket, better quality but bad latency
#async def routine(websocket):
#    while True:
#        await websocket.send(stream.read(chunk))
#
#start_server = websockets.serve(routine, serverName, wsPort)
#asyncio.get_event_loop().run_until_complete(start_server)
#asyncio.get_event_loop().run_forever()

#send data over udp socket
while True:
    data = stream.read(chunk)
    serverSocket.sendto(data, (serverName, serverPort))
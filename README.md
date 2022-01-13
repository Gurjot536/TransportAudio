# Audio Transport

Audio Transport allows you take your computer's audio output and stream it across your local network. 

## Requirements

- Realtek's Stereo Mix is required to get the computer's audio as an input device
- Python 3.8
- Node.js 16.13.2
- PyAudio module for Python
- Dependencies listed in package.json for Node.js
- Windows 


## Installation

1) Install the dependencies for Node.js and PyAudio module for Python.
2) Make sure Stereo Mixer is enabled. This [tutorial](https://www.youtube.com/watch?v=Bd3moKLV5sE) is helpful for enabling it or installing the codec if your PC doesn't have it.
3) Set local machine's IP address in `receiver-frontend.js`. It can be found in Windows Settings or when you run the Python program, it will print out the machine's IP address.
4) First run the Node.js server in root directory by running the following command in cmd:
```sh
node receiver.js
```
5. Then on the device you would like to listen to the audio, navigate to a web browser and enter the IP address of the local machine followed by the port number of Node.js application. An example is shown below:
```sh
10.0.0.7:3000
```
6. Finally, run the python server by entering the following command in root directory:
```sh
python server.py
```
7. Now the audio should on the desired device! Note: The audio is transmitted correctly only to a single device at the moment.

## Options
- There is tradeoff between seamless audio and latency. For example, to increase the seamlessness of the audio, the variable `packetsBeforePlay` can be increased in receiver-frontend.js file. This variable is essentially stores specified amount of audio packets before playing them
- There is also the option of directly connecting the websocket in python to the frontend. This code is commented out in `server.py`. The audio quality of this is decent, however there is significant latency. 
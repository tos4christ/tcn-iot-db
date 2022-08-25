import openSocket from 'socket.io-client';
// start the client socket
// TCN NAS Server
const socket = openSocket('https://tcnnas.org');

export default socket;

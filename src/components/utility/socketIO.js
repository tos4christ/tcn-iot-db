import openSocket from 'socket.io-client';
// start the client socket
// TCN NAS Server
const socket = openSocket('https://tcnnas.org', {
    // transports: ['websocket'],
    // secure: true,
    // rejectUnauthorized: true,
    // reconnect: true,
    auth: {
        token: localStorage.getItem('token')
    }
});

export default socket;

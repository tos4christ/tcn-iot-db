import openSocket from 'socket.io-client';
// start the client socket
// TCN NAS Server
const socket = openSocket('https://nisonas.org', {
    transports: ['websocket'],
    secure: true,
    // rejectUnauthorized: true,
    // reconnect: true,
    // The default (true) silently closes the socket when leaving the page, so a page restored
    // with Back/Forward thinks it is still connected and never reconnects.
    closeOnBeforeunload: false,
    auth: {
        token: localStorage.getItem('token')
    }
});

// A page restored from the Back-Forward Cache has had its connection closed by the browser: reconnect it.
window.addEventListener('pageshow', (e) => {
    if (e.persisted) {
        socket.disconnect();
        socket.connect();
    }
});

export default socket;

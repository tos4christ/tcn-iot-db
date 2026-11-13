/**
 * Live data helpers for the *_fix pages, on top of the app's single shared socket.
 *
 * scopedSocket(): socket.off('event') on the shared socket removes EVERY page's listener for that
 * event. A scoped socket remembers the handlers it added and removes only those.
 */
import { useEffect, useState } from 'react';
import socket from '../utility/socketIO';

// Fix 4: the shared socket was given `auth: { token }` once, when the app loaded, so it kept
// presenting the token from before sign-in (or after sign-out). As a function it is read on every
// (re)connect. The server session itself travels in the HttpOnly cookie of the handshake.
socket.auth = (cb) => {
  let token = null;
  try { token = localStorage.getItem('token'); } catch (e) { /* storage blocked */ }
  cb({ token });
};

export function scopedSocket() {
  let subs = [];
  return {
    socket,
    on(event, handler) {
      socket.on(event, handler);
      subs.push([event, handler]);
    },
    /** Removes this page's handlers for one event (all of them if no event is given). */
    off(event) {
      subs = subs.filter(([e, h]) => {
        if (event !== undefined && e !== event) return true;
        socket.off(e, h);
        return false;
      });
    },
    offAll() { this.off(); },
  };
}

/**
 * JSON.parse that skips a bad message instead of throwing out of the socket handler. It is
 * reported at most once a minute per channel, so a faulty meter cannot flood the console.
 */
const lastWarned = {};
export function parseMessage(raw, label = 'socket') {
  try {
    return typeof raw === 'string' ? JSON.parse(raw) : raw;
  } catch (e) {
    const now = Date.now();
    if (!lastWarned[label] || now - lastWarned[label] > 60000) {
      lastWarned[label] = now;
      console.warn(`Skipped a malformed ${label} message (${e.message}); further ones are skipped quietly for a minute.`);
    }
    return null;
  }
}

/**
 * The browser sends the session cookie when the socket connects. A socket opened before signing
 * in (or out) still carries the old identity, so reconnect it to present the current one.
 */
export function reconnectSocket() {
  socket.disconnect();
  socket.connect();
}

/** true while the shared socket is connected. */
export function useSocketConnected() {
  const [connected, setConnected] = useState(socket.connected);
  useEffect(() => {
    const live = scopedSocket();
    live.on('connect', () => setConnected(true));
    live.on('disconnect', () => setConnected(false));
    setConnected(socket.connected);
    return () => live.offAll();
  }, []);
  return connected;
}

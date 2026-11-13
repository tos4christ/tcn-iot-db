/**
 * Who is signed in, for the *_fix pages. The server decides (GET /auth2/me with the HttpOnly
 * session cookie); the browser keeps no "isLoggedIn" flag that could be edited by hand.
 * Also sends the activity trail (pages opened, queries, downloads) to /auth2/activity.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { api } from './fixApi';
import { reconnectSocket } from './live';

export const SIGNIN_PATH = { ncc: '/signin_fix', bilateral: '/bilateral_signin_fix' };

// ---- activity trail --------------------------------------------------------------------------
let queue = [];
let timer = null;
function flush(keepalive = false) {
  if (!queue.length) return;
  const events = queue.splice(0, 50);
  fetch('/auth2/activity', {
    method: 'POST',
    credentials: 'same-origin',
    keepalive,
    headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'nas-fix' },
    body: JSON.stringify({ events }),
  }).catch(() => { /* the trail is best effort; never disturb the page */ });
}
if (typeof window !== 'undefined') {
  window.addEventListener('pagehide', () => flush(true));
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') flush(true); });
}
/** Records something the user did. action: page_view | query | download | export | view_detail | ui */
export function track(action, detail, path = window.location.pathname) {
  queue.push({ action, path, detail });
  if (queue.length >= 20) flush();
  else if (!timer) timer = setTimeout(() => { timer = null; flush(); }, 10000);
}

// ---- session ---------------------------------------------------------------------------------
/**
 * { status: 'loading' | 'ready' | 'denied' | 'error', user, error, signOut }
 * realms: realms allowed on this page. kiosk: page one / two wall screens (sign-in asks for a
 * session that never expires; no sign-out button).
 */
export function useSession({ realms = ['ncc'], kiosk = false } = {}) {
  const history = useHistory();
  const location = useLocation();
  const [state, setState] = useState({ status: 'loading', user: null, error: null });
  const alive = useRef(true);
  const realmKey = realms.join(',');

  const toSignIn = useCallback(() => {
    const next = encodeURIComponent(location.pathname + location.search);
    history.replace(`${SIGNIN_PATH[realms[0]] || SIGNIN_PATH.ncc}?next=${next}${kiosk ? '&kiosk=1' : ''}`);
  }, [history, location.pathname, location.search, realmKey, kiosk]); // eslint-disable-line react-hooks/exhaustive-deps

  const check = useCallback(async (first) => {
    try {
      const data = await api('/auth2/me');
      if (!alive.current) return;
      if (!realms.includes(data.user.realm)) {
        setState({ status: 'denied', user: data.user, error: 'This account cannot open this page.' });
        return;
      }
      setState({ status: 'ready', user: data.user, error: null });
    } catch (err) {
      if (!alive.current) return;
      if (err.status === 401) toSignIn();
      // A network or server hiccup: keep showing the page (wall screens must not drop to a
      // sign-in form because of a brief outage); only the first check shows an error.
      else if (first) setState({ status: 'error', user: null, error: err.message });
    }
  }, [toSignIn, realmKey]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    alive.current = true;
    check(true);
    const i = setInterval(() => check(false), 5 * 60000); // notices sign-out elsewhere or a revoke
    return () => { alive.current = false; clearInterval(i); };
  }, [check]);

  const signOut = useCallback(async () => {
    flush(true);
    try { await api('/auth2/signout', { method: 'POST' }); } catch (e) { /* cookie is cleared by the server when reachable */ }
    reconnectSocket();
    history.replace(SIGNIN_PATH[realms[0]] || SIGNIN_PATH.ncc);
  }, [history, realmKey]); // eslint-disable-line react-hooks/exhaustive-deps

  return { ...state, signOut, retry: () => check(true) };
}

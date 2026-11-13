/**
 * /signin_fix and /bilateral_signin_fix: sign-in checked and kept by the server.
 * Same accounts and passwords as /signin and /bilateral_signin (users / bilateral_users tables).
 * ?next=/path returns there after signing in; ?kiosk=1 (grid page one / two) creates a wall-screen
 * session that never expires.
 */
import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import nisoLogo from '../../assets/img/niso_logo_main.jpg';
import '../GencoPortal/genco_portal.css';
import './fix.css';
import { api } from './fixApi';
import { reconnectSocket } from './live';

const HOME = { ncc: '/home_fix', bilateral: '/sp_bilateral_fix' };

/** Only paths inside this site, so a crafted link cannot send people elsewhere after sign-in. */
function safeNext(v, realm) {
  return typeof v === 'string' && /^\/[A-Za-z0-9_\-/?=&%.]*$/.test(v) && !v.startsWith('//') ? v : HOME[realm];
}

export default function SignInFix({ realm = 'ncc' }) {
  const history = useHistory();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const next = safeNext(params.get('next'), realm);
  const kiosk = realm === 'ncc' && params.get('kiosk') === '1';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [caps, setCaps] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [current, setCurrent] = useState(null);

  useEffect(() => {
    let alive = true;
    api('/auth2/me').then((d) => { if (alive) setCurrent(d.user); }).catch(() => {});
    return () => { alive = false; };
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      await api('/auth2/signin', { method: 'POST', body: { email: email.trim(), password, realm, kiosk } });
      reconnectSocket(); // present the new session on the live connection too
      history.replace(next);
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  };
  const signOutFirst = async () => {
    try { await api('/auth2/signout', { method: 'POST' }); } catch (e) { /* ignore */ }
    reconnectSocket();
    setCurrent(null);
  };

  return (
    <div className="gx-root gx-login">
      <div className="gx-login-art">
        <div className="gx-login-grid" />
        <div className="gx-login-copy">
          <img src={nisoLogo} alt="NISO" />
          <h2>{realm === 'bilateral' ? 'Bilateral customer data' : 'NISO IoT, National Control Centre'}</h2>
          <p>{realm === 'bilateral' ? 'Hourly readings of the bilateral customers.' : 'Live station readings, history, availability and reports.'}</p>
          <ul>
            <li>{kiosk ? 'This wall screen stays signed in; an administrator can end it from the audit page.' : 'Your sign-in is kept by the server and ends when you sign out.'}</li>
            <li>Sign-ins, sign-outs and reports are recorded for audit.</li>
          </ul>
        </div>
      </div>
      <form className="gx-login-card" onSubmit={submit}>
        <img src={nisoLogo} alt="NISO" className="gx-login-logo" />
        <div>
          <span className="gx-eyebrow">{kiosk ? 'Wall screen sign-in' : realm === 'bilateral' ? 'Bilateral sign-in' : 'NCC sign-in'}</span>
          <h1>Sign in</h1>
        </div>
        {kiosk && <p className="fx-warn">This screen will stay signed in until an administrator ends it from the audit page.</p>}
        {current && (
          <p className="fx-ok">
            Signed in as {current.name || current.email}.{' '}
            <button type="button" className="gx-btn" style={{ padding: '4px 10px', fontSize: 13 }} onClick={() => history.replace(next)}>Continue</button>{' '}
            <button type="button" className="gx-btn" style={{ padding: '4px 10px', fontSize: 13 }} onClick={signOutFirst}>Use another account</button>
          </p>
        )}
        <label className="gx-field">
          <span>E-mail</span>
          <input type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Your e-mail address" required autoFocus />
        </label>
        <label className="gx-field">
          <span>Password</span>
          <div className="gx-pass">
            <input type={show ? 'text' : 'password'} autoComplete="current-password" value={password} placeholder="Your password"
              onChange={(e) => setPassword(e.target.value)}
              onKeyUp={(e) => setCaps(e.getModifierState && e.getModifierState('CapsLock'))} required />
            <button type="button" onClick={() => setShow(!show)} aria-label={show ? 'Hide password' : 'Show password'}>{show ? 'Hide' : 'Show'}</button>
          </div>
        </label>
        {caps && <p className="fx-warn">Caps Lock is on.</p>}
        {error && <p className="gx-error" role="alert">{error}</p>}
        <button type="submit" className="gx-btn gx-btn-primary" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</button>
        <p className="gx-fine">Forgotten password? Ask the NISO IoT administrator to reset it.</p>
      </form>
    </div>
  );
}

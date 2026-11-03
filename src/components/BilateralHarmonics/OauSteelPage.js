/**
 * /oau_steel_bilaterals: OAU's own page behind a keypad. Shows the live table and the full
 * harmonic analysis for OAU only, with no links into the rest of the platform.
 *
 * The password is not stored here in plain text, only a SHA-256 fingerprint of
 * "niso-bilateral:oau_steel:{password}". To change it:
 *   node -e "console.log(require('crypto').createHash('sha256').update('niso-bilateral:oau_steel:NEWPASSWORD').digest('hex'))"
 * and paste the result into PASSWORD_HASH. This is a browser-only check, like the Genco portal.
 */
import React, { useEffect, useRef, useState } from 'react';
import nisoLogo from '../../assets/img/niso_logo_main.jpg';
import { sha256Hex } from '../GencoPortal/gencoAuth';
import '../GencoPortal/genco_portal.css';
import './harmonics.css';
import BilateralTable from './BilateralTable';
import { StationAnalysis } from './HarmonicsDashboard';
import { stationBySlug } from './harmonicsConfig';
import { harmonicsStore, stationKey } from './harmonicsStore';

const PASSWORD_HASH = '7442534caa3a1e409f6363c858f776b2594d63a755297e2bfa83a9f1cb962ec1';
const SESSION_KEY = 'niso.bilateral.session.oau_steel';
const SESSION_MS = 12 * 3600 * 1000;
const MAX_DIGITS = 12;

function hasSession() {
  try {
    const at = Number(sessionStorage.getItem(SESSION_KEY));
    return Boolean(at) && Date.now() - at < SESSION_MS;
  } catch (e) {
    return false;
  }
}

function Keypad({ onUnlock }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [fails, setFails] = useState(0);
  const inputRef = useRef(null);

  const submit = async () => {
    if (!pin || busy) return;
    setBusy(true);
    setError('');
    // Slow down repeated guesses.
    if (fails >= 3) await new Promise((r) => setTimeout(r, Math.min(8000, 1000 * 2 ** (fails - 3))));
    const ok = (await sha256Hex(`niso-bilateral:oau_steel:${pin}`)) === PASSWORD_HASH;
    setBusy(false);
    if (ok) { onUnlock(); return; }
    setFails((f) => f + 1);
    setError('Incorrect password');
    setPin('');
    if (inputRef.current) inputRef.current.focus();
  };
  const press = (d) => { setError(''); setPin((p) => (p.length < MAX_DIGITS ? p + d : p)); };
  const back = () => setPin((p) => p.slice(0, -1));

  // Number keys pressed while focus is on the keypad; typing in the field is handled by the field.
  useEffect(() => {
    const onKey = (e) => {
      if (e.target === inputRef.current || (e.key === 'Enter' && e.target.tagName === 'BUTTON')) return;
      if (/^\d$/.test(e.key)) press(e.key);
      else if (e.key === 'Backspace') back();
      else if (e.key === 'Enter') submit();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  return (
    <div className="gx-root hx-pin-screen">
      <form className="hx-pin-card" onSubmit={(e) => { e.preventDefault(); submit(); }}>
        <img src={nisoLogo} alt="NISO" />
        <span className="gx-eyebrow">Bilateral portal</span>
        <h1>Zenith Power 132 kV TS</h1>
        <p className="gx-muted">Enter your password to view this page.</p>
        <div className="hx-pin-dots" aria-label={`${pin.length} digits entered`}>
          {Array.from({ length: Math.max(9, pin.length) }, (_, i) => <span key={i} className={i < pin.length ? 'on' : ''} />)}
        </div>
        <input ref={inputRef} className="hx-sr" type="password" inputMode="numeric" autoComplete="off" autoFocus aria-label="Password"
          value={pin} onChange={(e) => { setError(''); setPin(e.target.value.replace(/\D/g, '').slice(0, MAX_DIGITS)); }} />
        {error && <div className="gx-error" role="alert">{error}</div>}
        <div className="hx-pin-pad">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((d) => <button key={d} type="button" onClick={() => press(d)}>{d}</button>)}
          <button type="button" className="ghost" onClick={back} aria-label="Delete last digit">⌫</button>
          <button type="button" onClick={() => press('0')}>0</button>
          <button type="submit" className="go" disabled={!pin || busy} aria-label="Unlock">{busy ? '…' : 'OK'}</button>
        </div>
        <p className="gx-fine">Nigerian Independent System Operator · National Control Centre</p>
      </form>
    </div>
  );
}

function OauView({ onSignOut }) {
  const [, setTick] = useState(0);
  useEffect(() => {
    harmonicsStore.start();
    const t = setInterval(() => setTick((n) => n + 1), 3000);
    return () => clearInterval(t);
  }, []);
  const cfg = stationBySlug('zenith-power-132-kv-ts');
  const entry = harmonicsStore.stations().find((e) => e.cfg === cfg) || { key: stationKey(cfg.id, cfg.line), cfg, samples: [] };
  const a = harmonicsStore.analysis(entry);
  const s = a.lastLiveSample || a.last || null;
  const data = s ? { id: cfg.id, lines: [{ id: cfg.line, td: { mw: s.mw, a: s.a, v: s.v, thdv: s.thdv, thdia: s.ia, thdib: s.ib, thdic: s.ic } }] } : null;
  const rows = [{ sn: 1, label: 'Zenith Power 132 kV TS', status: a.live ? 'live' : 'off', mw: s ? s.mw : null, kv: s ? s.v : null, data }];
  return (
    <div className="gx-root">
      <BilateralTable title="Zenith Power 132 kV TS" eyebrow="Bilateral portal" tableTitle="Live readings" rows={rows} total={a.live && s && s.mw ? s.mw : 0} totalLabel="Total load"
        actions={<button type="button" className="gx-btn gx-btn-ghost" onClick={onSignOut}>Sign out</button>} />
      <main className="gx-main hx-under"><StationAnalysis entry={entry} /></main>
    </div>
  );
}

export default function OauSteelPage() {
  const [unlocked, setUnlocked] = useState(hasSession);
  useEffect(() => { document.title = 'Zenith Power 132 kV TS · NISO'; }, []);
  const set = (value) => {
    try {
      if (value) sessionStorage.setItem(SESSION_KEY, String(Date.now())); else sessionStorage.removeItem(SESSION_KEY);
    } catch (e) { /* storage blocked: unlocked for this page view only */ }
    setUnlocked(value);
  };
  return unlocked ? <OauView onSignOut={() => set(false)} /> : <Keypad onUnlock={() => set(true)} />;
}

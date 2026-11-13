/**
 * /updatepassword_fix: change your own password. Unlike the old /updatepassword (the server's
 * PUT /changepassword accepts any e-mail with no sign-in and no current password), this needs
 * the server session and the current password, and signs out your other devices.
 */
import React, { useState } from 'react';
import FixPage from './FixPage';
import { api } from './fixApi';

function strength(p) {
  let s = 0;
  if (p.length >= 8) s += 1;
  if (p.length >= 12) s += 1;
  if (/[a-z]/.test(p) && /[A-Z]/.test(p)) s += 1;
  if (/\d/.test(p)) s += 1;
  if (/[^A-Za-z0-9]/.test(p)) s += 1;
  return ['Too short', 'Weak', 'Fair', 'Good', 'Strong', 'Very strong'][p.length < 8 ? 0 : s];
}

function PasswordForm() {
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [again, setAgain] = useState('');
  const [state, setState] = useState({ busy: false, error: null, ok: null });
  const problem = next && next.length < 8 ? 'At least 8 characters.' : again && next !== again ? 'The two new passwords are different.' : next && next === current ? 'Choose a password different from the current one.' : null;
  const submit = async (e) => {
    e.preventDefault();
    if (problem || !current || !next || next !== again) return;
    setState({ busy: true, error: null, ok: null });
    try {
      const d = await api('/auth2/password', { method: 'POST', body: { current, next } });
      setState({ busy: false, error: null, ok: d.message });
      setCurrent(''); setNext(''); setAgain('');
    } catch (err) {
      setState({ busy: false, error: err.message, ok: null });
    }
  };
  return (
    <main className="gx-main" style={{ maxWidth: 560 }}>
      <form className="gx-panel" onSubmit={submit}>
        <header><h2>Change password</h2></header>
        <label className="gx-field"><span>Current password</span><input type="password" autoComplete="current-password" value={current} onChange={(e) => setCurrent(e.target.value)} required /></label>
        <label className="gx-field"><span>New password</span><input type="password" autoComplete="new-password" value={next} onChange={(e) => setNext(e.target.value)} required /></label>
        {next && <p className="fx-hint">Strength: {strength(next)}</p>}
        <label className="gx-field"><span>New password again</span><input type="password" autoComplete="new-password" value={again} onChange={(e) => setAgain(e.target.value)} required /></label>
        {problem && <p className="fx-warn">{problem}</p>}
        {state.error && <p className="gx-error" role="alert">{state.error}</p>}
        {state.ok && <p className="fx-ok" role="status">{state.ok}</p>}
        <div className="fx-actions"><button type="submit" className="gx-btn gx-btn-primary" disabled={state.busy || !!problem || !current || !next || next !== again}>{state.busy ? 'Saving…' : 'Change password'}</button></div>
      </form>
    </main>
  );
}

export default function PasswordFix() {
  return (
    <FixPage title="Change password" eyebrow="Account" realms={['ncc', 'bilateral']}>
      {(session) => <PasswordForm key={session.user.email} />}
    </FixPage>
  );
}

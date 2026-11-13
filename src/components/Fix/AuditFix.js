/**
 * /audit_fix (administrators): who signed in and out, failed and blocked sign-ins, pages opened,
 * queries, downloads and exports, and the sessions open right now (with revoke).
 * Administrators: accounts whose role contains "admin", or e-mails listed in NAS_AUDIT_ADMINS
 * in the server's .env.
 */
import React, { useCallback, useEffect, useState } from 'react';
import FixPage from './FixPage';
import { api, saveCsv } from './fixApi';
import { ColumnChart, Legend } from './FixCharts';

const ACTIONS = ['signin', 'signin_failed', 'signin_blocked', 'signout', 'page_view', 'query', 'download', 'export', 'view_detail', 'password_changed', 'password_change_failed', 'session_revoked'];
const ACTION_LABEL = {
  signin: 'Signed in', signin_failed: 'Failed sign-in', signin_blocked: 'Sign-in blocked', signout: 'Signed out', page_view: 'Opened page',
  query: 'Query', download: 'Download', export: 'Export', view_detail: 'Meter detail', password_changed: 'Password changed',
  password_change_failed: 'Password change failed', session_revoked: 'Session ended by admin', client_error: 'Page error', ui: 'Action',
};
const BAD = ['signin_failed', 'signin_blocked', 'password_change_failed'];
const lagos = (t) => (t ? new Date(t).toLocaleString('en-GB', { timeZone: 'Africa/Lagos', day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' }) : '—');
const device = (ua) => {
  if (!ua) return '—';
  const os = /Windows/.test(ua) ? 'Windows' : /Android/.test(ua) ? 'Android' : /iPhone|iPad/.test(ua) ? 'iOS' : /Mac OS/.test(ua) ? 'Mac' : /Linux/.test(ua) ? 'Linux' : 'Other';
  const br = /Edg\//.test(ua) ? 'Edge' : /Chrome\//.test(ua) ? 'Chrome' : /Firefox\//.test(ua) ? 'Firefox' : /Safari\//.test(ua) ? 'Safari' : 'Browser';
  return `${br} on ${os}`;
};
const detailText = (d) => {
  if (!d || typeof d !== 'object') return '';
  return Object.entries(d).filter(([, v]) => v !== null && v !== undefined && v !== '').map(([k, v]) => `${k}: ${typeof v === 'object' ? JSON.stringify(v) : v}`).join(' · ');
};

function ActivityTab() {
  const [filters, setFilters] = useState({ from: '', to: '', email: '', action: '', q: '' });
  const [state, setState] = useState({ rows: [], more: false, busy: false, error: null });
  const load = useCallback(async (append, f, before) => {
    setState((s) => ({ ...s, busy: true, error: null }));
    const p = new URLSearchParams({ limit: '200' });
    if (f.from) p.set('from', new Date(`${f.from}T00:00:00+01:00`).toISOString());
    if (f.to) p.set('to', new Date(`${f.to}T23:59:59+01:00`).toISOString());
    ['email', 'action', 'q'].forEach((k) => { if (f[k].trim()) p.set(k, f[k].trim()); });
    if (before) p.set('before', String(before));
    try {
      const d = await api(`/auth2/audit?${p.toString()}`);
      setState((s) => ({ rows: append ? [...s.rows, ...d.rows] : d.rows, more: d.more, busy: false, error: null }));
    } catch (err) {
      setState((s) => ({ ...s, busy: false, error: err.message }));
    }
  }, []);
  useEffect(() => { load(false, { from: '', to: '', email: '', action: '', q: '' }); }, [load]);
  const set = (k) => (e) => setFilters({ ...filters, [k]: e.target.value });
  const exportRows = () => saveCsv([['time_wat', 'user', 'email', 'action', 'page', 'details', 'ip', 'device'],
    ...state.rows.map((r) => [lagos(r.at), r.name, r.email, ACTION_LABEL[r.action] || r.action, r.path, detailText(r.detail), r.ip, device(r.user_agent)])], 'nas_audit_log.csv');
  return (
    <>
      <section className="gx-panel">
        <form className="fx-form" onSubmit={(e) => { e.preventDefault(); load(false, filters); }}>
          <label className="gx-field narrow"><span>From</span><input type="date" value={filters.from} onChange={set('from')} /></label>
          <label className="gx-field narrow"><span>To</span><input type="date" value={filters.to} onChange={set('to')} /></label>
          <label className="gx-field"><span>User e-mail</span><input type="search" value={filters.email} onChange={set('email')} placeholder="Part of an e-mail" /></label>
          <label className="gx-field"><span>Action</span>
            <select value={filters.action} onChange={set('action')}>
              <option value="">Everything</option>
              {ACTIONS.map((a) => <option key={a} value={a}>{ACTION_LABEL[a]}</option>)}
            </select>
          </label>
          <label className="gx-field"><span>Page or detail</span><input type="search" value={filters.q} onChange={set('q')} placeholder="e.g. /home_fix or eket" /></label>
          <div className="fx-actions">
            <button type="submit" className="gx-btn gx-btn-primary" disabled={state.busy}>Search</button>
            <button type="button" className="gx-btn" onClick={exportRows} disabled={!state.rows.length}>CSV</button>
          </div>
        </form>
      </section>
      {state.error && <p className="gx-error">{state.error}</p>}
      <section className="gx-panel">
        <header><h2>Activity</h2><span>{state.rows.length} shown, newest first</span></header>
        <div className="gx-table-wrap">
          <table className="gx-table">
            <thead><tr><th>Time (WAT)</th><th>User</th><th>Action</th><th>Page</th><th className="fx-hide-sm">Details</th><th className="fx-hide-sm">From</th></tr></thead>
            <tbody>
              {state.rows.map((r) => (
                <tr key={r.id}>
                  <td className="fx-age">{lagos(r.at)}</td>
                  <td><b>{r.name || '—'}</b><br /><span className="gx-muted">{r.email || ''}</span></td>
                  <td><span className={`fx-status ${BAD.includes(r.action) ? 'off' : r.action === 'signin' ? 'on' : r.action === 'signout' || r.action === 'session_revoked' ? 'warn' : 'nodata'}`}><i aria-hidden="true" />{ACTION_LABEL[r.action] || r.action}</span></td>
                  <td title={r.path || undefined} style={{ wordBreak: 'break-all' }}>{r.path ? r.path.split('?')[0] : '—'}</td>
                  <td className="fx-hide-sm gx-muted" style={{ maxWidth: 360 }}>{detailText(r.detail)}</td>
                  <td className="fx-hide-sm gx-muted">{r.ip}<br />{device(r.user_agent)}</td>
                </tr>
              ))}
              {!state.rows.length && !state.busy && <tr><td colSpan={6} className="fx-none">Nothing recorded for these filters.</td></tr>}
            </tbody>
          </table>
        </div>
        {state.more && <div className="fx-pager"><button type="button" className="gx-btn" disabled={state.busy} onClick={() => load(true, filters, state.rows[state.rows.length - 1].id)}>Load older</button></div>}
      </section>
    </>
  );
}

function SessionsTab() {
  const [state, setState] = useState({ rows: [], currentId: null, busy: true, error: null });
  const load = useCallback(async () => {
    try {
      const d = await api('/auth2/sessions');
      setState({ rows: d.rows, currentId: d.currentId, busy: false, error: null });
    } catch (err) {
      setState((s) => ({ ...s, busy: false, error: err.message }));
    }
  }, []);
  useEffect(() => { load(); }, [load]);
  const revoke = async (r) => {
    // eslint-disable-next-line no-alert
    if (!window.confirm(`End the session of ${r.name || r.email} (${r.kind === 'kiosk' ? 'wall screen' : device(r.user_agent)})? They will have to sign in again.`)) return;
    try {
      await api(`/auth2/sessions/${r.id}/revoke`, { method: 'POST' });
      load();
    } catch (err) {
      setState((s) => ({ ...s, error: err.message }));
    }
  };
  return (
    <section className="gx-panel">
      <header><h2>Open sessions</h2><span>{state.rows.length} signed in now</span><div className="fx-table-tools"><button type="button" className="gx-btn" onClick={load}>Refresh</button></div></header>
      {state.error && <p className="gx-error">{state.error}</p>}
      <div className="gx-table-wrap">
        <table className="gx-table">
          <thead><tr><th>User</th><th>Type</th><th>Signed in (WAT)</th><th>Last seen</th><th className="fx-hide-sm">Expires</th><th className="fx-hide-sm">From</th><th /></tr></thead>
          <tbody>
            {state.rows.map((r) => (
              <tr key={r.id}>
                <td><b>{r.name || '—'}</b><br /><span className="gx-muted">{r.email}</span></td>
                <td>{r.kind === 'kiosk' ? <span className="fx-status warn"><i />Wall screen</span> : r.realm === 'bilateral' ? 'Bilateral' : 'NCC'}</td>
                <td className="fx-age">{lagos(r.created_at)}</td>
                <td className="fx-age">{lagos(r.last_seen_at)}</td>
                <td className="fx-age fx-hide-sm">{r.expires_at ? lagos(r.expires_at) : 'Never'}</td>
                <td className="fx-hide-sm gx-muted">{r.ip}<br />{device(r.user_agent)}</td>
                <td className="r">{r.id === state.currentId ? <span className="gx-muted">This browser</span> : <button type="button" className="gx-btn" style={{ padding: '5px 12px', fontSize: 13 }} onClick={() => revoke(r)}>End session</button>}</td>
              </tr>
            ))}
            {!state.rows.length && !state.busy && <tr><td colSpan={7} className="fx-none">No open sessions.</td></tr>}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function SummaryTab() {
  const [days, setDays] = useState(14);
  const [state, setState] = useState({ data: null, error: null });
  useEffect(() => {
    let alive = true;
    setState({ data: null, error: null });
    api(`/auth2/audit/summary?days=${days}`).then((data) => { if (alive) setState({ data, error: null }); }).catch((err) => { if (alive) setState({ data: null, error: err.message }); });
    return () => { alive = false; };
  }, [days]);
  const d = state.data;
  const dayKeys = [];
  for (let i = days - 1; i >= 0; i -= 1) {
    const t = new Date(Date.now() + 3600000 - i * 86400000);
    dayKeys.push(t.toISOString().slice(0, 10));
  }
  const count = (day, pred) => (d ? d.byDay.filter((r) => r.day === day && pred(r.action)).reduce((a, r) => a + r.n, 0) : 0);
  const items = dayKeys.map((k) => ({ key: k, label: k.slice(8, 10), title: k, values: { ok: count(k, (a) => a === 'signin'), bad: count(k, (a) => BAD.includes(a)) } }));
  const activity = dayKeys.map((k) => ({ key: k, label: k.slice(8, 10), title: k, values: { v: count(k, (a) => !['signin', 'signout', ...BAD].includes(a)) } }));
  return (
    <>
      <div className="gx-filters" role="group" aria-label="Period">
        {[7, 14, 30, 90].map((n) => <button key={n} type="button" className={days === n ? 'active' : ''} onClick={() => setDays(n)}>{n} days</button>)}
      </div>
      {state.error && <p className="gx-error">{state.error}</p>}
      <div className="gx-grid-2">
        <section className="gx-panel">
          <header><h2>Sign-ins per day</h2><span>WAT</span></header>
          <ColumnChart items={items} series={[{ key: 'ok', label: 'Sign-ins', color: '#3987e5' }, { key: 'bad', label: 'Failed or blocked', color: '#d03b3b' }]} digits={0} height={220} />
          <Legend items={[{ label: 'Sign-ins', color: '#3987e5' }, { label: 'Failed or blocked', color: '#d03b3b' }]} />
        </section>
        <section className="gx-panel">
          <header><h2>Activity per day</h2><span>Pages, queries, downloads</span></header>
          <ColumnChart items={activity} series={[{ key: 'v', label: 'Actions', color: '#3987e5' }]} digits={0} height={220} />
        </section>
      </div>
      <section className="gx-panel">
        <header><h2>Users</h2><span>Last {days} days</span></header>
        <div className="gx-table-wrap">
          <table className="gx-table">
            <thead><tr><th>User</th><th className="r">Sign-ins</th><th className="r">Failed</th><th className="r">Actions</th><th>Last seen (WAT)</th></tr></thead>
            <tbody>
              {(d ? d.byUser : []).map((u) => (
                <tr key={u.email}><td><b>{u.name || '—'}</b><br /><span className="gx-muted">{u.email}</span></td><td className="r">{u.signins}</td><td className={`r ${u.failed ? 'gx-error-text' : ''}`}>{u.failed}</td><td className="r">{u.activity}</td><td className="fx-age">{lagos(u.last_at)}</td></tr>
              ))}
              {d && !d.byUser.length && <tr><td colSpan={5} className="fx-none">No activity in this period.</td></tr>}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}

function AuditView() {
  const [tab, setTab] = useState('activity');
  return (
    <main className="gx-main">
      <div className="gx-filters fx-tabs" role="tablist" aria-label="Audit">
        {[['activity', 'Activity'], ['sessions', 'Open sessions'], ['summary', 'Summary']].map(([k, l]) => (
          <button key={k} type="button" role="tab" aria-selected={tab === k} className={tab === k ? 'active' : ''} onClick={() => setTab(k)}>{l}</button>
        ))}
      </div>
      {tab === 'activity' && <ActivityTab />}
      {tab === 'sessions' && <SessionsTab />}
      {tab === 'summary' && <SummaryTab />}
    </main>
  );
}

export default function AuditFix() {
  return (
    <FixPage title="Audit trail" eyebrow="Administration">
      {(session) => (session.user.isAdmin
        ? <AuditView />
        : <main className="gx-main"><p className="gx-error">Only administrators can open the audit trail.</p></main>)}
    </FixPage>
  );
}

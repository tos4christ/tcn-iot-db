/**
 * Genco portal: one page per Genco at /{slug}_units (see gencos.js and index.js).
 * A Genco signs in with its own name and password and sees only its own units, live, with
 * analytics built from the readings collected in this browser (kept for 6 hours on this device;
 * nothing is stored on the server yet).
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import socket from '../utility/socketIO';
import nisoLogo from '../../assets/img/niso_logo_main.jpg';
import { gencoBySlug, PASSWORD_YEAR } from './gencos';
import { checkLogin, endSession, hasSession, startSession } from './gencoAuth';
import { Bars, Donut, Sparkline, TrendChart } from './charts';
import './genco_portal.css';

// Validated categorical palette (dark surface #121a29: CVD, contrast and lightness checks pass).
const PALETTE = ['#3987e5', '#d95926', '#199e70', '#c98500', '#d55181', '#008300', '#9085e9', '#e66767'];
const STALE_MS = 30000;            // a station is offline after 30 s without a message (as on the main page)
const SAMPLE_MS = 10000;           // one analytics sample every 10 s
const KEEP_MS = 6 * 3600 * 1000;   // history kept on this device
const RANGES = [{ key: '15m', label: '15 min', ms: 15 * 60000 }, { key: '1h', label: '1 hour', ms: 3600000 }, { key: '6h', label: '6 hours', ms: KEEP_MS }];

const num = (v) => { const n = Number(v); return Number.isFinite(n) ? n : null; };
const histKey = (slug) => `niso.genco.history.${slug}`;

/* ------------------------------------------------------------------ page */

export default function GencoPortal({ slug }) {
  const genco = gencoBySlug(slug);
  const [authed, setAuthed] = useState(() => hasSession(slug));
  useEffect(() => { document.title = genco ? `${genco.name} · NISO Genco Portal` : 'NISO Genco Portal'; }, [genco]);
  if (!genco) return <div className="gx-root"><div className="gx-center"><h1>Unknown Genco</h1></div></div>;
  if (!authed) return <GencoLogin genco={genco} onSuccess={() => { startSession(slug); setAuthed(true); }} />;
  return <GencoDashboard genco={genco} onSignOut={() => { endSession(slug); setAuthed(false); }} />;
}

/* ------------------------------------------------------------------ login */

function GencoLogin({ genco, onSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [fails, setFails] = useState(0);

  const submit = async (e) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError('');
    // Slow down repeated guesses.
    if (fails >= 3) await new Promise((r) => setTimeout(r, Math.min(8000, 1000 * 2 ** (fails - 3))));
    const ok = await checkLogin(genco, username, password);
    setBusy(false);
    if (ok) { onSuccess(); return; }
    setFails((f) => f + 1);
    setError('The username or password is not correct for this Genco.');
  };

  return (
    <div className="gx-root gx-login">
      <div className="gx-login-art" aria-hidden="true">
        <div className="gx-login-grid" />
        <div className="gx-login-copy">
          <img src={nisoLogo} alt="" />
          <h2>{genco.name}</h2>
          <p>Live unit output, power quality and operating analytics for your plant, from the NISO IoT network.</p>
          <ul>
            <li>Live MW, kV, MVAr, power factor and frequency per unit</li>
            <li>Output trends, unit share and availability</li>
            <li>Export your readings to CSV</li>
          </ul>
        </div>
      </div>
      <form className="gx-login-card" onSubmit={submit}>
        <img src={nisoLogo} alt="NISO" className="gx-login-logo" />
        <div>
          <span className="gx-eyebrow">Genco portal</span>
          <h1>Sign in to {genco.name}</h1>
          <p className="gx-muted">Use the username and password issued to your Genco.</p>
        </div>
        <label className="gx-field">
          <span>Username</span>
          <input autoComplete="username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder={`e.g. ${genco.slug}`} required autoFocus />
        </label>
        <label className="gx-field">
          <span>Password</span>
          <div className="gx-pass">
            <input type={show ? 'text' : 'password'} autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <button type="button" onClick={() => setShow((s) => !s)} aria-label={show ? 'Hide password' : 'Show password'}>{show ? 'Hide' : 'Show'}</button>
          </div>
        </label>
        {error && <div className="gx-error" role="alert">{error}</div>}
        <button type="submit" className="gx-btn gx-btn-primary" disabled={busy}>{busy ? 'Checking…' : 'Sign in'}</button>
        <p className="gx-fine">Nigerian Independent System Operator · National Control Centre · {PASSWORD_YEAR}</p>
      </form>
    </div>
  );
}

/* ------------------------------------------------------------------ data */

/** Parses a generator_units message the same way the existing Generator Units page does. */
function parseMessage(message) {
  let m = message;
  if (typeof m !== 'string') return m;
  if (m[0] === '"') { m = `{${m}`; m = m.replace(/.(?=\])/g, ''); }
  try { return JSON.parse(m); } catch (e) { return null; }
}

/** Unit list for this Genco: expected units from config + any extra unit seen in messages. */
function buildUnits(genco, latest) {
  const units = [];
  genco.stations.forEach((st) => {
    const msg = latest[st.id];
    const seen = (msg && Array.isArray(msg.units) ? msg.units.map((u) => String(u.id)) : []);
    const ids = [...st.units, ...seen.filter((id) => !st.units.includes(id))];
    ids.forEach((uid) => units.push({ key: `${st.id}:${uid}`, station: st.id, id: uid }));
  });
  const counts = {};
  units.forEach((u) => { counts[u.id] = (counts[u.id] || 0) + 1; });
  units.forEach((u) => { u.label = counts[u.id] > 1 ? `${u.station.toUpperCase()} ${u.id.toUpperCase()}` : u.id.toUpperCase(); });
  units.forEach((u, i) => { u.color = PALETTE[i % PALETTE.length]; u.index = i; });
  return units;
}

function readUnit(latest, unit, now) {
  const msg = latest[unit.station];
  const raw = msg && Array.isArray(msg.units) ? msg.units.find((x) => String(x.id) === unit.id) : null;
  const d = raw ? (raw.pd || raw.td || raw.gd || {}) : {};
  const live = Boolean(msg && msg.server_time && now - msg.server_time <= STALE_MS);
  const mw = num(d.mw);
  return {
    ...unit,
    live,
    reported: Boolean(msg && msg.server_time),
    mw: mw === null ? null : Math.abs(mw),
    kv: num(d.v ?? d.V),
    mvar: num(d.mx),
    pf: num(d.pf),
    hz: num(d.f),
    amps: num(d.a),
    lastSeen: msg ? msg.server_time : null,
  };
}

function loadHistory(slug) {
  try {
    const h = JSON.parse(localStorage.getItem(histKey(slug)) || '[]');
    const cut = Date.now() - KEEP_MS;
    return Array.isArray(h) ? h.filter((s) => s.t >= cut) : [];
  } catch (e) {
    return [];
  }
}

/* ------------------------------------------------------------------ dashboard */

function GencoDashboard({ genco, onSignOut }) {
  const latestRef = useRef({});
  const historyRef = useRef(loadHistory(genco.slug));
  const [tick, setTick] = useState(0);
  const [connected, setConnected] = useState(socket.connected);
  const [range, setRange] = useState('1h');
  const [now, setNow] = useState(Date.now());

  const accepted = useMemo(() => {
    const map = {};
    genco.stations.forEach((st) => { [st.id, ...(st.aliases || [])].forEach((id) => { map[id] = st.id; }); });
    return map;
  }, [genco]);

  // Live feed: keep only this Genco's stations.
  useEffect(() => {
    const onMessage = (data) => {
      const parsed = parseMessage(data && data.message);
      if (!parsed) return;
      const id = parsed.name || parsed.id;
      const stationId = accepted[id];
      if (!stationId) return;
      parsed.server_time = Date.now();
      latestRef.current = { ...latestRef.current, [stationId]: parsed };
    };
    const onConnect = () => setConnected(true);
    const onDisconnect = () => setConnected(false);
    socket.on('generator_units', onMessage);
    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    const render = setInterval(() => { setNow(Date.now()); setTick((t) => t + 1); }, 1000);
    return () => {
      socket.off('generator_units', onMessage);
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      clearInterval(render);
    };
  }, [accepted]);

  const units = useMemo(() => buildUnits(genco, latestRef.current), [genco, tick]); // eslint-disable-line react-hooks/exhaustive-deps
  const readings = useMemo(() => units.map((u) => readUnit(latestRef.current, u, now)), [units, now]);

  // Analytics sampling + local persistence.
  useEffect(() => {
    const sample = () => {
      const t = Date.now();
      const rows = units.map((u) => readUnit(latestRef.current, u, t));
      if (!rows.some((r) => r.reported)) return;
      const liveRows = rows.filter((r) => r.live);
      const total = liveRows.reduce((a, r) => a + (r.mw || 0), 0);
      const running = liveRows.filter((r) => (r.mw || 0) > 0.5);
      const pfW = running.reduce((a, r) => a + (r.pf !== null ? Math.abs(r.pf) * r.mw : 0), 0);
      const hzVals = running.map((r) => r.hz).filter((v) => v !== null && v > 40 && v < 60);
      const s = {
        t,
        total: Number(total.toFixed(3)),
        mvar: Number(liveRows.reduce((a, r) => a + (r.mvar || 0), 0).toFixed(3)),
        pf: running.length ? Number((pfW / running.reduce((a, r) => a + r.mw, 0)).toFixed(3)) : null,
        hz: hzVals.length ? Number((hzVals.reduce((a, v) => a + v, 0) / hzVals.length).toFixed(3)) : null,
        u: Object.fromEntries(rows.map((r) => [r.key, r.live && r.mw !== null ? Number(r.mw.toFixed(3)) : null])),
      };
      const h = historyRef.current;
      h.push(s);
      while (h.length && h[0].t < t - KEEP_MS) h.shift();
    };
    sample();
    const a = setInterval(sample, SAMPLE_MS);
    const save = setInterval(() => {
      try { localStorage.setItem(histKey(genco.slug), JSON.stringify(historyRef.current)); } catch (e) { /* storage full or blocked */ }
    }, 60000);
    return () => { clearInterval(a); clearInterval(save); };
  }, [units.length, genco.slug]); // eslint-disable-line react-hooks/exhaustive-deps

  const win = RANGES.find((r) => r.key === range).ms;
  const hist = historyRef.current.filter((s) => s.t >= now - win);

  // KPIs
  const live = readings.filter((r) => r.live);
  const running = live.filter((r) => (r.mw || 0) > 0.5);
  const total = live.reduce((a, r) => a + (r.mw || 0), 0);
  const mvar = live.reduce((a, r) => a + (r.mvar || 0), 0);
  const pfAvg = running.length ? running.reduce((a, r) => a + (r.pf !== null ? Math.abs(r.pf) * r.mw : 0), 0) / running.reduce((a, r) => a + r.mw, 0) : null;
  const hzNow = (() => { const v = running.map((r) => r.hz).filter((x) => x !== null && x > 40 && x < 60); return v.length ? v.reduce((a, b) => a + b, 0) / v.length : null; })();
  const totals = hist.map((s) => s.total);
  const peak = totals.length ? Math.max(...totals) : null;
  const low = totals.length ? Math.min(...totals) : null;
  const avg = totals.length ? totals.reduce((a, b) => a + b, 0) / totals.length : null;
  let energy = 0; // MWh over the window (trapezoids, gaps over 2 min ignored)
  for (let i = 1; i < hist.length; i += 1) {
    const dt = (hist[i].t - hist[i - 1].t) / 3600000;
    if (dt > 0 && dt < 2 / 60) energy += ((hist[i].total + hist[i - 1].total) / 2) * dt;
  }
  const availability = hist.length
    ? (hist.reduce((a, s) => a + Object.values(s.u).filter((v) => v !== null && v > 0.5).length, 0) / (hist.length * units.length)) * 100
    : null;
  const anyReported = readings.some((r) => r.reported);
  const lastSeen = Math.max(0, ...readings.map((r) => r.lastSeen || 0)) || null;

  // Series: per unit when there are 8 or fewer, otherwise per plant (no ninth colour).
  const perUnit = units.length <= PALETTE.length;
  const groupSeries = perUnit
    ? units.map((u) => ({ key: u.key, label: u.label, color: u.color, points: hist.map((s) => ({ t: s.t, v: s.u[u.key] })) }))
    : genco.stations.map((st, i) => ({
      key: st.id, label: st.id.toUpperCase(), color: PALETTE[i % PALETTE.length],
      points: hist.map((s) => ({ t: s.t, v: units.filter((u) => u.station === st.id).reduce((a, u) => a + (s.u[u.key] || 0), 0) })),
    }));
  const shareSlices = perUnit
    ? readings.map((r) => ({ key: r.key, label: r.label, value: r.live ? r.mw || 0 : 0, color: r.color }))
    : genco.stations.map((st, i) => ({
      key: st.id, label: st.id.toUpperCase(), color: PALETTE[i % PALETTE.length],
      value: readings.filter((r) => r.station === st.id && r.live).reduce((a, r) => a + (r.mw || 0), 0),
    }));

  const exportCsv = useCallback(() => {
    const cols = units.map((u) => u.label);
    const lines = [['time', 'total_mw', 'mvar', 'power_factor', 'frequency_hz', ...cols.map((c) => `${c}_mw`)].join(',')];
    historyRef.current.forEach((s) => {
      lines.push([new Date(s.t).toISOString(), s.total, s.mvar, s.pf ?? '', s.hz ?? '', ...units.map((u) => (s.u[u.key] ?? ''))].join(','));
    });
    const blob = new Blob([lines.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${genco.slug}_units_${new Date().toISOString().slice(0, 16).replace(/[:T]/g, '-')}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [units, genco.slug]);

  const status = !connected ? 'offline' : !anyReported ? 'waiting' : live.length ? 'live' : 'stale';
  const statusText = { live: 'Live', waiting: 'Waiting for data', stale: 'No recent data', offline: 'Reconnecting' }[status];

  return (
    <div className="gx-root">
      <header className="gx-top">
        <img src={nisoLogo} alt="NISO" className="gx-top-logo" />
        <div className="gx-top-title">
          <span className="gx-eyebrow">Genco portal · {genco.type}</span>
          <h1>{genco.name}</h1>
        </div>
        <span className={`gx-status ${status}`}><i />{statusText}</span>
        <Clock />
        <button type="button" className="gx-btn gx-btn-ghost" onClick={onSignOut}>Sign out</button>
      </header>

      <main className="gx-main">
        <section className="gx-hero">
          <div className="gx-hero-main">
            <span className="gx-label">Current output</span>
            <div className="gx-hero-value">{anyReported ? total.toFixed(1) : '—'}<small>MW</small></div>
            <span className="gx-muted">
              {running.length} of {units.length} units generating
              {lastSeen ? ` · last reading ${new Date(lastSeen).toLocaleTimeString('en-GB', { timeZone: 'Africa/Lagos' })}` : ''}
            </span>
          </div>
          <div className="gx-kpis">
            <Kpi label={`Peak (${RANGES.find((r) => r.key === range).label})`} value={peak} unit="MW" />
            <Kpi label="Average" value={avg} unit="MW" />
            <Kpi label="Lowest" value={low} unit="MW" />
            <Kpi label="Energy" value={hist.length > 1 ? energy : null} unit="MWh" digits={2} />
            <Kpi label="Unit availability" value={availability} unit="%" digits={0} />
            <Kpi label="Power factor" value={pfAvg} unit="" digits={3} />
            <Kpi label="Reactive power" value={anyReported ? mvar : null} unit="MVAr" />
            <Kpi label="Frequency" value={hzNow} unit="Hz" digits={2} />
          </div>
        </section>

        <div className="gx-filters" role="group" aria-label="Time range">
          <span className="gx-label">Time range</span>
          {RANGES.map((r) => (
            <button key={r.key} type="button" className={range === r.key ? 'active' : ''} aria-pressed={range === r.key} onClick={() => setRange(r.key)}>{r.label}</button>
          ))}
          <span className="gx-filters-note">Built from readings collected on this device (kept for 6 hours)</span>
          <button type="button" className="gx-btn gx-btn-ghost gx-export" onClick={exportCsv} disabled={!historyRef.current.length}>Export CSV</button>
        </div>

        <section className="gx-grid-2">
          <Panel title="Total output" sub="Sum of all your units, MW">
            <TrendChart series={[{ key: 'total', label: 'Total output', color: PALETTE[0], points: hist.map((s) => ({ t: s.t, v: s.total })) }]}
              refLines={avg !== null && hist.length > 2 ? [{ label: `avg ${avg.toFixed(1)}`, v: avg }] : []} yMin={0} />
          </Panel>
          <Panel title="Output share now" sub={perUnit ? 'By unit' : 'By plant'}>
            <div className="gx-share">
              <Donut slices={shareSlices} />
              <Legend items={shareSlices.map((s) => ({ key: s.key, label: s.label, color: s.color, value: `${s.value.toFixed(1)} MW` }))} />
            </div>
          </Panel>
        </section>

        <section className="gx-grid-2">
          <Panel title={perUnit ? 'Output by unit' : 'Output by plant'} sub="MW over the selected range">
            <TrendChart series={groupSeries} yMin={0} />
            <Legend items={groupSeries.map((s) => ({ key: s.key, label: s.label, color: s.color }))} inline />
          </Panel>
          <Panel title="Current output per unit" sub="MW, live units only">
            <Bars rows={readings.map((r) => ({ key: r.key, label: r.label, value: r.live ? r.mw || 0 : 0, color: perUnit ? r.color : PALETTE[genco.stations.findIndex((s) => s.id === r.station) % PALETTE.length], muted: !r.live }))} />
          </Panel>
        </section>

        <section className="gx-grid-2">
          <Panel title="Power factor" sub="Output-weighted average of running units">
            <TrendChart series={[{ key: 'pf', label: 'Power factor', color: PALETTE[2], points: hist.map((s) => ({ t: s.t, v: s.pf })) }]} unit="" digits={3} height={200} />
          </Panel>
          <Panel title="Frequency at your units" sub="Hz, average of running units">
            <TrendChart series={[{ key: 'hz', label: 'Frequency', color: PALETTE[6], points: hist.map((s) => ({ t: s.t, v: s.hz })) }]} unit="Hz" digits={2} height={200}
              refLines={[{ label: '50.00 Hz', v: 50 }]} />
          </Panel>
        </section>

        <Panel title="Units" sub="Live readings and output trend for each unit">
          <div className="gx-units">
            {readings.map((r) => (
              <div key={r.key} className={`gx-unit ${r.live ? '' : 'is-off'}`}>
                <div className="gx-unit-head">
                  <i style={{ background: perUnit ? r.color : PALETTE[genco.stations.findIndex((s) => s.id === r.station) % PALETTE.length] }} />
                  <b>{r.label}</b>
                  <span className={`gx-pill ${!r.reported ? 'waiting' : r.live ? ((r.mw || 0) > 0.5 ? 'on' : 'idle') : 'off'}`}>
                    {!r.reported ? 'Waiting' : r.live ? ((r.mw || 0) > 0.5 ? 'Generating' : 'Online · 0 MW') : 'Offline'}
                  </span>
                </div>
                <div className="gx-unit-mw">{r.mw !== null && r.reported ? r.mw.toFixed(2) : '—'}<small>MW</small></div>
                <Sparkline points={historyRef.current.slice(-90).map((s) => ({ t: s.t, v: s.u[r.key] }))}
                  color={perUnit ? r.color : PALETTE[genco.stations.findIndex((s) => s.id === r.station) % PALETTE.length]} width={220} />
                <dl className="gx-unit-stats">
                  <div><dt>kV</dt><dd>{fmt(r.kv, 2)}</dd></div>
                  <div><dt>MVAr</dt><dd>{fmt(r.mvar, 2)}</dd></div>
                  <div><dt>PF</dt><dd>{fmt(r.pf, 3)}</dd></div>
                  <div><dt>Hz</dt><dd>{fmt(r.hz, 2)}</dd></div>
                </dl>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Readings table" sub="The same live values as a table">
          <div className="gx-table-wrap">
            <table className="gx-table">
              <thead><tr><th>Unit</th><th>Plant</th><th>Status</th><th className="r">MW</th><th className="r">kV</th><th className="r">MVAr</th><th className="r">PF</th><th className="r">Hz</th><th className="r">A</th></tr></thead>
              <tbody>
                {readings.map((r) => (
                  <tr key={r.key}>
                    <td><b>{r.label}</b></td><td>{r.station}</td>
                    <td>{!r.reported ? 'Waiting' : r.live ? 'Online' : 'Offline'}</td>
                    <td className="r">{fmt(r.mw, 2)}</td><td className="r">{fmt(r.kv, 2)}</td><td className="r">{fmt(r.mvar, 2)}</td>
                    <td className="r">{fmt(r.pf, 3)}</td><td className="r">{fmt(r.hz, 2)}</td><td className="r">{fmt(r.amps, 0)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot><tr><td colSpan={3}>Total</td><td className="r">{anyReported ? total.toFixed(2) : '—'}</td><td /><td className="r">{anyReported ? mvar.toFixed(2) : '—'}</td><td colSpan={3} /></tr></tfoot>
            </table>
          </div>
        </Panel>

        <footer className="gx-foot">Data from the NISO IoT network · National Control Centre · Readings are not stored on the server yet</footer>
      </main>
    </div>
  );
}

/* ------------------------------------------------------------------ bits */

const fmt = (v, d = 1) => (v === null || v === undefined || !Number.isFinite(v) ? '—' : v.toFixed(d));

function Kpi({ label, value, unit, digits = 1 }) {
  return (
    <div className="gx-kpi">
      <span>{label}</span>
      <b>{fmt(value, digits)}{unit && value !== null && Number.isFinite(value) ? <small>{unit}</small> : null}</b>
    </div>
  );
}

function Panel({ title, sub, children }) {
  return (
    <section className="gx-panel">
      <header><h2>{title}</h2>{sub && <span>{sub}</span>}</header>
      {children}
    </section>
  );
}

function Legend({ items, inline = false }) {
  return (
    <ul className={`gx-legend ${inline ? 'inline' : ''}`}>
      {items.map((it) => (
        <li key={it.key}><i style={{ background: it.color }} /><span>{it.label}</span>{it.value && <b>{it.value}</b>}</li>
      ))}
    </ul>
  );
}

function Clock() {
  const [t, setT] = useState(new Date());
  useEffect(() => { const i = setInterval(() => setT(new Date()), 1000); return () => clearInterval(i); }, []);
  return (
    <div className="gx-clock">
      <b>{t.toLocaleTimeString('en-GB', { timeZone: 'Africa/Lagos' })}</b>
      <span>{t.toLocaleDateString('en-GB', { timeZone: 'Africa/Lagos', weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' })}</span>
    </div>
  );
}

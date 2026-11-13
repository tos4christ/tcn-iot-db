/**
 * /tem_fix, /voltageprofile_fix, /collapse_fix, /weather_download_fix, /sp_bilateral_fix
 *
 * Same Excel files as the old pages (the server runs the same report code), but behind the
 * server session, written to the audit log, with clear messages instead of silent failures
 * (the old /collapse page did nothing at all when the period was over 2 hours).
 */
import React, { useState } from 'react';
import FixPage from './FixPage';
import { downloadFile } from './fixApi';

const p2 = (n) => String(n).padStart(2, '0');
const wallNow = () => new Date(Date.now() + 3600000); // WAT
const today = () => { const d = wallNow(); return `${d.getUTCFullYear()}-${p2(d.getUTCMonth() + 1)}-${p2(d.getUTCDate())}`; };
const toInput = (ms) => { const d = new Date(ms); return `${d.getUTCFullYear()}-${p2(d.getUTCMonth() + 1)}-${p2(d.getUTCDate())}T${p2(d.getUTCHours())}:${p2(d.getUTCMinutes())}`; };
const fromInput = (v) => { const m = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/.exec(v || ''); return m ? Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5]) : NaN; };

function useDownload() {
  const [state, setState] = useState({ busy: false, error: null, done: [] });
  const run = async (path, body, fallbackName) => {
    setState((s) => ({ ...s, busy: true, error: null }));
    try {
      const name = await downloadFile(path, { body, fallbackName });
      setState((s) => ({ busy: false, error: null, done: [{ name, at: new Date() }, ...s.done].slice(0, 5) }));
    } catch (err) {
      setState((s) => ({ ...s, busy: false, error: err.message }));
    }
  };
  return [state, run];
}

function Done({ state }) {
  return (
    <>
      {state.error && <p className="gx-error">{state.error}</p>}
      {state.done.length > 0 && (
        <p className="fx-ok">Saved {state.done[0].name} at {state.done[0].at.toLocaleTimeString('en-GB')}.{state.done.length > 1 ? ` (${state.done.length} files this visit)` : ''}</p>
      )}
    </>
  );
}

function DateCard({ title, text, kind, fallbackName, path }) {
  const [date, setDate] = useState(today());
  const [state, run] = useDownload();
  const submit = (e) => {
    e.preventDefault();
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return;
    run(path || `/api2/download/${kind}`, { startDate: date }, fallbackName);
  };
  return (
    <section className="gx-panel">
      <header><h2>{title}</h2><span>{text}</span></header>
      <form className="fx-form" onSubmit={submit}>
        <label className="gx-field narrow"><span>Date</span><input type="date" value={date} max={today()} onChange={(e) => setDate(e.target.value)} required /></label>
        <div className="fx-actions">
          <button type="submit" className="gx-btn gx-btn-primary" disabled={state.busy || !date}>{state.busy ? 'Preparing the file…' : 'Download Excel'}</button>
          <button type="button" className="gx-btn" onClick={() => setDate(today())}>Today</button>
        </div>
      </form>
      <Done state={state} />
    </section>
  );
}

function CollapseCard() {
  const end = Math.floor((wallNow().getTime()) / 60000) * 60000;
  const [from, setFrom] = useState(toInput(end - 3600000));
  const [to, setTo] = useState(toInput(end));
  const [state, run] = useDownload();
  const a = fromInput(from);
  const b = fromInput(to);
  const span = b - a;
  const problem = !Number.isFinite(a) || !Number.isFinite(b) ? 'Choose a start and end.' : span <= 0 ? 'The end must be after the start.' : span > 2 * 3600000 ? 'Choose at most 2 hours (the sheet has one row per reading).' : null;
  const submit = (e) => {
    e.preventDefault();
    if (problem) return;
    const [sd, st] = from.split('T');
    const [ed, et] = to.split('T');
    run('/api2/download/collapse', { startDate: sd, endDate: ed, startTime: st.slice(0, 5), endTime: et.slice(0, 5) }, 'IoT.xlsx');
  };
  const quick = (mins) => { const e2 = Math.floor(wallNow().getTime() / 60000) * 60000; setTo(toInput(e2)); setFrom(toInput(e2 - mins * 60000)); };
  return (
    <section className="gx-panel">
      <header><h2>IoT generation sheet</h2><span>Every station's generation for a period of up to 2 hours (station time, WAT)</span></header>
      <form className="fx-form" onSubmit={submit}>
        <label className="gx-field narrow"><span>From</span><input type="datetime-local" value={from} onChange={(e) => setFrom(e.target.value)} required /></label>
        <label className="gx-field narrow"><span>To</span><input type="datetime-local" value={to} onChange={(e) => setTo(e.target.value)} required /></label>
        <div className="fx-actions"><button type="submit" className="gx-btn gx-btn-primary" disabled={state.busy || !!problem}>{state.busy ? 'Preparing the file…' : 'Download Excel'}</button></div>
      </form>
      <div className="fx-quick"><span className="fx-hint">Last</span>{[15, 30, 60, 120].map((m) => <button key={m} type="button" onClick={() => quick(m)}>{m < 60 ? `${m} min` : `${m / 60} h`}</button>)}</div>
      {problem ? <p className="fx-warn">{problem}</p> : <p className="fx-hint">{Math.round(span / 60000)} minutes selected.</p>}
      <Done state={state} />
    </section>
  );
}

const PAGES = {
  tem: {
    title: 'TEM sheet and frequency',
    body: () => (
      <>
        <DateCard title="TEM sheet" kind="tem" fallbackName="tem.xlsx" text="Daily TEM sheet for every generation station, one sheet per station" />
        <DateCard title="Frequency" kind="frequency" fallbackName="frequency.xlsx" text="Recorded grid frequency for the day" />
      </>
    ),
  },
  voltageprofile: {
    title: 'Voltage profile',
    body: () => <DateCard title="Hourly voltage profile" kind="voltageprofile" fallbackName="voltageProfile.xlsx" text="Eket, Ekim, Port Harcourt Main, Lokoja, Asaba, Ugwuaji, Gwagwalada and Ikot Ekpene" />,
  },
  collapse: { title: 'Generation analysis', body: () => <CollapseCard /> },
  weather: {
    title: 'Weather report',
    body: () => <DateCard title="Weather report" kind="weather" fallbackName="weather.xlsx" text="Recorded weather at the stations for the day" />,
  },
  bilateral: {
    title: 'Bilateral download',
    realms: ['bilateral', 'ncc'],
    nav: [['/sp_bilateral_fix', 'Bilateral download']],
    body: () => <DateCard title="Bilateral hourly data" path="/api2/download/bilateral" fallbackName="bilateral.xlsx" text="Hourly readings of every bilateral customer for the day" />,
  },
};

export default function DownloadsFix({ kind }) {
  const page = PAGES[kind];
  return (
    <FixPage title={page.title} eyebrow="Reports" realms={page.realms || ['ncc']} nav={page.nav}>
      {() => <main className="gx-main">{page.body()}</main>}
    </FixPage>
  );
}

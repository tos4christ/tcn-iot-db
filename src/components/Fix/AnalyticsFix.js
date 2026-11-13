/**
 * /history_fix, /average_fix, /profile_fix, /downtime_fix, /uptime_fix
 *
 * The old /history, /average, /profile, /downtime and /uptime pages post to /lines/... routes
 * that are commented out on the server, so they return nothing today. These pages use the new
 * /api2/lines/* endpoints (tcn_radar_BE/controllers/analytics2.js): read-only, time-limited,
 * parameterised queries, behind the server session, and every query is written to the audit log.
 *
 * Times shown are the station's own clock (WAT), whatever the viewer's PC is set to.
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import FixPage from './FixPage';
import { api, downloadFile, saveCsv } from './fixApi';
import { track } from './session';
import { RangeChart, Timeline, ColumnChart, Legend, STATE_STYLE, fmtWall, fmtDuration } from './FixCharts';
import stationsKey from '../stationsKey';

const PARAMS = [
  { key: 'mw', label: 'Active power', unit: 'MW', digits: 2 },
  { key: 'kv', label: 'Voltage', unit: 'kV', digits: 2 },
  { key: 'amp', label: 'Current', unit: 'A', digits: 1 },
  { key: 'mvar', label: 'Reactive power', unit: 'MVAr', digits: 2 },
];
const COLOR = '#3987e5';
const DAY = 86400000;

// Friendly station names from the existing station list; the database key otherwise.
const LABELS = Object.entries(stationsKey).reduce((m, [label, key]) => (m[key] ? m : { ...m, [key]: label }), {});
const stationLabel = (key) => (LABELS[key] ? `${LABELS[key]} (${key})` : key);

const MODES = {
  history: { title: 'Equipment history', eyebrow: 'Analysis', maxDays: 31, intro: 'Average with the minimum-to-maximum range of every reading, for any period up to 31 days.' },
  average: { title: 'Averages', eyebrow: 'Analysis', maxDays: 31, intro: 'Average per period (5 minutes to a day), the highest and lowest periods, and the typical day.' },
  profile: { title: 'Load profile', eyebrow: 'Analysis', maxDays: 31, intro: 'Exact minimum and maximum of each parameter with the moment they happened.' },
  downtime: { title: 'Downtime', eyebrow: 'Availability', maxDays: 31, intro: 'Out of service = MW and kV both zero (the rule of the old /downtime page). A silence longer than the gap setting is shown separately as no data.' },
  uptime: { title: 'Uptime', eyebrow: 'Availability', maxDays: 31, intro: 'Availability and every in-service period. Availability = in service ÷ (in service + out of service); no-data time is left out.' },
};

// ---- time helpers (station clock = WAT = UTC+1, no daylight saving) --------------------------
const p2 = (n) => String(n).padStart(2, '0');
const toInput = (wallMs) => { const d = new Date(wallMs); return `${d.getUTCFullYear()}-${p2(d.getUTCMonth() + 1)}-${p2(d.getUTCDate())}T${p2(d.getUTCHours())}:${p2(d.getUTCMinutes())}`; };
const fromInput = (v) => { const m = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/.exec(v || ''); return m ? Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5]) : NaN; };
const nowWall = () => Date.now() + 3600000;
const QUICK = [['1 h', 3600000], ['6 h', 6 * 3600000], ['24 h', DAY], ['7 days', 7 * DAY], ['31 days', 31 * DAY]];

const num = (v, d) => (Number.isFinite(v) ? v.toFixed(d) : '—');
const pctText = (v) => (Number.isFinite(v) ? `${(v * 100).toFixed(v >= 0.9995 || v === 0 ? 0 : 2)}` : '—');

// ---- the query form --------------------------------------------------------------------------
function useCatalog() {
  const [state, setState] = useState({ loading: true, stations: [], error: null });
  useEffect(() => {
    let alive = true;
    api('/api2/lines/catalog')
      .then((d) => { if (alive) setState({ loading: false, stations: d.stations || [], error: null }); })
      .catch((err) => { if (alive) setState({ loading: false, stations: [], error: err.message }); });
    return () => { alive = false; };
  }, []);
  return state;
}

function QueryForm({ mode, onRun, busy }) {
  const cfg = MODES[mode];
  const history = useHistory();
  const location = useLocation();
  const catalog = useCatalog();
  const initial = useMemo(() => new URLSearchParams(location.search), []); // eslint-disable-line react-hooks/exhaustive-deps
  const [station, setStation] = useState(initial.get('station') || '');
  const [line, setLine] = useState(initial.get('line') || '');
  const [from, setFrom] = useState(initial.get('from') || toInput(nowWall() - DAY));
  const [to, setTo] = useState(initial.get('to') || toInput(nowWall()));
  const [bucket, setBucket] = useState(initial.get('bucket') || '3600');
  const [gap, setGap] = useState(initial.get('gap') || '60');
  const [problem, setProblem] = useState(null);
  const autoRan = useRef(false);

  const stations = catalog.stations;
  const lines = (stations.find((s) => s.station === station) || { lines: [] }).lines;

  const params = () => {
    const p = new URLSearchParams({ station, line, from, to });
    if (mode === 'average') p.set('bucket', bucket);
    if (mode === 'downtime' || mode === 'uptime') p.set('gap', gap);
    return p;
  };
  const run = (e) => {
    if (e) e.preventDefault();
    const a = fromInput(from);
    const b = fromInput(to);
    if (!station || !line) return setProblem('Choose a station and an equipment.');
    if (!Number.isFinite(a) || !Number.isFinite(b)) return setProblem('Choose a start and end date and time.');
    if (b <= a) return setProblem('The end must be after the start.');
    if (b - a > cfg.maxDays * DAY) return setProblem(`Choose at most ${cfg.maxDays} days.`);
    setProblem(null);
    const p = params();
    history.replace({ pathname: location.pathname, search: `?${p.toString()}` });
    return onRun(p, { from: a, to: b, station, line, bucket: Number(bucket), gap: Number(gap) });
  };

  // Opened from a shared link with every field filled in: run it straight away.
  useEffect(() => {
    if (autoRan.current || catalog.loading) return;
    autoRan.current = true;
    if (initial.get('station') && initial.get('line') && initial.get('from') && initial.get('to')) run();
  }, [catalog.loading]); // eslint-disable-line react-hooks/exhaustive-deps

  const quick = (ms) => { const end = nowWall(); setTo(toInput(end)); setFrom(toInput(end - ms)); };

  return (
    <section className="gx-panel">
      <header><h2>{cfg.title}</h2><span>{cfg.intro}</span></header>
      {catalog.error && <p className="gx-error">Could not load the station list: {catalog.error}</p>}
      <form className="fx-form" onSubmit={run}>
        <label className="gx-field">
          <span>Station</span>
          <select value={station} onChange={(e) => { setStation(e.target.value); setLine(''); }} disabled={catalog.loading}>
            <option value="">{catalog.loading ? 'Loading stations…' : 'Choose a station'}</option>
            {stations.map((s) => <option key={s.station} value={s.station}>{stationLabel(s.station)}</option>)}
            {station && !stations.some((s) => s.station === station) && <option value={station}>{station} (no recent data)</option>}
          </select>
        </label>
        <label className="gx-field">
          <span>Equipment</span>
          <select value={line} onChange={(e) => setLine(e.target.value)} disabled={!station}>
            <option value="">Choose equipment</option>
            {lines.map((l) => <option key={l.line} value={l.line}>{l.line}</option>)}
            {line && !lines.some((l) => l.line === line) && <option value={line}>{line}</option>}
          </select>
        </label>
        <label className="gx-field narrow"><span>From (WAT)</span><input type="datetime-local" value={from} onChange={(e) => setFrom(e.target.value)} required /></label>
        <label className="gx-field narrow"><span>To (WAT)</span><input type="datetime-local" value={to} onChange={(e) => setTo(e.target.value)} required /></label>
        {mode === 'average' && (
          <label className="gx-field narrow"><span>Average per</span>
            <select value={bucket} onChange={(e) => setBucket(e.target.value)}>
              {[['300', '5 minutes'], ['900', '15 minutes'], ['1800', '30 minutes'], ['3600', 'Hour'], ['86400', 'Day']].map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          </label>
        )}
        {(mode === 'downtime' || mode === 'uptime') && (
          <label className="gx-field narrow" title="A silence longer than this is counted as no data"><span>No-data gap</span>
            <select value={gap} onChange={(e) => setGap(e.target.value)}>
              {[['15', '15 s'], ['30', '30 s'], ['60', '1 min'], ['120', '2 min'], ['300', '5 min'], ['900', '15 min']].map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          </label>
        )}
        <div className="fx-actions"><button type="submit" className="gx-btn gx-btn-primary" disabled={busy}>{busy ? 'Working…' : 'Show'}</button></div>
      </form>
      <div className="fx-quick" role="group" aria-label="Quick periods">
        <span className="fx-hint">Last</span>
        {QUICK.filter(([, ms]) => ms <= cfg.maxDays * DAY).map(([l, ms]) => <button key={l} type="button" onClick={() => quick(ms)}>{l}</button>)}
      </div>
      {problem && <p className="gx-error">{problem}</p>}
    </section>
  );
}

// ---- shared pieces -----------------------------------------------------------------------------
function ParamTabs({ value, onChange }) {
  return (
    <div className="gx-filters" role="group" aria-label="Parameter">
      {PARAMS.map((p) => <button key={p.key} type="button" className={value === p.key ? 'active' : ''} aria-pressed={value === p.key} onClick={() => onChange(p.key)}>{p.label} ({p.unit})</button>)}
    </div>
  );
}

function usePaged(rows, size = 50) {
  const [page, setPage] = useState(0);
  useEffect(() => setPage(0), [rows]);
  const pages = Math.max(1, Math.ceil(rows.length / size));
  const shown = rows.slice(page * size, page * size + size);
  const pager = rows.length > size ? (
    <div className="fx-pager">
      <button type="button" className="gx-btn" disabled={page === 0} onClick={() => setPage(page - 1)}>Previous</button>
      <span>Page {page + 1} of {pages}</span>
      <button type="button" className="gx-btn" disabled={page >= pages - 1} onClick={() => setPage(page + 1)}>Next</button>
    </div>
  ) : null;
  return [shown, pager];
}

const seriesOf = (points, key) => points.map((p) => ({ t: p.t, n: p.n, avg: p[key][0], min: p[key][1], max: p[key][2] }));

function summarise(series) {
  let n = 0; let sum = 0; let min = null; let max = null;
  series.forEach((p) => {
    if (Number.isFinite(p.avg)) { sum += p.avg * p.n; n += p.n; }
    if (Number.isFinite(p.min) && (!min || p.min < min.v)) min = { v: p.min, t: p.t };
    if (Number.isFinite(p.max) && (!max || p.max > max.v)) max = { v: p.max, t: p.t };
  });
  return { avg: n ? sum / n : null, min, max, readings: series.reduce((a, p) => a + p.n, 0) };
}

function exportPoints(result, name) {
  const header = ['period_start', 'readings', ...PARAMS.flatMap((p) => [`${p.key}_avg`, `${p.key}_min`, `${p.key}_max`])];
  saveCsv([header, ...result.points.map((p) => [fmtWall(p.t, { seconds: true }), p.n, ...PARAMS.flatMap((x) => p[x.key])])], name);
  track('export', { kind: 'periods_csv', station: result.station, line: result.line, rows: result.points.length });
}

function RawCsvButton({ query }) {
  const [state, setState] = useState(null);
  const tooLong = query.to - query.from > 7 * DAY;
  const go = async () => {
    setState('busy');
    try {
      await downloadFile(`/api2/lines/export.csv?${query.params.toString()}`, { method: 'GET', fallbackName: 'readings.csv' });
      setState(null);
    } catch (err) {
      setState(err.message);
    }
  };
  return (
    <>
      <button type="button" className="gx-btn" disabled={tooLong || state === 'busy'} onClick={go} title={tooLong ? 'Raw readings: choose 7 days or less' : 'Every reading as a CSV file'}>
        {state === 'busy' ? 'Preparing…' : 'Raw readings (CSV)'}
      </button>
      {state && state !== 'busy' && <span className="gx-error">{state}</span>}
    </>
  );
}

// ---- history -----------------------------------------------------------------------------------
function HistoryResult({ result, query }) {
  const [param, setParam] = useState('mw');
  const meta = PARAMS.find((p) => p.key === param);
  const series = useMemo(() => seriesOf(result.points, param), [result, param]);
  const sum = useMemo(() => summarise(series), [series]);
  const rows = useMemo(() => series.filter((p) => p.n), [series]);
  const [shown, pager] = usePaged(rows);
  const bucketMs = result.bucket * 1000;
  return (
    <>
      <div className="fx-tiles">
        <div className="fx-tile hero"><span>Average {meta.label.toLowerCase()}</span><b>{num(sum.avg, meta.digits)}<small>{meta.unit}</small></b><em>{sum.readings.toLocaleString()} readings</em></div>
        <div className="fx-tile"><span>Highest</span><b>{num(sum.max && sum.max.v, meta.digits)}<small>{meta.unit}</small></b><em>{sum.max ? `around ${fmtWall(sum.max.t)}` : '—'}</em></div>
        <div className="fx-tile"><span>Lowest</span><b>{num(sum.min && sum.min.v, meta.digits)}<small>{meta.unit}</small></b><em>{sum.min ? `around ${fmtWall(sum.min.t)}` : '—'}</em></div>
        <div className="fx-tile"><span>Each point</span><b>{fmtDuration(bucketMs)}</b><em>{result.points.length} periods</em></div>
      </div>
      <section className="gx-panel">
        <header>
          <h2>{meta.label} · {stationLabel(result.station)} · {result.line}</h2>
          <span>{fmtWall(result.from)} to {fmtWall(result.to)}</span>
          <div className="fx-table-tools"><ParamTabs value={param} onChange={setParam} /></div>
        </header>
        <RangeChart points={series} from={result.from} to={result.to} bucketMs={bucketMs} unit={meta.unit} digits={meta.digits} color={COLOR} />
        <Legend items={[{ label: 'Average', color: COLOR }, { label: 'Minimum to maximum in each period', color: 'rgb(57 135 229 / 0.35)' }]} />
      </section>
      <section className="gx-panel">
        <header>
          <h2>Periods</h2><span>{rows.length} with readings</span>
          <div className="fx-table-tools">
            <button type="button" className="gx-btn" onClick={() => exportPoints(result, `${result.station}_${result.line}_periods.csv`)}>Table (CSV)</button>
            <RawCsvButton query={query} />
          </div>
        </header>
        <div className="gx-table-wrap">
          <table className="gx-table">
            <thead><tr><th>Period start (WAT)</th><th className="r">Readings</th><th className="r">Average {meta.unit}</th><th className="r">Min {meta.unit}</th><th className="r">Max {meta.unit}</th></tr></thead>
            <tbody>
              {shown.map((p) => <tr key={p.t}><td>{fmtWall(p.t)}</td><td className="r">{p.n}</td><td className="r">{num(p.avg, meta.digits)}</td><td className="r">{num(p.min, meta.digits)}</td><td className="r">{num(p.max, meta.digits)}</td></tr>)}
              {!shown.length && <tr><td colSpan={5} className="fx-none">No readings in this period.</td></tr>}
            </tbody>
          </table>
        </div>
        {pager}
      </section>
    </>
  );
}

// ---- average -----------------------------------------------------------------------------------
const HOURS = Array.from({ length: 24 }, (_, h) => h);
function AverageResult({ result, query }) {
  const [param, setParam] = useState('mw');
  const meta = PARAMS.find((p) => p.key === param);
  const series = useMemo(() => seriesOf(result.points, param).filter((p) => Number.isFinite(p.avg)), [result, param]);
  const sum = useMemo(() => summarise(series), [series]);
  const hi = series.reduce((b, p) => (!b || p.avg > b.avg ? p : b), null);
  const lo = series.reduce((b, p) => (!b || p.avg < b.avg ? p : b), null);
  const bucketMs = result.bucket * 1000;
  const label = (t) => (result.bucket >= 86400 ? fmtWall(t).slice(0, 11) : fmtWall(t, { date: query.to - query.from > DAY }));
  // Typical day: readings-weighted average for each hour of the day across the whole period.
  const typical = useMemo(() => {
    if (result.bucket > 3600 || query.to - query.from < 2 * DAY) return null;
    const acc = HOURS.map(() => ({ s: 0, n: 0 }));
    series.forEach((p) => { const h = new Date(p.t).getUTCHours(); acc[h].s += p.avg * p.n; acc[h].n += p.n; });
    return HOURS.map((h) => ({ key: h, label: p2(h), title: `${p2(h)}:00 to ${p2(h)}:59`, values: { v: acc[h].n ? acc[h].s / acc[h].n : NaN } }));
  }, [series, result, query]);
  const [shown, pager] = usePaged(series);
  return (
    <>
      <div className="fx-tiles">
        <div className="fx-tile hero"><span>Average over the period</span><b>{num(sum.avg, meta.digits)}<small>{meta.unit}</small></b><em>per {fmtDuration(bucketMs)} · {series.length} periods</em></div>
        <div className="fx-tile"><span>Highest period</span><b>{num(hi && hi.avg, meta.digits)}<small>{meta.unit}</small></b><em>{hi ? fmtWall(hi.t) : '—'}</em></div>
        <div className="fx-tile"><span>Lowest period</span><b>{num(lo && lo.avg, meta.digits)}<small>{meta.unit}</small></b><em>{lo ? fmtWall(lo.t) : '—'}</em></div>
      </div>
      <section className="gx-panel">
        <header>
          <h2>Average {meta.label.toLowerCase()} per {fmtDuration(bucketMs)}</h2>
          <span>{stationLabel(result.station)} · {result.line}</span>
          <div className="fx-table-tools"><ParamTabs value={param} onChange={setParam} /></div>
        </header>
        {series.length <= 62
          ? <ColumnChart items={series.map((p) => ({ key: p.t, label: label(p.t), title: fmtWall(p.t), values: { v: p.avg } }))} series={[{ key: 'v', label: 'Average', color: COLOR }]} unit={meta.unit} digits={meta.digits} height={280} emptyText="No readings in this period." />
          : <RangeChart points={series} from={result.from} to={result.to} bucketMs={bucketMs} unit={meta.unit} digits={meta.digits} color={COLOR} />}
      </section>
      {typical && (
        <section className="gx-panel">
          <header><h2>Typical day</h2><span>Average {meta.label.toLowerCase()} for each hour of the day over the whole period (WAT)</span></header>
          <ColumnChart items={typical} series={[{ key: 'v', label: 'Average', color: COLOR }]} unit={meta.unit} digits={meta.digits} height={220} />
        </section>
      )}
      <section className="gx-panel">
        <header>
          <h2>Periods</h2><span>{series.length}</span>
          <div className="fx-table-tools">
            <button type="button" className="gx-btn" onClick={() => exportPoints(result, `${result.station}_${result.line}_averages.csv`)}>Table (CSV)</button>
          </div>
        </header>
        <div className="gx-table-wrap">
          <table className="gx-table">
            <thead><tr><th>Period start (WAT)</th><th className="r">Readings</th><th className="r">Average {meta.unit}</th><th className="r">Min {meta.unit}</th><th className="r">Max {meta.unit}</th></tr></thead>
            <tbody>
              {shown.map((p) => <tr key={p.t}><td>{fmtWall(p.t)}</td><td className="r">{p.n}</td><td className="r">{num(p.avg, meta.digits)}</td><td className="r">{num(p.min, meta.digits)}</td><td className="r">{num(p.max, meta.digits)}</td></tr>)}
              {!shown.length && <tr><td colSpan={5} className="fx-none">No readings in this period.</td></tr>}
            </tbody>
          </table>
        </div>
        {pager}
      </section>
    </>
  );
}

// ---- profile -----------------------------------------------------------------------------------
function ProfileResult({ result }) {
  const [param, setParam] = useState('mw');
  const meta = PARAMS.find((p) => p.key === param);
  const { stats, series } = result;
  const s = stats.stats;
  const chart = useMemo(() => seriesOf(series.points, param), [series, param]);
  const st = s[param];
  const marks = [st.max && { t: st.max.t, v: st.max.v, label: `Max ${num(st.max.v, meta.digits)}` }, st.min && { t: st.min.t, v: st.min.v, label: `Min ${num(st.min.v, meta.digits)}` }].filter(Boolean);
  const exportProfile = () => {
    saveCsv([['parameter', 'unit', 'average', 'minimum', 'minimum_at', 'maximum', 'maximum_at'],
      ...PARAMS.map((p) => [p.label, p.unit, s[p.key].avg, s[p.key].min && s[p.key].min.v, s[p.key].min && fmtWall(s[p.key].min.t, { seconds: true }), s[p.key].max && s[p.key].max.v, s[p.key].max && fmtWall(s[p.key].max.t, { seconds: true })])],
    `${stats.station}_${stats.line}_profile.csv`);
    track('export', { kind: 'profile_csv', station: stats.station, line: stats.line });
  };
  return (
    <>
      <section className="gx-panel">
        <header>
          <h2>{stationLabel(stats.station)} · {stats.line}</h2>
          <span>{fmtWall(stats.from)} to {fmtWall(stats.to)} · {Number(stats.samples).toLocaleString()} readings</span>
          <div className="fx-table-tools"><button type="button" className="gx-btn" onClick={exportProfile}>Profile (CSV)</button></div>
        </header>
        <div className="gx-table-wrap">
          <table className="gx-table">
            <thead><tr><th>Parameter</th><th className="r">Average</th><th className="r">Minimum</th><th>At (WAT)</th><th className="r">Maximum</th><th>At (WAT)</th></tr></thead>
            <tbody>
              {PARAMS.map((p) => (
                <tr key={p.key} className={`can-open ${param === p.key ? 'fx-selected' : ''}`} onClick={() => setParam(p.key)} title="Show this parameter in the chart">
                  <td><b>{p.label}</b> <span className="gx-muted">{p.unit}</span></td>
                  <td className="r">{num(s[p.key].avg, p.digits)}</td>
                  <td className="r">{num(s[p.key].min && s[p.key].min.v, p.digits)}</td>
                  <td>{s[p.key].min ? fmtWall(s[p.key].min.t, { seconds: true }) : '—'}</td>
                  <td className="r">{num(s[p.key].max && s[p.key].max.v, p.digits)}</td>
                  <td>{s[p.key].max ? fmtWall(s[p.key].max.t, { seconds: true }) : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <section className="gx-panel">
        <header>
          <h2>{meta.label} with its minimum and maximum</h2>
          <div className="fx-table-tools"><ParamTabs value={param} onChange={setParam} /></div>
        </header>
        <RangeChart points={chart} from={series.from} to={series.to} bucketMs={series.bucket * 1000} unit={meta.unit} digits={meta.digits} color={COLOR} marks={marks} />
      </section>
    </>
  );
}

// ---- downtime / uptime -------------------------------------------------------------------------
function AvailabilityResult({ result, mode }) {
  const { segments, totals } = result;
  const [show, setShow] = useState(mode === 'uptime' ? 'up' : 'down');
  const known = totals.up + totals.out;
  const availability = known ? totals.up / known : null;
  const count = (st) => segments.filter((g) => g.state === st).length;
  const longest = (st) => segments.filter((g) => g.state === st).reduce((m, g) => Math.max(m, g.to - g.from), 0);
  const list = segments.filter((g) => (show === 'all' ? true : show === 'down' ? g.state !== 'up' : g.state === show));
  const [shown, pager] = usePaged(list);
  const exportList = () => {
    saveCsv([['state', 'from_wat', 'to_wat', 'duration_minutes'], ...list.map((g) => [STATE_STYLE[g.state].label, fmtWall(g.from, { seconds: true }), fmtWall(g.to, { seconds: true }), ((g.to - g.from) / 60000).toFixed(2)])],
      `${result.station}_${result.line}_${mode}.csv`);
    track('export', { kind: `${mode}_csv`, station: result.station, line: result.line, rows: list.length });
  };
  const filters = mode === 'uptime'
    ? [['up', 'In service'], ['all', 'Everything']]
    : [['down', 'Out of service and no data'], ['out', 'Out of service'], ['nodata', 'No data'], ['all', 'Everything']];
  return (
    <>
      <div className="fx-tiles">
        <div className={`fx-tile hero ${availability !== null && availability < 0.95 ? 'bad' : ''}`}><span>Availability</span><b>{pctText(availability)}<small>%</small></b><em>{known ? 'of the time with data' : 'No readings in this period'}</em></div>
        <div className="fx-tile"><span>In service</span><b>{fmtDuration(totals.up)}</b><em>{count('up')} periods · longest {fmtDuration(longest('up'))}</em></div>
        <div className={`fx-tile ${totals.out ? 'bad' : ''}`}><span>Out of service</span><b>{fmtDuration(totals.out)}</b><em>{count('out')} outages · longest {fmtDuration(longest('out'))}</em></div>
        <div className="fx-tile"><span>No data</span><b>{fmtDuration(totals.nodata)}</b><em>{count('nodata')} silences over {result.gap} s</em></div>
      </div>
      <section className="gx-panel">
        <header><h2>Timeline · {stationLabel(result.station)} · {result.line}</h2><span>{fmtWall(result.from)} to {fmtWall(result.to)}</span></header>
        <Timeline segments={segments} from={result.from} to={result.to} />
        <Legend items={[{ label: STATE_STYLE.up.label, color: STATE_STYLE.up.color }, { label: STATE_STYLE.out.label, color: STATE_STYLE.out.color }, { label: STATE_STYLE.nodata.label, hatch: true }]} />
      </section>
      <section className="gx-panel">
        <header>
          <h2>{mode === 'uptime' ? 'In-service periods' : 'Outages and silences'}</h2><span>{list.length}</span>
          <div className="fx-table-tools">
            <div className="gx-filters" role="group" aria-label="Show">
              {filters.map(([k, l]) => <button key={k} type="button" className={show === k ? 'active' : ''} aria-pressed={show === k} onClick={() => setShow(k)}>{l}</button>)}
            </div>
            <button type="button" className="gx-btn" onClick={exportList} disabled={!list.length}>List (CSV)</button>
          </div>
        </header>
        <div className="gx-table-wrap">
          <table className="gx-table">
            <thead><tr><th>State</th><th>From (WAT)</th><th>To (WAT)</th><th className="r">Duration</th></tr></thead>
            <tbody>
              {shown.map((g) => (
                <tr key={`${g.state}-${g.from}`}>
                  <td><span className={`fx-status ${g.state === 'up' ? 'on' : g.state === 'out' ? 'off' : 'nodata'}`}><i aria-hidden="true" />{STATE_STYLE[g.state].label}</span></td>
                  <td>{fmtWall(g.from, { seconds: true })}</td>
                  <td>{fmtWall(g.to, { seconds: true })}</td>
                  <td className="r">{fmtDuration(g.to - g.from)}</td>
                </tr>
              ))}
              {!shown.length && <tr><td colSpan={4} className="fx-none">{mode === 'uptime' ? 'Never in service in this period.' : 'No outages or silences in this period.'}</td></tr>}
            </tbody>
          </table>
        </div>
        {pager}
      </section>
    </>
  );
}

// ---- page ----------------------------------------------------------------------------------------
function AnalyticsView({ mode }) {
  const [state, setState] = useState({ busy: false, error: null, result: null, query: null });
  const req = useRef(0);
  const run = async (params, query) => {
    const id = req.current + 1;
    req.current = id;
    setState((s) => ({ ...s, busy: true, error: null }));
    params.set('kind', mode);
    const qs = params.toString();
    try {
      let result;
      if (mode === 'profile') {
        const [stats, series] = await Promise.all([api(`/api2/lines/stats?${qs}`), api(`/api2/lines/series?${qs}`)]);
        result = { stats, series };
      } else if (mode === 'downtime' || mode === 'uptime') {
        result = await api(`/api2/lines/availability?${qs}`);
      } else {
        result = await api(`/api2/lines/series?${qs}`);
      }
      if (req.current === id) setState({ busy: false, error: null, result, query: { ...query, params } });
    } catch (err) {
      if (req.current === id) setState((s) => ({ ...s, busy: false, error: err.message }));
    }
  };
  const { result, query } = state;
  return (
    <main className="gx-main">
      <QueryForm mode={mode} onRun={run} busy={state.busy} />
      {state.error && <p className="gx-error">{state.error}</p>}
      {state.busy && !result && <div className="fx-screen"><div><span className="fx-spinner" /><p className="gx-muted">Reading the data…</p></div></div>}
      {result && (mode === 'history') && <HistoryResult result={result} query={query} />}
      {result && (mode === 'average') && <AverageResult result={result} query={query} />}
      {result && (mode === 'profile') && <ProfileResult result={result} />}
      {result && (mode === 'downtime' || mode === 'uptime') && <AvailabilityResult result={result} mode={mode} />}
    </main>
  );
}

export default function AnalyticsFix({ mode }) {
  const cfg = MODES[mode];
  return (
    <FixPage title={cfg.title} eyebrow={cfg.eyebrow}>
      {() => <AnalyticsView key={mode} mode={mode} />}
    </FixPage>
  );
}

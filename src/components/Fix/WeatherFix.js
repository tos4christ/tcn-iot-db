/**
 * /nccweather_fix and /nccweather_fix/:name - the NISO NAS v2 weather centre, in the *_fix style.
 *
 * The old /nccweather page (OpenWeatherMap cards fed by a socket that no longer sends) is not
 * changed. This page reads the weather engine of the backend (tcn_radar_BE/weather2, routes
 * /api2/weather/*): every station of station_coords_2 is forecast at its centre and at 4 points on
 * a 15 km ring, from Open-Meteo, fused, corrected with live OpenWeatherMap observations, and turned
 * into grid risk (thunderstorm, gusts, heavy rain, flood rainfall, heat, visibility).
 *
 *   overview  - national risk map (click anywhere for a point forecast), alerts, station table
 *   station   - now, 72 h risk strip, alerts and rain windows, 6 hourly charts, 7-day outlook,
 *               sampling nodes (administrators can add or remove nodes on the map)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';
import FixPage from './FixPage';
import { api, downloadFile } from './fixApi';
import WxMap from './weather/WxMap';
import {
  ago, compass, fmt, fmt0, fmt1, fmtDay, fmtDayHour, fmtHour, hazardLabel, HourlyChart, isNum,
  RISK_COLOR, RiskBadge, RiskStrip, SERIES, WeatherIcon,
} from './weather/wx';
import './weather/weather.css';

const NIGERIA = [[4.2, 2.6], [13.9, 14.7]];
const stationPath = (name) => `/nccweather_fix/${encodeURIComponent(name)}`;

function Screen({ title, children }) {
  return (
    <main className="gx-main">
      <section className="gx-panel"><div className="fx-none"><b>{title}</b><div style={{ marginTop: 6 }}>{children}</div></div></section>
    </main>
  );
}

/* ================================================================ overview */
function PointPanel({ point, onClose }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const ref = useRef(null);
  // On a narrow screen the panel is below the map: bring it into view.
  useEffect(() => {
    if (ref.current && window.innerWidth <= 1100 && ref.current.scrollIntoView) ref.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [point]);
  useEffect(() => {
    const ctrl = new AbortController();
    setData(null);
    setError(null);
    api(`/api2/weather/point?lat=${point.lat.toFixed(4)}&lon=${point.lon.toFixed(4)}`, { signal: ctrl.signal })
      .then(setData).catch((e) => { if (e.name !== 'AbortError') setError(e.message); });
    return () => ctrl.abort();
  }, [point]);
  const nowSec = Date.now() / 1000;
  return (
    <section className="gx-panel" ref={ref}>
      <header>
        <h2>Point forecast</h2><span>{point.lat.toFixed(3)}, {point.lon.toFixed(3)} · same multi-node method as the stations</span>
        <button type="button" className="gx-btn wx-close" onClick={onClose} aria-label="Close the point forecast">×</button>
      </header>
      {error && <p className="gx-error-text">{error}</p>}
      {!data && !error && <div className="wx-row"><span className="fx-spinner wx-spin-sm" /> Forecasting 5 points around this place…</div>}
      {data && (
        <>
          <div className="wx-now compact">
            <WeatherIcon code={data.current.weatherCode} isDay={data.current.isDay} size={40} title={data.current.condition} />
            <div className="wx-temp">{fmt1(data.current.temperature)}°</div>
            <div className="wx-stack">
              <b>{data.current.condition}</b>
              <span className="gx-muted">Rain chance {fmt0(data.current.pop)}% here · {fmt0(data.current.popArea)}% in the area</span>
              {data.nearestStation && <span className="fx-hint">Nearest station: {data.nearestStation.name} ({data.nearestStation.distanceKm} km)</span>}
            </div>
            <span className="wx-push"><RiskBadge level={data.summary.level24h} /></span>
          </div>
          <RiskStrip hours={data.hourly.filter((h) => h.t >= nowSec - 3600).slice(0, 48)} />
          {data.rainWindows[0] ? (
            <p className="fx-warn">Next rain: {fmtDayHour(data.rainWindows[0].start)} for {data.rainWindows[0].hours} h, about {data.rainWindows[0].total} mm{data.rainWindows[0].thunder ? ', with thunder' : ''}.</p>
          ) : <p className="fx-hint">No rain expected in the next 7 days.</p>}
        </>
      )}
    </section>
  );
}

const FILTERS = [['all', 'All'], ['risk', 'At risk'], ['rain', 'Raining'], ['GENERATION', 'Generation'], ['TRANSMISSION', 'Transmission'], ['hydro', 'Hydro']];

function Overview({ session }) {
  const history = useHistory();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [query, setQuery] = useState('');
  const [point, setPoint] = useState(null);
  const [busy, setBusy] = useState('');
  const [note, setNote] = useState(null);
  const isAdmin = !!(session.user && session.user.isAdmin);

  const load = useCallback((signal) => api('/api2/weather/overview', { signal })
    .then((d) => { setData(d); setError(null); })
    .catch((e) => { if (e.name !== 'AbortError') setError(e.message); }), []);
  const warming = !data || !data.national.stations;
  useEffect(() => {
    const ctrl = new AbortController();
    load(ctrl.signal);
    // every 5 minutes; every 20 s while the first forecast is still being made
    const t = setInterval(() => load(ctrl.signal), warming ? 20000 : 5 * 60000);
    return () => { ctrl.abort(); clearInterval(t); };
  }, [load, warming]);

  const stations = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ((data && data.stations) || [])
      .filter((s) => filter === 'all' || (filter === 'hydro' ? s.isHydro : filter === 'risk' ? s.level24h >= 2 : filter === 'rain' ? s.rainNow : s.type === filter))
      .filter((s) => !q || s.name.toLowerCase().includes(q))
      .sort((a, b) => b.level24h - a.level24h || (b.current.popArea || 0) - (a.current.popArea || 0) || a.name.localeCompare(b.name));
  }, [data, filter, query]);

  const download = async () => {
    setBusy('report');
    setNote(null);
    try {
      const name = await downloadFile('/api2/weather/forecast-report', { body: { hours: 72 }, fallbackName: 'weather_forecast.xlsx' });
      setNote({ ok: true, text: `Saved ${name}.` });
    } catch (e) {
      setNote({ ok: false, text: e.message });
    } finally {
      setBusy('');
    }
  };
  const refresh = async () => {
    setBusy('refresh');
    setNote(null);
    try {
      await api('/api2/weather/refresh', { method: 'POST', body: {} });
      setNote({ ok: true, text: 'Forecast refresh started. The page updates in about a minute.' });
      setTimeout(() => load(), 60000);
    } catch (e) {
      setNote({ ok: false, text: e.message });
    } finally {
      setBusy('');
    }
  };

  if (error && !data) return <Screen title="The weather service is not available">{error}</Screen>;
  if (!data) return <Screen title="Loading the weather centre…"><span className="fx-spinner" /></Screen>;
  const n = data.national;
  const st = data.status;
  if (!st.enabled) return <Screen title="The weather engine is off">Set WEATHER2_ENABLED=true in the backend .env and restart it.</Screen>;
  if (!n.stations) {
    return (
      <Screen title="The forecast engine is warming up">
        {st.lastForecastError || (st.stations ? `Forecasting ${st.stations} stations (${st.nodes} points). The first run takes up to two minutes after the server starts.` : 'Reading the station list…')}
        <div style={{ marginTop: 12 }}><span className="fx-spinner" /></div>
      </Screen>
    );
  }
  const atRisk = n.byLevel[2] + n.byLevel[3];
  const gust = n.windiest && (isNum(n.windiest.current.windGust) ? n.windiest.current.windGust : n.windiest.current.windSpeed);

  const markers = data.stations.map((s) => ({
    id: s.key,
    lat: s.lat,
    lon: s.lon,
    r: 6 + Math.min(10, ((s.rain24hMax && s.rain24hMax.total) || 0) / 5),
    fill: RISK_COLOR[s.level24h],
    label: `${s.name}: ${fmt1(s.current.temperature)}°C · ${s.current.condition}`,
    popup: (
      <div className="wx-stack">
        <b>{s.name}</b>
        <span className="wx-row"><WeatherIcon code={s.current.weatherCode} isDay={s.current.isDay} title={s.current.condition} /> {fmt1(s.current.temperature)}°C · {s.current.condition}</span>
        <span>Rain chance {fmt0(s.current.pop)}% (area {fmt0(s.current.popArea)}%)</span>
        <RiskBadge level={s.level24h} label={`${s.label24h}${s.drivers24h.length ? ` · ${s.drivers24h.join(', ')}` : ''}`} />
        <Link to={stationPath(s.key)}>Open the station forecast →</Link>
      </div>
    ),
  }));
  if (point) markers.push({ id: '__point', lat: point.lat, lon: point.lon, r: 7, stroke: '#e6ecf5', dash: true, label: 'Point forecast' });

  return (
    <main className="gx-main">
      <div className="fx-tiles wx-kpis">
        <div className={`fx-tile hero ${n.maxLevel >= 3 ? 'bad' : ''}`}><span>Watch or warning</span><b>{atRisk}<small>of {n.stations} stations</small></b><em>{data.alerts.length} active alerts, next 24 h</em></div>
        <div className="fx-tile"><span>Raining now</span><b>{n.raining}<small>{n.raining === 1 ? 'station' : 'stations'}</small></b><em>{data.raining.slice(0, 3).join(', ') || 'No rain at any station'}{data.raining.length > 3 ? '…' : ''}</em></div>
        <div className="fx-tile"><span>Hottest</span><b>{fmt1(n.hottest && n.hottest.current.temperature)}<small>°C</small></b><em>{n.hottest ? n.hottest.name : '—'}</em></div>
        <div className="fx-tile"><span>Strongest gust</span><b>{fmt1(gust)}<small>m/s</small></b><em>{n.windiest ? n.windiest.name : '—'}</em></div>
        <div className="fx-tile"><span>Wettest next 24 h</span><b>{fmt1(n.wettest24h && n.wettest24h.rain24hMax.total)}<small>mm</small></b><em>{n.wettest24h ? n.wettest24h.name : '—'}</em></div>
      </div>

      <div className="wx-grid">
        <section className="gx-panel">
          <header><h2>National weather risk</h2><span>Colour = worst risk in the next 24 h · size = rain in 24 h · click anywhere for a point forecast</span></header>
          <WxMap markers={markers} bounds={NIGERIA} fitKey="ng" height={460} minZoom={4} maxZoom={12} cursor="crosshair"
            onMapClick={(lat, lon) => setPoint({ lat, lon })} ariaLabel="Map of the weather stations" />
          <div className="wx-strip-legend">{['Normal', 'Advisory', 'Watch', 'Warning'].map((l, i) => <span key={l}><i style={{ background: RISK_COLOR[i] }} />{l}</span>)}</div>
        </section>
        <div className="wx-side">
          {point && <PointPanel point={point} onClose={() => setPoint(null)} />}
          <section className="gx-panel">
            <header><h2>Active alerts</h2><span>Watch or warning expected within 24 h</span></header>
            {data.alerts.length === 0 ? <div className="fx-none">No station expects hazardous weather in the next 24 hours.</div> : (
              <div className="wx-alerts">
                {data.alerts.slice(0, 40).map((a) => (
                  <button type="button" key={`${a.station}-${a.hazard}`} className={`wx-alert wx-risk-${a.level}`} onClick={() => history.push(stationPath(a.station))}>
                    <i style={{ background: RISK_COLOR[a.level] }} aria-hidden="true" />
                    <div>
                      <b>{a.station} — {hazardLabel(a.hazard)}</b>
                      <span>From {fmtDayHour(a.onset)} · peak {fmtDayHour(a.peak)}</span>
                      <small>{a.message}</small>
                    </div>
                    <RiskBadge level={a.level} />
                  </button>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>

      <section className="gx-panel">
        <header>
          <h2>Stations</h2><span>Point = at the station · area = anywhere within the {st.ringRadiusKm} km sampling ring · click a row for the full forecast</span>
          <div className="fx-table-tools">
            <input type="search" className="fx-search" placeholder="Find a station" value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Find a station" />
          </div>
        </header>
        <div className="fx-quick" role="group" aria-label="Filter stations">
          {FILTERS.map(([k, l]) => <button key={k} type="button" aria-pressed={filter === k} className={filter === k ? 'on' : ''} onClick={() => setFilter(k)}>{l}</button>)}
        </div>
        <div className="gx-table-wrap wx-table-wrap">
          <table className="gx-table wx-table">
            <thead>
              <tr><th>Station</th><th>Now</th><th className="r">Temp</th><th className="r">Rain chance point / area</th><th className="r">Gust m/s</th><th>Next rain</th><th className="r">24 h rain mm</th><th>Risk 24 h</th><th className="r">Confidence</th></tr>
            </thead>
            <tbody>
              {stations.map((s) => (
                <tr key={s.key} className="can-open" tabIndex={0} onClick={() => history.push(stationPath(s.key))}
                  onKeyDown={(e) => { if (e.key === 'Enter') history.push(stationPath(s.key)); }}>
                  <td><b>{s.name}</b><div className="fx-hint">{s.type.toLowerCase()}{s.isHydro ? ' · hydro' : ''}</div></td>
                  <td><span className="wx-row"><WeatherIcon code={s.current.weatherCode} isDay={s.current.isDay} size={18} title={s.current.condition} />{s.current.condition}</span></td>
                  <td className="r">{fmt1(s.current.temperature)}°</td>
                  <td className="r">{fmt0(s.current.pop)}% / {fmt0(s.current.popArea)}%</td>
                  <td className="r">{fmt1(s.current.windGust)}</td>
                  <td>{s.nextRain ? `${fmtDayHour(s.nextRain.start)} · ${s.nextRain.total} mm` : <span className="fx-hint">none in 7 days</span>}</td>
                  <td className="r">{fmt(s.rain24hMax && s.rain24hMax.total, 1)}</td>
                  <td><RiskBadge level={s.level24h} label={s.level24h ? `${s.label24h}${s.drivers24h[0] ? ` · ${s.drivers24h[0]}` : ''}` : undefined} /></td>
                  <td className="r">{fmt0(s.current.confidence)}%</td>
                </tr>
              ))}
              {!stations.length && <tr><td colSpan={9} className="fx-none">No station matches.</td></tr>}
            </tbody>
          </table>
        </div>
      </section>

      <section className="gx-panel">
        <header><h2>Downloads and engine</h2></header>
        <div className="fx-actions">
          <button type="button" className="gx-btn" onClick={download} disabled={!!busy}>{busy === 'report' ? 'Preparing…' : 'Forecast report (Excel, 72 h)'}</button>
          {isAdmin && <button type="button" className="gx-btn" onClick={refresh} disabled={!!busy}>{busy === 'refresh' ? 'Starting…' : 'Refresh forecast now'}</button>}
          <Link className="gx-btn" to="/weather_download_fix">Observed rainfall report</Link>
        </div>
        {note && <p className={note.ok ? 'fx-ok' : 'fx-warn'}>{note.text}</p>}
        <p className="fx-hint">
          {st.provider} · models {st.models.join(', ')} · {st.stations} stations × {st.ringNodes + 1} points ({st.ringRadiusKm} km ring) = {st.nodes} forecast points ·
          forecast {ago(st.lastForecastAt && new Date(st.lastForecastAt).getTime())} (every {st.forecastRefreshMin} min) ·
          {st.nowcastEnabled ? ` live observations ${ago(st.lastNowcastAt && new Date(st.lastNowcastAt).getTime())} (${st.observationsOk} stations)` : ' live observations off (no OpenWeatherMap key)'} ·
          about {fmt0(st.estimatedDailyForecastCalls)} forecast calls a day
          {st.lastForecastError ? ` · last problem: ${st.lastForecastError}` : ''}
          {!st.tablesReady ? ' · weather2 tables missing: nodes and alert history are not kept (run database/migrations/002_weather2.sql)' : ''}
        </p>
      </section>
    </main>
  );
}

/* ================================================================= station */
const NODE_COLOR = { center: '#3987e5', ring: '#8cc0ff', custom: '#e0629a' };
const nodeBounds = (nodes) => {
  const lats = nodes.map((x) => x.lat);
  const lons = nodes.map((x) => x.lon);
  return [[Math.min(...lats) - 0.05, Math.min(...lons) - 0.05], [Math.max(...lats) + 0.05, Math.max(...lons) + 0.05]];
};

function NodeEditor({ station, pick, onDone }) {
  const [f, setF] = useState({ label: '', role: 'area', weight: '1' });
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null);
  useEffect(() => { if (pick) setMsg(null); }, [pick]);
  const save = async (e) => {
    e.preventDefault();
    if (!pick) return;
    setBusy(true);
    setMsg(null);
    try {
      await api(`/api2/weather/stations/${encodeURIComponent(station)}/nodes`, {
        method: 'POST', body: { label: f.label, role: f.role, weight: Number(f.weight), lat: pick.lat, lon: pick.lon },
      });
      setF({ label: '', role: 'area', weight: '1' });
      setMsg({ ok: true, text: 'Node added. The station forecast was worked out again.' });
      onDone();
    } catch (err) {
      setMsg({ ok: false, text: err.message });
    } finally {
      setBusy(false);
    }
  };
  return (
    <form className="wx-stack" onSubmit={save}>
      <p className={pick ? 'fx-ok' : 'fx-hint'}>{pick ? `Selected ${pick.lat.toFixed(4)}, ${pick.lon.toFixed(4)}.` : 'Administrators: click the map to place an extra forecast point (for example along a line corridor or over a reservoir catchment).'}</p>
      <div className="fx-form">
        <label className="gx-field"><span className="gx-label">Label</span>
          <input type="text" required maxLength={80} value={f.label} onChange={(e) => setF({ ...f, label: e.target.value })} placeholder="e.g. Kainji–Jebba line km 40" /></label>
        <label className="gx-field"><span className="gx-label">Role</span>
          <select value={f.role} onChange={(e) => setF({ ...f, role: e.target.value })}>
            <option value="area">Area: counts for the area risk only</option>
            <option value="point">Point: also shapes the station forecast</option>
          </select>
        </label>
        <label className="gx-field narrow"><span className="gx-label">Weight</span>
          <input type="text" inputMode="decimal" value={f.weight} onChange={(e) => setF({ ...f, weight: e.target.value })} /></label>
        <div className="fx-actions"><button className="gx-btn gx-btn-primary" type="submit" disabled={!pick || busy}>{busy ? 'Adding…' : 'Add node'}</button></div>
      </div>
      {msg && <p className={msg.ok ? 'fx-ok' : 'fx-warn'}>{msg.text}</p>}
    </form>
  );
}

function Station({ session, name }) {
  const [d, setD] = useState(null);
  const [error, setError] = useState(null);
  const [pick, setPick] = useState(null);
  const [msg, setMsg] = useState(null);
  const isAdmin = !!(session.user && session.user.isAdmin);

  const load = useCallback((signal) => api(`/api2/weather/stations/${encodeURIComponent(name)}`, { signal })
    .then((x) => { setD(x); setError(null); })
    .catch((e) => { if (e.name !== 'AbortError') setError(e.message); }), [name]);
  useEffect(() => {
    const ctrl = new AbortController();
    setD(null);
    setPick(null);
    load(ctrl.signal);
    const t = setInterval(() => load(ctrl.signal), 10 * 60000);
    return () => { ctrl.abort(); clearInterval(t); };
  }, [load]);

  const nowSec = Date.now() / 1000;
  const window72 = useMemo(() => ((d && d.hourly) || []).filter((h) => h.t >= nowSec - 3 * 3600).slice(0, 75), [d]); // eslint-disable-line react-hooks/exhaustive-deps

  const back = <Link to="/nccweather_fix" className="gx-btn wx-back">← Weather centre</Link>;
  if (error && !d) return <main className="gx-main">{back}<section className="gx-panel"><p className="gx-error-text">{error}</p></section></main>;
  if (!d) return <Screen title="Loading the station forecast…"><span className="fx-spinner" /></Screen>;
  if (d.pending) return <main className="gx-main">{back}<section className="gx-panel"><div className="fx-none">{d.station.name}: no forecast yet. The next engine run includes it.</div></section></main>;

  const c = d.current;
  const s = d.summary;
  const removeNode = async (node) => {
    if (!window.confirm(`Remove the forecast point "${node.label}"?`)) return;
    setMsg(null);
    try {
      await api(`/api2/weather/nodes/${encodeURIComponent(node.dbId)}`, { method: 'DELETE' });
      setMsg({ ok: true, text: `Removed ${node.label}.` });
      load();
    } catch (err) {
      setMsg({ ok: false, text: err.message });
    }
  };
  const nowcast = Object.entries((d.corrections && d.corrections.nowcast) || {});
  const learned = Object.entries((d.corrections && d.corrections.learned) || {});
  const ringKm = (d.nodes.find((x) => x.kind === 'ring') || {}).distanceKm || 15;
  const markers = d.nodes.map((x) => ({
    id: x.id,
    lat: x.lat,
    lon: x.lon,
    r: x.kind === 'center' ? 9 : 7,
    fill: NODE_COLOR[x.kind] || NODE_COLOR.ring,
    label: `${x.label}: ${fmt1(x.now && x.now.temperature)}°C · ${fmt(x.now && x.now.precipitation, 1)} mm/h`,
    popup: (
      <div className="wx-stack">
        <b>{x.label}</b>
        <span>{x.kind} · {x.role} · {fmt1(x.distanceKm)} km from the station</span>
        <span>{fmt1(x.now && x.now.temperature)}°C · rain {fmt(x.now && x.now.precipitation, 2)} mm/h · chance {fmt0(x.now && x.now.pop)}%</span>
        <span>Next 6 h rain {fmt1(x.next6hRain)} mm · gust {fmt1(x.now && x.now.windGust)} m/s</span>
      </div>
    ),
  }));
  if (pick) markers.push({ id: '__pick', lat: pick.lat, lon: pick.lon, r: 7, stroke: '#e6ecf5', dash: true, label: 'New node' });

  return (
    <main className="gx-main">
      <div className="wx-row wx-between">
        {back}
        <span className="fx-hint">Issued {ago(d.issuedAt && new Date(d.issuedAt).getTime())} · {(d.models || []).join(', ')} · {d.members} forecast members</span>
      </div>

      <div className="wx-grid">
        <section className="gx-panel">
          <div className="wx-now">
            <WeatherIcon code={c.weatherCode} isDay={c.isDay} size={56} title={c.condition} />
            <div>
              <div className="wx-temp">{fmt1(c.temperature)}°</div>
              <div className="gx-muted">Feels {fmt1(c.apparent)}° · dew point {fmt1(c.dewPoint)}°</div>
            </div>
            <div className="wx-stack">
              <h2 className="wx-title">{d.station.name}</h2>
              <div className="wx-cap">{c.condition}</div>
              <div className="wx-row wx-wrap">
                <span className="wx-chip">{d.station.type.toLowerCase()}{d.station.isHydro ? ' · hydro' : ''}</span>
                <span className="wx-chip accent">{c.source === 'fused' ? 'Fused forecast' : `Live observation ${ago(new Date(c.observedAt).getTime())}`}</span>
                <span className="wx-chip">Confidence {fmt0(c.confidence)}%</span>
              </div>
            </div>
          </div>
          <dl className="wx-kv">
            <dt>Humidity</dt><dd>{fmt0(c.humidity)}%</dd>
            <dt>Wind</dt><dd>{fmt1(c.windSpeed)} m/s {compass(c.windDeg)}</dd>
            <dt>Gust</dt><dd>{fmt1(c.windGust)} m/s</dd>
            <dt>Pressure</dt><dd>{fmt0(c.pressure)} hPa</dd>
            <dt>Rain chance</dt><dd>{fmt0(c.pop)}% at the station</dd>
            <dt>In the area</dt><dd>{fmt0(c.popArea)}% · {fmt0(c.rainCoverage)}% of points</dd>
            <dt>CAPE</dt><dd>{fmt0(c.cape)} J/kg</dd>
            <dt>Visibility</dt><dd>{isNum(c.visibility) ? `${fmt1(c.visibility / 1000)} km` : '—'}</dd>
          </dl>
          {(nowcast.length > 0 || learned.length > 0) && (
            <p className="fx-hint wx-note">
              {nowcast.length > 0 && <>Anchored to the live observation ({nowcast.map(([k, v]) => (v === true ? 'rain now' : `${k} ${v > 0 ? '+' : ''}${v}`)).join(', ')}). </>}
              {learned.length > 0 && <>Station bias learned over the last 7 days removed ({learned.map(([k, v]) => `${k} ${v > 0 ? '+' : ''}${v}`).join(', ')}).</>}
            </p>
          )}
          <div>
            <div className="wx-row wx-between" style={{ marginBottom: 8 }}>
              <b>Grid weather risk, next 72 h</b>
              <RiskBadge level={s.level24h} label={`24 h: ${s.label24h}`} />
            </div>
            <RiskStrip hours={window72} />
          </div>
        </section>

        <section className="gx-panel">
          <header><h2>Alerts and advice</h2><span>24 h max rainfall {fmt1(s.rain24hMax.total)} mm · thunder score {s.maxThunderScore24h}/100</span></header>
          {s.alerts.length === 0 ? <div className="fx-none">No watch or warning: within normal operating limits for the next 24 h.</div> : (
            <div className="wx-alerts">
              {s.alerts.map((a) => (
                <div key={a.hazard} className={`wx-alert wx-risk-${a.level}`}>
                  <i style={{ background: RISK_COLOR[a.level] }} aria-hidden="true" />
                  <div>
                    <b>{hazardLabel(a.hazard)}</b>
                    <span>{fmtDayHour(a.onset)} → {fmtDayHour(a.ends)} · peak {fmt1(a.peakValue)}</span>
                    <small>{a.message}</small>
                  </div>
                  <RiskBadge level={a.level} />
                </div>
              ))}
            </div>
          )}
          {d.rainWindows.length > 0 && (
            <>
              <b className="wx-sub">Expected rain</b>
              <div className="gx-table-wrap">
                <table className="gx-table wx-mini">
                  <thead><tr><th>From</th><th className="r">Hours</th><th className="r">Total mm</th><th className="r">Chance</th><th /></tr></thead>
                  <tbody>
                    {d.rainWindows.slice(0, 6).map((w) => (
                      <tr key={w.start}>
                        <td>{fmtDayHour(w.start)}</td><td className="r">{w.hours}</td><td className="r">{w.total}</td>
                        <td className="r">{w.maxPop}%</td><td>{w.thunder ? <span className="wx-chip storm">thunder</span> : null}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </section>
      </div>

      <div className="wx-charts">
        <section className="gx-panel"><header><h2>Temperature</h2><span>°C, fused and corrected</span></header>
          <HourlyChart data={window72} nowSec={nowSec} domain={['auto', 'auto']} series={[
            { key: 'temperature', name: 'Air temperature', color: SERIES[0], unit: '°C' },
            { key: 'apparent', name: 'Feels like', color: SERIES[1], unit: '°C', dashed: true },
          ]} />
        </section>
        <section className="gx-panel"><header><h2>Rainfall</h2><span>mm per hour, at the station and at the wettest point in the area</span></header>
          <HourlyChart data={window72} nowSec={nowSec} series={[
            { key: 'precipitation', name: 'At the station', color: SERIES[0], unit: 'mm', type: 'bar', digits: 2 },
            { key: 'precipAreaMax', name: 'Area maximum', color: SERIES[1], unit: 'mm', type: 'bar', digits: 2 },
          ]} />
        </section>
        <section className="gx-panel"><header><h2>Chance of rain</h2><span>%, at the station and anywhere in the area</span></header>
          <HourlyChart data={window72} nowSec={nowSec} domain={[0, 100]} series={[
            { key: 'pop', name: 'At the station', color: SERIES[0], unit: '%', digits: 0 },
            { key: 'popArea', name: 'In the area', color: SERIES[1], unit: '%', digits: 0, dashed: true },
          ]} />
        </section>
        <section className="gx-panel"><header><h2>Wind</h2><span>m/s · gust limits 12 / 17 / 24</span></header>
          <HourlyChart data={window72} nowSec={nowSec} refY={17} refLabel="17 m/s watch" series={[
            { key: 'windSpeed', name: 'Mean wind', color: SERIES[0], unit: 'm/s' },
            { key: 'gustAreaMax', name: 'Strongest gust in the area', color: SERIES[1], unit: 'm/s', dashed: true },
          ]} />
        </section>
        <section className="gx-panel"><header><h2>Thunderstorm potential</h2><span>0–100 score from CAPE, lifted index, rain chance and the model storm signal</span></header>
          <HourlyChart data={window72} nowSec={nowSec} domain={[0, 100]} refY={55} refLabel="55 watch" series={[
            { key: 'thunderScore', name: 'Thunder score', color: SERIES[0], unit: '/100', digits: 0 },
          ]} />
        </section>
        <section className="gx-panel"><header><h2>Forecast confidence</h2><span>%, agreement between points and models, lower further ahead</span></header>
          <HourlyChart data={window72} nowSec={nowSec} domain={[0, 100]} series={[
            { key: 'confidence', name: 'Confidence', color: SERIES[0], unit: '%', digits: 0 },
          ]} />
        </section>
      </div>

      <section className="gx-panel">
        <header><h2>Daily outlook</h2></header>
        <div className="wx-days">
          {d.daily.map((day) => (
            <div key={day.day} className="wx-day" style={day.riskLevel ? { borderTopColor: RISK_COLOR[day.riskLevel] } : undefined}>
              <b>{fmtDay(day.day)}</b>
              <WeatherIcon code={day.weatherCode} size={28} title={day.condition} />
              <span>{day.condition}</span>
              <span className="wx-mono"><b>{fmt0(day.tempMax)}°</b> <span className="gx-muted">{fmt0(day.tempMin)}°</span></span>
              <small>{fmt1(day.precipSum)} mm · {fmt0(day.popAreaMax)}% area</small>
              <small>Gust {fmt1(day.gustMax)} m/s</small>
              {day.riskLevel > 0 && <RiskBadge level={day.riskLevel} />}
              {isNum(day.sunrise) && <small className="gx-muted">Daylight {fmtHour(day.sunrise)}–{fmtHour(day.sunset)}</small>}
            </div>
          ))}
        </div>
      </section>

      <div className="wx-grid">
        <section className="gx-panel">
          <header><h2>Forecast points</h2><span>Each point is forecast on its own, then combined · dashed ring = {ringKm} km · pink = added by an administrator</span></header>
          <WxMap key={d.station.key} markers={markers} rings={[{ id: 'ring', lat: d.station.lat, lon: d.station.lon, radiusKm: ringKm }]}
            bounds={nodeBounds(d.nodes)} fitKey={d.station.key} height={380} minZoom={6} maxZoom={14}
            cursor={isAdmin ? 'crosshair' : 'grab'} onMapClick={isAdmin ? (lat, lon) => setPick({ lat, lon }) : undefined}
            ariaLabel={`Forecast points around ${d.station.name}`} />
          {isAdmin && <NodeEditor station={d.station.name} pick={pick} onDone={() => { setPick(null); load(); }} />}
          {msg && <p className={msg.ok ? 'fx-ok' : 'fx-warn'}>{msg.text}</p>}
        </section>
        <section className="gx-panel">
          <header><h2>Readings at each point now</h2></header>
          <div className="gx-table-wrap">
            <table className="gx-table wx-mini">
              <thead><tr><th>Point</th><th className="r">Temp</th><th className="r">Rain mm/h</th><th className="r">Next 6 h mm</th><th className="r">Gust</th>{isAdmin && <th />}</tr></thead>
              <tbody>
                {d.nodes.map((x) => (
                  <tr key={x.id}>
                    <td><span className="wx-dot" style={{ background: NODE_COLOR[x.kind] || NODE_COLOR.ring }} />{x.label}<div className="fx-hint">{x.role} · {fmt1(x.distanceKm)} km</div></td>
                    <td className="r">{fmt1(x.now && x.now.temperature)}°</td>
                    <td className="r">{fmt(x.now && x.now.precipitation, 1)}</td>
                    <td className="r">{fmt1(x.next6hRain)}</td>
                    <td className="r">{fmt1(x.now && x.now.windGust)}</td>
                    {isAdmin && <td className="r">{x.kind === 'custom' && x.dbId ? <button type="button" className="gx-btn wx-del" onClick={() => removeNode(x)} aria-label={`Remove ${x.label}`}>Remove</button> : null}</td>}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}

function decodeName(raw) {
  try { return decodeURIComponent(raw); } catch (e) { return raw; }
}

export default function WeatherFix() {
  const params = useParams();
  const name = params.name ? decodeName(params.name) : null;
  return (
    <FixPage title={name ? `Weather · ${name}` : 'Weather centre'} eyebrow="NCC weather">
      {(session) => (name ? <Station session={session} name={name} /> : <Overview session={session} />)}
    </FixPage>
  );
}

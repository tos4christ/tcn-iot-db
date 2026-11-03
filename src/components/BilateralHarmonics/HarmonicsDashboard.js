/**
 * Harmonics analysis screens:
 *   HarmonicsPage     full page: /harmonics (all stations) and /{slug}_harmonics (one station)
 *   HarmonicsSection  the same analysis as a section under a company's bilateral table
 * Figures come from harmonicsAnalysis.js; limits and thresholds from harmonicsConfig.js.
 */
import React, { useEffect, useMemo, useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import nisoLogo from '../../assets/img/niso_logo_main.jpg';
import { Sparkline, TrendChart, useWidth } from '../GencoPortal/charts';
import '../GencoPortal/genco_portal.css';
import './harmonics.css';
import { headline } from './harmonicsAnalysis';
import { SETTINGS, isCommissioned, stationBySlug } from './harmonicsConfig';
import { harmonicsStore, stationKey } from './harmonicsStore';

// Validated categorical palette, same as the Genco portal.
const PHASE = { ia: '#3987e5', ib: '#d95926', ic: '#199e70' };
const LIMIT_LABEL = { pass: 'Within limits', watch: 'Near limit', violation: 'Violation', insufficient: 'Collecting', nodata: 'No data' };
const RANGES = [{ key: '30m', label: '30 min', ms: 30 * 60000 }, { key: '2h', label: '2 hours', ms: 2 * 3600000 }, { key: '6h', label: '6 hours', ms: 6 * 3600000 }];

const fmt = (v, d = 2) => (v === null || v === undefined || !Number.isFinite(v) ? '—' : v.toFixed(d));
const clock = (t) => new Date(t).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Africa/Lagos' });
const clockSec = (t) => new Date(t).toLocaleTimeString('en-GB', { timeZone: 'Africa/Lagos' });
const duration = (ms) => { const m = Math.round(ms / 60000); return m < 1 ? `${Math.round(ms / 1000)} s` : m < 60 ? `${m} min` : `${Math.floor(m / 60)} h ${m % 60} min`; };

/** Re-render on a steady tick; the store keeps recording in the background. */
function useTick(ms = 5000) {
  const [, setTick] = useState(0);
  useEffect(() => {
    harmonicsStore.start();
    const t = setInterval(() => setTick((n) => n + 1), ms);
    return () => clearInterval(t);
  }, [ms]);
}

function StatusPill({ status }) {
  return <span className={`hx-pill ${status}`}><i aria-hidden="true" />{LIMIT_LABEL[status] || status}</span>;
}

function Panel({ title, sub, children, className = '' }) {
  return (
    <section className={`gx-panel ${className}`}>
      <header><h2>{title}</h2>{sub && <span>{sub}</span>}</header>
      {children}
    </section>
  );
}

function Gauge({ label, value, limit, unit = '%', sub }) {
  const ratio = Number.isFinite(value) && limit ? value / limit : 0;
  const state = !Number.isFinite(value) ? '' : ratio > 1 ? 'over' : ratio >= SETTINGS.watchFraction ? 'near' : 'ok';
  return (
    <div className={`hx-gauge ${state}`}>
      <span>{label}</span>
      <b>{fmt(value)}<small>{unit}</small></b>
      <div className="hx-bar" role="img" aria-label={`${fmt(value)} of ${limit} limit`}>
        <i style={{ width: `${Math.min(100, ratio * 100)}%` }} />
      </div>
      <small>{limit ? `Limit ${limit}${unit}` : ''}{sub ? ` · ${sub}` : ''}</small>
    </div>
  );
}

/* ---------------------------------------------------------------- charts specific to harmonics */

/** THDv against harmonic current, one dot per minute, with the fitted line. */
function Scatter({ points, fit, height = 260 }) {
  const [ref, width] = useWidth();
  const [hover, setHover] = useState(null);
  if (points.length < 3) return <div ref={ref} className="gx-chart-empty" style={{ height }}>Collecting one-minute readings under load…</div>;
  const pad = { l: 52, r: 16, t: 12, b: 38 };
  const xs = points.map((p) => p.x);
  const ys = points.map((p) => p.y);
  const x0 = 0;
  const x1 = Math.max(...xs) * 1.1 || 1;
  const y0 = 0;
  const y1 = Math.max(...ys) * 1.15 || 1;
  const w = Math.max(10, width - pad.l - pad.r);
  const h = height - pad.t - pad.b;
  const X = (v) => pad.l + ((v - x0) / (x1 - x0)) * w;
  const Y = (v) => pad.t + h - ((v - y0) / (y1 - y0)) * h;
  const ticks = [0, 0.25, 0.5, 0.75, 1];
  return (
    <div ref={ref} className="gx-chart" style={{ height }}>
      <svg width={width} height={height} role="img" aria-label="Voltage distortion against harmonic current">
        {ticks.map((f) => (
          <g key={f}>
            <line x1={pad.l} x2={width - pad.r} y1={Y(y1 * f)} y2={Y(y1 * f)} className="gx-grid" />
            <text x={pad.l - 8} y={Y(y1 * f) + 4} textAnchor="end" className="gx-axis">{(y1 * f).toFixed(1)}</text>
            <text x={X(x1 * f)} y={height - 22} textAnchor={f === 0 ? 'start' : f === 1 ? 'end' : 'middle'} className="gx-axis">{(x1 * f).toFixed(1)}</text>
          </g>
        ))}
        <text x={width - pad.r} y={height - 6} textAnchor="end" className="gx-axis">Harmonic current (A)</text>
        <text x={pad.l} y={pad.t - 2} className="gx-axis">THDv %</text>
        {points.map((p) => (
          <circle key={p.t} cx={X(p.x)} cy={Y(p.y)} r={hover === p.t ? 6 : 4} fill={PHASE.ia} fillOpacity={0.7} stroke="var(--gx-surface)" strokeWidth={1}
            onMouseEnter={() => setHover(p.t)} onMouseLeave={() => setHover(null)} />
        ))}
        {fit && <line x1={X(0)} y1={Y(fit.intercept)} x2={X(x1)} y2={Y(fit.intercept + fit.slope * x1)} stroke="#d95926" strokeWidth={2} />}
      </svg>
      {hover && (() => {
        const p = points.find((q) => q.t === hover);
        return p ? <div className="gx-tooltip" style={{ left: Math.min(X(p.x) + 10, width - 180) }}><div className="gx-tooltip-time">{clock(p.t)}</div><div className="gx-tooltip-row"><span>Harmonic current</span><b>{p.x.toFixed(2)} A</b></div><div className="gx-tooltip-row"><span>THDv</span><b>{p.y.toFixed(2)} %</b></div></div> : null;
      })()}
    </div>
  );
}

/** One cell per 10-minute block, showing how close each was to the limit. */
function BlockStrip({ blocks, field, limit, label }) {
  const state = (v) => (v > limit ? 'over' : v >= limit * SETTINGS.watchFraction ? 'near' : 'ok');
  return (
    <div className="hx-strip-row">
      <span>{label}</span>
      <div className="hx-strip">
        {blocks.length === 0 && <em>No 10-minute blocks yet</em>}
        {blocks.map((b) => (
          <i key={b.t} className={Number.isFinite(b[field]) ? state(b[field]) : ''} title={`${clock(b.t)}: ${fmt(b[field])}% (limit ${limit}%)`} />
        ))}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- alerts */

function AlertCard({ a }) {
  const icon = { violation: '!', watch: '▲', info: 'i' }[a.level];
  const levelName = { violation: 'Violation', watch: 'Watch', info: 'Notice' }[a.level];
  return (
    <article className={`hx-alert ${a.level}`}>
      <div className="hx-alert-head"><span aria-hidden="true">{icon}</span><b>{a.title}</b><em>{levelName}</em></div>
      <p>{a.detail}</p>
      {a.consequence && <p><strong>Effect on the grid:</strong> {a.consequence}</p>}
      {a.action && <p><strong>What to do:</strong> {a.action}</p>}
    </article>
  );
}

/* ---------------------------------------------------------------- one station */

const ATTR_TEXT = {
  insufficient: ['Not enough data yet', `This needs at least ${SETTINGS.storageWarnMinutes} minutes of readings under load.`],
  steady: ['Load has been too steady to tell', 'The study compares distortion as the load changes. Check again after the load has moved.'],
  station: ['This station is the likely source', 'Voltage distortion rises and falls with this station\'s harmonic current.'],
  background: ['Distortion is coming from the network', 'Voltage distortion does not follow this station\'s harmonic current.'],
  mixed: ['Partly linked to this station', 'Voltage distortion follows this station\'s harmonic current only in part. Other sources are also present.'],
};

export function StationAnalysis({ entry }) {
  const a = harmonicsStore.analysis(entry);
  const [range, setRange] = useState('2h');
  const win = RANGES.find((r) => r.key === range).ms;
  const now = Date.now();
  const hist = (a.samples || []).filter((s) => s.t >= now - win);

  const series = useMemo(() => {
    // Thin long ranges for drawing only; all samples still go into the statistics.
    const step = Math.max(1, Math.floor(hist.length / 500));
    const thin = hist.filter((_, i) => i % step === 0);
    const line = (key) => thin.map((s) => ({ t: s.t, v: s[key] }));
    return { thin, thdv: line('thdv'), tdd: thin.map((s) => ({ t: s.t, v: s.loaded ? s.tdd : null })), ia: line('ia'), ib: line('ib'), ic: line('ic'), mw: line('mw'), ih: thin.map((s) => ({ t: s.t, v: s.ih })) };
  }, [a.samples, range, hist.length]); // eslint-disable-line react-hooks/exhaustive-deps

  if (a.overall === 'nodata') {
    return (
      <div className="hx-empty">
        <b>{entry.cfg.name}</b>
        <p>No harmonic readings have reached this device yet. Readings are recorded from the moment this page is opened and kept here for {SETTINGS.keepHours} hours.</p>
      </div>
    );
  }

  const exportCsv = () => {
    const rows = ['time,mw,current_a,kv,pf,thdv,thdia,thdib,thdic,tdd_calculated,tdd_meter,harmonic_current_a'];
    a.samples.forEach((s) => rows.push([new Date(s.t).toISOString(), s.mw, s.a, s.v, s.pf, s.thdv, s.ia, s.ib, s.ic, s.tdd === null ? '' : s.tdd.toFixed(3), s.tddMeter, s.ih === null ? '' : s.ih.toFixed(3)].map((v) => v ?? '').join(',')));
    const url = URL.createObjectURL(new Blob([rows.join('\n')], { type: 'text/csv' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `${(entry.cfg.slug || entry.cfg.id)}_harmonics_${new Date().toISOString().slice(0, 16).replace(/[:T]/g, '-')}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const live = a.lastLiveSample;
  const attr = ATTR_TEXT[a.attr.verdict] || ATTR_TEXT.insufficient;
  const allAlerts = a.alerts;

  return (
    <div className="hx-station">
      <div className={`hx-verdict ${a.overall}`}>
        <StatusPill status={a.overall} />
        <p>{headline(a)}</p>
        <span className={`gx-status ${a.live ? 'live' : 'stale'}`}><i />{a.live ? 'Live' : 'Not reporting'}</span>
      </div>

      {allAlerts.filter((x) => x.level !== 'info').length > 0 && (
        <div className="hx-alerts">
          {allAlerts.filter((x) => x.level !== 'info').map((x) => <AlertCard key={x.code} a={x} />)}
        </div>
      )}

      <div className="hx-gauges">
        <Gauge label="Voltage distortion (THDv)" value={live ? live.thdv : null} limit={a.limits.thdv} sub={a.limits.band} />
        <Gauge label="Current distortion (TDD)" value={live && live.loaded ? live.tdd : null} limit={a.limits.tdd} sub={live && !live.loaded ? 'load too low to assess' : `IL ${fmt(a.il, 0)} A`} />
        <Gauge label="Worst phase current THD" value={live ? live.thdi : null} />
        <div className="hx-gauge"><span>Harmonic current</span><b>{fmt(live ? live.ih : null)}<small>A</small></b><small>{fmt(a.harmonicMva, 3)} MVA of distortion</small></div>
        <div className="hx-gauge"><span>Extra I²R heating</span><b>{fmt(a.extraHeat)}<small>%</small></b><small>Added to feeder and transformer losses</small></div>
        <div className="hx-gauge"><span>Load</span><b>{fmt(live ? live.mw : null)}<small>MW</small></b><small>{fmt(live ? live.a : null, 1)} A · PF {fmt(live ? live.pf : null)}</small></div>
      </div>

      <Panel title="Compliance check" sub={`IEEE 519-2022 · ${a.kv ?? '?'} kV · ${a.limits.ratioKnown ? `Isc/IL ${a.limits.ratio.toFixed(0)}` : 'fault level not entered, strictest limit used'}`}>
        <div className="gx-table-wrap">
          <table className="gx-table">
            <thead><tr><th>Measure</th><th className="r">Now</th><th className="r">Average</th><th className="r">95th % (10 min)</th><th className="r">99th % (10 min)</th><th className="r">99th % (3 s)</th><th className="r">Limit</th><th className="r">Time above limit</th><th>Result</th></tr></thead>
            <tbody>
              {[a.thdv, a.tdd].map((m) => (
                <tr key={m.key}>
                  <td><b>{m.label}</b></td><td className="r">{fmt(m.now)}</td><td className="r">{fmt(m.avg)}</td><td className="r">{fmt(m.p95Short)}</td><td className="r">{fmt(m.p99Short)}</td>
                  <td className="r">{fmt(m.p99VeryShort)}</td><td className="r">{m.limit}%</td><td className="r">{fmt(m.overLimitPct, 1)}%</td><td><StatusPill status={m.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="hx-note">
          IEEE 519 assesses a full week: the 95th percentile of 10-minute values must stay under the limit, and short peaks may reach {`${1.5}`} to {`${2}`} times it.
          This device holds {SETTINGS.keepHours} hours ({fmt(a.windowHours, 1)} h so far, {fmt(a.coverage, 0)}% coverage), so treat this as an early indication, not a formal compliance finding.
          TDD excludes periods below {SETTINGS.minLoadFraction * 100}% of demand current ({fmt(a.lowLoadShare, 0)}% of readings).
        </p>
        <BlockStrip blocks={a.blocks} field="thdv" limit={a.limits.thdv} label="THDv, each 10 min" />
        <BlockStrip blocks={a.loadedBlocks} field="tdd" limit={a.limits.tdd} label="TDD, each 10 min" />
        <ul className="hx-legend" aria-label="Key"><li><i className="ok" />Under {SETTINGS.watchFraction * 100}% of limit</li><li><i className="near" />Near limit</li><li><i className="over" />Over limit</li></ul>
      </Panel>

      <div className="gx-filters" role="group" aria-label="Time range">
        <span className="gx-label">Time range</span>
        {RANGES.map((r) => <button key={r.key} type="button" className={range === r.key ? 'active' : ''} aria-pressed={range === r.key} onClick={() => setRange(r.key)}>{r.label}</button>)}
        <span className="gx-filters-note">Recorded on this device, kept for {SETTINGS.keepHours} hours</span>
        <button type="button" className="gx-btn gx-btn-ghost gx-export" onClick={exportCsv}>Export CSV</button>
      </div>

      <div className="hx-grid">
        <Panel title="Voltage distortion" sub="THDv, %">
          <TrendChart series={[{ key: `thdv-${entry.key}`, label: 'THDv', color: PHASE.ia, points: series.thdv }]} unit="%" digits={2} height={230} yMin={0} refLines={[{ label: `limit ${a.limits.thdv}%`, v: a.limits.thdv }]} />
        </Panel>
        <Panel title="Current distortion" sub="TDD, %, calculated (gaps = load too low)">
          <TrendChart series={[{ key: `tdd-${entry.key}`, label: 'TDD', color: PHASE.ib, points: series.tdd }]} unit="%" digits={2} height={230} yMin={0} refLines={[{ label: `limit ${a.limits.tdd}%`, v: a.limits.tdd }]} />
        </Panel>
        <Panel title="Current THD by phase" sub={a.phaseSpread ? `Phases differ by ${fmt(a.phaseSpread.max - a.phaseSpread.min)} points` : '%'}>
          <TrendChart series={[{ key: 'ia', label: 'Phase A', color: PHASE.ia, points: series.ia }, { key: 'ib', label: 'Phase B', color: PHASE.ib, points: series.ib }, { key: 'ic', label: 'Phase C', color: PHASE.ic, points: series.ic }]} unit="%" digits={2} height={230} yMin={0} />
          <ul className="gx-legend inline"><li><i style={{ background: PHASE.ia }} /><span>Phase A</span></li><li><i style={{ background: PHASE.ib }} /><span>Phase B</span></li><li><i style={{ background: PHASE.ic }} /><span>Phase C</span></li></ul>
        </Panel>
        <Panel title="Load" sub="MW, to compare with distortion">
          <TrendChart series={[{ key: `mw-${entry.key}`, label: 'Load', color: '#9085e9', points: series.mw }]} unit="MW" digits={2} height={230} yMin={0} />
        </Panel>
      </div>

      <div className="hx-grid">
        <Panel title="Is this station affecting the grid?" sub="Voltage distortion against this station's harmonic current">
          <div className={`hx-attr ${a.attr.verdict}`}>
            <b>{attr[0]}</b>
            <p>{attr[1]}</p>
            {a.attr.fit && (
              <dl>
                <div><dt>Correlation</dt><dd>{a.attr.fit.r.toFixed(2)}</dd></div>
                <div><dt>Network background</dt><dd>{fmt(a.attr.background)}%</dd></div>
                <div><dt>Share linked to station</dt><dd>{a.attr.share === null ? '—' : `${a.attr.share.toFixed(0)}%`}</dd></div>
              </dl>
            )}
          </div>
          <Scatter points={a.attr.points} fit={a.attr.fit} />
          <p className="hx-note">Each dot is one minute. A rising line means distortion follows this station. This is an indicator from one measuring point. A formal finding needs a measurement at the connection point with the load switched.</p>
        </Panel>
        <Panel title="Effect on equipment" sub="Why these numbers matter">
          <dl className="hx-effects">
            <div><dt>Extra conductor heating</dt><dd>{fmt(a.extraHeat)}%</dd><p>Extra I²R loss in lines, cables and transformers. It uses up capacity even when MW looks normal.</p></div>
            <div><dt>Distortion power factor</dt><dd>{fmt(a.distortionPf, 3)}</dd><p>The part of power factor lost to harmonics, on top of ordinary reactive load. 1.000 means none.</p></div>
            <div><dt>Harmonic loading</dt><dd>{fmt(a.harmonicMva, 3)} MVA</dd><p>Apparent power carried at harmonic frequencies. It delivers no useful energy.</p></div>
            <div><dt>Phase balance</dt><dd>{a.phaseSpread ? `${a.phaseSpread.worst} worst` : '—'}</dd><p>{a.phaseSpread && a.phaseSpread.flagged ? 'Unbalanced: points to large single-phase nonlinear loads.' : 'No significant difference between phases.'}</p></div>
          </dl>
        </Panel>
      </div>

      <div className="hx-grid">
        <Panel title="Excursion log" sub={`Over the limit for at least ${SETTINGS.minEventSec} s, last ${SETTINGS.keepHours} hours`}>
          {a.events.length === 0 ? <p className="hx-note">No excursions recorded.</p> : (
            <div className="gx-table-wrap">
              <table className="gx-table">
                <thead><tr><th>Measure</th><th>Start</th><th>End</th><th className="r">Lasted</th><th className="r">Peak</th><th className="r">Limit</th></tr></thead>
                <tbody>{a.events.slice(0, 15).map((e) => <tr key={`${e.metric}-${e.start}`}><td><b>{e.metric}</b></td><td>{clockSec(e.start)}</td><td>{clockSec(e.end)}</td><td className="r">{duration(e.end - e.start)}</td><td className="r">{fmt(e.peak)}%</td><td className="r">{e.limit}%</td></tr>)}</tbody>
              </table>
            </div>
          )}
        </Panel>
        <Panel title="Data checks" sub="How far these results can be relied on">
          {a.quality.length === 0 ? <p className="hx-note">No data problems found.</p> : a.quality.map((q) => (
            <article key={q.title} className={`hx-alert ${q.level === 'warning' ? 'watch' : 'info'}`}>
              <div className="hx-alert-head"><span aria-hidden="true">{q.level === 'warning' ? '▲' : 'i'}</span><b>{q.title}</b></div>
              <p>{q.detail}</p>
              <p><strong>What to do:</strong> {q.action}</p>
            </article>
          ))}
        </Panel>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- comparison table */

export function StationsTable({ entries, selected, onSelect, linkPages = false }) {
  const rows = entries.map((e) => ({ e, a: harmonicsStore.analysis(e) }))
    .sort((x, y) => (y.a.impact || 0) - (x.a.impact || 0));
  return (
    <div className="gx-table-wrap">
      <table className="gx-table hx-table">
        <thead>
          <tr>
            <th>Station</th><th>Status</th><th className="r">MW</th><th className="r">TDD %</th><th className="r">THDv %</th><th className="r">THDia %</th><th className="r">THDib %</th><th className="r">THDic %</th>
            <th className="r">% of limit</th><th>Grid impact</th><th className="r">Alerts</th><th>THDv trend</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(({ e, a }) => {
            const s = a.lastLiveSample;
            const count = (a.alerts || []).filter((x) => x.level !== 'info').length;
            const name = e.cfg.name;
            return (
              <tr key={e.key} className={selected === e.key ? 'is-selected' : ''} onClick={onSelect ? () => onSelect(e.key) : undefined}>
                <td><b>{linkPages && e.cfg.slug ? <Link to={`/${e.cfg.slug}_harmonics`}>{name}</Link> : name}</b>{!a.live && a.overall !== 'nodata' && <small className="hx-off">not reporting</small>}</td>
                <td><StatusPill status={a.overall} /></td>
                <td className="r">{fmt(s ? s.mw : null)}</td>
                <td className={`r ${s && s.loaded && s.tdd > a.limits.tdd ? 'hx-over-d' : ''}`}>{fmt(s && s.loaded ? s.tdd : null)}</td>
                <td className={`r ${s && s.thdv > a.limits.thdv ? 'hx-over-d' : ''}`}>{fmt(s ? s.thdv : null)}</td>
                <td className="r">{fmt(s ? s.ia : null)}</td><td className="r">{fmt(s ? s.ib : null)}</td><td className="r">{fmt(s ? s.ic : null)}</td>
                <td className="r">{a.impact ? `${(a.impact * 100).toFixed(0)}%` : '—'}</td>
                <td>{!a.attr ? '—' : a.overall === 'pass' ? 'No concern' : (ATTR_TEXT[a.attr.verdict] || ATTR_TEXT.insufficient)[0]}</td>
                <td className="r">{count || '—'}</td>
                <td><Sparkline points={(a.samples || []).slice(-120).map((x) => ({ t: x.t, v: x.thdv }))} color={PHASE.ia} width={110} height={28} /></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/* ---------------------------------------------------------------- section under a bilateral table */

/** group = mesl, fipl, taopex, ndphc, sakete; leave out for every station. */
export function HarmonicsSection({ group = null, title = 'Harmonics analysis' }) {
  useTick();
  const entries = harmonicsStore.stations(group).filter(isCommissioned); // see UNCOMMISSIONED in harmonicsConfig.js
  const [selected, setSelected] = useState(null);
  const withData = entries.filter((e) => e.samples.length);
  const active = entries.find((e) => e.key === selected) || withData[0] || null;
  const violating = withData.filter((e) => harmonicsStore.analysis(e).overall === 'violation').length;
  return (
    <div className="gx-root hx-section">
      <div className="hx-section-head">
        <h2>{title}</h2>
        {violating > 0 && <span className="hx-pill violation"><i aria-hidden="true" />{violating} station{violating > 1 ? 's' : ''} in violation</span>}
        <Link className="gx-btn gx-btn-ghost" to="/harmonics">Open full page</Link>
      </div>
      {entries.length === 0 ? (
        <p className="hx-note">No station in this group sends harmonic readings yet. Any station that starts sending THD will appear here on its own.</p>
      ) : (
        <>
          <StationsTable entries={entries} selected={active ? active.key : null} onSelect={setSelected} />
          {active && <StationAnalysis key={active.key} entry={active} />}
        </>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------- full page */

export default function HarmonicsPage({ slug = null, isLoggedIn }) {
  useTick();
  const cfg = slug ? stationBySlug(slug) : null;
  useEffect(() => { document.title = cfg ? `${cfg.short} Harmonics · NISO` : 'Bilateral Harmonics · NISO'; }, [cfg]);
  if (!isLoggedIn || localStorage.getItem('token') === null) return <Redirect to="/" />;

  const entries = harmonicsStore.stations();
  const single = cfg ? entries.find((e) => e.key === stationKey(cfg.id, cfg.line) || e.cfg === cfg) : null;
  const shown = cfg ? [single].filter(Boolean) : entries.filter(isCommissioned); // a station's own page always shows it
  const analyses = shown.map((e) => harmonicsStore.analysis(e));
  const violations = analyses.filter((a) => a.overall === 'violation').length;
  const near = analyses.filter((a) => a.overall === 'watch').length;
  const reporting = analyses.filter((a) => a.live).length;

  return (
    <div className="gx-root">
      <header className="gx-top">
        <img src={nisoLogo} alt="NISO" className="gx-top-logo" />
        <div className="gx-top-title">
          <span className="gx-eyebrow">Bilateral power quality</span>
          <h1>{cfg ? cfg.name : 'Bilateral harmonics'}</h1>
        </div>
        <span className={`gx-status ${reporting ? 'live' : 'waiting'}`}><i />{reporting ? `${reporting} reporting` : 'Waiting for data'}</span>
        {cfg && <Link className="gx-btn gx-btn-ghost" to="/harmonics">All stations</Link>}
        <Link className="gx-btn gx-btn-ghost" to="/bilateral">Bilateral table</Link>
      </header>
      <main className="gx-main">
        {!harmonicsStore.persistent && <div className="hx-alert watch"><p>This browser is blocking storage, so history is lost when the page is closed.</p></div>}
        {!cfg && (
          <>
            <div className="hx-summary">
              <div><b>{shown.length}</b><span>Stations with harmonic metering</span></div>
              <div><b>{reporting}</b><span>Reporting now</span></div>
              <div className={violations ? 'bad' : ''}><b>{violations}</b><span>In violation</span></div>
              <div className={near ? 'warn' : ''}><b>{near}</b><span>Near a limit</span></div>
            </div>
            <Panel title="Stations ranked by grid impact" sub="Worst first">
              <StationsTable entries={shown} linkPages />
            </Panel>
          </>
        )}
        {cfg && single && <StationAnalysis entry={single} />}
        {!cfg && shown.filter((e) => e.samples.length).map((e) => (
          <section key={e.key} className="hx-block">
            <h2>{e.cfg.name}</h2>
            <StationAnalysis entry={e} />
          </section>
        ))}
        <footer className="gx-foot">Limits: IEEE 519-2022, editable in harmonicsConfig.js. Readings are recorded on this device for {SETTINGS.keepHours} hours and are not stored on the server yet.</footer>
      </main>
    </div>
  );
}

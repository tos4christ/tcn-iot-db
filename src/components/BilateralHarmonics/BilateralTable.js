/**
 * Smart bilateral table used by every bilateral page and /oau_steel_bilaterals.
 * The pages keep their own MW, kV, status and total calculations and pass the results in:
 *   rows: [{ sn, label, status: <checkConnection span> or 'live'/'off', mw, kv, data, line,
 *            parts, modal, warn, excluded }]
 *   parts: the meter blocks ({ mw, a, mx, pf, ... }) the page used for this row's MW. Current,
 *          MVar and power factor are read from the same blocks, so they always match the MW.
 *          Without parts: the line `line` of data, else the first line/transformer, else data.
 * Adds search, a connection filter, sortable columns, summary tiles, the live frequency and
 * the current, MVar, power factor and harmonic columns.
 */
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import nisoLogo from '../../assets/img/niso_logo_main.jpg';
import socket from '../utility/socketIO';
import '../GencoPortal/genco_portal.css';
import './harmonics.css';
import { harmonicValues } from './HarmonicCells';
import { harmonicsStore } from './harmonicsStore';

const COLUMNS = [
  { key: 'sn', label: 'S/N' },
  { key: 'label', label: 'Station' },
  { key: 'connected', label: 'Status' },
  { key: 'mwNum', label: 'Power (MW)', right: true },
  { key: 'kvNum', label: 'Voltage (kV)', right: true },
  { key: 'amp', label: 'Current (A)', right: true, title: 'Line current in amps (sum of the meters behind this row)' },
  { key: 'mvar', label: 'MVar', right: true, title: 'Reactive power, as metered (sum of the meters behind this row)' },
  { key: 'pf', label: 'PF', right: true, title: 'Power factor as the meter sent it. Hover or tap a value for the value worked out from MW and MVar, and how. "calc" = no meter figure, worked out. "!" = the meter figure needs a look.' },
  { key: 'tdd', label: 'TDD %', right: true, title: 'Total demand distortion of current, as the meter sent it. "calc" = the meter does not send TDD, so it is worked out from THD and current. Alerts use the same figure.' },
  { key: 'thdv', label: 'THDv %', right: true, title: 'Voltage total harmonic distortion' },
  { key: 'ia', label: 'THDia %', right: true, title: 'Current THD, phase A' },
  { key: 'ib', label: 'THDib %', right: true, title: 'Current THD, phase B' },
  { key: 'ic', label: 'THDic %', right: true, title: 'Current THD, phase C' },
];

const toNum = (v) => { const n = Number(v); return v !== null && v !== '' && Number.isFinite(n) ? n : null; };
const show = (v, d = 2) => { const n = toNum(v); return n === null ? (v === undefined || v === null || v === '' ? '—' : v) : n.toFixed(d); };

/** The meter blocks behind a row (see `parts` above). */
function meterBlocks(row) {
  const isBlock = (b) => b && typeof b === 'object' && !Array.isArray(b);
  if (Array.isArray(row.parts)) return row.parts.filter(isBlock);
  const d = row.data;
  if (!isBlock(d)) return [];
  const list = [...(Array.isArray(d.lines) ? d.lines : []), ...(Array.isArray(d.transformers) ? d.transformers : [])].filter(isBlock);
  if (row.line) {
    const p = list.find((x) => x.id === row.line);
    return p && isBlock(p.td) ? [p.td] : [];
  }
  if (list.length) return isBlock(list[0].td) ? [list[0].td] : [];
  return [d];
}

/** Current, MVar and power factor for one row, from the same meters as its MW. null = no reading. */
function electrical(row) {
  const blocks = meterBlocks(row);
  const pick = (b, ...keys) => { for (const k of keys) { const n = toNum(b[k]); if (n !== null) return n; } return null; };
  const sum = (vals) => { const ok = vals.filter((v) => v !== null); return ok.length ? ok.reduce((s, v) => s + v, 0) : null; };
  const amps = blocks.map((b) => pick(b, 'a', 'A', 'amp'));
  const mvars = blocks.map((b) => pick(b, 'mx', 'MX', 'mvar'));
  const mws = blocks.map((b) => pick(b, 'mw', 'MW'));
  const amp = sum(amps.map((v) => (v === null ? null : Math.abs(v))));
  const mvar = sum(mvars);
  // The meter's own power factor, exactly as sent (one meter only). This is what the table shows.
  let pfMeter = null;
  if (blocks.length === 1) {
    pfMeter = pick(blocks[0], 'pf', 'PF');
    // A station that sends pf beside its line list (one line only) rather than inside the line.
    const d = row.data;
    const count = d && typeof d === 'object' ? (Array.isArray(d.lines) ? d.lines.length : 0) + (Array.isArray(d.transformers) ? d.transformers.length : 0) : 0;
    if (pfMeter === null && d && blocks[0] !== d && count === 1) pfMeter = pick(d, 'pf', 'PF');
  }
  // The check: |P| / sqrt(P² + Q²) from the same meters as the MW and MVar shown, when every
  // meter sent both. Shown on hover, beside the meter's figure.
  let pfCalc = null;
  let p = null;
  let q = null;
  let s = null;
  const complete = blocks.length > 0 && mws.every((v) => v !== null) && mvars.every((v) => v !== null);
  if (complete) {
    p = Math.abs(sum(mws));
    q = sum(mvars);
    s = Math.sqrt(p * p + q * q);
    if (s > 0) pfCalc = p / s;
  }
  // Displayed: the meter's figure; the worked-out one only where no meter figure applies.
  const pf = pfMeter !== null ? pfMeter : pfCalc;
  const pfSource = pfMeter !== null ? 'meter' : pfCalc !== null ? 'calc' : null;
  return { amp, mvar, pf, pfSource, pfMeter, pfCalc, p, q, s, meters: blocks.length, pfFlag: pfFlag(pfMeter, pfCalc) };
}

/**
 * Whether the meter's power factor needs a look: above 1 (a power factor never is), or more than
 * 0.05 away from the value worked out from the meter's own MW and MVar.
 */
function pfFlag(meter, calc) {
  if (meter === null) return null;
  if (Math.abs(meter) > 1) return 'above1';
  if (calc !== null && Math.abs(Math.abs(meter) - calc) > 0.05) return 'differs';
  return null;
}

/** A power factor as the meter sent it: at least 2 decimals, at most 3. */
function fmtPf(v) {
  const t = String(Number(v.toFixed(3)));
  return (t.split('.')[1] || '').length >= 2 ? t : v.toFixed(2);
}

const rowKey = (r) => `${r.sn}-${r.label}`;

/** The power factor explanation, placed below (or above) the value and kept on screen. */
function PfPopover({ row, rect }) {
  const ref = useRef(null);
  const [top, setTop] = useState(null);
  const width = Math.min(340, window.innerWidth - 16);
  const left = Math.max(8, Math.min(rect.right - width, window.innerWidth - width - 8));
  // Measured after drawing: below the value if it fits, else above, else as high as fits on screen.
  useLayoutEffect(() => {
    const h = ref.current ? ref.current.offsetHeight : 0;
    const vh = window.innerHeight;
    let t = rect.bottom + 6;
    if (t + h > vh - 8) t = rect.top - h - 6 >= 8 ? rect.top - h - 6 : Math.max(8, vh - h - 8);
    t = Math.round(t);
    if (t !== top) setTop(t); // only when it moves, so this settles after one pass
  }, [rect.top, rect.bottom, top, row]);
  return (
    <div ref={ref} className="hx-pf-pop" role="tooltip" style={{ left, width, top: top === null ? rect.bottom + 6 : top, maxHeight: window.innerHeight - 16, visibility: top === null ? 'hidden' : 'visible' }}>
      <PfExplain r={row} />
    </div>
  );
}

/** The explanation shown when a power factor is hovered, tapped or focused. */
function PfExplain({ r }) {
  const f2 = (v) => v.toFixed(2);
  const sq = (v) => (v < 0 ? `(${f2(v)})²` : `${f2(v)}²`);
  const lines = [];
  if (r.pfMeter !== null) lines.push(<p key="m"><b>Meter sent:</b> {String(r.pfMeter)}</p>);
  else lines.push(<p key="m"><b>Meter sent:</b> no power factor{r.meters > 1 ? ' for this row as a whole' : ''}</p>);
  if (r.pfCalc !== null) {
    lines.push(<p key="c"><b>Worked out:</b> {r.pfCalc.toFixed(3)}</p>);
    lines.push(
      <p key="f" className="hx-pf-formula">
        PF = |P| ÷ √(P² + Q²)<br />
        = {f2(r.p)} ÷ √({sq(r.p)} + {sq(r.q)})<br />
        = {f2(r.p)} ÷ {f2(r.s)} = {r.pfCalc.toFixed(3)}
      </p>,
    );
    lines.push(
      <p key="h">
        How: power factor is real power divided by apparent power. P = {f2(r.p)} MW and Q = {f2(r.q)} MVar are{' '}
        {r.meters > 1 ? `the totals of the ${r.meters} meters added in this row` : 'what this meter sent (the Power and MVar columns)'}; the apparent
        power S = √(P² + Q²) = {f2(r.s)} MVA.
      </p>,
    );
  } else {
    const reason = r.s === 0 ? 'no load: P and Q are both 0' : r.meters ? `the meter${r.meters > 1 ? 's do' : ' does'} not send both MW and MVar` : 'no reading yet';
    lines.push(<p key="c"><b>Worked out:</b> not possible — {reason}.</p>);
  }
  let why;
  if (r.pfMeter === null && r.pfCalc !== null) {
    why = r.meters > 1
      ? `This row adds ${r.meters} meters, so no single meter's power factor describes it: the worked-out value is shown instead.`
      : 'This meter does not send a power factor, so the worked-out value is shown instead.';
  } else if (r.pfMeter !== null && r.pfCalc === null) {
    why = r.s === 0
      ? 'There is no load at the moment, so the meter\'s power factor cannot be checked against its MW and MVar.'
      : `The meter does not send MVar, so its power factor cannot be checked here.${r.pfFlag === 'above1' ? ' A power factor can never be above 1, so this meter figure needs a look.' : ''}`;
  } else if (r.pfFlag === 'above1') {
    const m = Math.abs(r.pfMeter);
    const matches = Math.abs((2 - m) - r.pfCalc) <= 0.03;
    why = matches
      ? `A power factor can never be above 1. The meter's ${r.pfMeter} equals ${r.pfMeter < 0 ? `−(2 − ${(2 - m).toFixed(2)})` : `2 − ${(2 - m).toFixed(2)}`}, and ${r.pfCalc.toFixed(2)} is what its own MW and MVar give: this meter sends ${r.pfMeter < 0 ? '−(2 − PF)' : '2 − PF'} in one quadrant (a register format some meters use for leading or lagging load). The real power factor is ${r.pfCalc.toFixed(3)}. The meter set-up should be checked.`
      : `A power factor can never be above 1, and the meter's ${r.pfMeter} does not match its own MW and MVar (${r.pfCalc.toFixed(3)}). The meter should be checked.`;
  } else if (r.pfFlag === 'differs') {
    why = `The meter's figure differs from the one its own MW and MVar give by ${Math.abs(Math.abs(r.pfMeter) - r.pfCalc).toFixed(3)}. The readings may be from different moments or measuring points; worth checking with the meter.`;
  } else if (r.pfMeter !== null) {
    why = `The meter agrees with its own MW and MVar (difference ${Math.abs(Math.abs(r.pfMeter) - r.pfCalc).toFixed(3)}, from rounding).${r.pfMeter < 0 ? ' The minus sign is the meter\'s own lead/lag indication.' : ''}`;
  }
  return (
    <>
      <h3>Power factor · {r.label}</h3>
      {lines}
      {why && <p className="hx-pf-why"><b>Why it is shown:</b> {why}</p>}
      <p className="hx-pf-note">Each meter figure is checked against the meter's own MW and MVar, because the power factor is monitored by management.</p>
    </>
  );
}

/**
 * Grid frequency, live. Pages that already track it pass `frequency`; the table listens itself
 * otherwise, and removes only its own listener.
 */
function useFrequency() {
  const [value, setValue] = useState(null);
  useEffect(() => {
    const onFrequency = (data) => {
      try {
        const m = typeof data?.message === 'string' ? JSON.parse(data.message) : data?.message;
        const n = toNum(m && m.value);
        if (n !== null) setValue(n);
      } catch (e) { /* a malformed message is skipped */ }
    };
    socket.on('frequency001', onFrequency);
    return () => { socket.off('frequency001', onFrequency); };
  }, []);
  return value;
}

/** Connected, from the page's own checkConnection result (a CN/NC span) or a plain value. */
function isConnected(status) {
  if (status === 'live') return true;
  if (status === 'off') return false;
  const cls = status && status.props ? String(status.props.className || '') : '';
  return cls.includes('success');
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

export default function BilateralTable({ title, eyebrow = 'Bilateral stations', tableTitle, rows, total, totalLabel = 'Total', frequency, onRowClick, actions, footnote }) {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState({ key: 'sn', dir: 1 });
  // Power factor explanation: { key, rect, pinned }. Drawn outside the scrolling table so it is
  // never clipped; opens on hover, keyboard focus or tap (phones cannot hover).
  const [pfTip, setPfTip] = useState(null);
  useEffect(() => {
    if (!pfTip) return undefined;
    const close = () => setPfTip(null);
    const onKey = (e) => { if (e.key === 'Escape') close(); };
    window.addEventListener('scroll', close, true);
    window.addEventListener('resize', close);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('scroll', close, true);
      window.removeEventListener('resize', close);
      window.removeEventListener('keydown', onKey);
    };
  }, [pfTip]);
  useEffect(() => { harmonicsStore.start(); }, []);
  const ownFrequency = useFrequency();
  const freq = toNum(frequency) !== null ? toNum(frequency) : ownFrequency;

  const enriched = rows.map((r) => {
    const h = harmonicValues(r.data, r.line);
    return { ...r, ...h, ...electrical(r), connected: isConnected(r.status) ? 1 : 0, mwNum: toNum(r.mw), kvNum: toNum(r.kv) };
  });
  const connected = enriched.filter((r) => r.connected).length;
  const top = enriched.filter((r) => r.connected && r.mwNum !== null).sort((a, b) => Math.abs(b.mwNum) - Math.abs(a.mwNum))[0];
  const metered = enriched.filter((r) => r.thdv !== null || r.ia !== null || r.tddSource === 'meter').length;
  const over = enriched.filter((r) => r.overTdd || r.overThdv).length;
  const maxMw = Math.max(1, ...enriched.map((r) => Math.abs(r.mwNum || 0)));

  const q = query.trim().toLowerCase();
  const shown = enriched
    .filter((r) => !q || r.label.toLowerCase().includes(q))
    .filter((r) => filter === 'all' || (filter === 'on' ? r.connected : !r.connected))
    .sort((a, b) => {
      const x = a[sort.key];
      const y = b[sort.key];
      if (x === y) return a.sn - b.sn;
      if (x === null || x === undefined) return 1;
      if (y === null || y === undefined) return -1;
      return (typeof x === 'string' ? x.localeCompare(y) : x - y) * sort.dir;
    });

  const toggleSort = (key) => setSort((s) => (s.key === key ? { key, dir: -s.dir } : { key, dir: ['sn', 'label'].includes(key) ? 1 : -1 }));

  return (
    <>
      <header className="gx-top">
        <img src={nisoLogo} alt="NISO" className="gx-top-logo" />
        <div className="gx-top-title">
          <span className="gx-eyebrow">{eyebrow}</span>
          <h1>{title}</h1>
        </div>
        <span className={`gx-status hx-freq ${freq !== null ? 'live' : 'waiting'}`} title="Grid frequency, live"><i />{freq !== null ? `${freq.toFixed(2)} Hz` : 'Frequency —'}</span>
        <span className={`gx-status ${connected ? 'live' : 'waiting'}`}><i />{connected} of {enriched.length} connected</span>
        <Clock />
        {actions}
      </header>
      <main className="gx-main">
        <div className="hx-summary">
          <div><b>{Number(total).toFixed(2)}</b><span>{totalLabel}, MW</span></div>
          <div><b>{freq !== null ? freq.toFixed(2) : '—'}<small> Hz</small></b><span>{freq !== null ? 'Grid frequency, live' : 'Waiting for the frequency'}</span></div>
          <div><b>{connected}<small>/{enriched.length}</small></b><span>Stations connected</span></div>
          <div><b>{top ? Math.abs(top.mwNum).toFixed(2) : '—'}</b><span>{top ? `Highest load: ${top.label}` : 'Highest load'}</span></div>
          <div className={over ? 'bad' : ''}><b>{metered ? over : '—'}</b><span>{metered ? `Over a harmonic limit, of ${metered} metered` : 'No harmonic meters reporting'}</span></div>
        </div>

        <section className="gx-panel">
          <header className="hx-table-head">
            <h2>{tableTitle || title}</h2>
            {onRowClick && <span>Click a row for meter detail</span>}
            <div className="hx-table-tools">
              <input type="search" className="hx-search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search stations" aria-label="Search stations" />
              <div className="gx-filters" role="group" aria-label="Connection">
                {[['all', 'All'], ['on', 'Connected'], ['off', 'Not connected']].map(([k, l]) => (
                  <button key={k} type="button" className={filter === k ? 'active' : ''} aria-pressed={filter === k} onClick={() => setFilter(k)}>{l}</button>
                ))}
              </div>
            </div>
          </header>
          <div className="gx-table-wrap">
            <table className="gx-table hx-table hx-bl-table">
              <thead>
                <tr>
                  {COLUMNS.map((c) => (
                    <th key={c.key} className={c.right ? 'r' : ''} title={c.title} aria-sort={sort.key === c.key ? (sort.dir > 0 ? 'ascending' : 'descending') : 'none'}>
                      <button type="button" className="hx-sort" onClick={() => toggleSort(c.key)}>{c.label}{sort.key === c.key ? (sort.dir > 0 ? ' ▲' : ' ▼') : ''}</button>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {shown.map((r) => (
                  <tr key={`${r.sn}-${r.label}`} className={`${r.connected ? '' : 'is-off'} ${onRowClick && r.modal ? 'can-open' : ''}`} onClick={onRowClick && r.modal ? () => onRowClick(r.modal) : undefined}>
                    <td className="hx-sn">{r.sn}</td>
                    <td><b>{r.label}</b>{r.note && <small className="hx-off">{r.note}</small>}{r.excluded && <small className="hx-off">not in total</small>}</td>
                    <td><span className={`hx-pill ${r.connected ? 'pass' : 'off'}`}><i aria-hidden="true" />{r.connected ? 'Connected' : 'Not connected'}</span></td>
                    <td className={`r hx-mw ${r.warn ? 'hx-warn' : ''}`}>
                      {show(r.mw)}
                      {r.mwNum ? <i className="hx-load" style={{ width: `${Math.min(100, (Math.abs(r.mwNum) / maxMw) * 100)}%` }} /> : null}
                    </td>
                    <td className="r">{show(r.kv)}</td>
                    <td className="r">{show(r.amp, 1)}</td>
                    <td className="r">{show(r.mvar)}</td>
                    <td className="r hx-pf-cell">
                      {r.pf === null ? '—' : (
                        <button
                          type="button"
                          className={`hx-pf ${r.pfSource === 'calc' ? 'is-calc' : ''} ${r.pfFlag ? 'is-flag' : ''}`}
                          aria-label={`Power factor ${r.pfSource === 'calc' ? r.pf.toFixed(3) + ', worked out' : r.pf}. Show how it is checked.`}
                          onMouseEnter={(e) => { const rect = e.currentTarget.getBoundingClientRect(); setPfTip((t) => (t && t.pinned ? t : { key: rowKey(r), rect, pinned: false })); }}
                          onMouseLeave={() => setPfTip((t) => (t && t.pinned ? t : null))}
                          onFocus={(e) => {
                            // Keyboard focus only: a mouse click or tap focuses first and is handled by onClick.
                            let keyboard = false;
                            try { keyboard = e.currentTarget.matches(':focus-visible'); } catch (err) { /* old browser */ }
                            if (keyboard) { const rect = e.currentTarget.getBoundingClientRect(); setPfTip({ key: rowKey(r), rect, pinned: true }); }
                          }}
                          onBlur={() => setPfTip(null)}
                          onClick={(e) => { e.stopPropagation(); const rect = e.currentTarget.getBoundingClientRect(); setPfTip((t) => (t && t.pinned && t.key === rowKey(r) ? null : { key: rowKey(r), rect, pinned: true })); }}
                        >
                          {r.pfFlag && <span className="hx-pf-mark" aria-hidden="true">!</span>}
                          {r.pfSource === 'calc' ? r.pf.toFixed(3) : fmtPf(r.pf)}
                          {r.pfSource === 'calc' && <small>calc</small>}
                        </button>
                      )}
                    </td>
                    <td
                      className={`r ${r.overTdd ? 'hx-over-d' : ''}`}
                      title={r.tdd === null ? undefined : r.tddSource === 'meter'
                        ? `TDD as the meter sent it.${r.tddCalc !== null ? ` Worked out from THD and current: ${r.tddCalc.toFixed(2)}%.` : ''}`
                        : 'Worked out from THD and current: this meter does not send TDD.'}
                    >
                      {show(r.tdd)}{r.tddSource === 'calc' && <small className="hx-calc">calc</small>}
                    </td>
                    <td className={`r ${r.overThdv ? 'hx-over-d' : ''}`}>{show(r.thdv)}</td>
                    <td className="r">{show(r.ia)}</td>
                    <td className="r">{show(r.ib)}</td>
                    <td className="r">{show(r.ic)}</td>
                  </tr>
                ))}
                {shown.length === 0 && <tr><td colSpan={COLUMNS.length} className="hx-none">No station matches this search.</td></tr>}
              </tbody>
              <tfoot>
                <tr><td /><td colSpan={2}>{totalLabel}</td><td className="r">{Number(total).toFixed(2)}</td><td colSpan={COLUMNS.length - 4} /></tr>
              </tfoot>
            </table>
          </div>
          {footnote && <p className="hx-note">{footnote}</p>}
        </section>
      </main>
      {pfTip && (() => {
        // Looked up on every render, so the explanation follows the live readings.
        const row = enriched.find((x) => rowKey(x) === pfTip.key);
        return row && row.pf !== null ? <PfPopover row={row} rect={pfTip.rect} /> : null;
      })()}
    </>
  );
}

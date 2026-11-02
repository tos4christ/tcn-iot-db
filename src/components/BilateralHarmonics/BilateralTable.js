/**
 * Smart bilateral table used by /bilateral, /bilaterals and /oau_steel_bilaterals.
 * The pages keep their own MW, kV, status and total calculations and pass the results in:
 *   rows: [{ sn, label, status: <checkConnection span> or 'live'/'off', mw, kv, data, line,
 *            modal, warn, excluded }]
 * Adds search, a connection filter, sortable columns, summary tiles and the harmonic columns.
 */
import React, { useEffect, useState } from 'react';
import nisoLogo from '../../assets/img/niso_logo_main.jpg';
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
  { key: 'tdd', label: 'TDD %', right: true, title: 'Total demand distortion of current, calculated' },
  { key: 'thdv', label: 'THDv %', right: true, title: 'Voltage total harmonic distortion' },
  { key: 'ia', label: 'THDia %', right: true, title: 'Current THD, phase A' },
  { key: 'ib', label: 'THDib %', right: true, title: 'Current THD, phase B' },
  { key: 'ic', label: 'THDic %', right: true, title: 'Current THD, phase C' },
];

const toNum = (v) => { const n = Number(v); return v !== null && v !== '' && Number.isFinite(n) ? n : null; };
const show = (v, d = 2) => { const n = toNum(v); return n === null ? (v === undefined || v === null || v === '' ? '—' : v) : n.toFixed(d); };

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

export default function BilateralTable({ title, eyebrow = 'Bilateral stations', tableTitle, rows, total, totalLabel = 'Total', onRowClick, actions, footnote }) {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState({ key: 'sn', dir: 1 });
  useEffect(() => { harmonicsStore.start(); }, []);

  const enriched = rows.map((r) => {
    const h = harmonicValues(r.data, r.line);
    return { ...r, ...h, connected: isConnected(r.status) ? 1 : 0, mwNum: toNum(r.mw), kvNum: toNum(r.kv) };
  });
  const connected = enriched.filter((r) => r.connected).length;
  const top = enriched.filter((r) => r.connected && r.mwNum !== null).sort((a, b) => Math.abs(b.mwNum) - Math.abs(a.mwNum))[0];
  const metered = enriched.filter((r) => r.thdv !== null || r.ia !== null).length;
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
        <span className={`gx-status ${connected ? 'live' : 'waiting'}`}><i />{connected} of {enriched.length} connected</span>
        <Clock />
        {actions}
      </header>
      <main className="gx-main">
        <div className="hx-summary">
          <div><b>{Number(total).toFixed(2)}</b><span>{totalLabel}, MW</span></div>
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
                    <td><b>{r.label}</b>{r.excluded && <small className="hx-off">not in total</small>}</td>
                    <td><span className={`hx-pill ${r.connected ? 'pass' : 'off'}`}><i aria-hidden="true" />{r.connected ? 'Connected' : 'Not connected'}</span></td>
                    <td className={`r hx-mw ${r.warn ? 'hx-warn' : ''}`}>
                      {show(r.mw)}
                      {r.mwNum ? <i className="hx-load" style={{ width: `${Math.min(100, (Math.abs(r.mwNum) / maxMw) * 100)}%` }} /> : null}
                    </td>
                    <td className="r">{show(r.kv)}</td>
                    <td className={`r ${r.overTdd ? 'hx-over-d' : ''}`}>{show(r.tdd)}</td>
                    <td className={`r ${r.overThdv ? 'hx-over-d' : ''}`}>{show(r.thdv)}</td>
                    <td className="r">{show(r.ia)}</td>
                    <td className="r">{show(r.ib)}</td>
                    <td className="r">{show(r.ic)}</td>
                  </tr>
                ))}
                {shown.length === 0 && <tr><td colSpan={COLUMNS.length} className="hx-none">No station matches this search.</td></tr>}
              </tbody>
              <tfoot>
                <tr><td /><td colSpan={2}>{totalLabel}</td><td className="r">{Number(total).toFixed(2)}</td><td colSpan={6} /></tr>
              </tfoot>
            </table>
          </div>
          {footnote && <p className="hx-note">{footnote}</p>}
        </section>
      </main>
    </>
  );
}

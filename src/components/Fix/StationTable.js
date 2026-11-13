/**
 * Smart live station table for the *_fix pages (search, connection filter, sortable columns,
 * load bars, last-update age, total row). The page keeps its own MW / kV / status / total
 * calculations and passes the results in:
 *   rows: [{ sn, label, status: <checkConnection span> | 'live' | 'off', mw, kv, updatedAt, modal, excluded }]
 */
import React, { useEffect, useState } from 'react';

const toNum = (v) => { const n = Number(v); return v !== null && v !== undefined && v !== '' && Number.isFinite(n) ? n : null; };
const show = (v, d = 2) => { const n = toNum(v); return n === null ? (v === undefined || v === null || v === '' ? '—' : String(v)) : n.toFixed(d); };

/** Connected, from the page's own checkConnection result (a CN/NC span) or a plain value. */
export function isConnected(status) {
  if (status === 'live' || status === true) return true;
  if (status === 'off' || status === false || !status) return false;
  const cls = status.props ? String(status.props.className || '') : '';
  return cls.includes('success');
}

function useNow(ms) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => { const i = setInterval(() => setNow(Date.now()), ms); return () => clearInterval(i); }, [ms]);
  return now;
}
const ago = (t, now) => {
  if (!t) return '—';
  const s = Math.max(0, Math.round((now - t) / 1000));
  if (s < 60) return `${s} s`;
  if (s < 3600) return `${Math.floor(s / 60)} min`;
  return `${Math.floor(s / 3600)} h`;
};

const COLUMNS = [
  { key: 'sn', label: 'S/N' },
  { key: 'label', label: 'Station' },
  { key: 'connected', label: 'Status' },
  { key: 'mwNum', label: 'Power (MW)', right: true },
  { key: 'kvNum', label: 'Voltage (kV)', right: true },
  { key: 'updatedAt', label: 'Updated', right: true, hideSm: true },
];

export default function StationTable({ title, note, rows, total, totalLabel = 'Total', onRowClick }) {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState({ key: 'sn', dir: 1 });
  const now = useNow(5000);

  const enriched = rows.map((r) => ({ ...r, connected: isConnected(r.status) ? 1 : 0, mwNum: toNum(r.mw), kvNum: toNum(r.kv) }));
  const maxMw = Math.max(1, ...enriched.map((r) => Math.abs(r.mwNum || 0)));
  const q = query.trim().toLowerCase();
  const shown = enriched
    .filter((r) => !q || String(r.label).toLowerCase().includes(q))
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
  const connected = enriched.filter((r) => r.connected).length;

  return (
    <section className="gx-panel">
      <header>
        <h2>{title}</h2>
        <span>{connected} of {enriched.length} connected{onRowClick ? ' · click a row for meter detail' : ''}</span>
        <div className="fx-table-tools">
          <input type="search" className="fx-search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search stations" aria-label={`Search ${title}`} />
          <div className="gx-filters" role="group" aria-label="Connection">
            {[['all', 'All'], ['on', 'Connected'], ['off', 'Not connected']].map(([k, l]) => (
              <button key={k} type="button" className={filter === k ? 'active' : ''} aria-pressed={filter === k} onClick={() => setFilter(k)}>{l}</button>
            ))}
          </div>
        </div>
      </header>
      <div className="gx-table-wrap">
        <table className="gx-table">
          <thead>
            <tr>
              {COLUMNS.map((c) => (
                <th key={c.key} className={`${c.right ? 'r' : ''} ${c.hideSm ? 'fx-hide-sm' : ''}`} aria-sort={sort.key === c.key ? (sort.dir > 0 ? 'ascending' : 'descending') : 'none'}>
                  <button type="button" className="fx-sort" onClick={() => toggleSort(c.key)}>{c.label}{sort.key === c.key ? (sort.dir > 0 ? ' ▲' : ' ▼') : ''}</button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {shown.map((r) => (
              <tr key={`${r.sn}-${r.label}`} className={`${r.connected ? '' : 'is-off'} ${onRowClick && r.modal ? 'can-open' : ''}`}
                onClick={onRowClick && r.modal ? () => onRowClick(r.modal) : undefined}
                onKeyDown={onRowClick && r.modal ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onRowClick(r.modal); } } : undefined}
                tabIndex={onRowClick && r.modal ? 0 : undefined}>
                <td className="fx-age">{r.sn}</td>
                <td><b>{r.label}</b>{r.excluded ? <small className="gx-muted"> · not in total</small> : null}</td>
                <td><span className={`fx-status ${r.connected ? 'on' : 'off'}`}><i aria-hidden="true" />{r.connected ? 'Connected' : 'Not connected'}</span></td>
                <td className="r fx-bar">{show(r.mw)}{r.mwNum ? <i style={{ width: `${Math.min(100, (Math.abs(r.mwNum) / maxMw) * 100)}%` }} /> : null}</td>
                <td className="r">{show(r.kv)}</td>
                <td className="r fx-hide-sm fx-age">{ago(r.updatedAt, now)}</td>
              </tr>
            ))}
            {shown.length === 0 && <tr><td colSpan={COLUMNS.length} className="fx-none">No station matches this search.</td></tr>}
          </tbody>
          {total !== undefined && (
            <tfoot>
              <tr><td /><td colSpan={2}>{totalLabel}</td><td className="r">{Number(total).toFixed(2)}</td><td /><td className="fx-hide-sm" /></tr>
            </tfoot>
          )}
        </table>
      </div>
      {note && <p className="fx-hint">{note}</p>}
    </section>
  );
}

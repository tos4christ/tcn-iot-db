/**
 * Meter detail dialog for the *_fix pages. Same props as components/Modal.js:
 *   modalData = [stationName, payload, payload, ...], setModalFalse()
 *
 * The old Modal only read `lines`/`units` with td/gd blocks and V/A/mvar keys, so stations that
 * send other shapes showed an empty table. This reads every shape the backend (bin/www) accepts:
 *   { lines | units | transformers: [{ id, td | gd | pd: { V|v, mw, A|a, mvar|mx, pf, f } }] }
 *   { id, t, v, mw, a, mx, pf, f }            (single meter, e.g. bilateral feeders)
 */
import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import '../GencoPortal/genco_portal.css';
import './fix.css';

const pick = (o, keys) => {
  for (let i = 0; i < keys.length; i += 1) {
    const v = o[keys[i]];
    if (v !== undefined && v !== null && v !== '') return v;
  }
  return null;
};
const readings = (o) => ({
  mw: pick(o, ['mw', 'MW', 'p']),
  kv: pick(o, ['V', 'v', 'kv', 'kV']),
  amp: pick(o, ['A', 'a', 'amp', 'I']),
  mvar: pick(o, ['mvar', 'mx', 'MVAR', 'q']),
  pf: pick(o, ['pf', 'PF']),
  f: pick(o, ['f', 'F', 'hz']),
});
const GROUPS = [['lines', 'Line'], ['units', 'Unit'], ['transformers', 'Transformer']];

/** Flat list of meter rows from one payload, whatever its shape. */
export function meterRows(payload) {
  if (!payload || typeof payload !== 'object') return [];
  const rows = [];
  GROUPS.forEach(([key, kind]) => {
    if (!Array.isArray(payload[key])) return;
    payload[key].forEach((item, i) => {
      if (!item || typeof item !== 'object') return;
      const block = item.td || item.gd || item.pd || item.data || item;
      rows.push({ equipment: item.id || item.name || `${kind} ${i + 1}`, kind, ...readings(block) });
    });
  });
  if (!rows.length) {
    const r = readings(payload);
    if (r.mw !== null || r.kv !== null || r.amp !== null) rows.push({ equipment: payload.id || payload.name || 'Meter', kind: 'Meter', ...r });
  }
  return rows;
}

const num = (v, d = 2) => {
  const n = Number(v);
  return v === null || v === undefined || v === '' ? '—' : Number.isFinite(n) ? n.toFixed(d) : String(v);
};
function age(serverTime) {
  if (!serverTime) return null;
  const s = Math.round((Date.now() - serverTime) / 1000);
  if (s < 60) return `${s} s ago`;
  if (s < 3600) return `${Math.round(s / 60)} min ago`;
  return `${Math.round(s / 3600)} h ago`;
}

export default function ModalFix({ modalData, setModalFalse }) {
  const closeRef = useRef(null);
  const data = Array.isArray(modalData) ? modalData : [];
  const station = data[0];
  // Pages start some stations with placeholder zeros; only payloads that really arrived (the page
  // stamps server_time on receipt) or carry a station time are readings.
  const payloads = data.slice(1).filter((p) => p && typeof p === 'object' && (p.server_time || p.t));

  useEffect(() => {
    const prev = document.activeElement;
    if (closeRef.current) closeRef.current.focus();
    const onKey = (e) => { if (e.key === 'Escape') setModalFalse(); };
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('keydown', onKey); if (prev && prev.focus) prev.focus(); };
  }, [setModalFalse]);

  const meters = payloads.map((p, i) => ({ key: i, id: p.id || p.name || `Meter ${i + 1}`, time: p.t || null, ago: age(p.server_time), rows: meterRows(p) }));
  const any = meters.some((m) => m.rows.length);

  return ReactDOM.createPortal(
    <div className="gx-root fx-modal-root" role="dialog" aria-modal="true" aria-labelledby="fx-modal-title">
      <div className="fx-backdrop" onClick={setModalFalse} />
      <div className="fx-dialog">
        <header>
          <div style={{ flex: 1 }}>
            <span className="gx-eyebrow">Meter detail</span>
            <h2 id="fx-modal-title">{station}</h2>
          </div>
          <button type="button" className="gx-btn" ref={closeRef} onClick={setModalFalse}>Close</button>
        </header>
        {!any && <p className="fx-warn">No readings have arrived from this station since the page opened.</p>}
        {meters.filter((m) => m.rows.length).map((m) => (
          <section key={m.key} className="fx-meter">
            <h3>{m.id}<span className="fx-age">{[m.time && `station time ${m.time}`, m.ago && `received ${m.ago}`].filter(Boolean).join(' · ')}</span></h3>
            <div className="gx-table-wrap">
              <table className="gx-table">
                <thead>
                  <tr><th>Equipment</th><th className="fx-hide-sm">Type</th><th className="r">MW</th><th className="r">kV</th><th className="r">A</th><th className="r">MVAr</th><th className="r fx-hide-sm">PF</th><th className="r fx-hide-sm">Hz</th></tr>
                </thead>
                <tbody>
                  {m.rows.map((r, i) => (
                    <tr key={`${r.equipment}-${i}`}>
                      <td><b>{r.equipment}</b></td>
                      <td className="fx-hide-sm">{r.kind}</td>
                      <td className="r">{num(r.mw)}</td>
                      <td className="r">{num(r.kv)}</td>
                      <td className="r">{num(r.amp, 1)}</td>
                      <td className="r">{num(r.mvar)}</td>
                      <td className="r fx-hide-sm">{num(r.pf, 3)}</td>
                      <td className="r fx-hide-sm">{num(r.f)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ))}
      </div>
    </div>,
    document.body,
  );
}

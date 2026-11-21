/**
 * Table rows for the Ikorodu-Sagamu axis meters added in 2026-11: four new off-takers and the two
 * gencos (sent-out value). Shared by /bilaterals (components/Bilateral.js) and /bilaterals_fix
 * (Fix/legacy/BilateralFix.js) so both pages show the same figures.
 */
import { NODE_BY_KEY } from './axisModel';

const nz = (v) => (v === null || v === undefined || v === '' || !Number.isFinite(Number(v)) ? null : Number(v));
/** A meter block in the a/v/mx form the table reads; NaN / missing become null, not 0. */
const tableBlock = (b) => (b ? { mw: nz(b.mw), a: nz(b.a !== undefined ? b.a : b.A), v: nz(b.v !== undefined ? b.v : b.V), mx: nz(b.mx !== undefined ? b.mx : b.mvar), pf: nz(b.pf) } : {});
const blocksOf = (payload, ids) => {
  const all = [...((payload && payload.lines) || []), ...((payload && payload.transformers) || [])].filter(Boolean);
  const picked = ids ? all.filter((x) => ids.includes(String(x.id))) : all.slice(0, 1);
  return picked.map((x) => tableBlock(x.td || x.gd));
};

export const AXIS_ROWS = [
  { key: 'monarchOgijo', label: 'MONARCH ALLOY OGIJO', state: 'monarch-alloy-ogijo' },
  { key: 'monarchOdogunyan', label: 'MONARCH ALLOY ODOGUNYAN', state: 'monarch-alloy-odogunyan' },
  { key: 'odogunyan', label: 'ODOGUNYAN 132KV TS (T1 + T21)', state: 'odogunyan', ids: ['t1', '21'] },
  { key: 'sagamuSteel', label: 'SAGAMU STEEL', state: 'sagamuSteel' },
];
export const AXIS_GENCOS = [
  { key: 'taopex', label: 'TAOPEX G.S', state: 'taopex', ids: ['line1'] },
  { key: 'paras', label: 'PARAS ENERGY', state: 'parasEnergyPs', ids: ['132cb'] },
];
export const AXIS_LABELS = [...AXIS_ROWS, ...AXIS_GENCOS].map((a) => a.label);

/**
 * Appends the axis rows to `rows` (numbering on from its length) and returns the MW the new
 * off-takers take, for the page total. `status(server_time)` is the page's connection badge.
 */
export function addAxisRows(rows, state, status) {
  let offtake = 0;
  const row = (a, extra) => {
    const r = NODE_BY_KEY[a.key].read(state);
    const mw = r && r.mw !== null ? Math.abs(r.mw) : null;
    rows.push({
      sn: rows.length + 1, label: a.label,
      status: status(state[a.state] && state[a.state].server_time),
      mw: mw === null ? '—' : mw.toFixed(2), kv: r && r.kv !== null ? r.kv : '—',
      data: state[a.state] || {},
      parts: blocksOf(state[a.state], a.ids),
      modal: [a.label, state[a.state] || {}],
      ...extra(mw),
    });
    return mw;
  };
  // New off-takers: MW as the meter sent it (magnitude, like the other rows); NaN = no reading.
  AXIS_ROWS.forEach((a) => {
    const mw = row(a, (m) => ({ warn: Boolean(state[a.state]) && m === null }));
    if (mw !== null) offtake += mw;
  });
  // Gencos feeding the axis: sent-out value of their line meter, not part of the off-take total.
  AXIS_GENCOS.forEach((g) => row(g, () => ({ note: 'generation · sent out', excluded: true })));
  return offtake;
}

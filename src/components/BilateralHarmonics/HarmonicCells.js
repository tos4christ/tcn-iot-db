/**
 * The five harmonic values for one row of the bilateral table.
 * TDD is calculated from THD and current, because the value sent by the meter depends on a
 * set-up figure in the meter (see the data checks on the harmonics page).
 */
import { deriveSample } from './harmonicsAnalysis';
import { harmonicPoints, harmonicsStore } from './harmonicsStore';

/** The five values for one row, plus whether each is over its limit. */
export function harmonicValues(data, line) {
  const empty = { tdd: null, thdv: null, ia: null, ib: null, ic: null, overTdd: false, overThdv: false };
  if (!data) return empty;
  const points = harmonicPoints(data);
  const point = line ? points.find((p) => p.lineId === line) : points[0];
  if (!point) return empty;
  const td = point.td;
  const n = (v) => { const x = Number(v); return v === null || v === undefined || v === '' || !Number.isFinite(x) ? null : x; };
  const summary = harmonicsStore.summaryFor(point.stationId, point.lineId);
  const tdd = summary && summary.il ? deriveSample({ a: Number(td.a), ia: n(td.thdia), ib: n(td.thdib), ic: n(td.thdic) }, summary.il).tdd : null;
  const limits = summary ? summary.limits : null;
  const thdv = n(td.thdv);
  return { tdd, thdv, ia: n(td.thdia), ib: n(td.thdib), ic: n(td.thdic), overTdd: Boolean(limits && tdd !== null && tdd > limits.tdd), overThdv: Boolean(limits && thdv !== null && thdv > limits.thdv) };
}

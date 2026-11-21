/**
 * The five harmonic values for one row of the bilateral table.
 * TDD is the meter's own figure when the meter sends one (used for display and alerts);
 * otherwise it is worked out from THD and current.
 */
import { deriveSample } from './harmonicsAnalysis';
import { harmonicPoints, harmonicsStore } from './harmonicsStore';

/** The five values for one row, plus whether each is over its limit. */
export function harmonicValues(data, line) {
  const empty = { tdd: null, tddSource: null, tddCalc: null, thdv: null, ia: null, ib: null, ic: null, overTdd: false, overThdv: false };
  if (!data) return empty;
  const points = harmonicPoints(data);
  const point = line ? points.find((p) => p.lineId === line) : points[0];
  if (!point) return empty;
  const td = point.td;
  const n = (v) => { const x = Number(v); return v === null || v === undefined || v === '' || !Number.isFinite(x) ? null : x; };
  const summary = harmonicsStore.summaryFor(point.stationId, point.lineId);
  // The meter's own TDD when it sends one; otherwise worked out from THD and current.
  const d = deriveSample({ a: n(td.a), ia: n(td.thdia), ib: n(td.thdib), ic: n(td.thdic), tddMeter: n(td.tdd) }, summary && summary.il ? summary.il : null);
  const tdd = d.tdd;
  const limits = summary ? summary.limits : null;
  const thdv = n(td.thdv);
  return { tdd, tddSource: d.tddSource, tddCalc: d.tddCalc, thdv, ia: n(td.thdia), ib: n(td.thdib), ic: n(td.thdic), overTdd: Boolean(limits && tdd !== null && tdd > limits.tdd), overThdv: Boolean(limits && thdv !== null && thdv > limits.thdv) };
}

/**
 * The five harmonic columns for the existing bilateral tables:
 *   <HarmonicHeaders className="bl-tg-zb4j" />   after the VOLTAGE heading
 *   <HarmonicCells data={this.state.phedc} line="rspub1" />   at the end of a station row
 *   <HarmonicCells />   for a row with no meter, such as the total row
 * TDD is calculated from THD and current, because the value sent by the meter depends on a
 * set-up figure in the meter (see the data checks on the harmonics page).
 */
import React, { useEffect } from 'react';
import { deriveSample } from './harmonicsAnalysis';
import { harmonicPoints, harmonicsStore } from './harmonicsStore';
import './harmonics.css';

const fmt = (v) => (v === null || v === undefined || v === '' || !Number.isFinite(Number(v)) ? '—' : Number(v).toFixed(2));

export function HarmonicHeaders({ className = '' }) {
  return (
    <>
      <th className={`${className} hx-th`} title="Total demand distortion of current, calculated (limit depends on fault level)">TDD %</th>
      <th className={`${className} hx-th`} title="Voltage total harmonic distortion">THDv %</th>
      <th className={`${className} hx-th`} title="Current total harmonic distortion, phase A">THDia %</th>
      <th className={`${className} hx-th`} title="Current total harmonic distortion, phase B">THDib %</th>
      <th className={`${className} hx-th`} title="Current total harmonic distortion, phase C">THDic %</th>
    </>
  );
}

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

export function HarmonicCells({ data, line }) {
  useEffect(() => { if (data) harmonicsStore.start(); }, [data]);
  const v = harmonicValues(data, line);
  return (
    <>
      <td className={`hx-td${v.overTdd ? ' hx-over' : ''}`}>{fmt(v.tdd)}</td>
      <td className={`hx-td${v.overThdv ? ' hx-over' : ''}`}>{fmt(v.thdv)}</td>
      <td className="hx-td">{fmt(v.ia)}</td>
      <td className="hx-td">{fmt(v.ib)}</td>
      <td className="hx-td">{fmt(v.ic)}</td>
    </>
  );
}

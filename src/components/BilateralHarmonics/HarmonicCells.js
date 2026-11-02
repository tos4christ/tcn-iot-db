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

export function HarmonicCells({ data, line }) {
  useEffect(() => { if (data) harmonicsStore.start(); }, [data]);
  const points = harmonicPoints(data);
  const point = line ? points.find((p) => p.lineId === line) : points[0];
  const td = point ? point.td : null;
  const summary = point ? harmonicsStore.summaryFor(point.stationId, point.lineId) : null;
  let tdd = null;
  if (td && summary && summary.il) {
    tdd = deriveSample({ a: Number(td.a), ia: Number(td.thdia), ib: Number(td.thdib), ic: Number(td.thdic) }, summary.il).tdd;
  }
  const limits = summary ? summary.limits : null;
  const over = (v, limit) => (limits && Number(v) > limit ? ' hx-over' : '');
  return (
    <>
      <td className={`hx-td${over(tdd, limits ? limits.tdd : 0)}`}>{fmt(tdd)}</td>
      <td className={`hx-td${over(td && td.thdv, limits ? limits.thdv : 0)}`}>{fmt(td && td.thdv)}</td>
      <td className="hx-td">{fmt(td && td.thdia)}</td>
      <td className="hx-td">{fmt(td && td.thdib)}</td>
      <td className="hx-td">{fmt(td && td.thdic)}</td>
    </>
  );
}

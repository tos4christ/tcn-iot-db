/**
 * Shared pieces of the /nccweather_fix weather centre: formatting, weather icons, risk colours,
 * the 72-hour risk strip and the hourly SVG chart. No chart or icon library.
 * Weather times are true times (unix seconds) shown on the Nigerian clock (Africa/Lagos).
 */
import React, { useState } from 'react';
import { useWidth, Legend } from '../FixCharts';

const TZ = 'Africa/Lagos';
export const isNum = (v) => typeof v === 'number' && Number.isFinite(v);
export const fmt = (v, d = 1, fb = '—') => (isNum(v) ? v.toFixed(d) : fb);
export const fmt0 = (v) => fmt(v, 0);
export const fmt1 = (v) => fmt(v, 1);

const hourFmt = new Intl.DateTimeFormat('en-GB', { timeZone: TZ, hour: '2-digit', minute: '2-digit', hourCycle: 'h23' });
const dayHourFmt = new Intl.DateTimeFormat('en-GB', { timeZone: TZ, weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' });
const dayFmt = new Intl.DateTimeFormat('en-GB', { timeZone: 'UTC', weekday: 'short', day: 'numeric', month: 'short' });
const tickDayFmt = new Intl.DateTimeFormat('en-GB', { timeZone: TZ, weekday: 'short', day: 'numeric' });
const hourOnly = new Intl.DateTimeFormat('en-GB', { timeZone: TZ, hour: 'numeric', hourCycle: 'h23' });

export const fmtHour = (sec) => (isNum(sec) ? hourFmt.format(new Date(sec * 1000)) : '—');
export const fmtDayHour = (sec) => (isNum(sec) ? dayHourFmt.format(new Date(sec * 1000)) : '—');
/** "2026-11-14" -> "Sat 14 Nov" */
export const fmtDay = (isoDay) => {
  const d = new Date(`${isoDay}T12:00:00Z`);
  return Number.isNaN(d.getTime()) ? String(isoDay) : dayFmt.format(d);
};
const lagosHour = (sec) => Number(hourOnly.format(new Date(sec * 1000))) % 24;

export function ago(ms) {
  if (!ms || !Number.isFinite(ms)) return 'never';
  const s = Math.round((Date.now() - ms) / 1000);
  if (s < 5) return 'just now';
  if (s < 60) return `${s} s ago`;
  if (s < 3600) return `${Math.floor(s / 60)} min ago`;
  if (s < 86400) return `${Math.floor(s / 3600)} h ago`;
  return `${Math.floor(s / 86400)} d ago`;
}

const COMPASS = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
export const compass = (deg) => (isNum(deg) ? COMPASS[Math.round((((deg % 360) + 360) % 360) / 22.5) % 16] : '');

/* ------------------------------------------------------------------ risk */
// Status colours, used only for risk (never for a chart series). Always shown with the level name.
export const RISK_COLOR = ['#0ca30c', '#fab219', '#ec7a24', '#d03b3b'];
export const RISK_LABEL = ['Normal', 'Advisory', 'Watch', 'Warning'];
export const HAZARD_LABEL = {
  thunderstorm: 'Thunderstorm / lightning', wind: 'Strong gusts', rain: 'Heavy rain', flood: '24 h flood rainfall',
  heat: 'High temperature', visibility: 'Low visibility',
};
export const hazardLabel = (h) => HAZARD_LABEL[h] || h;

export function RiskBadge({ level = 0, label }) {
  const l = Math.max(0, Math.min(3, Number(level) || 0));
  return (
    <span className={`wx-badge wx-risk-${l}`} title={RISK_LABEL[l]}>
      <i style={{ background: RISK_COLOR[l] }} aria-hidden="true" />{label || RISK_LABEL[l]}
    </span>
  );
}

/** One cell per hour, coloured by risk level; hover (or tap) shows the hour and its drivers. */
export function RiskStrip({ hours }) {
  const [hover, setHover] = useState(null);
  if (!hours.length) return <div className="gx-chart-empty" style={{ height: 60 }}>No hourly forecast.</div>;
  const h = hover !== null ? hours[hover] : null;
  return (
    <div className="wx-strip-wrap">
      <div className="wx-strip" role="img" aria-label="Hourly grid weather risk" onMouseLeave={() => setHover(null)}>
        {hours.map((x, i) => (
          <span key={x.t} className={hover === i ? 'on' : ''} style={x.riskLevel ? { background: RISK_COLOR[x.riskLevel] } : undefined}
            onMouseEnter={() => setHover(i)} onClick={() => setHover(i)} />
        ))}
      </div>
      <div className="wx-strip-foot">
        <span>{fmtDayHour(hours[0].t)}</span>
        <span className="wx-strip-detail">
          {h ? <><b>{fmtDayHour(h.t)}</b> {RISK_LABEL[h.riskLevel]}{h.riskDrivers && h.riskDrivers.length ? `: ${h.riskDrivers.join(', ')}` : ''}</> : (
            <span className="wx-strip-legend">
              {RISK_LABEL.map((l, i) => <span key={l}><i style={{ background: i ? RISK_COLOR[i] : '#2a3a57' }} />{l}</span>)}
            </span>
          )}
        </span>
        <span>{fmtDayHour(hours[hours.length - 1].t)}</span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ icons */
const SUN = '#f5c451';
const RAIN = '#5aa2f0';
const STORM = '#c08af0';
const CLOUD_D = 'M7 19h10.5a4 4 0 0 0 .6-7.96A6 6 0 0 0 6.4 10.5 4.25 4.25 0 0 0 7 19z';
const CLOUD_UP = 'M7 15h10.5a4 4 0 0 0 .6-7.96A6 6 0 0 0 6.4 6.5 4.25 4.25 0 0 0 7 15z';

function Sun({ cx = 12, cy = 12, r = 4, ray = 3 }) {
  const rays = [0, 45, 90, 135, 180, 225, 270, 315].map((a) => {
    const t = (a * Math.PI) / 180;
    return <line key={a} x1={cx + Math.cos(t) * (r + 2)} y1={cy + Math.sin(t) * (r + 2)} x2={cx + Math.cos(t) * (r + 2 + ray)} y2={cy + Math.sin(t) * (r + 2 + ray)} />;
  });
  return <g stroke={SUN} fill="none"><circle cx={cx} cy={cy} r={r} />{rays}</g>;
}

/** WMO weather code -> icon. */
export function WeatherIcon({ code, isDay = 1, size = 22, title }) {
  let body;
  const c = isNum(code) ? code : null;
  const moon = <path d="M15.5 4.5a7.5 7.5 0 1 0 4 13.6A6.5 6.5 0 0 1 15.5 4.5z" stroke="#c9d6ea" fill="none" />;
  if (c === null || c === 3) body = <path d={CLOUD_D} />;
  else if (c === 0) body = isDay ? <Sun /> : moon;
  else if (c <= 2) {
    body = (
      <>
        {isDay ? <Sun cx={8} cy={8} r={3} ray={2} /> : <path d="M9 2.5a5 5 0 1 0 3.3 8.8A4.3 4.3 0 0 1 9 2.5z" stroke="#c9d6ea" fill="none" />}
        <path d="M9 20h8.5a3.5 3.5 0 0 0 .5-6.96A5 5 0 0 0 8.7 12.6 3.75 3.75 0 0 0 9 20z" fill="#121a29" />
      </>
    );
  } else if (c === 5) body = <><Sun cx={12} cy={9} r={3} ray={2} /><path d="M3 17h18M5 21h14" /></>;
  else if (c === 6) body = <path d="M3 8h11a3 3 0 1 0-3-3M3 12h16a3 3 0 1 1-3 3M3 16h8" />;
  else if (c === 45 || c === 48) body = <><path d={CLOUD_UP} /><path d="M4 18.5h16M6 21.5h12" /></>;
  else if (c >= 51 && c <= 57) body = <><path d={CLOUD_UP} /><g stroke={RAIN}><path d="M8 18.5v.5M12 19v.5M16 18.5v.5M10 21.5v.5M14 21.5v.5" /></g></>;
  else if ((c >= 71 && c <= 77) || c === 85 || c === 86) body = <><path d={CLOUD_UP} /><path d="M8 19l.01 0M12 21l.01 0M16 19l.01 0" strokeWidth="2.6" /></>;
  else if (c >= 95) body = <><path d={CLOUD_UP} /><path d="M13 14l-3 4.5h4L11 23" stroke={STORM} /></>;
  else {
    const heavy = c === 65 || c === 67 || c === 82;
    body = <><path d={CLOUD_UP} /><g stroke={RAIN}><path d="M8 17.5l-1 3M12 17.5l-1 3M16 17.5l-1 3" />{heavy && <path d="M10 20.5l-.8 2.5M14 20.5l-.8 2.5" />}</g></>;
  }
  return (
    <svg className="wx-icon" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#c9d6ea" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"
      role="img" aria-label={title || 'weather'}>
      {title && <title>{title}</title>}
      {body}
    </svg>
  );
}

/* ------------------------------------------------------------- hourly chart */
// Two categorical series colours for the dark surface (status colours are kept for risk only).
export const SERIES = ['#3987e5', '#e0629a'];

function niceTicks(min, max, count = 4) {
  if (!Number.isFinite(min) || !Number.isFinite(max)) return [0, 1];
  if (min === max) { const pad = Math.abs(min) * 0.1 || 1; min -= pad; max += pad; }
  const raw = (max - min) / count;
  const mag = 10 ** Math.floor(Math.log10(raw));
  const step = [1, 2, 2.5, 5, 10].map((m) => m * mag).find((s) => raw <= s) || 10 * mag;
  const ticks = [];
  for (let v = Math.floor(min / step) * step; v <= Math.ceil(max / step) * step + step / 2; v += step) ticks.push(Number(v.toFixed(6)));
  return ticks;
}

/**
 * Hourly chart for series that share ONE unit (never a second axis).
 * series: [{ key, name, color, unit, type: 'line'|'bar', dashed, digits }]
 * domain: [min|'auto', max|'auto'] (default [0, 'auto'])
 */
export function HourlyChart({ data, series, height = 220, domain = [0, 'auto'], nowSec, refY, refLabel }) {
  const [wrapRef, width] = useWidth();
  const [hover, setHover] = useState(null);
  const pad = { l: 44, r: 10, t: 12, b: 26 };
  const rows = data.filter((d) => isNum(d.t));
  const vals = rows.flatMap((d) => series.map((s) => d[s.key])).filter(isNum);
  if (rows.length < 2 || !vals.length) return <div ref={wrapRef} className="gx-chart-empty" style={{ height }}>No data for this period.</div>;
  let lo = domain[0] === 'auto' ? Math.min(...vals) : domain[0];
  let hi = domain[1] === 'auto' ? Math.max(...vals, isNum(refY) ? refY : -Infinity) : domain[1];
  if (domain[0] === 'auto' && domain[1] === 'auto') { const p = (hi - lo) * 0.08 || 1; lo -= p; hi += p; }
  if (hi <= lo) hi = lo + 1;
  const ticks = domain[0] !== 'auto' && domain[1] !== 'auto' ? niceTicks(lo, hi).filter((v) => v >= lo && v <= hi) : niceTicks(lo, hi);
  const y0 = domain[0] !== 'auto' && domain[1] !== 'auto' ? lo : ticks[0];
  const y1 = domain[0] !== 'auto' && domain[1] !== 'auto' ? hi : ticks[ticks.length - 1];
  const t0 = rows[0].t;
  const t1 = rows[rows.length - 1].t;
  const w = Math.max(10, width - pad.l - pad.r);
  const h = height - pad.t - pad.b;
  const x = (t) => pad.l + ((t - t0) / (t1 - t0 || 1)) * w;
  const y = (v) => pad.t + h - ((Math.max(y0, Math.min(y1, v)) - y0) / (y1 - y0 || 1)) * h;
  const slot = w / rows.length;
  const bars = series.filter((s) => s.type === 'bar');
  const barW = Math.max(1, Math.min(10, (slot - 2) / Math.max(1, bars.length) - 1));
  // x ticks every 6, 12 or 24 hours (on the Nigerian clock), whichever fits the width
  const stepH = [3, 6, 12, 24].find((s) => ((t1 - t0) / 3600 / s) * 64 <= w) || 24;
  const xt = rows.filter((d) => lagosHour(d.t) % stepH === 0);
  const linePath = (key) => {
    let p = '';
    let pen = false;
    rows.forEach((d) => {
      if (!isNum(d[key])) { pen = false; return; }
      p += `${pen ? 'L' : 'M'}${x(d.t).toFixed(1)},${y(d[key]).toFixed(1)}`;
      pen = true;
    });
    return p;
  };
  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    const px = e.clientX - r.left;
    const i = Math.round(((px - pad.l) / w) * (rows.length - 1));
    setHover(i >= 0 && i < rows.length ? i : null);
  };
  const hi2 = hover !== null ? rows[hover] : null;
  const tipLeft = hi2 && x(hi2.t) > width - 200;
  return (
    <div className="wx-chart">
      {series.length > 1 && <Legend items={series.map((s) => ({ label: s.name, color: s.color, hatch: false }))} />}
      <div ref={wrapRef} className="gx-chart" style={{ height }} onMouseMove={onMove} onMouseLeave={() => setHover(null)}>
        <svg width={width} height={height} role="img" aria-label={`${series.map((s) => s.name).join(', ')}, hourly`}>
          {ticks.map((v) => (
            <g key={v}>
              <line x1={pad.l} x2={width - pad.r} y1={y(v)} y2={y(v)} className="gx-grid" />
              <text x={pad.l - 6} y={y(v) + 4} textAnchor="end" className="gx-axis">{Math.abs(v) >= 1000 ? `${(v / 1000).toFixed(1)}k` : v}</text>
            </g>
          ))}
          {xt.map((d) => (
            <text key={d.t} x={x(d.t)} y={height - 8} textAnchor="middle" className="gx-axis">
              {lagosHour(d.t) === 0 ? tickDayFmt.format(new Date(d.t * 1000)) : fmtHour(d.t)}
            </text>
          ))}
          {isNum(refY) && refY >= y0 && refY <= y1 && (
            <g>
              <line x1={pad.l} x2={width - pad.r} y1={y(refY)} y2={y(refY)} stroke="#6f7f99" strokeDasharray="4 4" />
              {refLabel && <text x={width - pad.r - 2} y={y(refY) - 4} textAnchor="end" className="gx-axis">{refLabel}</text>}
            </g>
          )}
          {bars.map((s, j) => rows.map((d) => (isNum(d[s.key]) && d[s.key] > 0 ? (
            <rect key={`${s.key}${d.t}`} x={x(d.t) - (bars.length * (barW + 1)) / 2 + j * (barW + 1)} y={y(d[s.key])}
              width={barW} height={Math.max(1, y(y0) - y(d[s.key]))} rx={Math.min(2, barW / 2)} fill={s.color} />
          ) : null)))}
          {series.filter((s) => s.type !== 'bar').map((s) => (
            <path key={s.key} d={linePath(s.key)} fill="none" stroke={s.color} strokeWidth="2" strokeDasharray={s.dashed ? '5 4' : undefined} strokeLinejoin="round" />
          ))}
          {isNum(nowSec) && nowSec >= t0 && nowSec <= t1 && (
            <g>
              <line x1={x(nowSec)} x2={x(nowSec)} y1={pad.t} y2={pad.t + h} stroke="#8cc0ff" strokeDasharray="3 3" />
              <text x={x(nowSec) + 4} y={pad.t + 10} className="gx-axis" style={{ fill: '#8cc0ff' }}>now</text>
            </g>
          )}
          {hi2 && <line x1={x(hi2.t)} x2={x(hi2.t)} y1={pad.t} y2={pad.t + h} stroke="#a9b6cc" strokeOpacity="0.5" />}
          {hi2 && series.filter((s) => s.type !== 'bar' && isNum(hi2[s.key])).map((s) => (
            <circle key={s.key} cx={x(hi2.t)} cy={y(hi2[s.key])} r="4" fill={s.color} stroke="#121a29" strokeWidth="2" />
          ))}
        </svg>
        {hi2 && (
          <div className="gx-tooltip" style={{ left: tipLeft ? undefined : x(hi2.t) + 10, right: tipLeft ? width - x(hi2.t) + 10 : undefined }}>
            <div className="gx-tooltip-time">{fmtDayHour(hi2.t)}</div>
            {series.map((s) => (
              <div key={s.key} className="gx-tooltip-row"><i style={{ background: s.color }} /><span>{s.name}</span>
                <b>{fmt(hi2[s.key], s.digits === undefined ? 1 : s.digits)}{s.unit ? ` ${s.unit}` : ''}</b></div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

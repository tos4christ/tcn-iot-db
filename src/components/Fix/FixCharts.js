/**
 * SVG charts for the *_fix analysis pages (no chart library, no licence).
 * Times are "station clock as UTC" (see tcn_radar_BE/controllers/analytics2.js), so they are
 * always formatted with timeZone 'UTC' and every viewer sees the station's own clock.
 *
 * RangeChart  - average line with the min-max band per period, gaps where no data, hover detail
 * Timeline    - in service / out of service / no data strip with hover detail
 * ColumnChart - one or more series of columns (one axis), hover detail
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useClipId } from '../GencoPortal/charts';

/**
 * Width of the chart box, kept up to date. (GencoPortal's useWidth watches only the first element
 * it is given; a chart that switches from its "empty" box to the drawn one kept a stale width and
 * could stick out of the page on a phone. A callback ref follows whichever element is mounted.)
 */
export function useWidth() {
  const [width, setWidth] = useState(600);
  const stop = useRef(null);
  const ref = useCallback((node) => {
    if (stop.current) { stop.current(); stop.current = null; }
    if (!node) return;
    const update = () => setWidth(node.clientWidth || 600);
    update();
    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', update);
      stop.current = () => window.removeEventListener('resize', update);
    } else {
      const ro = new ResizeObserver(update);
      ro.observe(node);
      stop.current = () => ro.disconnect();
    }
  }, []);
  useEffect(() => () => { if (stop.current) stop.current(); }, []);
  return [ref, width];
}

const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const p2 = (n) => String(n).padStart(2, '0');
export function fmtWall(t, { seconds = false, date = true } = {}) {
  if (!Number.isFinite(t)) return '—';
  const d = new Date(t);
  const time = `${p2(d.getUTCHours())}:${p2(d.getUTCMinutes())}${seconds ? `:${p2(d.getUTCSeconds())}` : ''}`;
  return date ? `${p2(d.getUTCDate())} ${MON[d.getUTCMonth()]} ${d.getUTCFullYear()}, ${time}` : time;
}
export function fmtDuration(ms) {
  if (!Number.isFinite(ms) || ms <= 0) return '0 min';
  const m = Math.round(ms / 60000);
  if (m < 1) return `${Math.round(ms / 1000)} s`;
  const d = Math.floor(m / 1440);
  const h = Math.floor((m % 1440) / 60);
  const mm = m % 60;
  return [d && `${d} d`, h && `${h} h`, (mm || (!d && !h)) && `${mm} min`].filter(Boolean).join(' ');
}

function niceTicks(min, max, count = 4) {
  if (!Number.isFinite(min) || !Number.isFinite(max)) return [0, 1];
  if (min === max) { const pad = Math.abs(min) * 0.05 || 1; min -= pad; max += pad; }
  const raw = (max - min) / count;
  const mag = 10 ** Math.floor(Math.log10(raw));
  const step = [1, 2, 2.5, 5, 10].map((m) => m * mag).find((s) => raw <= s) || 10 * mag;
  const lo = Math.floor(min / step) * step;
  const hi = Math.ceil(max / step) * step;
  const ticks = [];
  for (let v = lo; v <= hi + step / 2; v += step) ticks.push(Number(v.toFixed(6)));
  return ticks;
}

const TIME_STEPS = [60, 300, 900, 1800, 3600, 7200, 10800, 21600, 43200, 86400, 172800, 604800].map((s) => s * 1000);
function timeTicks(t0, t1, width) {
  const want = Math.max(2, Math.min(8, Math.floor(width / 110)));
  const step = TIME_STEPS.find((s) => (t1 - t0) / s <= want) || TIME_STEPS[TIME_STEPS.length - 1];
  const ticks = [];
  for (let t = Math.ceil(t0 / step) * step; t <= t1; t += step) ticks.push(t);
  const daily = step >= 86400000;
  const multiDay = t1 - t0 > 36 * 3600000;
  const label = (t) => {
    const d = new Date(t);
    if (daily) return `${p2(d.getUTCDate())} ${MON[d.getUTCMonth()]}`;
    const hm = `${p2(d.getUTCHours())}:${p2(d.getUTCMinutes())}`;
    return multiDay && d.getUTCHours() === 0 && d.getUTCMinutes() === 0 ? `${p2(d.getUTCDate())} ${MON[d.getUTCMonth()]}` : hm;
  };
  return ticks.map((t) => ({ t, label: label(t) }));
}

/**
 * points: [{ t, avg, min, max, n }], from/to: the period asked for, bucketMs: period length.
 * marks: [{ t, v, label }] highlighted readings (e.g. the exact minimum and maximum).
 */
export function RangeChart({ points, from, to, bucketMs, unit, digits = 2, color = '#3987e5', height = 300, marks = [], emptyText = 'No readings in this period.' }) {
  const [wrapRef, width] = useWidth();
  const [hover, setHover] = useState(null);
  const clipId = useClipId();
  const pad = { l: 56, r: 16, t: 14, b: 30 };
  const valid = points.filter((p) => Number.isFinite(p.avg));

  const geo = useMemo(() => {
    if (!valid.length) return null;
    const t0 = Math.min(from, valid[0].t);
    const t1 = Math.max(to, valid[valid.length - 1].t + bucketMs);
    const vals = [];
    valid.forEach((p) => { vals.push(p.avg); if (Number.isFinite(p.min)) vals.push(p.min); if (Number.isFinite(p.max)) vals.push(p.max); });
    marks.forEach((m) => { if (Number.isFinite(m.v)) vals.push(m.v); });
    const ticks = niceTicks(Math.min(...vals), Math.max(...vals));
    const y0 = ticks[0];
    const y1 = ticks[ticks.length - 1];
    const w = Math.max(10, width - pad.l - pad.r);
    const h = height - pad.t - pad.b;
    const x = (t) => pad.l + ((t - t0) / (t1 - t0 || 1)) * w;
    const y = (v) => pad.t + h - ((v - y0) / (y1 - y0 || 1)) * h;
    // contiguous runs: a missing period breaks the line instead of drawing across it
    const runs = [];
    valid.forEach((p, i) => {
      if (!i || p.t - valid[i - 1].t > bucketMs * 1.5) runs.push([]);
      runs[runs.length - 1].push(p);
    });
    return { t0, t1, ticks, x, y, w, h, runs, xt: timeTicks(t0, t1, w) };
  }, [points, from, to, bucketMs, width, height, marks]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!geo) return <div ref={wrapRef} className="gx-chart-empty" style={{ height }}>{emptyText}</div>;
  const { ticks, x, y, h, runs, xt, t0, t1 } = geo;
  const mid = (p) => p.t + bucketMs / 2; // a period is drawn at its middle
  const line = (run) => run.map((p, i) => `${i ? 'L' : 'M'}${x(mid(p)).toFixed(1)},${y(p.avg).toFixed(1)}`).join('');
  const band = (run) => {
    const top = run.filter((p) => Number.isFinite(p.max));
    const bot = run.filter((p) => Number.isFinite(p.min));
    if (top.length < 1 || bot.length < 1) return '';
    return `${top.map((p, i) => `${i ? 'L' : 'M'}${x(mid(p)).toFixed(1)},${y(p.max).toFixed(1)}`).join('')}${[...bot].reverse().map((p) => `L${x(mid(p)).toFixed(1)},${y(p.min).toFixed(1)}`).join('')}Z`;
  };
  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    const t = t0 + ((e.clientX - r.left - pad.l) / (geo.w || 1)) * (t1 - t0);
    let best = valid[0];
    valid.forEach((p) => { if (Math.abs(mid(p) - t) < Math.abs(mid(best) - t)) best = p; });
    setHover(best);
  };
  const tipLeft = hover && x(mid(hover)) > width - 220;
  const f = (v) => (Number.isFinite(v) ? `${v.toFixed(digits)} ${unit}` : '—');

  return (
    <div ref={wrapRef} className="gx-chart" style={{ height }} onMouseMove={onMove} onMouseLeave={() => setHover(null)}>
      <svg width={width} height={height} role="img" aria-label={`${unit} over time, average with minimum to maximum range`}>
        <defs><clipPath id={clipId}><rect x={pad.l - 4} y={pad.t - 4} width={geo.w + 8} height={h + 8} /></clipPath></defs>
        {ticks.map((v) => (
          <g key={v}>
            <line x1={pad.l} x2={width - pad.r} y1={y(v)} y2={y(v)} className="gx-grid" />
            <text x={pad.l - 8} y={y(v) + 4} textAnchor="end" className="gx-axis">{Math.abs(v) >= 1000 ? `${(v / 1000).toFixed(1)}k` : v}</text>
          </g>
        ))}
        {xt.map(({ t, label }) => <text key={t} x={x(t)} y={height - 9} textAnchor="middle" className="gx-axis">{label}</text>)}
        <g clipPath={`url(#${clipId})`}>
          {runs.map((run, i) => <path key={`b${i}`} d={band(run)} fill={color} fillOpacity={0.16} stroke="none" />)}
          {runs.map((run, i) => (run.length > 1
            ? <path key={`l${i}`} d={line(run)} fill="none" stroke={color} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
            : <circle key={`l${i}`} cx={x(mid(run[0]))} cy={y(run[0].avg)} r={2.5} fill={color} />))}
          {marks.filter((m) => Number.isFinite(m.v)).map((m) => (
            <g key={m.label}>
              <circle cx={x(m.t)} cy={y(m.v)} r={5} fill="var(--gx-surface)" stroke="var(--gx-text)" strokeWidth={2} />
              <text x={x(m.t)} y={y(m.v) + (m.label.startsWith('Max') ? -10 : 18)} textAnchor="middle" className="gx-ref-label">{m.label}</text>
            </g>
          ))}
          {hover && (
            <g>
              <line x1={x(mid(hover))} x2={x(mid(hover))} y1={pad.t} y2={pad.t + h} className="gx-crosshair" />
              <circle cx={x(mid(hover))} cy={y(hover.avg)} r={4} fill={color} stroke="var(--gx-surface)" strokeWidth={2} />
            </g>
          )}
        </g>
      </svg>
      {hover && (
        <div className="gx-tooltip" style={{ left: tipLeft ? undefined : x(mid(hover)) + 12, right: tipLeft ? width - x(mid(hover)) + 12 : undefined }}>
          <div className="gx-tooltip-time">{fmtWall(hover.t)}{bucketMs > 5000 ? ` + ${fmtDuration(bucketMs)}` : ''}</div>
          <div className="gx-tooltip-row"><i style={{ background: color }} /><span>Average</span><b>{f(hover.avg)}</b></div>
          <div className="gx-tooltip-row"><i style={{ background: color, opacity: 0.35 }} /><span>Minimum</span><b>{f(hover.min)}</b></div>
          <div className="gx-tooltip-row"><i style={{ background: color, opacity: 0.35 }} /><span>Maximum</span><b>{f(hover.max)}</b></div>
          <div className="gx-tooltip-row"><span>Readings</span><b>{hover.n}</b></div>
        </div>
      )}
    </div>
  );
}

export const STATE_STYLE = {
  up: { label: 'In service', color: '#0ca30c' },
  out: { label: 'Out of service', color: '#d03b3b' },
  nodata: { label: 'No data', color: '#6f7f99' },
};

/** segments: [{ state: 'up' | 'out' | 'nodata', from, to }] */
export function Timeline({ segments, from, to, height = 64 }) {
  const [wrapRef, width] = useWidth();
  const [hover, setHover] = useState(null);
  const hatchId = `${useClipId()}-hatch`;
  const pad = { l: 8, r: 8, t: 6, b: 24 };
  const w = Math.max(10, width - pad.l - pad.r);
  const h = height - pad.t - pad.b;
  const t0 = from;
  const t1 = Math.max(to, from + 1);
  const x = (t) => pad.l + ((Math.min(Math.max(t, t0), t1) - t0) / (t1 - t0)) * w;
  const xt = timeTicks(t0, t1, w);
  const tipLeft = hover && x(hover.from) > width - 240;
  return (
    <div ref={wrapRef} className="fx-timeline" style={{ height, position: 'relative' }} onMouseLeave={() => setHover(null)}>
      <svg width={width} height={height} role="img" aria-label="Service timeline">
        <defs>
          <pattern id={hatchId} width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width="6" height="6" fill="#1f2b42" /><line x1="0" y1="0" x2="0" y2="6" stroke="#6f7f99" strokeWidth="2" />
          </pattern>
        </defs>
        <rect x={pad.l} y={pad.t} width={w} height={h} rx={4} fill="var(--gx-bg)" />
        {segments.map((g, i) => {
          const sx = x(g.from);
          const sw = Math.max(1, x(g.to) - sx);
          return (
            <rect key={i} x={sx} y={pad.t} width={sw} height={h} fill={g.state === 'nodata' ? `url(#${hatchId})` : STATE_STYLE[g.state].color}
              onMouseEnter={() => setHover(g)} style={{ cursor: 'default' }} />
          );
        })}
        {xt.map(({ t, label }) => <text key={t} x={x(t)} y={height - 7} textAnchor="middle" className="gx-axis">{label}</text>)}
      </svg>
      {hover && (
        <div className="gx-tooltip" style={{ top: height - 4, left: tipLeft ? undefined : x(hover.from), right: tipLeft ? 8 : undefined }}>
          <div className="gx-tooltip-row"><i style={{ background: STATE_STYLE[hover.state].color }} /><span>{STATE_STYLE[hover.state].label}</span><b>{fmtDuration(hover.to - hover.from)}</b></div>
          <div className="gx-tooltip-time">{fmtWall(hover.from, { seconds: true })} → {fmtWall(hover.to, { seconds: true })}</div>
        </div>
      )}
    </div>
  );
}

/**
 * items: [{ key, label, values: { [seriesKey]: number } }], series: [{ key, label, color }].
 * All series share one axis (same unit).
 */
export function ColumnChart({ items, series, unit = '', digits = 1, height = 240, emptyText = 'No data.' }) {
  const [wrapRef, width] = useWidth();
  const [hover, setHover] = useState(null);
  const pad = { l: 52, r: 12, t: 12, b: 30 };
  const vals = items.flatMap((it) => series.map((s) => it.values[s.key])).filter(Number.isFinite);
  if (!items.length || !vals.length) return <div ref={wrapRef} className="gx-chart-empty" style={{ height }}>{emptyText}</div>;
  const ticks = niceTicks(Math.min(0, ...vals), Math.max(0, ...vals));
  const y0 = ticks[0];
  const y1 = ticks[ticks.length - 1];
  const w = Math.max(10, width - pad.l - pad.r);
  const h = height - pad.t - pad.b;
  const y = (v) => pad.t + h - ((v - y0) / (y1 - y0 || 1)) * h;
  const slot = w / items.length;
  const gap = 2;
  const barW = Math.max(1, (slot - 6) / series.length - gap);
  // room for the longest label (about 6.5 px a character in the 11 px axis font) plus a gap
  const labelW = Math.max(30, ...items.map((it) => String(it.label).length * 6.5)) + 14;
  const every = Math.max(1, Math.ceil(items.length / Math.max(2, Math.floor(w / labelW))));
  const hi = hover !== null ? items[hover] : null;
  const tipLeft = hover !== null && pad.l + slot * hover > width - 200;
  return (
    <div ref={wrapRef} className="gx-chart" style={{ height }} onMouseLeave={() => setHover(null)}>
      <svg width={width} height={height} role="img" aria-label={`${series.map((s) => s.label).join(', ')} per period`}>
        {ticks.map((v) => (
          <g key={v}>
            <line x1={pad.l} x2={width - pad.r} y1={y(v)} y2={y(v)} className="gx-grid" />
            <text x={pad.l - 8} y={y(v) + 4} textAnchor="end" className="gx-axis">{Math.abs(v) >= 1000 ? `${(v / 1000).toFixed(1)}k` : v}</text>
          </g>
        ))}
        {items.map((it, i) => (
          <g key={it.key} onMouseEnter={() => setHover(i)}>
            <rect x={pad.l + slot * i} y={pad.t} width={slot} height={h} fill={hover === i ? 'rgb(57 135 229 / 0.08)' : 'transparent'} />
            {series.map((s, j) => {
              const v = it.values[s.key];
              if (!Number.isFinite(v)) return null;
              const top = y(Math.max(0, v));
              const bh = Math.max(1, Math.abs(y(v) - y(0)));
              return <rect key={s.key} x={pad.l + slot * i + 3 + j * (barW + gap)} y={top} width={barW} height={bh} rx={Math.min(3, barW / 2)} fill={s.color} />;
            })}
            {i % every === 0 && <text x={pad.l + slot * i + slot / 2} y={height - 9} textAnchor="middle" className="gx-axis">{it.label}</text>}
          </g>
        ))}
      </svg>
      {hi && (
        <div className="gx-tooltip" style={{ left: tipLeft ? undefined : pad.l + slot * (hover + 1) + 6, right: tipLeft ? width - pad.l - slot * hover + 6 : undefined }}>
          <div className="gx-tooltip-time">{hi.title || hi.label}</div>
          {series.map((s) => (
            <div key={s.key} className="gx-tooltip-row"><i style={{ background: s.color }} /><span>{s.label}</span>
              <b>{Number.isFinite(hi.values[s.key]) ? hi.values[s.key].toFixed(digits) : '—'}{unit ? ` ${unit}` : ''}</b></div>
          ))}
        </div>
      )}
    </div>
  );
}

export function Legend({ items }) {
  return (
    <ul className="gx-legend inline">
      {items.map((it) => <li key={it.label}><i style={{ background: it.color, backgroundImage: it.hatch ? 'repeating-linear-gradient(45deg, #6f7f99 0 2px, #1f2b42 2px 5px)' : undefined }} />{it.label}{it.value !== undefined && <b>{it.value}</b>}</li>)}
    </ul>
  );
}

/**
 * Ranked horizontal bars (one measure, one axis): label, bar, value and share of the total.
 * Replaces the 29-slice pie of /charts, which could not be read once slices were small.
 * items: [{ key, label, value, title?, onClick? }] already sorted.
 */
export function BarList({ items, unit = 'MW', digits = 1, total, color = '#3987e5', rowHeight = 30, emptyText = 'Nothing to show.' }) {
  const [wrapRef, width] = useWidth();
  const [hover, setHover] = useState(null);
  if (!items.length) return <div ref={wrapRef} className="gx-chart-empty" style={{ height: 120 }}>{emptyText}</div>;
  const narrow = width < 520;
  const labelW = narrow ? Math.min(140, width * 0.38) : 210;
  const valueW = narrow ? 92 : 150;
  const barX = labelW + 10;
  const barW = Math.max(20, width - barX - valueW - 8);
  const max = Math.max(...items.map((it) => it.value), 0) || 1;
  const height = items.length * rowHeight + 4;
  const sum = total !== undefined ? total : items.reduce((a, it) => a + it.value, 0);
  const cut = (s, n) => (s.length > n ? `${s.slice(0, n - 1)}…` : s);
  const maxChars = Math.floor(labelW / 6.6);
  return (
    <div ref={wrapRef} className="gx-chart" style={{ height }}>
      <svg width={width} height={height} role="img" aria-label={`${items.length} bars, ${unit}`}>
        {items.map((it, i) => {
          const y = i * rowHeight + 2;
          const w = Math.max(it.value > 0 ? 2 : 0, (it.value / max) * barW);
          const share = sum > 0 ? (it.value / sum) * 100 : 0;
          const active = hover === i;
          return (
            <g key={it.key || it.label} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}
              onClick={it.onClick} style={{ cursor: it.onClick ? 'pointer' : 'default' }}>
              <title>{it.title || `${it.label}: ${it.value.toFixed(digits)} ${unit} (${share.toFixed(1)}% of the total)`}</title>
              <rect x={0} y={y} width={width} height={rowHeight - 2} rx={6} fill={active ? 'rgb(57 135 229 / 0.10)' : 'transparent'} />
              <text x={labelW} y={y + rowHeight / 2 + 2} textAnchor="end" className="gx-axis" style={{ fill: 'var(--gx-text)', fontSize: 12 }}>{cut(it.label, maxChars)}</text>
              <rect x={barX} y={y + 6} width={barW} height={rowHeight - 14} rx={4} fill="var(--gx-grid)" opacity={0.45} />
              <rect x={barX} y={y + 6} width={w} height={rowHeight - 14} rx={4} fill={color} />
              <text x={width - 4} y={y + rowHeight / 2 + 2} textAnchor="end" className="gx-axis" style={{ fill: 'var(--gx-text)', fontSize: 12 }}>
                {it.value.toFixed(digits)}{narrow ? '' : ` ${unit}`}<tspan style={{ fill: 'var(--gx-muted)' }}>{`  ${share.toFixed(1)}%`}</tspan>
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

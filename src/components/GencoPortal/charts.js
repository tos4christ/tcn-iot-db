/**
 * Small, dependency-free SVG charts for the Genco portal.
 * Trend (area/lines with crosshair tooltip), Donut (share), Bars (current value), Sparkline.
 * Colours come from the caller (validated categorical palette in GencoPortal.js); text always
 * uses the page's text colours, never the series colour.
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';

export function useWidth() {
  const ref = useRef(null);
  const [width, setWidth] = useState(600);
  useEffect(() => {
    if (!ref.current) return undefined;
    const update = () => setWidth(ref.current ? ref.current.clientWidth : 600);
    update();
    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', update);
      return () => window.removeEventListener('resize', update);
    }
    const ro = new ResizeObserver(update);
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);
  return [ref, width];
}

const fmtTime = (t) => new Date(t).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Africa/Lagos' });
const fmtTimeSec = (t) => new Date(t).toLocaleTimeString('en-GB', { timeZone: 'Africa/Lagos' });

/** "Nice" axis ticks covering [min, max]. */
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

/**
 * Time-series chart. series: [{ key, label, color, points: [{ t, v }] }].
 * One series -> soft area fill; several -> lines with a legend. Hover shows a crosshair and
 * every series' value at that moment.
 */
export function TrendChart({ series, height = 260, unit = 'MW', digits = 1, yMin, yMax, refLines = [], emptyText = 'Collecting data…' }) {
  const [wrapRef, width] = useWidth();
  const [hoverX, setHoverX] = useState(null);
  const pad = { l: 52, r: 16, t: 14, b: 28 };
  const all = series.flatMap((s) => s.points);
  const ready = all.length > 1;

  const geo = useMemo(() => {
    if (!ready) return null;
    const t0 = Math.min(...all.map((p) => p.t));
    const t1 = Math.max(...all.map((p) => p.t));
    const vals = all.map((p) => p.v).filter(Number.isFinite);
    const lo = yMin !== undefined ? yMin : Math.min(...vals, ...refLines.map((r) => r.v));
    const hi = yMax !== undefined ? yMax : Math.max(...vals, ...refLines.map((r) => r.v));
    const ticks = niceTicks(lo, hi);
    const y0 = ticks[0];
    const y1 = ticks[ticks.length - 1];
    const w = Math.max(10, width - pad.l - pad.r);
    const h = height - pad.t - pad.b;
    const x = (t) => pad.l + (t1 === t0 ? w / 2 : ((t - t0) / (t1 - t0)) * w);
    const y = (v) => pad.t + h - ((v - y0) / (y1 - y0 || 1)) * h;
    const xticks = [0, 0.25, 0.5, 0.75, 1].map((f) => t0 + f * (t1 - t0));
    return { t0, t1, ticks, x, y, w, h, xticks };
  }, [series, width, height, yMin, yMax, refLines]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!ready) {
    return <div ref={wrapRef} className="gx-chart-empty" style={{ height }}>{emptyText}</div>;
  }
  const { ticks, x, y, h, xticks, t0, t1 } = geo;
  const path = (pts) => pts.filter((p) => Number.isFinite(p.v)).map((p, i) => `${i ? 'L' : 'M'}${x(p.t).toFixed(1)},${y(p.v).toFixed(1)}`).join('');
  const single = series.length === 1;

  // Hover: nearest timestamp across series
  let hoverT = null;
  if (hoverX !== null) {
    const t = t0 + ((hoverX - pad.l) / (geo.w || 1)) * (t1 - t0);
    const times = series[0].points.map((p) => p.t);
    hoverT = times.reduce((best, tt) => (Math.abs(tt - t) < Math.abs(best - t) ? tt : best), times[0]);
  }
  const valueAt = (s, t) => {
    const p = s.points.find((pp) => pp.t === t);
    return p ? p.v : null;
  };
  const tipLeft = hoverT !== null && x(hoverT) > width - 200;

  return (
    <div ref={wrapRef} className="gx-chart" style={{ height }}
      onMouseMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); setHoverX(Math.min(Math.max(e.clientX - r.left, pad.l), width - pad.r)); }}
      onMouseLeave={() => setHoverX(null)}>
      <svg width={width} height={height} role="img" aria-label={series.map((s) => s.label).join(', ')}>
        <defs>
          {single && (
            <linearGradient id={`gx-fill-${series[0].key}`} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor={series[0].color} stopOpacity="0.32" />
              <stop offset="100%" stopColor={series[0].color} stopOpacity="0" />
            </linearGradient>
          )}
        </defs>
        {ticks.map((v) => (
          <g key={v}>
            <line x1={pad.l} x2={width - pad.r} y1={y(v)} y2={y(v)} className="gx-grid" />
            <text x={pad.l - 8} y={y(v) + 4} textAnchor="end" className="gx-axis">{Math.abs(v) >= 1000 ? `${(v / 1000).toFixed(1)}k` : v}</text>
          </g>
        ))}
        {xticks.map((t, i) => (
          <text key={i} x={x(t)} y={height - 8} textAnchor={i === 0 ? 'start' : i === 4 ? 'end' : 'middle'} className="gx-axis">{t1 - t0 < 5 * 60000 ? fmtTimeSec(t) : fmtTime(t)}</text>
        ))}
        {refLines.map((r) => (
          <g key={r.label}>
            <line x1={pad.l} x2={width - pad.r} y1={y(r.v)} y2={y(r.v)} className="gx-ref" />
            <text x={width - pad.r} y={y(r.v) - 5} textAnchor="end" className="gx-ref-label">{r.label}</text>
          </g>
        ))}
        {single && (() => {
          const pts = series[0].points.filter((p) => Number.isFinite(p.v));
          if (pts.length < 2) return null;
          const area = `${path(pts)}L${x(pts[pts.length - 1].t).toFixed(1)},${(pad.t + h).toFixed(1)}L${x(pts[0].t).toFixed(1)},${(pad.t + h).toFixed(1)}Z`;
          return <path d={area} fill={`url(#gx-fill-${series[0].key})`} />;
        })()}
        {series.map((s) => (
          <path key={s.key} d={path(s.points)} fill="none" stroke={s.color} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
        ))}
        {series.map((s) => {
          const last = [...s.points].reverse().find((p) => Number.isFinite(p.v));
          return last ? <circle key={s.key} cx={x(last.t)} cy={y(last.v)} r={4} fill={s.color} stroke="var(--gx-surface)" strokeWidth={2} /> : null;
        })}
        {hoverT !== null && (
          <g>
            <line x1={x(hoverT)} x2={x(hoverT)} y1={pad.t} y2={pad.t + h} className="gx-crosshair" />
            {series.map((s) => {
              const v = valueAt(s, hoverT);
              return Number.isFinite(v) ? <circle key={s.key} cx={x(hoverT)} cy={y(v)} r={4} fill={s.color} stroke="var(--gx-surface)" strokeWidth={2} /> : null;
            })}
          </g>
        )}
      </svg>
      {hoverT !== null && (
        <div className="gx-tooltip" style={{ left: tipLeft ? undefined : x(hoverT) + 12, right: tipLeft ? width - x(hoverT) + 12 : undefined }}>
          <div className="gx-tooltip-time">{fmtTimeSec(hoverT)}</div>
          {series.map((s) => {
            const v = valueAt(s, hoverT);
            return (
              <div key={s.key} className="gx-tooltip-row">
                <i style={{ background: s.color }} /><span>{s.label}</span>
                <b>{Number.isFinite(v) ? v.toFixed(digits) : '—'}{unit ? ` ${unit}` : ''}</b>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/** Share of the current total. slices: [{ key, label, value, color }]. */
export function Donut({ slices, size = 200, unit = 'MW', centerLabel = 'Total' }) {
  const [hover, setHover] = useState(null);
  const total = slices.reduce((a, s) => a + Math.max(0, s.value), 0);
  const r = size / 2 - 10;
  const inner = r * 0.64;
  const cx = size / 2;
  const cy = size / 2;
  let angle = -Math.PI / 2;
  const gap = slices.filter((s) => s.value > 0).length > 1 ? 0.025 : 0;
  const arcs = slices.filter((s) => s.value > 0).map((s) => {
    const sweep = (s.value / total) * Math.PI * 2;
    const a0 = angle + gap / 2;
    const a1 = angle + sweep - gap / 2;
    angle += sweep;
    const large = a1 - a0 > Math.PI ? 1 : 0;
    const p = (rad, a) => `${(cx + rad * Math.cos(a)).toFixed(2)},${(cy + rad * Math.sin(a)).toFixed(2)}`;
    const d = sweep >= Math.PI * 2 - 0.001
      ? `M${p(r, -Math.PI / 2)}A${r},${r} 0 1 1 ${p(r, Math.PI * 1.5 - 0.0001)}L${p(inner, Math.PI * 1.5 - 0.0001)}A${inner},${inner} 0 1 0 ${p(inner, -Math.PI / 2)}Z`
      : `M${p(r, a0)}A${r},${r} 0 ${large} 1 ${p(r, a1)}L${p(inner, a1)}A${inner},${inner} 0 ${large} 0 ${p(inner, a0)}Z`;
    return { ...s, d };
  });
  const shown = hover ? slices.find((s) => s.key === hover) : null;
  return (
    <div className="gx-donut" style={{ width: size, height: size }}>
      <svg width={size} height={size} role="img" aria-label="Share of current output">
        {total <= 0 && <circle cx={cx} cy={cy} r={(r + inner) / 2} fill="none" stroke="var(--gx-grid)" strokeWidth={r - inner} />}
        {arcs.map((a) => (
          <path key={a.key} d={a.d} fill={a.color} opacity={hover && hover !== a.key ? 0.35 : 1}
            onMouseEnter={() => setHover(a.key)} onMouseLeave={() => setHover(null)} />
        ))}
      </svg>
      <div className="gx-donut-center">
        <span>{shown ? shown.label : centerLabel}</span>
        <b>{(shown ? shown.value : total).toFixed(1)}</b>
        <small>{shown && total > 0 ? `${((shown.value / total) * 100).toFixed(1)}% · ${unit}` : unit}</small>
      </div>
    </div>
  );
}

/** Horizontal bars with direct value labels. rows: [{ key, label, value, color, muted }]. */
export function Bars({ rows, unit = 'MW', max }) {
  const top = max || Math.max(1, ...rows.map((r) => r.value));
  return (
    <div className="gx-bars">
      {rows.map((r) => (
        <div key={r.key} className={`gx-bar-row ${r.muted ? 'muted' : ''}`} title={`${r.label}: ${r.value.toFixed(2)} ${unit}`}>
          <span className="gx-bar-label">{r.label}</span>
          <div className="gx-bar-track">
            <div className="gx-bar-fill" style={{ width: `${Math.max(0, (r.value / top) * 100)}%`, background: r.color }} />
          </div>
          <b className="gx-bar-value">{r.value.toFixed(1)}</b>
        </div>
      ))}
    </div>
  );
}

/** Tiny trend line for unit cards. */
export function Sparkline({ points, color, width = 120, height = 34 }) {
  const vals = points.map((p) => p.v).filter(Number.isFinite);
  if (vals.length < 2) return <svg width={width} height={height} aria-hidden="true"><line x1={0} x2={width} y1={height - 2} y2={height - 2} className="gx-grid" /></svg>;
  const lo = Math.min(...vals);
  const hi = Math.max(...vals);
  const x = (i) => (i / (points.length - 1)) * (width - 4) + 2;
  const y = (v) => height - 3 - ((v - lo) / (hi - lo || 1)) * (height - 8);
  const d = points.map((p, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(Number.isFinite(p.v) ? p.v : lo).toFixed(1)}`).join('');
  return (
    <svg width={width} height={height} aria-hidden="true">
      <path d={d} fill="none" stroke={color} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={x(points.length - 1)} cy={y(vals[vals.length - 1])} r={3} fill={color} />
    </svg>
  );
}

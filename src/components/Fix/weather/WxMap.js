/**
 * A small slippy map for the weather pages, without a map library: Esri basemap tiles (no key
 * needed, as in the v2 weather centre) under an SVG layer of circle markers.
 * Drag to move, + / - buttons or double-click to zoom, click a marker for its popup, click the
 * map elsewhere for onMapClick(lat, lon). If the tiles cannot load (no internet), the markers still
 * show on a plain background.
 *
 * markers: [{ id, lat, lon, r, fill, stroke, dash, label (hover text), popup (React node), onClick }]
 * rings:   [{ id, lat, lon, radiusKm }]          dashed circles (sampling ring)
 * bounds:  [[south, west], [north, east]]        initial view (refit when fitKey changes)
 */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useWidth } from '../FixCharts';

const TILE_URL = 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}';
const ATTRIBUTION = 'Tiles © Esri — Esri, HERE, Garmin, © OpenStreetMap contributors';
const T = 256;
const MAX_LAT = 85.05112878;

const clampLat = (lat) => Math.max(-MAX_LAT, Math.min(MAX_LAT, lat));
function project(lat, lon, z) {
  const s = T * 2 ** z;
  const sin = Math.sin((clampLat(lat) * Math.PI) / 180);
  return { x: ((lon + 180) / 360) * s, y: (0.5 - Math.log((1 + sin) / (1 - sin)) / (4 * Math.PI)) * s };
}
function unproject(x, y, z) {
  const s = T * 2 ** z;
  const lon = (x / s) * 360 - 180;
  const n = Math.PI - (2 * Math.PI * y) / s;
  return { lat: (180 / Math.PI) * Math.atan(Math.sinh(n)), lon: ((lon + 540) % 360) - 180 };
}
/** Pixels per km at this latitude and zoom. */
const pxPerKm = (lat, z) => (T * 2 ** z) / (40075.016686 * Math.cos((lat * Math.PI) / 180));

function fitView(bounds, width, height, minZoom, maxZoom, padding) {
  const [[s, w], [n, e]] = bounds;
  let zoom = minZoom;
  for (let z = maxZoom; z >= minZoom; z -= 1) {
    const a = project(n, w, z);
    const b = project(s, e, z);
    if (b.x - a.x <= width - 2 * padding && b.y - a.y <= height - 2 * padding) { zoom = z; break; }
  }
  const a = project(n, w, zoom);
  const b = project(s, e, zoom);
  const c = unproject((a.x + b.x) / 2, (a.y + b.y) / 2, zoom);
  return { lat: c.lat, lon: c.lon, zoom };
}

export default function WxMap({ markers = [], rings = [], bounds, fitKey, height = 440, minZoom = 4, maxZoom = 13, padding = 24, onMapClick, cursor = 'grab', ariaLabel = 'Map' }) {
  const [wrapRef, width] = useWidth();
  const [view, setView] = useState(null);
  const [hover, setHover] = useState(null);
  const [open, setOpen] = useState(null);
  const [tileErrors, setTileErrors] = useState(0);
  const drag = useRef(null);
  const fitted = useRef(null);

  // First view (and a new one when fitKey changes), once the width is known.
  useEffect(() => {
    if (!bounds || width < 50) return;
    const key = `${fitKey}`;
    if (fitted.current === key && view) return;
    fitted.current = key;
    setView(fitView(bounds, width, height, minZoom, maxZoom, padding));
    setOpen(null);
  }, [bounds, fitKey, width, height, minZoom, maxZoom, padding, view]);

  const zoomBy = useCallback((dz, at) => {
    setView((v) => {
      if (!v) return v;
      const z = Math.max(minZoom, Math.min(maxZoom, v.zoom + dz));
      if (z === v.zoom) return v;
      if (!at) return { ...v, zoom: z };
      // keep the point under the cursor in place
      const c = project(v.lat, v.lon, v.zoom);
      const p = { x: c.x - width / 2 + at.x, y: c.y - height / 2 + at.y };
      const ll = unproject(p.x, p.y, v.zoom);
      const p2 = project(ll.lat, ll.lon, z);
      const c2 = unproject(p2.x - at.x + width / 2, p2.y - at.y + height / 2, z);
      return { lat: c2.lat, lon: c2.lon, zoom: z };
    });
  }, [minZoom, maxZoom, width, height]);

  if (!view) return <div ref={wrapRef} className="wx-map" style={{ height }} aria-label={ariaLabel} />;

  const c = project(view.lat, view.lon, view.zoom);
  const ox = c.x - width / 2; // world pixel of the left edge
  const oy = c.y - height / 2;
  const n = 2 ** view.zoom;
  const tiles = [];
  for (let ty = Math.max(0, Math.floor(oy / T)); ty <= Math.min(n - 1, Math.floor((oy + height) / T)); ty += 1) {
    for (let tx = Math.floor(ox / T); tx <= Math.floor((ox + width) / T); tx += 1) {
      const wx = ((tx % n) + n) % n;
      tiles.push(
        <img key={`${view.zoom}/${tx}/${ty}`} alt="" draggable={false} src={TILE_URL.replace('{z}', view.zoom).replace('{y}', ty).replace('{x}', wx)}
          style={{ left: tx * T - ox, top: ty * T - oy }} onError={() => setTileErrors((e) => e + 1)} />,
      );
    }
  }
  const toScreen = (lat, lon) => {
    const p = project(lat, lon, view.zoom);
    return { x: p.x - ox, y: p.y - oy };
  };

  const local = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };
  const onPointerDown = (e) => {
    if (e.button !== 0 || e.target.closest('.wx-map-ui')) return;
    drag.current = { start: local(e), centre: c, moved: false, id: e.pointerId, target: e.target };
  };
  const onPointerMove = (e) => {
    const d = drag.current;
    if (!d) {
      return;
    }
    const p = local(e);
    const dx = p.x - d.start.x;
    const dy = p.y - d.start.y;
    if (!d.moved && Math.hypot(dx, dy) < 5) return;
    if (!d.moved) {
      d.moved = true;
      try { e.currentTarget.setPointerCapture(d.id); } catch (err) { /* not supported */ }
    }
    const ll = unproject(d.centre.x - dx, Math.max(0, Math.min(T * n, d.centre.y - dy)), view.zoom);
    setView((v) => ({ ...v, lat: ll.lat, lon: ll.lon }));
  };
  const onPointerUp = (e) => {
    const d = drag.current;
    drag.current = null;
    if (!d || d.moved) return;
    const markerEl = d.target.closest && d.target.closest('[data-marker]');
    if (markerEl) {
      const m = markers.find((x) => String(x.id) === markerEl.getAttribute('data-marker'));
      if (m) {
        if (m.onClick) m.onClick(m);
        else if (m.popup) setOpen((o) => (o === m.id ? null : m.id));
      }
      return;
    }
    if (open !== null) { setOpen(null); return; }
    if (onMapClick) {
      const p = local(e);
      const ll = unproject(ox + p.x, oy + p.y, view.zoom);
      onMapClick(ll.lat, ll.lon);
    }
  };

  const openMarker = open !== null ? markers.find((m) => m.id === open) : null;
  const hoverMarker = hover !== null && hover !== open ? markers.find((m) => m.id === hover) : null;
  const place = (m) => toScreen(m.lat, m.lon);

  return (
    <div ref={wrapRef} className="wx-map" style={{ height, cursor: drag.current && drag.current.moved ? 'grabbing' : cursor }} role="application" aria-label={ariaLabel}
      onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerCancel={() => { drag.current = null; }}
      onDoubleClick={(e) => { if (!e.target.closest('.wx-map-ui')) zoomBy(1, local(e)); }}>
      <div className="wx-tiles">{tiles}</div>
      <svg className="wx-overlay" width={width} height={height}>
        {rings.map((r) => {
          const p = toScreen(r.lat, r.lon);
          return <circle key={r.id} cx={p.x} cy={p.y} r={r.radiusKm * pxPerKm(r.lat, view.zoom)} fill="rgb(57 135 229 / 0.06)" stroke="#8cc0ff" strokeWidth="1" strokeDasharray="4 6" />;
        })}
        {markers.map((m) => {
          const p = place(m);
          if (p.x < -40 || p.y < -40 || p.x > width + 40 || p.y > height + 40) return null;
          const r = m.r || 7;
          return (
            <g key={m.id} data-marker={m.id} style={{ cursor: m.onClick || m.popup ? 'pointer' : 'default' }}
              onMouseEnter={() => setHover(m.id)} onMouseLeave={() => setHover((h) => (h === m.id ? null : h))}>
              <circle cx={p.x} cy={p.y} r={Math.max(r + 6, 12)} fill="transparent" />
              <circle cx={p.x} cy={p.y} r={r} fill={m.fill || 'none'} fillOpacity={m.fill ? 0.92 : 0} stroke={m.stroke || '#121a29'} strokeWidth="2" strokeDasharray={m.dash ? '3 3' : undefined} />
            </g>
          );
        })}
      </svg>
      {hoverMarker && hoverMarker.label && (() => {
        const p = place(hoverMarker);
        return <div className="wx-map-label" style={{ left: p.x, top: p.y - (hoverMarker.r || 7) - 8 }}>{hoverMarker.label}</div>;
      })()}
      {openMarker && openMarker.popup && (() => {
        const p = place(openMarker);
        const below = p.y < 190;
        return (
          <div className={`wx-map-popup wx-map-ui ${below ? 'below' : ''}`} style={{ left: Math.max(130, Math.min(width - 130, p.x)), top: below ? p.y + (openMarker.r || 7) + 8 : p.y - (openMarker.r || 7) - 8 }}>
            <button type="button" className="wx-popup-close" onClick={() => setOpen(null)} aria-label="Close">×</button>
            {openMarker.popup}
          </div>
        );
      })()}
      <div className="wx-zoom wx-map-ui">
        <button type="button" onClick={() => zoomBy(1)} disabled={view.zoom >= maxZoom} aria-label="Zoom in">+</button>
        <button type="button" onClick={() => zoomBy(-1)} disabled={view.zoom <= minZoom} aria-label="Zoom out">−</button>
        {bounds && <button type="button" onClick={() => setView(fitView(bounds, width, height, minZoom, maxZoom, padding))} aria-label="Show all" title="Show all">⤢</button>}
      </div>
      <div className="wx-attrib wx-map-ui">{tileErrors > 4 ? 'Map tiles unavailable (no internet) · ' : ''}{ATTRIBUTION}</div>
    </div>
  );
}

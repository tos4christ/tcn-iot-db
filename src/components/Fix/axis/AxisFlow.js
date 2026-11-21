/**
 * Ikorodu-Sagamu axis: live single-line flow diagram, power balance per line, and the locked
 * arrangement editor. Used by /bilaterals_fix (Fix/legacy/BilateralFix.js), which passes its
 * socket state in.
 *
 * Arrangement (which line, order along it, meter direction, counted or not, TLF) is read from the
 * server for everyone; changing it needs the lock password, checked on the server only.
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { api } from '../fixApi';
import {
  NODES, NODE_BY_KEY, DIRECTIONS, DEFAULT_TLF_PCT, completeLayout, readAll, analyseAxis, lineNodes,
  moveNode, setLine, setNode, num,
} from './axisModel';
import './axis.css';

const HISTORY_EVERY_MS = 10000;
const HISTORY_KEEP = 720; // 2 hours at 10 s

const f2 = (v) => (v === null || v === undefined || !Number.isFinite(v) ? '—' : v.toFixed(2));
const f1 = (v) => (v === null || v === undefined || !Number.isFinite(v) ? '—' : v.toFixed(1));
const STATUS_TEXT = { live: 'live', stale: 'no recent data', never: 'no data yet', nan: 'meter sends NaN' };
const VERDICT = {
  balanced: { cls: 'ok', title: 'Accounted for', text: 'Metered power in and out agree within the allowed transmission loss.' },
  unaccounted: { cls: 'bad', title: 'Power not accounted for', text: 'More power enters this line than its meters show leaving, beyond the allowed loss. Possible theft, an unmetered off-take or a meter fault.' },
  overmetered: { cls: 'watch', title: 'Meters show more out than in', text: 'Physically impossible: a meter direction, CT ratio or the arrangement is wrong. Check the direction settings.' },
  incomplete: { cls: 'watch', title: 'Incomplete', text: 'One or more meters on this line have no valid reading, so the balance cannot be trusted. The figures use the meters that are reporting.' },
  empty: { cls: 'muted', title: 'No meters', text: 'Nothing is counted on this line.' },
};

/* ------------------------------------------------------------------ live clock */
function useNow(ms) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => { const t = setInterval(() => setNow(Date.now()), ms); return () => clearInterval(t); }, [ms]);
  return now;
}

/* ------------------------------------------------------------------ diagram */
const SP = 132; // spacing between taps
const BOX_W = 118;
const BUS_Y = 150;

function NodeBox({ x, y, item, selected, onSelect }) {
  const { node, reading, cfg, inj } = item;
  const off = !cfg.include;
  const st = reading ? reading.status : 'never';
  const verb = inj === null ? (off ? 'not counted' : STATUS_TEXT[st]) : Math.abs(inj) < 0.005 ? 'no flow' : inj > 0 ? `gives ${inj.toFixed(2)} MW` : `takes ${(-inj).toFixed(2)} MW`;
  return (
    <g className={`ax-node k-${node.kind} s-${st} ${off ? 'is-off' : ''} ${selected ? 'is-sel' : ''}`} transform={`translate(${x - BOX_W / 2},${y})`}
      role="button" tabIndex={0} aria-label={`${node.name}: ${verb}`} onClick={() => onSelect(node.key)}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect(node.key); } }}>
      <title>{`${node.name}\nMeter MW: ${reading && reading.mw !== null ? reading.mw.toFixed(2) : '—'} · ${STATUS_TEXT[st]}\nDirection: ${DIRECTIONS.find((d) => d.key === cfg.dir)?.label}${off ? '\nNot counted in the balance' : ''}`}</title>
      <rect width={BOX_W} height={64} rx={10} />
      <circle className="ax-dot" cx={BOX_W - 12} cy={12} r={5} />
      <text x={9} y={18} className="ax-name">{node.short}</text>
      <text x={9} y={39} className="ax-mw">{reading && reading.mw !== null ? `${reading.mw.toFixed(2)} MW` : '— MW'}</text>
      <text x={9} y={56} className="ax-verb">{verb}</text>
    </g>
  );
}

function FlowArrow({ x1, y1, x2, y2, value, cls }) {
  const dir = value === null ? 'none' : value > 0.05 ? 'fwd' : value < -0.05 ? 'rev' : 'none';
  return <line x1={x1} y1={y1} x2={x2} y2={y2} className={`ax-wire ${cls} flow-${dir}`} />;
}

function LineDiagram({ analysis, selected, onSelect }) {
  const { items, line } = analysis;
  const start = items.find((i) => i.node.fixedStart);
  const taps = items.filter((i) => !i.node.fixedStart);
  const width = Math.max(720, 170 + taps.length * SP + 40);
  const xs = taps.map((_, i) => 200 + i * SP);
  const busEnd = taps.length ? xs[xs.length - 1] + 30 : 260;
  const segs = [];
  let prevX = 130;
  let flowAt = start ? (start.inj === null && start.cfg.include ? null : start.inj || 0) : 0;
  taps.forEach((t, i) => {
    segs.push({ x1: prevX, x2: xs[i], flow: flowAt });
    prevX = xs[i];
    flowAt = t.flowAfter;
  });
  return (
    <div className="ax-scroll" role="group" aria-label={`Line ${line} flow diagram`}>
      <svg width={width} height={300} viewBox={`0 0 ${width} 300`} className="ax-svg">
        <text x={12} y={22} className="ax-linelabel">{`Line ${line}`}</text>
        <text x={12} y={40} className="ax-hint">{'Ikorodu end → Sagamu end · arrows show the direction power flows'}</text>
        {segs.map((s, i) => (
          <g key={`seg${i}`}>
            <FlowArrow x1={s.x1} y1={BUS_Y} x2={s.x2} y2={BUS_Y} value={s.flow} cls="ax-bus" />
            <text x={(s.x1 + s.x2) / 2} y={BUS_Y - 10} textAnchor="middle" className="ax-segval">
              {s.flow === null ? '?' : `${s.flow >= 0 ? '→' : '←'} ${Math.abs(s.flow).toFixed(1)}`}
            </text>
          </g>
        ))}
        {taps.length === 0 && <line x1={130} y1={BUS_Y} x2={busEnd} y2={BUS_Y} className="ax-wire ax-bus flow-none" />}
        {start && <NodeBox x={68} y={BUS_Y - 32} item={start} selected={selected === start.key} onSelect={onSelect} />}
        {taps.map((t, i) => {
          const above = t.node.kind === 'genco';
          const boxY = above ? 52 : 200;
          const tapFrom = above ? boxY + 64 : BUS_Y;
          const tapTo = above ? BUS_Y : boxY;
          // power into the line flows box -> bus; out of the line flows bus -> box
          const into = t.inj === null ? null : (above ? t.inj : -t.inj);
          return (
            <g key={t.key}>
              <FlowArrow x1={xs[i]} y1={tapFrom} x2={xs[i]} y2={tapTo} value={into} cls="ax-tap" />
              <circle cx={xs[i]} cy={BUS_Y} r={4} className="ax-joint" />
              <NodeBox x={xs[i]} y={boxY} item={t} selected={selected === t.key} onSelect={onSelect} />
            </g>
          );
        })}
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------ small trend */
function Spark({ points, label }) {
  const vals = points.map((p) => p.v).filter((v) => v !== null);
  if (vals.length < 2) return <p className="ax-note">The trend builds up while this page is open (every 10 s).</p>;
  const w = 320; const h = 60;
  const lo = Math.min(0, ...vals); const hi = Math.max(0.5, ...vals);
  const t0 = points[0].t; const t1 = points[points.length - 1].t || t0 + 1;
  const X = (t) => ((t - t0) / Math.max(1, t1 - t0)) * (w - 4) + 2;
  const Y = (v) => h - 2 - ((v - lo) / (hi - lo || 1)) * (h - 4);
  let d = '';
  points.forEach((p) => { if (p.v === null) { d += ' '; return; } d += `${d.endsWith(' ') || !d ? 'M' : 'L'}${X(p.t).toFixed(1)},${Y(p.v).toFixed(1)}`; });
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="ax-spark" role="img" aria-label={`${label}: last ${vals.length} readings, latest ${vals[vals.length - 1].toFixed(2)} MW`}>
      <line x1={0} x2={w} y1={Y(0)} y2={Y(0)} className="ax-spark-zero" />
      <path d={d.replace(/ /g, '')} className="ax-spark-line" />
    </svg>
  );
}

/* ------------------------------------------------------------------ lock dialog */
function LockDialog({ onClose, onUnlocked }) {
  const [pw, setPw] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(null);
  const ref = useRef(null);
  useEffect(() => { if (ref.current) ref.current.focus(); }, []);
  useEffect(() => {
    const esc = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', esc);
    return () => window.removeEventListener('keydown', esc);
  }, [onClose]);
  const submit = async (e) => {
    e.preventDefault();
    setBusy(true); setErr(null);
    try {
      const d = await api('/api2/axis/unlock', { method: 'POST', body: { password: pw } });
      setPw('');
      onUnlocked(d);
    } catch (x) {
      setErr(x.message);
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="ax-modal" role="dialog" aria-modal="true" aria-labelledby="ax-lock-title" onClick={onClose}>
      <form className="ax-dialog" onClick={(e) => e.stopPropagation()} onSubmit={submit}>
        <h3 id="ax-lock-title">Unlock arrangement</h3>
        <p>Enter the password to move stations between lines, change their order or meter direction.</p>
        <input ref={ref} type="password" inputMode="numeric" autoComplete="off" value={pw} onChange={(e) => setPw(e.target.value)} aria-label="Password" />
        {err && <p className="ax-err" role="alert">{err}</p>}
        <div className="ax-row">
          <button type="button" className="gx-btn gx-btn-ghost" onClick={onClose}>Cancel</button>
          <button type="submit" className="gx-btn gx-btn-primary" disabled={busy || !pw}>{busy ? 'Checking…' : 'Unlock'}</button>
        </div>
      </form>
    </div>
  );
}

/* ------------------------------------------------------------------ editor */
function Editor({ draft, setDraft, selected, onSelect, readings }) {
  const groups = [1, 2, 0].map((l) => ({ l, nodes: l === 0 ? NODES.filter((n) => draft.nodes[n.key].line === 0) : lineNodes(draft, l) }));
  return (
    <div className="ax-editor">
      <label className="ax-tlf">Allowed loss (TLF) %
        <input type="number" min={0} max={20} step={0.1} value={draft.tlfPct}
          onChange={(e) => setDraft({ ...draft, tlfPct: Math.max(0, Math.min(20, num(e.target.value) ?? DEFAULT_TLF_PCT)) })} />
        <small>NERC MYTO benchmark: 7 %</small>
      </label>
      {groups.map(({ l, nodes }) => (
        <div key={l} className="ax-egroup">
          <h4>{l === 0 ? 'Not on the axis' : `Line ${l} (from the Ikorodu end)`}</h4>
          {nodes.length === 0 && <p className="ax-note">None.</p>}
          <ol>
            {nodes.map((n) => {
              const c = draft.nodes[n.key];
              const r = readings[n.key];
              return (
                <li key={n.key} className={selected === n.key ? 'is-sel' : ''}>
                  <button type="button" className="ax-ename" onClick={() => onSelect(n.key)}>
                    <b>{n.name}</b><small>{n.kind === 'end' ? 'line end' : n.kind}{r && r.mw !== null ? ` · ${r.mw.toFixed(2)} MW` : ` · ${STATUS_TEXT[r ? r.status : 'never']}`}</small>
                  </button>
                  <div className="ax-ectl">
                    {!n.fixedStart && (
                      <>
                        <button type="button" className="gx-btn" aria-label={`Move ${n.name} towards Ikorodu`} disabled={l === 0} onClick={() => setDraft(moveNode(draft, n.key, -1))}>◀</button>
                        <button type="button" className="gx-btn" aria-label={`Move ${n.name} towards Sagamu`} disabled={l === 0} onClick={() => setDraft(moveNode(draft, n.key, 1))}>▶</button>
                      </>
                    )}
                    <select aria-label={`Line for ${n.name}`} value={c.line} onChange={(e) => setDraft(setLine(draft, n.key, Number(e.target.value)))}>
                      <option value={1}>Line 1</option><option value={2}>Line 2</option><option value={0}>Not on axis</option>
                    </select>
                    <select aria-label={`Meter direction for ${n.name}`} value={c.dir} onChange={(e) => setDraft(setNode(draft, n.key, { dir: e.target.value }))}>
                      {DIRECTIONS.map((d) => <option key={d.key} value={d.key}>{d.label}</option>)}
                    </select>
                    <label className="ax-chk"><input type="checkbox" checked={c.include} onChange={(e) => setDraft(setNode(draft, n.key, { include: e.target.checked }))} /> counted</label>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ main */
export default function AxisFlow({ state }) {
  const now = useNow(2000);
  const [saved, setSaved] = useState({ layout: completeLayout(null), version: 0, updatedAt: null, loaded: false, error: null });
  const [unlocked, setUnlocked] = useState(false);
  const [askLock, setAskLock] = useState(false);
  const [draft, setDraft] = useState(null);
  const [selected, setSelected] = useState(null);
  const [msg, setMsg] = useState(null);
  const [saving, setSaving] = useState(false);
  const history = useRef([]);
  const lastSample = useRef(0);

  const load = useCallback((signal) => api('/api2/axis/layout', { signal })
    .then((d) => {
      setSaved({ layout: completeLayout(d.layout), version: d.version || 0, updatedAt: d.updatedAt, loaded: true, error: null });
      setUnlocked(Boolean(d.unlocked));
    })
    .catch((e) => { if (e.name !== 'AbortError') setSaved((s) => ({ ...s, loaded: true, error: e.message })); }), []);

  useEffect(() => {
    const ctrl = new AbortController();
    load(ctrl.signal);
    // others may rearrange: refresh every minute unless this viewer is editing
    const t = setInterval(() => { if (!draft) load(ctrl.signal); }, 60000);
    return () => { ctrl.abort(); clearInterval(t); };
  }, [load, draft]);

  const layout = draft || saved.layout;
  const readings = useMemo(() => readAll(state, now), [state, now]);
  const axis = useMemo(() => analyseAxis(layout, readings), [layout, readings]);
  // trend of the saved arrangement only (a draft is not yet real)
  const savedAxis = useMemo(() => (draft ? analyseAxis(saved.layout, readings) : axis), [draft, saved.layout, readings, axis]);

  useEffect(() => {
    if (now - lastSample.current < HISTORY_EVERY_MS) return;
    lastSample.current = now;
    history.current = [...history.current, {
      t: now,
      l1: savedAxis.lines[0].verdict === 'incomplete' ? null : savedAxis.lines[0].unaccounted,
      l2: savedAxis.lines[1].verdict === 'incomplete' ? null : savedAxis.lines[1].unaccounted,
    }].slice(-HISTORY_KEEP);
  }, [now, savedAxis]);

  const startEdit = () => { setDraft(saved.layout); setMsg(null); };
  const onUnlocked = () => { setUnlocked(true); setAskLock(false); startEdit(); };
  const lockNow = async () => {
    setDraft(null);
    try { await api('/api2/axis/lock', { method: 'POST', body: {} }); } catch (e) { /* the cookie expires anyway */ }
    setUnlocked(false);
  };
  const save = async () => {
    setSaving(true); setMsg(null);
    try {
      const d = await api('/api2/axis/layout', { method: 'PUT', body: { layout: draft, version: saved.version } });
      setSaved({ layout: completeLayout(d.layout), version: d.version, updatedAt: d.updatedAt, loaded: true, error: null });
      setDraft(null);
      setMsg({ ok: true, text: 'Arrangement saved. Everyone now sees it.' });
    } catch (e) {
      if (e.status === 401) setUnlocked(false);
      setMsg({ ok: false, text: e.message });
    } finally {
      setSaving(false);
    }
  };

  const sel = selected ? NODE_BY_KEY[selected] : null;
  const selItem = sel ? axis.lines.flatMap((L) => L.items).find((i) => i.key === selected) : null;
  const v = VERDICT[axis.verdict];

  return (
    <section className="gx-panel ax-root" aria-labelledby="ax-title">
      <header className="ax-head">
        <div>
          <h2 id="ax-title">Ikorodu–Sagamu axis: live load flow</h2>
          <p className="ax-sub">
            Gencos use their <b>sent-out</b> (line meter) value. Allowed loss uses the NERC MYTO transmission loss factor
            ({f1(layout.tlfPct)} %). {saved.updatedAt ? `Arrangement saved ${new Date(saved.updatedAt).toLocaleString('en-GB')}.` : 'Default arrangement (not yet saved).'}
          </p>
        </div>
        <div className="ax-actions">
          {!draft && !unlocked && <button type="button" className="gx-btn ax-lock" onClick={() => setAskLock(true)} aria-label="Unlock to rearrange">🔒 Rearrange</button>}
          {!draft && unlocked && <button type="button" className="gx-btn" onClick={startEdit}>✏️ Rearrange</button>}
          {draft && <button type="button" className="gx-btn" onClick={() => { setDraft(null); setMsg(null); }} disabled={saving}>Discard</button>}
          {draft && <button type="button" className="gx-btn gx-btn-primary" onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Save arrangement'}</button>}
          {unlocked && <button type="button" className="gx-btn gx-btn-ghost" onClick={lockNow} aria-label="Lock again">🔓 Lock</button>}
        </div>
      </header>
      {saved.error && <p className="ax-err" role="alert">{saved.error}</p>}
      {msg && <p className={msg.ok ? 'ax-ok' : 'ax-err'} role="status">{msg.text}</p>}
      {draft && <p className="ax-editing">Editing: the diagram and balance below show your changes live. Nothing is saved until you click “Save arrangement”.</p>}

      <div className="ax-kpis">
        <div><b>{f2(axis.generation)}</b><span>Generation into the axis (Taopex + Paras, sent out), MW</span></div>
        <div><b>{f2(axis.consumption)}</b><span>Taken by customers, MW</span></div>
        <div><b>{f2(axis.ikorodu)}</b><span>{axis.ikorodu >= 0 ? 'Into the axis from Ikorodu TS' : 'Out of the axis to Ikorodu TS'}, MW (signed)</span></div>
        <div><b>{f2(-axis.sagamu)}</b><span>{-axis.sagamu >= 0 ? 'Taken by Sagamu TS' : 'Fed in by Sagamu TS'}, MW (signed)</span></div>
        <div className={`ax-kpi-${v.cls} ${axis.missing.length ? 'is-partial' : ''}`}><b>{f2(axis.unaccounted)}</b>
          <span>Not accounted for after {f1(layout.tlfPct)} % loss, MW{axis.missing.length ? ` · partial: ${axis.missing.length} meter${axis.missing.length > 1 ? 's' : ''} missing, not reliable` : ''}</span></div>
      </div>
      <p className={`ax-verdict v-${v.cls}`}><b>{v.title}.</b> {v.text}
        {axis.missing.length > 0 && <> Missing: {axis.missing.map((k) => NODE_BY_KEY[k].short).join(', ')}.</>}
        {axis.generationShare !== null && <> Customers on the axis take {f1(axis.generationShare)} % of the generation fed in.</>}
      </p>

      {axis.lines.map((L) => (
        <div key={L.line} className="ax-line">
          <LineDiagram analysis={L} selected={selected} onSelect={setSelected} />
          <div className="ax-balance">
            <table className="ax-btable">
              <caption>{`Line ${L.line} balance`}</caption>
              <tbody>
                <tr><th scope="row">Into the line (metered)</th><td>{f2(L.inflow)} MW</td></tr>
                <tr><th scope="row">Out of the line (metered)</th><td>{f2(L.outflow)} MW</td></tr>
                <tr><th scope="row">Difference (in − out)</th><td>{f2(L.residual)} MW</td></tr>
                <tr><th scope="row">{`Allowed loss (${f1(L.tlfPct)} % of in)`}</th><td>{f2(L.allowed)} MW</td></tr>
                <tr className={`v-${VERDICT[L.verdict].cls}`}><th scope="row">{L.missing.length ? 'Not accounted for (partial)' : 'Not accounted for'}</th><td><b>{f2(L.unaccounted)} MW</b>{L.unaccountedPct !== null && ` (${f1(L.unaccountedPct)} %)`}</td></tr>
              </tbody>
            </table>
            <p className={`ax-verdict v-${VERDICT[L.verdict].cls}`}><b>{VERDICT[L.verdict].title}.</b>{L.missing.length > 0 && ` Missing: ${L.missing.map((k) => NODE_BY_KEY[k].short).join(', ')}.`}</p>
            <div className="ax-trend"><span>Not accounted for, MW (this session)</span><Spark points={history.current.map((h) => ({ t: h.t, v: L.line === 1 ? h.l1 : h.l2 }))} label={`Line ${L.line} unaccounted power`} /></div>
          </div>
        </div>
      ))}

      {sel && selItem && (
        <div className="ax-detail" role="region" aria-label={`${sel.name} details`}>
          <b>{sel.name}</b>
          <span>Line {selItem.cfg.line || '—'} · {selItem.cfg.include ? 'counted in the balance' : 'not counted'} · {DIRECTIONS.find((d) => d.key === selItem.cfg.dir)?.label}</span>
          <span>Meter: {f2(selItem.reading.mw)} MW · {f2(selItem.reading.mvar)} MVar · {f2(selItem.reading.amp)} A · {f2(selItem.reading.kv)} kV · {STATUS_TEXT[selItem.reading.status]}</span>
          <span>Into the line: {selItem.inj === null ? '—' : `${selItem.inj.toFixed(2)} MW`}{sel.kind === 'genco' ? ' · sent-out value' : ''}</span>
          <button type="button" className="gx-btn gx-btn-ghost" onClick={() => setSelected(null)}>Close</button>
        </div>
      )}

      {draft && <Editor draft={draft} setDraft={setDraft} selected={selected} onSelect={setSelected} readings={readings} />}

      <details className="ax-how">
        <summary>How the balance is worked out</summary>
        <p>Each meter's MW is turned into power <i>into</i> the line using its direction setting (gencos and the line ends feed in or draw; customers draw).
          For each line: <b>in</b> = all power metered entering, <b>out</b> = all power metered leaving. The difference is power that entered but was not metered leaving.
          Part of that is normal transmission loss, allowed at the NERC MYTO transmission loss factor ({f1(layout.tlfPct)} % of what enters).
          What is left is <b>not accounted for</b>: possible theft, an unmetered off-take, a meter on the wrong line, or a meter fault.
          Differences under {`max(1 MW, 1 %)`} are treated as measurement noise.</p>
        <p>A meter that sends nothing, sends NaN or has not reported for 60 s is shown as missing (never as 0 MW) and the line is marked incomplete.
          Arrows on the line show the flow worked out from the Ikorodu end, adding each meter in order; after a missing meter the flow is shown as “?”.</p>
        <p>The national TLF covers the whole grid; losses on a short 132 kV corridor are usually lower, so an unaccounted figure close to zero can still hide a small leak.
          The trend above helps: a gap that follows one customer's load points to that customer.</p>
      </details>

      {askLock && <LockDialog onClose={() => setAskLock(false)} onUnlocked={onUnlocked} />}
    </section>
  );
}

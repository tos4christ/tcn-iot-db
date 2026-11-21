/**
 * Ikorodu-Sagamu axis: live single-line flow diagram, power balance per line, and the locked
 * arrangement editor. Used by /bilaterals (components/Bilateral.js) and /bilaterals_fix
 * (Fix/legacy/BilateralFix.js), which pass their socket state in. Both read the same saved arrangement.
 *
 * Arrangement (which line, order along it, meter direction, counted or not, TLF) is read from the
 * server for everyone; changing it needs the lock password, checked on the server only.
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { api } from '../fixApi';
import {
  NODES, NODE_BY_KEY, DIRECTIONS, DEFAULT_TLF_PCT, completeLayout, readAll, analyseAxis, lineNodes,
  moveNode, moveNodeTo, positionOf, setLine, setNode, num, analyseCoupled, setCoupler,
} from './axisModel';
import { AXIS_SECTION_ID } from './AxisJump';
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

/* ------------------------------------------------------------------ single-line diagram (both lines + bus coupler) */
const TW_X0 = 290; // first tap on each line
const TW_CX = 190; // the bus coupler, between the Ikorodu line meters and the first tap
const TW_OFF = 300; // Line 2 is drawn this far below Line 1

/** Geometry and section flows of one line in the single-line diagram. `delta` = MW the coupler adds. */
function twinLine(L, yOff, delta, closed) {
  const start = L.items.find((i) => i.node.fixedStart);
  const taps = L.items.filter((i) => !i.node.fixedStart);
  const xs = taps.map((_, i) => TW_X0 + i * SP);
  const startFlow = start ? (start.inj === null && start.cfg.include ? null : start.inj || 0) : 0;
  // beyond a closed coupler the flow is the line's own running sum plus the (estimated) transfer
  const adj = (v) => (!closed ? v : v === null || delta === null ? null : v + delta);
  const segs = [];
  if (closed) segs.push({ x1: 130, x2: TW_CX, flow: startFlow, est: false });
  let prevX = closed ? TW_CX : 130;
  let flowAt = adj(startFlow);
  taps.forEach((t, i) => {
    segs.push({ x1: prevX, x2: xs[i], flow: flowAt, est: closed });
    prevX = xs[i];
    flowAt = adj(t.flowAfter);
  });
  return { start, taps, xs, busY: yOff + BUS_Y, yOff, segs };
}

function Coupler({ closed, transfer, onToggle }) {
  const y1 = BUS_Y;
  const y2 = TW_OFF + BUS_Y;
  const mid = (y1 + y2) / 2;
  const state = closed ? 'CLOSED' : 'OPEN';
  const flowText = closed
    ? transfer === null ? 'flow through it unknown (a meter is missing)'
      : Math.abs(transfer) < 0.05 ? '≈ 0 MW through it'
        : `≈ ${Math.abs(transfer).toFixed(1)} MW ${transfer > 0 ? 'Line 1 → Line 2' : 'Line 2 → Line 1'}`
    : 'lines separate';
  const label = `Ikorodu bus coupler, ${state.toLowerCase()}${closed ? `, ${flowText}` : ''}`;
  const act = onToggle ? {
    role: 'button', tabIndex: 0, 'aria-label': `${label}. Click to ${closed ? 'open' : 'close'} it.`, onClick: onToggle,
    onKeyDown: (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onToggle(); } },
  } : { role: 'img', 'aria-label': label };
  return (
    <g className={`ax-cb ${closed ? 'is-closed' : 'is-open'} ${onToggle ? 'is-edit' : ''}`} {...act}>
      <title>{`${label}\nSet by hand (no telemetry)${onToggle ? '' : '. Unlock to change it.'}`}</title>
      <circle cx={TW_CX} cy={y1} r={5} className="ax-joint" />
      <circle cx={TW_CX} cy={y2} r={5} className="ax-joint" />
      {closed
        ? <FlowArrow x1={TW_CX} y1={y1} x2={TW_CX} y2={y2} value={transfer} cls="ax-cb-wire" />
        : (<>
          <line x1={TW_CX} y1={y1} x2={TW_CX} y2={mid - 14} className="ax-wire ax-cb-wire flow-none" />
          <line x1={TW_CX} y1={mid + 14} x2={TW_CX} y2={y2} className="ax-wire ax-cb-wire flow-none" />
        </>)}
      <rect x={TW_CX - 13} y={mid - 13} width={26} height={26} rx={3} className="ax-cb-box" />
      <text x={TW_CX + 22} y={mid - 4} className="ax-cb-title">Bus coupler</text>
      <text x={TW_CX + 22} y={mid + 12} className="ax-cb-state">{`${state} · ${flowText}`}</text>
    </g>
  );
}

function TwinDiagram({ axis, coupled, selected, onSelect, onToggleCoupler }) {
  const { closed, transfer } = coupled;
  const lines = [
    twinLine(axis.lines[0], 0, transfer === null ? null : -transfer, closed),
    twinLine(axis.lines[1], TW_OFF, transfer, closed),
  ];
  const width = Math.max(760, TW_X0 + Math.max(lines[0].taps.length, lines[1].taps.length, 1) * SP);
  const height = TW_OFF * 2;
  return (
    <div className="ax-scroll" role="group" aria-label="Ikorodu–Sagamu Lines 1 and 2, single-line diagram">
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="ax-svg">
        {lines.map((g, li) => (
          <g key={li}>
            <text x={12} y={g.yOff + 22} className="ax-linelabel">{`Line ${li + 1}`}</text>
            {/* once only: on Line 2 it would run through the coupler */}
            {li === 0 && <text x={12} y={g.yOff + 40} className="ax-hint">{'Ikorodu end → Sagamu end · arrows show the direction power flows'}</text>}
            {g.segs.map((sg, i) => (
              <g key={`seg${i}`}>
                <FlowArrow x1={sg.x1} y1={g.busY} x2={sg.x2} y2={g.busY} value={sg.flow} cls="ax-bus" />
                {sg.x2 - sg.x1 > 50 && (
                  <text x={(sg.x1 + sg.x2) / 2} y={g.busY - 10} textAnchor="middle" className="ax-segval">
                    {sg.flow === null ? '?' : `${sg.est ? '≈' : ''}${sg.flow >= 0 ? '→' : '←'} ${Math.abs(sg.flow).toFixed(1)}`}
                  </text>
                )}
              </g>
            ))}
            {g.taps.length === 0 && <line x1={closed ? TW_CX : 130} y1={g.busY} x2={TW_CX + 80} y2={g.busY} className="ax-wire ax-bus flow-none" />}
            {g.start && <NodeBox x={68} y={g.busY - 32} item={g.start} selected={selected === g.start.key} onSelect={onSelect} />}
            {g.taps.map((t, i) => {
              const above = t.node.kind === 'genco';
              const boxY = g.yOff + (above ? 52 : 200);
              const tapFrom = above ? boxY + 64 : g.busY;
              const tapTo = above ? g.busY : boxY;
              const into = t.inj === null ? null : (above ? t.inj : -t.inj);
              return (
                <g key={t.key}>
                  <FlowArrow x1={g.xs[i]} y1={tapFrom} x2={g.xs[i]} y2={tapTo} value={into} cls="ax-tap" />
                  <circle cx={g.xs[i]} cy={g.busY} r={4} className="ax-joint" />
                  <NodeBox x={g.xs[i]} y={boxY} item={t} selected={selected === t.key} onSelect={onSelect} />
                </g>
              );
            })}
          </g>
        ))}
        <Coupler closed={closed} transfer={transfer} onToggle={onToggleCoupler} />
      </svg>
    </div>
  );
}

/** Balance of one line. With the coupler closed its own "not accounted for" is not shown. */
function LineBalance({ L, history, coupledClosed }) {
  const vk = coupledClosed && L.verdict !== 'incomplete' && L.verdict !== 'empty' ? null : L.verdict;
  return (
    <div className="ax-lbal">
      <table className="ax-btable">
        <caption>{`Line ${L.line} balance`}</caption>
        <tbody>
          <tr><th scope="row">Into the line (metered)</th><td>{f2(L.inflow)} MW</td></tr>
          <tr><th scope="row">Out of the line (metered)</th><td>{f2(L.outflow)} MW</td></tr>
          <tr><th scope="row">Difference (in − out)</th><td>{f2(L.residual)} MW</td></tr>
          <tr><th scope="row">{`Allowed loss (${f1(L.tlfPct)} % of in)`}</th><td>{f2(L.allowed)} MW</td></tr>
          {coupledClosed
            ? <tr><th scope="row">Not accounted for</th><td className="ax-muted">see both lines</td></tr>
            : <tr className={`v-${VERDICT[L.verdict].cls}`}><th scope="row">{L.missing.length ? 'Not accounted for (partial)' : 'Not accounted for'}</th><td><b>{f2(L.unaccounted)} MW</b>{L.unaccountedPct !== null && ` (${f1(L.unaccountedPct)} %)`}</td></tr>}
        </tbody>
      </table>
      {vk
        ? <p className={`ax-verdict v-${VERDICT[vk].cls}`}><b>{VERDICT[vk].title}.</b>{L.missing.length > 0 && ` Missing: ${L.missing.map((k) => NODE_BY_KEY[k].short).join(', ')}.`}</p>
        : <p className="ax-verdict v-muted"><b>Coupled.</b> The bus coupler is closed, so part of this line's power can pass to or from the other line unmetered. Judge both lines together.</p>}
      {!coupledClosed && history && (
        <div className="ax-trend"><span>Not accounted for, MW (this session)</span><Spark points={history.current.map((h) => ({ t: h.t, v: L.line === 1 ? h.l1 : h.l2 }))} label={`Line ${L.line} unaccounted power`} /></div>
      )}
    </div>
  );
}

function CombinedBalance({ coupled, history }) {
  const C = coupled.combined;
  const V = VERDICT[C.verdict];
  const t = coupled.transfer;
  return (
    <div className="ax-lbal ax-combined">
      <table className="ax-btable">
        <caption>Both lines together</caption>
        <tbody>
          <tr><th scope="row">Into the lines (metered)</th><td>{f2(C.inflow)} MW</td></tr>
          <tr><th scope="row">Out of the lines (metered)</th><td>{f2(C.outflow)} MW</td></tr>
          <tr><th scope="row">Difference (in − out)</th><td>{f2(C.residual)} MW</td></tr>
          <tr><th scope="row">{`Allowed loss (${f1(C.tlfPct)} % of in)`}</th><td>{f2(C.allowed)} MW</td></tr>
          <tr className={`v-${V.cls}`}><th scope="row">{C.missing.length ? 'Not accounted for (partial)' : 'Not accounted for'}</th><td><b>{f2(C.unaccounted)} MW</b>{C.unaccountedPct !== null && ` (${f1(C.unaccountedPct)} %)`}</td></tr>
          {coupled.closed && (
            <tr><th scope="row">Through the coupler (estimate)</th>
              <td>{t === null ? '—' : Math.abs(t) < 0.05 ? '≈ 0 MW' : `≈ ${Math.abs(t).toFixed(2)} MW ${t > 0 ? 'L1→L2' : 'L2→L1'}`}</td></tr>
          )}
        </tbody>
      </table>
      <p className={`ax-verdict v-${V.cls}`}><b>{coupled.closed ? 'Coupler closed: ' : 'Coupler open: '}{V.title}.</b>
        {coupled.closed ? ' This is the figure to judge by.' : ' The sum of the two lines; each line is judged on its own.'}</p>
      <div className="ax-trend"><span>Not accounted for, both lines, MW (this session)</span>
        <Spark points={history.current.map((h) => ({ t: h.t, v: h.all }))} label="Both lines unaccounted power" /></div>
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

/* ------------------------------------------------------------------ position along the line */
/** ◀ [place n of m] ▶ : moves a station forward or back along its own line (same line). */
function PositionControl({ draft, setDraft, node }) {
  const p = positionOf(draft, node.key);
  if (!p) return null;
  const places = Array.from({ length: p.count }, (_, i) => i + 1);
  return (
    <span className="ax-pos">
      <button type="button" className="gx-btn" aria-label={`Move ${node.name} one place towards Ikorodu`} title="One place towards Ikorodu"
        disabled={p.index <= 1} onClick={() => setDraft(moveNode(draft, node.key, -1))}>◀</button>
      <select aria-label={`Place of ${node.name} along the line, counted from Ikorodu`} value={p.index}
        onChange={(e) => setDraft(moveNodeTo(draft, node.key, Number(e.target.value)))}>
        {places.map((i) => <option key={i} value={i}>{`Place ${i} of ${p.count}`}</option>)}
      </select>
      <button type="button" className="gx-btn" aria-label={`Move ${node.name} one place towards Sagamu`} title="One place towards Sagamu"
        disabled={p.index >= p.count} onClick={() => setDraft(moveNode(draft, node.key, 1))}>▶</button>
    </span>
  );
}

/* ------------------------------------------------------------------ change lock password */
function PasswordDialog({ onClose, onChanged }) {
  const [form, setForm] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(null);
  const ref = useRef(null);
  useEffect(() => { if (ref.current) ref.current.focus(); }, []);
  useEffect(() => {
    const esc = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', esc);
    return () => window.removeEventListener('keydown', esc);
  }, [onClose]);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const mismatch = form.confirmPassword !== '' && form.newPassword !== form.confirmPassword;
  const tooShort = form.newPassword !== '' && form.newPassword.length < 8;
  const submit = async (e) => {
    e.preventDefault();
    if (mismatch || tooShort) return;
    setBusy(true); setErr(null);
    try {
      await api('/api2/axis/password', { method: 'POST', body: form });
      setForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
      onChanged();
    } catch (x) {
      setErr(x.message);
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="ax-modal" role="dialog" aria-modal="true" aria-labelledby="ax-pw-title" onClick={onClose}>
      <form className="ax-dialog" onClick={(e) => e.stopPropagation()} onSubmit={submit}>
        <h3 id="ax-pw-title">Change lock password</h3>
        <p>Enter the current lock password, then the new one twice. Other browsers that are unlocked will be locked.</p>
        <label className="ax-field">Current password
          <input ref={ref} type="password" autoComplete="current-password" value={form.oldPassword} onChange={set('oldPassword')} />
        </label>
        <label className="ax-field">New password <small>(at least 8 characters)</small>
          <input type="password" autoComplete="new-password" value={form.newPassword} onChange={set('newPassword')} aria-invalid={tooShort} />
        </label>
        <label className="ax-field">New password again
          <input type="password" autoComplete="new-password" value={form.confirmPassword} onChange={set('confirmPassword')} aria-invalid={mismatch} />
        </label>
        {tooShort && <p className="ax-err">The new password must be at least 8 characters.</p>}
        {mismatch && <p className="ax-err">The two new passwords do not match.</p>}
        {err && <p className="ax-err" role="alert">{err}</p>}
        <div className="ax-row">
          <button type="button" className="gx-btn gx-btn-ghost" onClick={onClose}>Cancel</button>
          <button type="submit" className="gx-btn gx-btn-primary"
            disabled={busy || !form.oldPassword || !form.newPassword || !form.confirmPassword || mismatch || tooShort}>{busy ? 'Saving…' : 'Change password'}</button>
        </div>
      </form>
    </div>
  );
}

/* ------------------------------------------------------------------ editor */
function Editor({ draft, setDraft, selected, onSelect, readings, singleLine }) {
  const groups = [1, 2, 0].map((l) => ({ l, nodes: l === 0 ? NODES.filter((n) => draft.nodes[n.key].line === 0) : lineNodes(draft, l) }));
  return (
    <div className="ax-editor">
      <label className="ax-tlf">Allowed loss (TLF) %
        <input type="number" min={0} max={20} step={0.1} value={draft.tlfPct}
          onChange={(e) => setDraft({ ...draft, tlfPct: Math.max(0, Math.min(20, num(e.target.value) ?? DEFAULT_TLF_PCT)) })} />
        <small>NERC MYTO benchmark: 7 %</small>
      </label>
      {singleLine && (
        <label className="ax-tlf">Ikorodu bus coupler
          <select aria-label="Ikorodu bus coupler state" value={draft.coupler && draft.coupler.closed ? 'closed' : 'open'}
            onChange={(e) => setDraft(setCoupler(draft, e.target.value === 'closed'))}>
            <option value="open">Open (lines separate)</option>
            <option value="closed">Closed (Line 1 and Line 2 coupled)</option>
          </select>
          <small>Set by hand: there is no coupler status meter. You can also click the coupler in the diagram.</small>
        </label>
      )}
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
                    {!n.fixedStart && l !== 0 && <PositionControl draft={draft} setDraft={setDraft} node={n} />}
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
/** singleLine: both lines in one diagram with the Ikorodu bus coupler (trial on /bilaterals_fix). */
export default function AxisFlow({ state, singleLine = false }) {
  const now = useNow(2000);
  const [saved, setSaved] = useState({ layout: completeLayout(null), version: 0, updatedAt: null, loaded: false, error: null });
  const [unlocked, setUnlocked] = useState(false);
  const [askLock, setAskLock] = useState(false);
  const [draft, setDraft] = useState(null);
  const [selected, setSelected] = useState(null);
  const [msg, setMsg] = useState(null);
  const [saving, setSaving] = useState(false);
  const [askPassword, setAskPassword] = useState(false);
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
  const coupled = useMemo(() => analyseCoupled(axis, layout), [axis, layout]);
  const savedCoupled = useMemo(() => analyseCoupled(savedAxis, saved.layout), [savedAxis, saved.layout]);

  useEffect(() => {
    if (now - lastSample.current < HISTORY_EVERY_MS) return;
    lastSample.current = now;
    history.current = [...history.current, {
      t: now,
      l1: savedAxis.lines[0].verdict === 'incomplete' ? null : savedAxis.lines[0].unaccounted,
      l2: savedAxis.lines[1].verdict === 'incomplete' ? null : savedAxis.lines[1].unaccounted,
      all: savedCoupled.combined.verdict === 'incomplete' ? null : savedCoupled.combined.unaccounted,
    }].slice(-HISTORY_KEEP);
  }, [now, savedAxis, savedCoupled]);

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
  // with the coupler closed, single lines cannot be judged alone: the verdict is both lines together
  const v = VERDICT[singleLine && coupled.closed ? coupled.combined.verdict : axis.verdict];
  const toggleCoupler = draft ? () => setDraft(setCoupler(draft, !(draft.coupler && draft.coupler.closed))) : null;

  return (
    <section className="gx-panel ax-root" id={AXIS_SECTION_ID} aria-labelledby="ax-title">
      <header className="ax-head">
        <div>
          <h2 id="ax-title" tabIndex={-1}>Ikorodu–Sagamu axis: live load flow</h2>
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

      {singleLine && (
        <div className="ax-line ax-twin">
          <TwinDiagram axis={axis} coupled={coupled} selected={selected} onSelect={setSelected} onToggleCoupler={toggleCoupler} />
          <div className="ax-balance">
            <LineBalance L={axis.lines[0]} history={history} coupledClosed={coupled.closed} />
            <LineBalance L={axis.lines[1]} history={history} coupledClosed={coupled.closed} />
            <CombinedBalance coupled={coupled} history={history} />
          </div>
        </div>
      )}

      {!singleLine && axis.lines.map((L) => (
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
          {draft && !sel.fixedStart && selItem.cfg.line !== 0 && (
            <span className="ax-detail-move">Place along Line {selItem.cfg.line}: <PositionControl draft={draft} setDraft={setDraft} node={sel} /></span>
          )}
          <button type="button" className="gx-btn gx-btn-ghost" onClick={() => setSelected(null)} aria-label="Close these details" title="Hide these details">Close</button>
        </div>
      )}

      {draft && <Editor draft={draft} setDraft={setDraft} selected={selected} onSelect={setSelected} readings={readings} singleLine={singleLine} />}

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
        {singleLine && (
          <p><b>Bus coupler.</b> Line 1 and Line 2 leave the same Ikorodu bus and can be tied by the bus coupler. Its state is set by hand behind the lock
            (no status meter). <b>Open</b>: the lines are separate and each line's balance stands on its own. <b>Closed</b>: power can pass between the lines
            through the coupler without a meter, so a shortfall on one line may simply be power taken from the other; only the balance of both lines
            together is exact, and that is the verdict. The coupler flow shown (≈) is an estimate that shares the unaccounted power equally between the
            lines (it blames neither); line sections after the coupler use it and are marked ≈.</p>
        )}
      </details>

      <div className="ax-admin">
        <button type="button" className="gx-btn gx-btn-ghost" onClick={() => { setMsg(null); setAskPassword(true); }}>🔑 Change lock password</button>
      </div>

      {askLock && <LockDialog onClose={() => setAskLock(false)} onUnlocked={onUnlocked} />}
      {askPassword && <PasswordDialog onClose={() => setAskPassword(false)}
        onChanged={() => { setAskPassword(false); setMsg({ ok: true, text: 'Lock password changed. Use the new password from now on.' }); }} />}
    </section>
  );
}

/**
 * Ikorodu-Sagamu axis: which meters exist, how each is read, the default arrangement, and the
 * power balance of each line. No React here, so it can be tested on its own.
 *
 * Sign convention used everywhere below: "injection" = MW going INTO the line at that point.
 * Gencos and the line ends inject (positive) or draw (negative); customers draw (negative).
 * Each meter's raw MW is turned into an injection by its direction setting:
 *   in     : raw positive = power into the line          (injection =  raw)
 *   out    : raw positive = power out of the line        (injection = -raw)
 *   absIn  : always into the line, sign ignored          (injection =  |raw|)
 *   absOut : always out of the line, sign ignored        (injection = -|raw|)
 */

/** NERC MYTO transmission loss factor benchmark (7 %). Changeable behind the lock. */
export const DEFAULT_TLF_PCT = 7;
/** A reading older than this is not used in the balance (meter treated as missing). */
export const STALE_MS = 60000;
/** An imbalance below this is treated as measurement noise. */
export const NOISE_MW = 1;
export const NOISE_PCT = 1;

export const DIRECTIONS = [
  { key: 'in', label: 'Positive MW = into the line' },
  { key: 'out', label: 'Positive MW = out of the line' },
  { key: 'absIn', label: 'Always into the line (sign ignored)' },
  { key: 'absOut', label: 'Always out of the line (sign ignored)' },
];

/** A number from a meter, or null for missing / NaN / Infinity / empty. */
export const num = (v) => {
  if (v === null || v === undefined || v === '' || typeof v === 'boolean') return null;
  const n = typeof v === 'number' ? v : Number(String(v).trim());
  return Number.isFinite(n) ? n : null;
};

const list = (payload, field) => (payload && Array.isArray(payload[field]) ? payload[field] : []);
const byId = (payload, id, fields = ['lines', 'transformers', 'units']) => {
  for (const f of fields) {
    const hit = list(payload, f).find((x) => x && String(x.id) === id);
    if (hit) return hit;
  }
  return null;
};
const first = (payload, field) => list(payload, field).find((x) => x) || null;

/** One block's values, whatever the field names (mw/A/V/mvar or mw/a/v/mx). */
function readBlock(block) {
  const b = block && (block.td || block.gd || block.pd);
  if (!b) return null;
  return {
    mw: num(b.mw),
    kv: num(b.V !== undefined ? b.V : b.v),
    amp: num(b.A !== undefined ? b.A : b.a),
    mvar: num(b.mvar !== undefined ? b.mvar : b.mx),
  };
}
/** Several blocks added together; MW is missing if any block's MW is missing. */
function sumBlocks(blocks) {
  const read = blocks.map(readBlock);
  if (!read.length || read.some((r) => !r)) return null;
  const add = (k) => (read.every((r) => r[k] !== null) ? read.reduce((a, r) => a + r[k], 0) : null);
  return { mw: add('mw'), kv: read.map((r) => r.kv).find((v) => v !== null) ?? null, amp: add('amp'), mvar: add('mvar'), meters: read.length };
}

/**
 * Every meter on the axis. state = the page's socket state (payloads keyed by device id).
 * kind: 'end' (line end at a TS), 'genco', 'customer'.
 */
export const NODES = [
  { key: 'ikorodu1', name: 'Ikorodu TS · Line 1 (D23S)', short: 'Ikorodu L1', kind: 'end', fixedStart: true, payload: 'ikorodu1', read: (s) => sumBlocks([byId(s.ikorodu1, 'd23s')].filter(Boolean)) },
  { key: 'ikorodu2', name: 'Ikorodu TS · Line 2 (D24S)', short: 'Ikorodu L2', kind: 'end', fixedStart: true, payload: 'ikorodu2', read: (s) => sumBlocks([byId(s.ikorodu2, 'd24s')].filter(Boolean)) },
  { key: 'sagamu1', name: 'Sagamu TS · D23S', short: 'Sagamu D23S', kind: 'end', payload: 'sagamu', read: (s) => sumBlocks([byId(s.sagamu, 'd23s')].filter(Boolean)) },
  { key: 'sagamu2', name: 'Sagamu TS · D24S', short: 'Sagamu D24S', kind: 'end', payload: 'sagamu', read: (s) => sumBlocks([byId(s.sagamu, 'd24s')].filter(Boolean)) },
  { key: 'taopex', name: 'Taopex G.S (sent out)', short: 'Taopex', kind: 'genco', payload: 'taopex', read: (s) => sumBlocks([byId(s.taopex, 'line1')].filter(Boolean)) },
  { key: 'paras', name: 'Paras Energy (sent out)', short: 'Paras', kind: 'genco', payload: 'parasEnergyPs', read: (s) => sumBlocks([byId(s.parasEnergyPs, '132cb')].filter(Boolean)) },
  { key: 'pheonix', name: 'Pheonix Steel Ikorodu', short: 'Pheonix', kind: 'customer', payload: 'pheonix', read: (s) => sumBlocks([first(s.pheonix, 'transformers')].filter(Boolean)) },
  { key: 'afl', name: 'African Foundries Ikorodu', short: 'AFL', kind: 'customer', payload: 'africanFoundriesLimited', read: (s) => sumBlocks([byId(s.africanFoundriesLimited, 'afll1')].filter(Boolean)) },
  { key: 'monarch', name: 'Monarch Ikorodu', short: 'Monarch Ikd', kind: 'customer', payload: 'monarch', read: (s) => sumBlocks([byId(s.monarch, 'ml1')].filter(Boolean)) },
  { key: 'quantum', name: 'Real Infrastructure Ikorodu', short: 'Real Infra', kind: 'customer', payload: 'quantum', read: (s) => sumBlocks([byId(s.quantum, 'qt1')].filter(Boolean)) },
  { key: 'kamSteel', name: 'Kam Steel Sagamu', short: 'Kam Steel', kind: 'customer', payload: 'kamSteel', read: (s) => sumBlocks([first(s.kamSteel, 'lines')].filter(Boolean)) },
  { key: 'larfarge', name: 'Cement Factory', short: 'Cement', kind: 'customer', payload: 'larfarge', read: (s) => sumBlocks([byId(s.larfarge, 'll1')].filter(Boolean)) },
  { key: 'topSteel', name: 'Top Steel Ikorodu', short: 'Top Steel', kind: 'customer', payload: 'topSteel', read: (s) => sumBlocks([byId(s.topSteel, 'tsl1')].filter(Boolean)) },
  { key: 'sunflag', name: 'Sunflag Iron & Steel Ikorodu', short: 'Sunflag', kind: 'customer', payload: 'sunflag', read: (s) => sumBlocks([first(s.sunflag, 'lines')].filter(Boolean)) },
  { key: 'pulkit', name: 'Pulkit Alloy & Steel Ikorodu', short: 'Pulkit', kind: 'customer', payload: 'pulkitSteel', read: (s) => sumBlocks([first(s.pulkitSteel, 'lines')].filter(Boolean)) },
  { key: 'starPipe', name: 'Star Pipe Product Ikorodu', short: 'Star Pipe', kind: 'customer', payload: 'starPipe', read: (s) => sumBlocks([byId(s.starPipe, 'spt1')].filter(Boolean)) },
  { key: 'monarchOgijo', name: 'Monarch Alloy Ogijo', short: 'Monarch Ogijo', kind: 'customer', payload: 'monarch-alloy-ogijo', read: (s) => sumBlocks([first(s['monarch-alloy-ogijo'], 'transformers')].filter(Boolean)) },
  { key: 'monarchOdogunyan', name: 'Monarch Alloy Odogunyan', short: 'Monarch Odg', kind: 'customer', payload: 'monarch-alloy-odogunyan', read: (s) => sumBlocks([first(s['monarch-alloy-odogunyan'], 'transformers')].filter(Boolean)) },
  { key: 'odogunyan', name: 'Odogunyan TS (T1 + T21)', short: 'Odogunyan TS', kind: 'customer', payload: 'odogunyan', read: (s) => sumBlocks(list(s.odogunyan, 'transformers').filter((t) => t && (t.id === 't1' || t.id === '21'))) },
  { key: 'sagamuSteel', name: 'Sagamu Steel', short: 'Sagamu Steel', kind: 'customer', payload: 'sagamuSteel', read: (s) => sumBlocks([first(s.sagamuSteel, 'transformers')].filter(Boolean)) },
];
export const NODE_BY_KEY = Object.fromEntries(NODES.map((n) => [n.key, n]));

/** Today's arrangement: every genco and customer on Line 1 (the user rearranges it behind the lock). */
export function defaultLayout() {
  const nodes = {};
  let pos = 1;
  NODES.forEach((n) => {
    if (n.key === 'ikorodu1') nodes[n.key] = { line: 1, pos: 0, dir: 'in', include: true };
    else if (n.key === 'ikorodu2') nodes[n.key] = { line: 2, pos: 0, dir: 'in', include: true };
    else if (n.key === 'sagamu1') nodes[n.key] = { line: 1, pos: 900, dir: 'out', include: true };
    else if (n.key === 'sagamu2') nodes[n.key] = { line: 2, pos: 900, dir: 'out', include: true };
    else nodes[n.key] = { line: 1, pos: pos++, dir: n.kind === 'genco' ? 'absIn' : 'absOut', include: true };
  });
  return { tlfPct: DEFAULT_TLF_PCT, nodes };
}

/** A saved layout with any missing station filled from the default (a station added later). */
export function completeLayout(saved) {
  const base = defaultLayout();
  if (!saved || !saved.nodes) return base;
  const nodes = { ...base.nodes };
  Object.keys(saved.nodes).forEach((k) => { if (NODE_BY_KEY[k]) nodes[k] = { ...nodes[k], ...saved.nodes[k] }; });
  const tlf = num(saved.tlfPct);
  return { tlfPct: tlf === null ? base.tlfPct : tlf, nodes };
}

/** Raw meter MW turned into MW into the line. */
export function injection(raw, dir) {
  if (raw === null) return null;
  if (dir === 'out') return -raw;
  if (dir === 'absIn') return Math.abs(raw);
  if (dir === 'absOut') return -Math.abs(raw);
  return raw;
}

/** Readings of every meter at `now`. */
export function readAll(state, now = Date.now()) {
  const out = {};
  NODES.forEach((n) => {
    const payload = state ? state[n.payload] : null;
    const at = payload && num(payload.server_time);
    const r = payload ? n.read(state) : null;
    const fresh = at !== null && now - at <= STALE_MS;
    out[n.key] = {
      mw: r ? r.mw : null, kv: r ? r.kv : null, amp: r ? r.amp : null, mvar: r ? r.mvar : null,
      at, fresh, status: !payload || at === null ? 'never' : !fresh ? 'stale' : r && r.mw !== null ? 'live' : 'nan',
    };
  });
  return out;
}

/** Nodes of one line in order from the Ikorodu end. */
export function lineNodes(layout, line) {
  return NODES.filter((n) => layout.nodes[n.key] && layout.nodes[n.key].line === line)
    .sort((a, b) => {
      if (a.fixedStart !== b.fixedStart) return a.fixedStart ? -1 : 1;
      return layout.nodes[a.key].pos - layout.nodes[b.key].pos || NODES.indexOf(a) - NODES.indexOf(b);
    });
}

/**
 * Power balance of one line.
 * in = MW entering the line through meters; out = MW leaving through meters;
 * residual = in - out (power that entered but was not metered leaving);
 * allowed loss = TLF x in; unaccounted = residual - allowed loss.
 * Segments: flow after each node, from the Ikorodu end (positive = towards Sagamu).
 */
export function analyseLine(layout, readings, line) {
  const tlf = (num(layout.tlfPct) ?? DEFAULT_TLF_PCT) / 100;
  const nodes = lineNodes(layout, line);
  let inflow = 0;
  let outflow = 0;
  let running = 0;
  let broken = false;
  const missing = [];
  const items = nodes.map((n) => {
    const cfg = layout.nodes[n.key];
    const r = readings[n.key];
    const usable = cfg.include && r && r.fresh && r.mw !== null;
    const inj = usable ? injection(r.mw, cfg.dir) : null;
    if (cfg.include && !usable) { missing.push(n.key); broken = true; }
    if (inj !== null) {
      if (inj >= 0) inflow += inj; else outflow += -inj;
      running += inj;
    }
    return { key: n.key, node: n, cfg, reading: r, inj, flowAfter: broken ? null : running };
  });
  const residual = inflow - outflow;
  const allowed = tlf * inflow;
  const unaccounted = residual - allowed;
  const noise = Math.max(NOISE_MW, (NOISE_PCT / 100) * inflow);
  const counted = items.filter((i) => i.cfg.include).length;
  let verdict = 'balanced';
  if (!counted) verdict = 'empty';
  else if (missing.length) verdict = 'incomplete';
  else if (unaccounted > noise) verdict = 'unaccounted';
  else if (residual < -noise) verdict = 'overmetered';
  return {
    line, items, inflow, outflow, residual, allowed, unaccounted, tlfPct: tlf * 100,
    unaccountedPct: inflow > 0 ? (unaccounted / inflow) * 100 : null, missing, verdict, noise,
  };
}

/** The whole axis: both lines plus who generates, who consumes and what crosses at each TS. */
export function analyseAxis(layout, readings) {
  const lines = [1, 2].map((l) => analyseLine(layout, readings, l));
  const sum = (pred) => lines.reduce((a, L) => a + L.items.filter((i) => i.inj !== null && pred(i)).reduce((b, i) => b + i.inj, 0), 0);
  const generation = sum((i) => i.node.kind === 'genco');
  const consumption = -sum((i) => i.node.kind === 'customer');
  const ikorodu = sum((i) => i.node.key.startsWith('ikorodu'));
  const sagamu = sum((i) => i.node.key.startsWith('sagamu'));
  const unaccounted = lines.reduce((a, L) => a + L.unaccounted, 0);
  const residual = lines.reduce((a, L) => a + L.residual, 0);
  const allowed = lines.reduce((a, L) => a + L.allowed, 0);
  const inflow = lines.reduce((a, L) => a + L.inflow, 0);
  const missing = lines.flatMap((L) => L.missing);
  return {
    lines, generation, consumption, ikorodu, sagamu, unaccounted, residual, allowed, inflow, missing,
    generationShare: generation > 0 ? Math.min(100, (consumption / generation) * 100) : null,
    verdict: missing.length ? 'incomplete' : lines.some((L) => L.verdict === 'unaccounted') ? 'unaccounted'
      : lines.some((L) => L.verdict === 'overmetered') ? 'overmetered' : 'balanced',
  };
}

/** Moves a node one place along its line (delta -1 / +1). Returns a new layout. */
export function moveNode(layout, key, delta) {
  const cfg = layout.nodes[key];
  if (!cfg || NODE_BY_KEY[key].fixedStart) return layout;
  const order = lineNodes(layout, cfg.line).filter((n) => !n.fixedStart).map((n) => n.key);
  const i = order.indexOf(key);
  const j = i + delta;
  if (i < 0 || j < 0 || j >= order.length) return layout;
  [order[i], order[j]] = [order[j], order[i]];
  const nodes = { ...layout.nodes };
  order.forEach((k, idx) => { nodes[k] = { ...nodes[k], pos: idx + 1 }; });
  return { ...layout, nodes };
}

/** Where a node sits along its line: { index (1 = first after the Ikorodu end), count }, or null. */
export function positionOf(layout, key) {
  const cfg = layout.nodes[key];
  if (!cfg || !cfg.line || NODE_BY_KEY[key].fixedStart) return null;
  const order = lineNodes(layout, cfg.line).filter((n) => !n.fixedStart).map((n) => n.key);
  return { index: order.indexOf(key) + 1, count: order.length };
}

/** Moves a node to place `index` (1 = first after the Ikorodu end) on its own line. */
export function moveNodeTo(layout, key, index) {
  const cfg = layout.nodes[key];
  if (!cfg || !cfg.line || NODE_BY_KEY[key].fixedStart) return layout;
  const order = lineNodes(layout, cfg.line).filter((n) => !n.fixedStart).map((n) => n.key);
  const from = order.indexOf(key);
  const to = Math.max(0, Math.min(order.length - 1, Math.round(Number(index)) - 1));
  if (from < 0 || !Number.isFinite(to) || from === to) return layout;
  order.splice(from, 1);
  order.splice(to, 0, key);
  const nodes = { ...layout.nodes };
  order.forEach((k, idx) => { nodes[k] = { ...nodes[k], pos: idx + 1 }; });
  return { ...layout, nodes };
}

/**
 * Puts a node on another line (0 = not on the axis). It goes at the end of that line, but in front
 * of a Sagamu end that is currently last, so a station never lands beyond the Sagamu end.
 */
export function setLine(layout, key, line) {
  const cfg = layout.nodes[key];
  if (!cfg || cfg.line === line) return layout;
  const order = lineNodes(layout, line).filter((n) => !n.fixedStart).map((n) => n.key);
  const last = order[order.length - 1];
  const beforeEnd = line !== 0 && NODE_BY_KEY[key].kind !== 'end' && last && NODE_BY_KEY[last].kind === 'end';
  if (beforeEnd) order.splice(order.length - 1, 0, key); else order.push(key);
  const nodes = { ...layout.nodes, [key]: { ...cfg, line } };
  order.forEach((k, idx) => { nodes[k] = { ...nodes[k], pos: Math.min(999, idx + 1) }; });
  return { ...layout, nodes };
}

export function setNode(layout, key, patch) {
  return { ...layout, nodes: { ...layout.nodes, [key]: { ...layout.nodes[key], ...patch } } };
}

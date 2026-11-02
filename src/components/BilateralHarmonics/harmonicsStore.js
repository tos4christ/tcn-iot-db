/**
 * 6-hour harmonic recorder for this device. One shared instance listens to the bilateral feeds,
 * keeps samples in memory for analysis and saves them to IndexedDB, so they survive a page
 * reload. Nothing is stored on the server yet.
 *
 * It uses socket.onAny on purpose: the bilateral pages call socket.off('client_message_x') when
 * they unmount, which removes every listener on that channel. onAny listeners are not affected,
 * so recording carries on while the operator moves between pages.
 */
import socket from '../utility/socketIO';
import { analyseStation } from './harmonicsAnalysis';
import { SETTINGS, STATIONS } from './harmonicsConfig';

const DB_NAME = 'niso_harmonics';
const STORE = 'samples';
const KEEP_MS = SETTINGS.keepHours * 3600 * 1000;
const WAT_MS = 3600 * 1000;
const ANALYSIS_TTL_MS = 10000;

const num = (v) => { const n = typeof v === 'string' ? Number(v) : v; return typeof n === 'number' && Number.isFinite(n) ? n : null; };
const hasHarmonics = (td) => td && (td.thdv !== undefined || td.thdia !== undefined || td.tdd !== undefined);

/** Measurement time from the device's HH:MM:SS (WAT). A backlog resend keeps its real time. */
export function sampleTime(hhmmss, now) {
  const m = /^(\d{1,2}):(\d{2}):(\d{2})$/.exec(String(hhmmss || ''));
  if (!m) return now;
  const wat = new Date(now + WAT_MS);
  let t = Date.UTC(wat.getUTCFullYear(), wat.getUTCMonth(), wat.getUTCDate(), Number(m[1]), Number(m[2]), Number(m[3])) - WAT_MS;
  if (t > now + 60000) t -= 24 * 3600 * 1000; // sent just after midnight, measured yesterday
  return t;
}

/** Harmonic points in a device message: [{ stationId, lineId, td }]. */
export function harmonicPoints(data) {
  if (!data || typeof data !== 'object') return [];
  const id = data.id || data.name;
  if (!id) return [];
  const list = [...(data.lines || []), ...(data.transformers || [])];
  const points = list.filter((p) => p && hasHarmonics(p.td)).map((p) => ({ stationId: id, lineId: p.id || null, td: p.td }));
  if (!points.length && hasHarmonics(data)) points.push({ stationId: id, lineId: null, td: data });
  return points;
}

const toSample = (td, t, backlog) => ({
  t, backlog: backlog || undefined,
  mw: num(td.mw), a: num(td.a), v: num(td.v ?? td.V), mx: num(td.mx), f: num(td.f), pf: num(td.pf),
  tddMeter: num(td.tdd), thdv: num(td.thdv), ia: num(td.thdia), ib: num(td.thdib), ic: num(td.thdic),
});

export const stationKey = (stationId, lineId) => `${stationId}:${lineId || ''}`;

function openDb() {
  return new Promise((resolve, reject) => {
    if (!window.indexedDB) { reject(new Error('IndexedDB not available')); return; }
    const req = window.indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      const os = req.result.createObjectStore(STORE, { keyPath: 'pk' });
      os.createIndex('t', 't');
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

class HarmonicsStore {
  constructor() {
    this.series = new Map();   // key -> { cfg, stationId, lineId, group, samples: [] }
    this.cache = new Map();    // key -> { at, analysis }
    this.pending = [];
    this.started = false;
    this.db = null;
    this.loaded = false;
    this.persistent = true;
    this.lastMessageAt = 0;
  }

  start() {
    if (this.started) return;
    this.started = true;
    socket.onAny((event, payload) => this.onEvent(event, payload));
    this.restore();
    setInterval(() => this.flush(), 15000);
    setInterval(() => this.prune(), 5 * 60000);
  }

  configFor(stationId, lineId) {
    return STATIONS.find((s) => s.id === stationId && (!s.line || !lineId || s.line === lineId)) || null;
  }

  seriesFor(stationId, lineId, group) {
    const key = stationKey(stationId, lineId);
    let s = this.series.get(key);
    if (!s) {
      const known = this.configFor(stationId, lineId);
      const label = lineId && lineId !== stationId ? `${stationId} ${lineId}` : stationId;
      const cfg = known || { slug: null, id: stationId, line: lineId, name: label, short: label.toUpperCase(), group: group || 'other', nominalKv: null, demandCurrentA: null, iscKA: null };
      s = { key, cfg, samples: [] };
      this.series.set(key, s);
    }
    if (group && s.cfg.group === 'other') s.cfg.group = group;
    return s;
  }

  onEvent(event, payload) {
    if (!/^client_message_/.test(event) || !payload || !payload.message) return;
    if (event === 'client_message_111') return; // transmission stations carry no harmonic data
    let data = null;
    try { data = typeof payload.message === 'string' ? JSON.parse(payload.message) : payload.message; } catch (e) { return; }
    const points = harmonicPoints(data);
    if (!points.length) return;
    const now = Date.now();
    this.lastMessageAt = now;
    const group = event.replace('client_message_', '');
    const t = sampleTime(data.t, now);
    const backlog = now - t > SETTINGS.backlogSec * 1000;
    points.forEach((p) => {
      if (now - t > KEEP_MS) return;
      const s = this.seriesFor(p.stationId, p.lineId, group);
      this.add(s, toSample(p.td, t, backlog), true);
    });
  }

  /** Inserts in time order; a reading resent after an outage goes back to its true place. */
  add(s, sample, save) {
    const a = s.samples;
    const gap = SETTINGS.minGapSec * 1000;
    let i = a.length;
    while (i > 0 && a[i - 1].t > sample.t) i -= 1;
    if ((i > 0 && sample.t - a[i - 1].t < gap) || (i < a.length && a[i].t - sample.t < gap)) return;
    a.splice(i, 0, sample);
    if (save) this.pending.push({ ...sample, pk: `${s.key}|${sample.t}`, key: s.key, stationId: s.cfg.id, lineId: s.cfg.line, group: s.cfg.group });
  }

  async restore() {
    try {
      this.db = await openDb();
      const cut = Date.now() - KEEP_MS;
      await new Promise((resolve, reject) => {
        const req = this.db.transaction(STORE).objectStore(STORE).index('t').openCursor(window.IDBKeyRange.lowerBound(cut));
        req.onsuccess = () => {
          const c = req.result;
          if (!c) { resolve(); return; }
          const { pk, key, stationId, lineId, group, ...sample } = c.value;
          const s = this.seriesFor(stationId, lineId, group);
          this.add(s, sample, false);
          c.continue();
        };
        req.onerror = () => reject(req.error);
      });
    } catch (e) {
      this.persistent = false; // private window or blocked storage: analysis still runs in memory
    }
    this.loaded = true;
  }

  flush() {
    if (!this.db || !this.pending.length) return;
    const batch = this.pending;
    this.pending = [];
    try {
      const tx = this.db.transaction(STORE, 'readwrite');
      const os = tx.objectStore(STORE);
      batch.forEach((r) => os.put(r));
    } catch (e) {
      this.persistent = false;
    }
  }

  prune() {
    const cut = Date.now() - KEEP_MS;
    this.series.forEach((s) => {
      let n = 0;
      while (n < s.samples.length && s.samples[n].t < cut) n += 1;
      if (n) s.samples.splice(0, n);
    });
    if (!this.db) return;
    try {
      const req = this.db.transaction(STORE, 'readwrite').objectStore(STORE).index('t').openCursor(window.IDBKeyRange.upperBound(cut));
      req.onsuccess = () => { const c = req.result; if (c) { c.delete(); c.continue(); } };
    } catch (e) { /* the next prune retries */ }
  }

  /** Every station to show: the configured ones, then any others that have sent harmonics. */
  stations(group = null) {
    const list = STATIONS.map((cfg) => {
      const found = [...this.series.values()].find((s) => s.cfg === cfg);
      return found || { key: stationKey(cfg.id, cfg.line), cfg, samples: [] };
    });
    this.series.forEach((s) => { if (!STATIONS.includes(s.cfg)) list.push(s); });
    return list.filter((s) => !group || s.cfg.group === group);
  }

  analysis(entry) {
    const cached = this.cache.get(entry.key);
    const now = Date.now();
    // Pages re-render on every feed message, so reuse a result for a few seconds.
    // A station shown as not reporting is refreshed as soon as a new reading arrives.
    const lastT = entry.samples.length ? entry.samples[entry.samples.length - 1].t : 0;
    const fresh = cached && now - cached.at < ANALYSIS_TTL_MS && (cached.count > 0 || !entry.samples.length);
    if (fresh && (cached.analysis.live || cached.lastT === lastT)) return cached.analysis;
    const analysis = { ...analyseStation(entry.samples, entry.cfg, now), key: entry.key };
    this.cache.set(entry.key, { at: now, analysis, count: entry.samples.length, lastT });
    return analysis;
  }

  /** Latest analysis for a live table row, without forcing a recalculation. */
  summaryFor(stationId, lineId) {
    const s = this.series.get(stationKey(stationId, lineId));
    if (!s) return null;
    return this.analysis(s);
  }
}

export const harmonicsStore = new HarmonicsStore();

/**
 * Harmonic analysis engine. Pure functions: no browser, socket or React code here, so every
 * figure on the dashboard can be tested on its own.
 *
 * Input: one station's samples, oldest first:
 *   { t, mw, a, v, mx, f, pf, tddMeter, thdv, ia, ib, ic }
 * t = epoch ms, a = RMS current (A), v = kV, thd* = % of fundamental, tddMeter = % from the meter.
 */
import { ASSESSMENT, SETTINGS, SYSTEM_KV, TDD_LIMITS, VOLTAGE_LIMITS } from './harmonicsConfig';

/* ---------------------------------------------------------------- maths */

const isNum = (v) => typeof v === 'number' && Number.isFinite(v);
const mean = (a) => (a.length ? a.reduce((s, v) => s + v, 0) / a.length : null);
const rms = (a) => (a.length ? Math.sqrt(a.reduce((s, v) => s + v * v, 0) / a.length) : null);

/** Percentile by linear interpolation; p in 0-100. */
export function percentile(values, p) {
  const a = values.filter(isNum).sort((x, y) => x - y);
  if (!a.length) return null;
  if (a.length === 1) return a[0];
  const rank = (p / 100) * (a.length - 1);
  const lo = Math.floor(rank);
  const hi = Math.ceil(rank);
  return a[lo] + (a[hi] - a[lo]) * (rank - lo);
}

/** Least-squares fit of y on x. r = Pearson correlation. */
export function regression(xs, ys) {
  const n = xs.length;
  if (n < 3) return null;
  const mx = mean(xs);
  const my = mean(ys);
  let sxx = 0;
  let syy = 0;
  let sxy = 0;
  for (let i = 0; i < n; i += 1) {
    sxx += (xs[i] - mx) ** 2;
    syy += (ys[i] - my) ** 2;
    sxy += (xs[i] - mx) * (ys[i] - my);
  }
  if (sxx === 0 || syy === 0) return { r: 0, slope: 0, intercept: my, n };
  const slope = sxy / sxx;
  return { r: sxy / Math.sqrt(sxx * syy), slope, intercept: my - slope * mx, n };
}

/* ---------------------------------------------------------------- limits */

export function nominalKv(cfg, samples) {
  if (cfg && isNum(cfg.nominalKv)) return { kv: cfg.nominalKv, source: 'configured' };
  const median = percentile(samples.map((s) => s.v).filter((v) => isNum(v) && v > 0), 50);
  if (median === null) return { kv: null, source: 'unknown' };
  const kv = SYSTEM_KV.reduce((best, k) => (Math.abs(Math.log(k / median)) < Math.abs(Math.log(best / median)) ? k : best), SYSTEM_KV[0]);
  return { kv, source: 'estimated from live voltage' };
}

/** Demand current IL: entered value, or the highest 15-minute average seen on this device. */
export function demandCurrent(cfg, samples) {
  if (cfg && isNum(cfg.demandCurrentA) && cfg.demandCurrentA > 0) return { il: cfg.demandCurrentA, source: 'configured' };
  const span = 15 * 60000;
  let best = null;
  let start = 0;
  let sum = 0;
  let count = 0;
  for (let i = 0; i < samples.length; i += 1) {
    if (isNum(samples[i].a)) { sum += samples[i].a; count += 1; }
    while (samples[start].t < samples[i].t - span) {
      if (isNum(samples[start].a)) { sum -= samples[start].a; count -= 1; }
      start += 1;
    }
    // Only a window that really spans about 15 minutes counts as a demand period.
    if (count > 0 && samples[i].t - samples[start].t >= span * 0.8) best = Math.max(best ?? 0, sum / count);
  }
  if (best === null && samples.length) { // under 15 minutes of data: use the peak so far
    const peak = Math.max(...samples.map((s) => s.a).filter(isNum), 0);
    best = peak || null;
  }
  return { il: best && best > 0 ? best : null, source: 'observed peak on this device' };
}

export function limitsFor(kv, il, iscKA) {
  const voltage = VOLTAGE_LIMITS.find((l) => (kv ?? 33) <= l.maxKv);
  const row = TDD_LIMITS.find((l) => (kv ?? 33) <= l.maxKv);
  const ratio = isNum(iscKA) && iscKA > 0 && il ? (iscKA * 1000) / il : null;
  const band = ratio === null ? row.bands[0] : row.bands.find((b) => ratio < b.upTo) || row.bands[row.bands.length - 1];
  return { thdv: voltage.thd, tdd: band.tdd, band: voltage.label, ratio, ratioKnown: ratio !== null };
}

/* ---------------------------------------------------------------- derived values */

/** Harmonic current and TDD for one sample, using the worst phase. */
export function deriveSample(s, il) {
  const phases = [s.ia, s.ib, s.ic].filter(isNum);
  const thdi = phases.length ? Math.max(...phases) : null;
  if (thdi === null || !isNum(s.a)) return { ...s, thdi, ih: null, tdd: null };
  const fundamental = s.a / Math.sqrt(1 + (thdi / 100) ** 2);
  const ih = fundamental * (thdi / 100);
  return { ...s, thdi, ih, tdd: il ? (ih / il) * 100 : null };
}

/** RMS 10-minute blocks, clock aligned. */
export function shortBlocks(samples, metrics, periodMs) {
  const size = SETTINGS.shortBlockMin * 60000;
  const needed = (size / periodMs) * SETTINGS.minBlockFill;
  const groups = new Map();
  samples.forEach((s) => {
    const k = Math.floor(s.t / size) * size;
    if (!groups.has(k)) groups.set(k, []);
    groups.get(k).push(s);
  });
  const blocks = [];
  [...groups.keys()].sort((a, b) => a - b).forEach((t) => {
    const g = groups.get(t);
    if (g.length < needed) return;
    const b = { t, count: g.length };
    metrics.forEach((m) => { b[m] = rms(g.map((x) => x[m]).filter(isNum)); });
    blocks.push(b);
  });
  return blocks;
}

/** One line of the compliance table. */
function assess(label, key, unit, limit, rules, values, blocks, current, minBlocks) {
  const vst = values.filter(isNum);
  const short = blocks.map((b) => b[key]).filter(isNum);
  const p95s = percentile(short, 95);
  const p99s = percentile(short, 99);
  const p99v = percentile(vst, 99);
  const checks = [];
  if (rules.p95Short) checks.push({ name: '95th percentile, 10 min', value: p95s, allowed: limit * rules.p95Short });
  if (rules.p99Short) checks.push({ name: '99th percentile, 10 min', value: p99s, allowed: limit * rules.p99Short });
  if (rules.p99VeryShort) checks.push({ name: '99th percentile, 3 s', value: p99v, allowed: limit * rules.p99VeryShort });
  const ratio = Math.max(0, ...checks.filter((c) => isNum(c.value)).map((c) => c.value / c.allowed));
  const failed = checks.filter((c) => isNum(c.value) && c.value > c.allowed);
  let status = 'pass';
  if (short.length < minBlocks) status = 'insufficient';
  else if (failed.length) status = 'violation';
  else if (ratio >= SETTINGS.watchFraction) status = 'watch';
  return {
    label, key, unit, limit, now: current, avg: mean(vst), max: vst.length ? Math.max(...vst) : null,
    p95Short: p95s, p99Short: p99s, p99VeryShort: p99v, percentOfLimit: isNum(p95s) ? (p95s / limit) * 100 : null,
    ratio, status, failed, overLimitPct: vst.length ? (vst.filter((v) => v > limit).length / vst.length) * 100 : null, blocks: short.length,
  };
}

/** Continuous periods above a limit. */
export function excursions(samples, key, limit, meta) {
  const events = [];
  let cur = null;
  const gap = SETTINGS.eventGapSec * 1000;
  samples.forEach((s) => {
    const v = s[key];
    if (!isNum(v)) return;
    if (v > limit) {
      if (cur && s.t - cur.end <= gap) { cur.end = s.t; cur.peak = Math.max(cur.peak, v); } else {
        if (cur) events.push(cur);
        cur = { ...meta, start: s.t, end: s.t, peak: v, limit };
      }
    }
  });
  if (cur) events.push(cur);
  return events.filter((e) => e.end - e.start >= SETTINGS.minEventSec * 1000);
}

/* ---------------------------------------------------------------- is this station the cause? */

/**
 * Does this station's harmonic current drive the voltage distortion at its connection?
 * Regresses 1-minute THDv on 1-minute harmonic current. A strong positive relationship means
 * voltage distortion rises and falls with the station's own harmonic current; the intercept
 * estimates the distortion already on the network (background). An indicator, not a measurement
 * of harmonic impedance: it needs the customer's load to vary during the window.
 */
export function attribution(loaded) {
  const minutes = new Map();
  loaded.forEach((s) => {
    if (!isNum(s.ih) || !isNum(s.thdv)) return;
    const k = Math.floor(s.t / 60000);
    if (!minutes.has(k)) minutes.set(k, { ih: [], thdv: [] });
    const m = minutes.get(k);
    m.ih.push(s.ih);
    m.thdv.push(s.thdv);
  });
  const points = [...minutes.keys()].sort((a, b) => a - b).map((k) => ({ t: k * 60000, x: mean(minutes.get(k).ih), y: mean(minutes.get(k).thdv) }));
  const base = { points, fit: null, verdict: 'insufficient', share: null, background: null };
  if (points.length < SETTINGS.storageWarnMinutes) return base;
  const xs = points.map((p) => p.x);
  const ys = points.map((p) => p.y);
  const avgX = mean(xs);
  const spread = Math.sqrt(mean(xs.map((v) => (v - avgX) ** 2)));
  if (!avgX || spread / avgX < 0.1) return { ...base, verdict: 'steady' };
  const fit = regression(xs, ys);
  const avgY = mean(ys);
  const background = Math.max(0, Math.min(fit.intercept, avgY));
  const share = avgY > 0 ? ((avgY - background) / avgY) * 100 : 0;
  let verdict = 'mixed';
  if (fit.r >= SETTINGS.strongCorrelation && fit.slope > 0) verdict = 'station';
  else if (Math.abs(fit.r) < SETTINGS.weakCorrelation) verdict = 'background';
  return { points, fit, verdict, share: verdict === 'station' || verdict === 'mixed' ? share : null, background };
}

/* ---------------------------------------------------------------- data quality */

function dataQuality(samples, derived, il, ilInfo, cfg, kvInfo, limits) {
  const issues = [];
  const add = (level, title, detail, action) => issues.push({ level, title, detail, action });

  // Meter TDD against the value worked out from THD and current.
  const check = derived.filter((s) => isNum(s.tddMeter) && s.tddMeter > 0 && isNum(s.thdi) && s.thdi > 0 && isNum(s.a) && s.a > 0);
  if (check.length >= 5) {
    // The meter works from the average of the phases, so compare on the same basis.
    const implied = percentile(check.map((s) => (mean([s.ia, s.ib, s.ic].filter(isNum)) * s.a) / s.tddMeter), 50);
    const typicalMeter = percentile(check.map((s) => s.tddMeter), 50);
    const wrong = il ? il / implied : null;
    if (wrong !== null && (wrong > SETTINGS.meterTddTolerance || wrong < 1 / SETTINGS.meterTddTolerance)) {
      add('warning', 'Meter TDD is not reliable',
        `The meter reports TDD of about ${typicalMeter.toFixed(1)}%, which means it is dividing by a demand current of only about ${implied.toFixed(1)} A. This station's demand current is ${il.toFixed(0)} A. This dashboard ignores the meter's TDD and calculates it from THD and current.`,
        'Enter the true peak demand current in the meter (PM5100 register 2048, in primary amps) and in harmonicsConfig.js.');
    }
  }
  if (ilInfo.source !== 'configured') {
    add('info', 'Demand current is estimated',
      'TDD uses the highest 15-minute current seen on this device. If the load has been low, TDD will read too high or too low.',
      'Enter demandCurrentA for this station in harmonicsConfig.js (contract maximum demand).');
  }
  if (!limits.ratioKnown) {
    add('info', 'Fault level not entered',
      `The strictest TDD limit (${limits.tdd}%) is applied. Stations on a strong network are allowed more.`,
      'Enter iscKA for this station in harmonicsConfig.js (from System Planning fault studies).');
  }
  if (kvInfo.source !== 'configured' && kvInfo.kv !== null) {
    const v = percentile(samples.map((s) => s.v).filter((x) => isNum(x) && x > 0), 50);
    if (v !== null && Math.abs(v - kvInfo.kv) / kvInfo.kv > 0.15) {
      add('warning', 'Voltage reading looks wrong',
        `The meter shows ${v.toFixed(2)} kV, which does not match any system voltage (nearest ${kvInfo.kv} kV). The voltage limit may be wrong until this is fixed.`,
        'Check the meter PT ratio and enter nominalKv in harmonicsConfig.js.');
    } else {
      add('info', 'System voltage is estimated', `Limits use ${kvInfo.kv} kV, worked out from the live voltage.`, 'Enter nominalKv in harmonicsConfig.js to fix it.');
    }
  }
  // Same values repeating: the field device may be carrying old values forward.
  const recent = samples.filter((s) => s.t >= samples[samples.length - 1].t - SETTINGS.frozenMinutes * 60000);
  if (recent.length > 20 && recent[recent.length - 1].t - recent[0].t > (SETTINGS.frozenMinutes - 1) * 60000) {
    const sig = new Set(recent.map((s) => [s.thdv, s.ia, s.ib, s.ic, s.a].join('|')));
    if (sig.size === 1) {
      add('warning', 'Readings have not changed', `All values have been identical for ${SETTINGS.frozenMinutes} minutes. The field device may be repeating its last reading.`, 'Check the meter and the RS-485 link at site.');
    }
  }
  return issues;
}

/* ---------------------------------------------------------------- alerts */

const ACTIONS = {
  thdv: {
    consequence: 'Distorted voltage reaches every customer on this bus. It overheats transformers and motors, overstresses capacitor banks, and can cause protection relays and energy meters to misread.',
    action: 'Tell the control engineer. Compare with the neighbouring bus and check capacitor banks on this section for resonance. If the attribution points to this station, ask the customer to reduce nonlinear load until filters are checked.',
  },
  tdd: {
    consequence: 'Excess harmonic current overheats transformers, cables and neutral conductors, reduces their usable capacity, and adds to voltage distortion on the shared network.',
    action: 'Notify the customer in writing with the times below. Ask them to check their harmonic filters and drives (arc furnaces, rectifiers, VFDs, inverters). Repeated violations should go to System Planning for a connection-agreement review.',
  },
};

function buildAlerts(thdv, tdd, derivedNow, events, attr, phaseSpread, extraHeat) {
  const alerts = [];
  const push = (a) => alerts.push(a);
  const statutory = (m, label) => {
    if (m.status === 'violation') {
      const f = m.failed[0];
      push({ level: 'violation', code: `${m.key}-limit`, title: `${label} above the IEEE 519 limit`,
        detail: `${f.name} is ${f.value.toFixed(2)}% against ${f.allowed.toFixed(2)}% allowed.`, ...ACTIONS[m.key] });
    } else if (m.status === 'watch') {
      push({ level: 'watch', code: `${m.key}-watch`, title: `${label} is close to its limit`,
        detail: `At ${(m.ratio * 100).toFixed(0)}% of what is allowed.`, consequence: ACTIONS[m.key].consequence, action: 'Keep watching. No action needed yet.' });
    }
  };
  statutory(thdv, 'Voltage distortion');
  statutory(tdd, 'Current distortion (TDD)');

  // Live state, shown even before there is enough history for a verdict.
  if (derivedNow) {
    if (isNum(derivedNow.thdv) && derivedNow.thdv > thdv.limit && thdv.status !== 'violation') {
      push({ level: 'violation', code: 'thdv-live', title: 'Voltage distortion is above the limit now',
        detail: `THDv is ${derivedNow.thdv.toFixed(2)}% against a ${thdv.limit}% limit.`, ...ACTIONS.thdv });
    }
    if (isNum(derivedNow.tdd) && derivedNow.tdd > tdd.limit && derivedNow.loaded && tdd.status !== 'violation') {
      push({ level: 'watch', code: 'tdd-live', title: 'Current distortion is above the limit now',
        detail: `TDD is ${derivedNow.tdd.toFixed(2)}% against a ${tdd.limit}% limit. Short peaks are allowed; a sustained level is not.`, ...ACTIONS.tdd });
    }
  }
  if (attr.verdict === 'station' && (thdv.status === 'violation' || thdv.status === 'watch')) {
    push({ level: thdv.status === 'violation' ? 'violation' : 'watch', code: 'attribution', title: 'This station appears to be driving the voltage distortion',
      detail: `Voltage distortion rises with this station's harmonic current (correlation ${attr.fit.r.toFixed(2)}).`,
      consequence: 'Other customers and equipment on the same bus are being affected by this load.', action: ACTIONS.tdd.action });
  }
  if (phaseSpread && phaseSpread.flagged) {
    push({ level: 'watch', code: 'phase', title: 'Harmonic current is unbalanced across phases',
      detail: `Phase ${phaseSpread.worst} is at ${phaseSpread.max.toFixed(1)}% while phase ${phaseSpread.best} is at ${phaseSpread.min.toFixed(1)}%.`,
      consequence: 'Points to large single-phase nonlinear loads, adding neutral current and uneven transformer heating.',
      action: 'Ask the customer to review how single-phase loads are spread across phases.' });
  }
  if (isNum(extraHeat) && extraHeat >= 5) {
    push({ level: 'info', code: 'heat', title: 'Harmonics are adding to conductor heating',
      detail: `About ${extraHeat.toFixed(1)}% extra I²R loss at the current distortion level.`,
      consequence: 'Reduces the spare capacity of lines and transformers, even when MW looks normal.', action: 'Allow for this when assessing the loading of this feeder.' });
  }
  const order = { violation: 0, watch: 1, info: 2 };
  alerts.sort((a, b) => order[a.level] - order[b.level]);
  if (events.length) alerts.events = events;
  return alerts;
}

/* ---------------------------------------------------------------- station analysis */

export function analyseStation(samples, cfg, now = Date.now()) {
  const staleMs = SETTINGS.staleSec * 1000;
  const lastLive = samples.length ? samples.filter((s) => !s.backlog).reduce((m, s) => Math.max(m, s.t), 0) : 0;
  const empty = { cfg, samples: [], status: 'nodata', overall: 'nodata', live: false, alerts: [], quality: [], events: [] };
  if (!samples.length) return empty;

  const ilInfo = demandCurrent(cfg, samples);
  const kvInfo = nominalKv(cfg, samples);
  const limits = limitsFor(kvInfo.kv, ilInfo.il, cfg ? cfg.iscKA : null);
  const derived = samples.map((s) => deriveSample(s, ilInfo.il));
  const minLoad = ilInfo.il ? ilInfo.il * SETTINGS.minLoadFraction : Infinity;
  derived.forEach((s) => { s.loaded = isNum(s.a) && s.a >= minLoad; });
  const loaded = derived.filter((s) => s.loaded);

  // Typical spacing between samples, so a 10-minute block's fill is judged fairly.
  const span = samples[samples.length - 1].t - samples[0].t;
  const period = samples.length > 1 ? Math.max(SETTINGS.minGapSec * 1000, percentile(samples.slice(1).map((s, i) => s.t - samples[i].t), 50)) : 5000;
  const blocks = shortBlocks(derived, ['thdv'], period);
  const loadedBlocks = shortBlocks(loaded, ['tdd', 'ih', 'thdi'], period);

  const last = derived[derived.length - 1];
  const live = lastLive > 0 && now - lastLive <= staleMs;
  const lastLiveSample = live ? derived.filter((s) => !s.backlog).slice(-1)[0] : null;
  const min = SETTINGS.minBlocksForVerdict;
  const thdv = assess('Voltage distortion (THDv)', 'thdv', '%', limits.thdv, ASSESSMENT.voltage, derived.map((s) => s.thdv), blocks, lastLiveSample ? lastLiveSample.thdv : null, min);
  const tdd = assess('Current distortion (TDD)', 'tdd', '%', limits.tdd, ASSESSMENT.current, loaded.map((s) => s.tdd), loadedBlocks, lastLiveSample && lastLiveSample.loaded ? lastLiveSample.tdd : null, min);

  const events = [
    ...excursions(derived, 'thdv', limits.thdv, { metric: 'THDv' }),
    ...excursions(loaded, 'tdd', limits.tdd, { metric: 'TDD' }),
  ].sort((a, b) => b.start - a.start);

  // Phase comparison on the recent loaded samples.
  const recent = loaded.slice(-60);
  const phaseAvg = ['ia', 'ib', 'ic'].map((k, i) => ({ phase: 'ABC'[i], v: mean(recent.map((s) => s[k]).filter(isNum)) })).filter((p) => isNum(p.v));
  let phaseSpread = null;
  if (phaseAvg.length === 3) {
    const sorted = [...phaseAvg].sort((a, b) => a.v - b.v);
    const avg = mean(phaseAvg.map((p) => p.v));
    const spreadRatio = avg ? (sorted[2].v - sorted[0].v) / avg : 0;
    phaseSpread = { max: sorted[2].v, min: sorted[0].v, worst: sorted[2].phase, best: sorted[0].phase, spreadRatio,
      flagged: avg >= SETTINGS.minPhaseThd && spreadRatio > SETTINGS.phaseSpreadRatio };
  }

  const attr = attribution(loaded);

  // Physical effect of the distortion at present.
  const basis = lastLiveSample || last;
  const thdiNow = isNum(basis.thdi) ? basis.thdi / 100 : null;
  const extraHeat = thdiNow === null ? null : (thdiNow ** 2) * 100;
  const distortionPf = thdiNow === null ? null : 1 / Math.sqrt(1 + thdiNow ** 2);
  const harmonicMva = isNum(basis.ih) && isNum(basis.v) ? (Math.sqrt(3) * basis.v * basis.ih) / 1000 : null;

  const quality = dataQuality(samples, derived, ilInfo.il, ilInfo, cfg, kvInfo, limits);
  const alerts = buildAlerts(thdv, tdd, lastLiveSample, events, attr, phaseSpread, extraHeat);

  // Overall verdict and a single figure to rank stations by.
  const statuses = [thdv.status, tdd.status];
  let overall = 'pass';
  if (statuses.includes('violation')) overall = 'violation';
  else if (statuses.includes('watch')) overall = 'watch';
  else if (statuses.every((s) => s === 'insufficient')) overall = 'insufficient';

  const windowHours = span / 3600000;
  const expected = Math.max(1, Math.round(Math.min(span, SETTINGS.keepHours * 3600000) / period) + 1);
  return {
    cfg, samples: derived, blocks, loadedBlocks, live, lastLive, status: live ? 'live' : 'stale', overall,
    il: ilInfo.il, ilSource: ilInfo.source, kv: kvInfo.kv, kvSource: kvInfo.source, limits,
    thdv, tdd, events, phaseSpread, attr, extraHeat, distortionPf, harmonicMva, last, lastLiveSample,
    alerts, quality, impact: Math.max(thdv.ratio || 0, tdd.ratio || 0), windowHours,
    coverage: Math.min(100, (samples.length / expected) * 100), lowLoadShare: derived.length ? ((derived.length - loaded.length) / derived.length) * 100 : 0,
  };
}

/** Plain-language summary for operators and management. */
export function headline(a) {
  const name = a.cfg.short || a.cfg.name;
  if (a.overall === 'nodata') return `${name}: no harmonic data has been received on this device yet.`;
  if (a.overall === 'insufficient') {
    return `${name}: still collecting. A compliance verdict needs at least ${SETTINGS.minBlocksForVerdict * SETTINGS.shortBlockMin} minutes of readings under load.`;
  }
  const cause = {
    station: ' Voltage distortion moves with this station\'s own harmonic current, so it is the likely source.',
    background: ' Voltage distortion does not follow this station\'s load, so it is more likely coming from the wider network.',
    mixed: ' Voltage distortion is partly linked to this station\'s load.',
  }[a.attr.verdict] || '';
  if (a.overall === 'violation') {
    const which = [a.thdv.status === 'violation' ? 'voltage distortion' : null, a.tdd.status === 'violation' ? 'current distortion (TDD)' : null].filter(Boolean).join(' and ');
    return `${name} is over the IEEE 519 limit for ${which}.${cause}`;
  }
  if (a.overall === 'watch') return `${name} is within limits but close to them.${cause}`;
  if (a.tdd.status === 'insufficient') {
    return `${name}: voltage distortion is within the IEEE 519 limit. Current distortion could not be assessed because the station has not carried enough load.`;
  }
  return `${name} is within IEEE 519 limits over the last ${a.windowHours.toFixed(1)} hours.`;
}

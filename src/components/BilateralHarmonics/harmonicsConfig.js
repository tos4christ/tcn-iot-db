/**
 * Bilateral harmonics: stations, limits and thresholds. Everything an engineer may need to tune
 * is in this one file.
 *
 * LIMITS: IEEE 519-2022 (voltage Table 1; current TDD by Isc/IL) with its statistical assessment.
 * The Nigerian Grid Code's harmonic clause could not be located when this was written. If the
 * Grid Code or a connection agreement sets different figures, change the tables below: they win
 * everywhere in the dashboard.
 * The 69-161 kV and >161 kV TDD rows were not confirmed against the printed standard; check them
 * before quoting them in a formal notice. Bilaterals at 33 kV and below do not use those rows.
 */

/** Voltage distortion limits at the point of common coupling (%), by bus voltage. */
export const VOLTAGE_LIMITS = [
  { maxKv: 1, thd: 8.0, individual: 5.0, label: 'up to 1 kV' },
  { maxKv: 69, thd: 5.0, individual: 3.0, label: '1 kV to 69 kV' },
  { maxKv: 161, thd: 2.5, individual: 1.5, label: '69 kV to 161 kV' },
  { maxKv: Infinity, thd: 1.5, individual: 1.0, label: 'above 161 kV' },
];

/** TDD limits (%), by Isc/IL ratio. `upTo` is the top of each ratio band. */
export const TDD_LIMITS = [
  { maxKv: 69, bands: [{ upTo: 20, tdd: 5.0 }, { upTo: 50, tdd: 8.0 }, { upTo: 100, tdd: 12.0 }, { upTo: 1000, tdd: 15.0 }, { upTo: Infinity, tdd: 20.0 }] },
  { maxKv: 161, bands: [{ upTo: 20, tdd: 2.5 }, { upTo: 50, tdd: 4.0 }, { upTo: 100, tdd: 6.0 }, { upTo: 1000, tdd: 7.5 }, { upTo: Infinity, tdd: 10.0 }] },
  { maxKv: Infinity, bands: [{ upTo: 25, tdd: 1.5 }, { upTo: 50, tdd: 2.5 }, { upTo: Infinity, tdd: 3.75 }] },
];

/**
 * IEEE 519 statistical assessment: multipliers on the table limit.
 * The standard assesses a full week; with 6 hours on the device the result is an early indication.
 */
export const ASSESSMENT = {
  voltage: { p95Short: 1.0, p99VeryShort: 1.5 },
  current: { p95Short: 1.0, p99Short: 1.5, p99VeryShort: 2.0 },
};

export const SETTINGS = {
  keepHours: 6,            // history kept on this device
  minGapSec: 3,            // at most one sample per 3 s (IEEE "very short time" interval)
  shortBlockMin: 10,       // IEEE "short time" interval
  minBlockFill: 0.5,       // a 10-minute block needs half its samples to count
  minBlocksForVerdict: 6,  // one hour of 10-minute blocks before any compliance verdict
  staleSec: 60,            // no live reading for this long = offline
  backlogSec: 90,          // a reading older than this is a resend from the field device
  minLoadFraction: 0.1,    // below 10 % of demand current, current distortion is not meaningful
  watchFraction: 0.8,      // at 80 % of a limit the station is on "watch"
  minEventSec: 30,         // an excursion must last this long to be logged
  eventGapSec: 30,         // gaps shorter than this do not split an excursion
  frozenMinutes: 10,       // readings unchanged this long = device may be repeating old values
  phaseSpreadRatio: 0.3,   // phases differ by over 30 % of their mean = unbalanced distortion
  minPhaseThd: 2,          // ignore phase spread below this THD
  meterTddTolerance: 2,    // meter TDD off by more than this factor = meter set-up problem
  storageWarnMinutes: 30,  // minimum minutes of data for the attribution study
  strongCorrelation: 0.6,
  weakCorrelation: 0.3,
};

/**
 * Stations with harmonic metering. Other stations that start sending THD values appear
 * automatically, using the defaults, under the group of the channel they arrive on.
 *
 *   slug           page address: /{slug}_harmonics
 *   id / line      station id and line id in the MQTT payload
 *   group          which company bilateral page shows it (mesl, fipl, taopex, ndphc, sakete)
 *   nominalKv      system voltage at the meter. null = worked out from the live voltage
 *   demandCurrentA IL: maximum demand current in amps (from the connection agreement, or the
 *                  average of the 12 monthly peak demands). null = highest 15-minute average
 *                  seen on this device. Enter the real value: it sets every TDD figure
 *   iscKA          fault level at the connection point (kA). null = strictest TDD limit used
 */
export const STATIONS = [
  { slug: 'zenith-power-132-kv-ts', id: 'oau', line: 'oau', name: 'Zenith Power 132 kV TS', short: 'Zenith Power', group: 'fipl', nominalKv: null, demandCurrentA: null, iscKA: null },
  { slug: 'gph', id: 'phedc-gph', line: 'gph', name: 'Greater Port Harcourt', short: 'GPH', group: 'mesl', nominalKv: null, demandCurrentA: null, iscKA: null },
  { slug: 'olam', id: 'phedc-olam', line: null, name: 'OLAM', short: 'OLAM', group: 'mesl', nominalKv: null, demandCurrentA: null, iscKA: null },
  { slug: 'baoyao', id: 'phedc-bao-yao', line: 'bao-yao', name: 'BAO YAO', short: 'BAO YAO', group: 'mesl', nominalKv: null, demandCurrentA: null, iscKA: null },
];

/**
 * Not yet commissioned: kept off /harmonics and the sections under the bilateral tables.
 * They still have their own pages (/{slug}_harmonics, and /oau_steel_bilaterals for Zenith Power).
 * To show a station everywhere, comment out its line here.
 */
export const UNCOMMISSIONED = [
  'zenith-power-132-kv-ts',
];
export const isCommissioned = (entry) => !UNCOMMISSIONED.includes(entry.cfg.slug);

/** Standard system voltages, used to work out nominal voltage from the live reading. */
export const SYSTEM_KV = [0.415, 11, 33, 132, 330];

export const stationBySlug = (slug) => STATIONS.find((s) => s.slug === slug) || null;

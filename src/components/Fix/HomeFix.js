/**
 * /home_fix: the /home power stations page in the modern design.
 *
 * The MW / kV / connection / total calculations are copied unchanged from components/Home.js, so
 * every number matches /home. What changed:
 *   - sign-in is checked by the server (FixPage), with a sign-out button
 *   - socket listeners are removed one by one on leaving (scopedSocket), including
 *     generator_units, which /home never removed
 *   - a malformed message is skipped instead of throwing (/home had console(e), not a function)
 *   - state is replaced, not modified in place
 *   - the meter popup (ModalFix) shows transformer and single-meter stations too
 *   - live totals, a 2-hour trend of generation and frequency, sortable/searchable tables
 */
import React from 'react';
import { Link } from 'react-router-dom';
import get_stations from '../stations_adder';
import FixPage from './FixPage';
import StationTable, { isConnected } from './StationTable';
import ModalFix from './ModalFix';
import { scopedSocket, parseMessage } from './live';
import { track } from './session';
import { TrendChart } from '../GencoPortal/charts';

const TREND_EVERY_MS = 10000;
const TREND_POINTS = 720; // 2 hours

// stations_adder adds readings with `+`: a meter that sends mw as text ("40.1") would be joined
// as text and turn the totals into NaN. Numeric text is made a number before it is stored.
function numericMw(msg) {
  const fix = (o) => {
    if (o && typeof o.mw === 'string' && o.mw.trim() !== '' && Number.isFinite(Number(o.mw))) o.mw = Number(o.mw);
  };
  fix(msg);
  ['lines', 'units', 'transformers'].forEach((k) => {
    if (Array.isArray(msg[k])) msg[k].forEach((m) => { if (m) ['td', 'gd', 'pd', 'data'].forEach((b) => fix(m[b])); });
  });
}

const TOOLS = [
  ['/history_fix', 'History', 'MW, kV, A and MVAr of any equipment over time'],
  ['/average_fix', 'Average', 'Averages per 5 min to per day, and the typical day'],
  ['/profile_fix', 'Profile', 'Exact minimum and maximum with the time they happened'],
  ['/downtime_fix', 'Downtime', 'Outages and no-data periods with durations'],
  ['/uptime_fix', 'Uptime', 'Availability and in-service periods'],
  ['/collapse_fix', 'Generation analysis', 'IoT generation sheet for up to 2 hours'],
  ['/tem_fix', 'TEM & frequency', 'Daily TEM sheet and frequency download'],
  ['/voltageprofile_fix', 'Voltage profile', 'Hourly voltage profile download'],
];

export class HomeFixView extends React.Component {
  constructor(props) {
    super(props);
    this.setModalFalse = this.setModalFalse.bind(this);
    this.setModalTrue = this.setModalTrue.bind(this);
    // Same initial state as Home.js (without the token check, now done by the server).
    this.state = {
      frequency: '',
      markudi: {}, starPipe: {}, quantum: {}, kamSteel: {}, ikorodu1: {}, ikorodu2: {}, pheonix: {}, sagamu: {},
      pulkitSteel: {}, africanFoundriesLimited: {}, sunflag: {}, topSteel: {}, monarch: {}, larfarge: {},
      afamIv_vPs: {}, afamVPs: {}, transamadiGs: {}, egbinPs: {}, kainjiTs: {}, jebbaTs: {}, okpaiGs: {}, deltaGs: {},
      omotosho2: {}, omotosho1: {}, eket: {}, phMain: {}, afamViTs: {}, alaoji: {}, sapeleNippPs: {}, omotoshoNippPs: {},
      odukpaniNippPs: {}, ekim: {}, gereguPs: {}, ikotEkpene: {}, riversIppPs: {}, omokuPs1: {}, ihovborNippPs: {},
      olorunsogo1: {}, delta2: {}, delta3: {}, parasEnergyPs: {}, olorunsogoPhase1Gs: {}, gbarain: {}, dadinKowaGs: {},
      dadinkowa: {
        id: 'dadinkowa',
        units: [{ id: 'unit1', pd: { mw: 0, a: 0, v: 0, mx: 0, f: 0, pf: 0 } },
          { id: 'unit2', pd: { mw: 0, a: 0, v: 0, mx: 0, f: 0, pf: 0 } }],
      },
      shiroroPs: {
        id: 'shiroroPs',
        units: [{ id: '411g1', pd: { mw: 0, a: 0, v: 0, mx: 0, f: 0, pf: 0 } },
          { id: '411g2', pd: { mw: 0, a: 0, v: 0, mx: 0, f: 0, pf: 0 } },
          { id: '411g3', pd: { mw: 0, a: 0, v: 0, mx: 0, f: 0, pf: 0 } },
          { id: '411g4', pd: { mw: 0, a: 0, v: 0, mx: 0, f: 0, pf: 0 } }],
      },
      kainjiPs: {
        id: 'kainjiPs',
        units: [{ id: '1g5', pd: { mw: 0, a: 0, v: 0, mx: 0, f: 0, pf: 0 } },
          { id: '1g6', pd: { mw: 0, a: 0, v: 0, mx: 0, f: 0, pf: 0 } },
          { id: '1g7', pd: { mw: 0, a: 0, v: 0, mx: 0, f: 0, pf: 0 } },
          { id: '1g9', pd: { mw: 0, a: 0, v: 0, mx: 0, f: 0, pf: 0 } },
          { id: '1g11', pd: { mw: 0, a: 0, v: 0, mx: 0, f: 0, pf: 0 } },
          { id: '1g12', pd: { mw: 0, a: 0, v: 0, mx: 0, f: 0, pf: 0 } }],
      },
      asaba: {}, lokojaTs: {}, ugwuaji: {}, gwagwalada: {}, zungeru: {}, taopex: {},
      ModalState: false,
      modal_data: 'TAOPEX',
      trend: [],
    };
  }

  componentDidMount() {
    this.live = scopedSocket();
    const onStation = (label, skip) => (data) => {
      const parsedMessage = parseMessage(data && data.message, label);
      if (!parsedMessage || typeof parsedMessage !== 'object') return;
      numericMw(parsedMessage);
      parsedMessage.server_time = (new Date()).getTime();
      const station = parsedMessage.name ? parsedMessage.name : parsedMessage.id ? parsedMessage.id : null;
      if (!station || station === skip) return;
      this.setState({ [station]: parsedMessage });
    };
    this.live.on('generator_units', onStation('generator_units', 'zungeru'));
    this.live.on('client_message_111', onStation('client_message_111'));
    this.live.on('client_message_222', onStation('client_message_222'));
    this.live.on('frequency001', (data) => {
      const parsedMessage = parseMessage(data && data.message, 'frequency001');
      if (parsedMessage === null) return;
      this.setState({ frequency: parsedMessage });
    });
    this.sampler = setInterval(() => {
      const v = this.computeView();
      const f = Number(this.state.frequency && this.state.frequency.value);
      this.setState((s) => ({
        trend: [...s.trend, { t: Date.now(), gen: v.totalGeneration, trans: v.totalTransmission, f: Number.isFinite(f) ? f : null }].slice(-TREND_POINTS),
      }));
    }, TREND_EVERY_MS);
  }

  componentWillUnmount() {
    if (this.live) this.live.offAll();
    clearInterval(this.sampler);
  }

  // ---- connection checks: copied from Home.js ----------------------------------------------
  checkConnection2(server_time) {
    const connected = <span className="text-success"> CN </span>;
    const disconnected = <span className="text-danger"> NC </span>;
    if (server_time === undefined || server_time === null) return disconnected;
    try {
      const time_now = (new Date()).getTime();
      const time_diff = (time_now - server_time) > 30000;
      if (server_time.length === 0 || time_diff) return disconnected;
      else if (!isNaN(server_time)) return connected;
    } catch (e) {
      console.error(e);
      return disconnected;
    }
    return undefined;
  }

  checkConnection3(t1, t2) {
    const connected = <span className="text-success"> CN </span>;
    const disconnected = <span className="text-danger"> NC </span>;
    if ((t1 === undefined || t1 === null) && (t2 === undefined || t2 === null)) return disconnected;
    try {
      t1 = t1 ? t1 : '';
      t2 = t2 ? t2 : '';
      const time_now = (new Date()).getTime();
      const time_diff_1 = (time_now - t1) > 30000;
      const time_diff_2 = (time_now - t2) > 30000;
      if (time_diff_1 || time_diff_2) return disconnected;
      else if (!isNaN(t1) && !isNaN(t2)) return connected;
    } catch (e) {
      console.error(e);
      return disconnected;
    }
    return undefined;
  }

  checkConnection3_b(t1, t2) {
    const connected = <span className="text-success"> CN </span>;
    const disconnected = <span className="text-danger"> NC </span>;
    if ((t1 === undefined || t1 === null) && (t2 === undefined || t2 === null)) return disconnected;
    try {
      t1 = t1 ? t1 : '';
      t2 = t2 ? t2 : '';
      const time_now = (new Date()).getTime();
      const time_diff_1 = (time_now - t1) > 30000;
      const time_diff_2 = (time_now - t2) > 30000;
      if (time_diff_1 && time_diff_2) return disconnected;
      else if (!isNaN(t1) || !isNaN(t2)) return connected;
    } catch (e) {
      console.error(e);
      return disconnected;
    }
    return undefined;
  }

  checkConnection4_delta(t1, t2, t3) {
    const connected = <span className="text-success"> CN </span>;
    const disconnected = <span className="text-danger"> NC </span>;
    if ((t1 === undefined || t1 === null) && (t2 === undefined || t2 === null) && (t3 === undefined || t3 === null)) return disconnected;
    try {
      t1 = t1 ? t1 : '';
      t2 = t2 ? t2 : '';
      t3 = t3 ? t3 : '';
      const time_now = (new Date()).getTime();
      const time_diff_1 = (time_now - t1) > 30000;
      const time_diff_3 = (time_now - t3) > 30000;
      if (time_diff_1 && time_diff_3) return disconnected;
      else if (!isNaN(t1) || !isNaN(t3)) return connected;
    } catch (e) {
      console.error(e);
      return disconnected;
    }
    return undefined;
  }

  setModalTrue(modal) {
    track('view_detail', { station: modal[0] });
    this.setState({ ModalState: true, modal_data: modal });
  }

  setModalFalse() {
    this.setState({ ModalState: false });
  }

  // ---- figures: copied from Home.js render() -------------------------------------------------
  computeView() {
    const s = this.state;
    const stations_array = get_stations(s);
    const olorunsogonipp_gs = stations_array['OLORUNSOGO NIPP'];
    const markudi_ts = stations_array['MARKUDI TS'];
    const zungeru_gs = stations_array['ZUNGERU'];
    const taopex_gs = stations_array['TAOPEX'];
    const ihovbor_gs = stations_array['IHOVBOR NIPP (GAS)'];
    const omoku_gs = stations_array['OMOKU (GAS)'];
    const riversipp_gs = stations_array['RIVERS IPP (GAS)'];
    const geregugas_gs = stations_array['GEREGU (GAS)'];
    const omotosogas_gs = stations_array['OMOTOSHO (GAS)'];
    const odukpani_gs = stations_array['ODUKPANI NIPP (GAS)'];
    const sapelenipp_gs = stations_array['SAPELE NIPP (GAS)'];
    const sapelesteam_gs = stations_array['SAPELE (STEAM)'];
    const alaoji_gs = stations_array['ALAOJI NIPP (GAS)'];
    const afam6_gs = stations_array['AFAM VI (GAS/STEAM)'];
    const jebba_gs = stations_array['JEBBA (HYDRO)'];
    const delta_gs = stations_array['DELTA (GAS)'];
    const okpai_gs = stations_array['OKPAI (GAS/STEAM)'];
    const egbin_gs = stations_array['EGBIN (STEAM)'];
    const afam4_gs = stations_array['AFAM IV & V (GAS)'];
    const paras_gs = stations_array['PARAS ENERGY (GAS)'];
    const omotosonipp_gs = stations_array['OMOTOSHO NIPP (GAS)'];
    const geregunipp_gs = stations_array['GEREGU NIPP (GAS)'];
    const azura_gs = stations_array['AZURA-EDO IPP (GAS)'];
    const ibom_gs = stations_array['IBOM POWER (GAS)'];
    const gbarain_gs = stations_array['GBARAIN NIPP (GAS)'];
    const olorunsogogas_gs = stations_array['OLORUNSOGO (GAS)'];
    const dadinkowa_gs = {
      mw: (Number(s.dadinkowa.units[0].pd.mw) + Number(s.dadinkowa.units[1].pd.mw)).toFixed(2),
      kv: (s.dadinkowa.units[0].pd.v || s.dadinkowa.units[1].pd.v),
    };
    const shiroro_gs = {
      mw: (Number(s.shiroroPs.units[0]?.pd?.mw) + Number(s.shiroroPs.units[1]?.pd?.mw)
        + Number(s.shiroroPs.units[2]?.pd?.mw) + Number(s.shiroroPs.units[3]?.pd?.mw)).toFixed(2),
      kv: (s.shiroroPs.units[1]?.pd?.v || s.shiroroPs.units[2]?.pd?.v || s.shiroroPs.units[0]?.pd?.v || s.shiroroPs.units[1]?.pd?.v),
    };
    const { kainjiPs } = s;
    const kainji_gs = {
      mw: (Number(kainjiPs.units[0].pd.mw) + Number(kainjiPs.units[1].pd.mw) + Number(kainjiPs.units[2].pd.mw) + Number(kainjiPs.units[3].pd.mw) + Number(kainjiPs.units[4].pd.mw) + Number(kainjiPs.units[5].pd.mw)).toFixed(2),
      kv: kainjiPs.units[0].pd.v || kainjiPs.units[1].pd.v || kainjiPs.units[2].pd.v || kainjiPs.units[3].pd.v || kainjiPs.units[4].pd.v || kainjiPs.units[5].pd.v,
    };
    const asaba_ts = stations_array['ASABA'];
    const ugwuaji_ts = stations_array['UGWUAJI'];
    const gwagwalada_ts = stations_array['GWAGWALADA'];
    const ikotekpene_ts = stations_array['IKOT EKPENE'];
    const ekim_ts = stations_array['EKIM'];
    const phMain_ts = stations_array['PORT-HARCOURT MAIN'];
    const lokoja_ts = stations_array['LOKOJA TS'];
    const eket_ts = stations_array['EKET'];

    const pos = (v) => (Number(v) < 0 ? 0 : Number(v));
    const totalGeneration = pos(riversipp_gs.mw) + pos(afam6_gs.mw) + pos(paras_gs.mw) + pos(geregugas_gs.mw) + pos(zungeru_gs.mw)
      + pos(geregunipp_gs.mw) + pos(omotosogas_gs.mw) + pos(omotosonipp_gs.mw) + pos(sapelenipp_gs.mw) + pos(sapelesteam_gs.mw)
      + pos(omoku_gs.mw) + pos(odukpani_gs.mw) + pos(alaoji_gs.mw) + pos(azura_gs.mw) + pos(olorunsogonipp_gs.mw) + pos(ihovbor_gs.mw)
      + pos(phMain_ts.mw) + pos(ibom_gs.mw) + pos(olorunsogogas_gs.mw) + pos(gbarain_gs.mw) + pos(shiroro_gs.mw) + pos(afam4_gs.mw)
      + pos(kainji_gs.mw) + pos(egbin_gs.mw) + pos(okpai_gs.mw) + pos(delta_gs.mw) + pos(jebba_gs.mw) + pos(dadinkowa_gs.mw) + pos(taopex_gs.mw);
    const totalTransmission = pos(ugwuaji_ts.mw) + pos(asaba_ts.mw) + pos(ekim_ts.mw) + pos(gwagwalada_ts.mw) + pos(lokoja_ts.mw)
      + pos(phMain_ts.mw) + pos(ikotekpene_ts.mw) + pos(markudi_ts.mw) + pos(eket_ts.mw);

    const t = (...ps) => Math.max(0, ...ps.map((p) => (p && p.server_time) || 0)) || null;
    const c2 = (p) => this.checkConnection2(p.server_time);
    const row = (sn, label, status, v, modal, updatedAt) => ({ sn, label, status, mw: v.mw, kv: v.kv, modal: [label, ...modal], updatedAt });
    const generation = [
      row(1, 'RIVERS IPP (GAS)', c2(s.riversIppPs), riversipp_gs, [s.riversIppPs], t(s.riversIppPs)),
      row(2, 'AFAM VI (GAS/STEAM)', c2(s.afamViTs), afam6_gs, [s.afamViTs], t(s.afamViTs)),
      row(3, 'GEREGU (GAS)', c2(s.gereguPs), geregugas_gs, [s.gereguPs], t(s.gereguPs)),
      row(4, 'OMOTOSHO (GAS)', this.checkConnection3(s.omotosho2.server_time, s.omotosho1.server_time), omotosogas_gs, [s.omotosho2, s.omotosho1], t(s.omotosho2, s.omotosho1)),
      row(5, 'OMOTOSHO NIPP (GAS)', c2(s.omotoshoNippPs), omotosonipp_gs, [s.omotoshoNippPs], t(s.omotoshoNippPs)),
      row(6, 'DELTA (GAS)', this.checkConnection4_delta(s.delta3.server_time, s.deltaGs.server_time, s.delta2.server_time), delta_gs, [s.delta3, s.deltaGs, s.delta2], t(s.delta3, s.deltaGs, s.delta2)),
      row(7, 'SAPELE NIPP (GAS)', c2(s.sapeleNippPs), sapelenipp_gs, [s.sapeleNippPs], t(s.sapeleNippPs)),
      row(8, 'OMOKU (GAS)', c2(s.omokuPs1), omoku_gs, [s.omokuPs1], t(s.omokuPs1)),
      row(9, 'AZURA-EDO IPP (GAS)', c2(s.ihovborNippPs), azura_gs, [s.ihovborNippPs], t(s.ihovborNippPs)),
      row(10, 'TRANS-AMADI (GAS)', c2(s.phMain), phMain_ts, [s.phMain], t(s.phMain)),
      row(11, 'GEREGU NIPP (GAS)', c2(s.gereguPs), { mw: Number(geregunipp_gs.mw) < 0 ? 0 : Number(geregunipp_gs.mw), kv: geregunipp_gs.kv }, [s.gereguPs], t(s.gereguPs)),
      // /home always shows GBARAIN as connected
      row(12, 'GBARAIN NIPP (GAS)', <span className="text-success"> CN </span>, gbarain_gs, [s.gbarain], t(s.gbarain)),
      row(13, 'DADINKOWA G.S (HYDRO)', c2(s.dadinkowa), dadinkowa_gs, [s.dadinKowaGs, s.dadinkowa], t(s.dadinkowa, s.dadinKowaGs)),
      row(14, 'PARAS ENERGY (GAS)', c2(s.parasEnergyPs), paras_gs, [s.parasEnergyPs], t(s.parasEnergyPs)),
      row(15, 'IBOM POWER (GAS)', c2(s.eket), ibom_gs, [s.eket, s.ekim], t(s.eket, s.ekim)),
      row(16, 'JEBBA (HYDRO)', c2(s.jebbaTs), jebba_gs, [s.jebbaTs], t(s.jebbaTs)),
      row(17, 'OLORUNSOGO (GAS)', this.checkConnection3(s.olorunsogo1.server_time, s.olorunsogoPhase1Gs.server_time), olorunsogogas_gs, [s.olorunsogo1, s.olorunsogoPhase1Gs], t(s.olorunsogo1, s.olorunsogoPhase1Gs)),
      row(18, 'OLORUNSOGO NIPP', this.checkConnection3(s.olorunsogo1.server_time, s.olorunsogoPhase1Gs.server_time), { mw: Number(olorunsogonipp_gs.mw) <= -3 ? 0 : Number(olorunsogonipp_gs.mw), kv: olorunsogonipp_gs.kv }, [s.olorunsogo1, s.olorunsogoPhase1Gs], t(s.olorunsogo1, s.olorunsogoPhase1Gs)),
      row(19, 'SAPELE (STEAM)', c2(s.sapeleNippPs), sapelesteam_gs, [s.sapeleNippPs], t(s.sapeleNippPs)),
      row(20, 'ODUKPANI NIPP (GAS)', c2(s.odukpaniNippPs), odukpani_gs, [s.odukpaniNippPs], t(s.odukpaniNippPs)),
      row(21, 'ALAOJI NIPP (GAS)', c2(s.alaoji), alaoji_gs, [s.alaoji], t(s.alaoji)),
      row(22, 'IHOVBOR NIPP (GAS)', c2(s.ihovborNippPs), ihovbor_gs, [s.ihovborNippPs], t(s.ihovborNippPs)),
      row(23, 'SHIRORO (HYDRO)', c2(s.shiroroPs), shiroro_gs, [s.shiroroPs], t(s.shiroroPs)),
      row(24, 'AFAM IV & V (GAS)', this.checkConnection3_b(s.afamVPs.server_time, s.afamIv_vPs.server_time), afam4_gs, [s.afamVPs, s.afamIv_vPs], t(s.afamVPs, s.afamIv_vPs)),
      row(25, 'KAINJI (HYDRO)', c2(s.kainjiPs), kainji_gs, [s.kainjiPs], t(s.kainjiPs)),
      row(26, 'EGBIN (STEAM)', c2(s.egbinPs), egbin_gs, [s.egbinPs], t(s.egbinPs)),
      row(27, 'OKPAI (GAS/STEAM)', c2(s.okpaiGs), okpai_gs, [s.okpaiGs], t(s.okpaiGs)),
      row(28, 'ZUNGERU G.S', c2(s.zungeru), zungeru_gs, [s.zungeru], t(s.zungeru)),
      row(29, 'TAOPEX G.S', c2(s.taopex), taopex_gs, [s.taopex], t(s.taopex)),
    ];
    const transmission = [
      row(101, 'IKOT EKPENE TS', c2(s.ikotEkpene), ikotekpene_ts, [s.ikotEkpene], t(s.ikotEkpene)),
      row(102, 'GWAGWALADA TS', c2(s.gwagwalada), gwagwalada_ts, [s.gwagwalada], t(s.gwagwalada)),
      row(103, 'LOKOJA TS', c2(s.lokojaTs), lokoja_ts, [s.lokojaTs], t(s.lokojaTs)),
      row(104, 'ASABA TS', c2(s.asaba), asaba_ts, [s.asaba], t(s.asaba)),
      row(105, 'UGWUAJI TS', c2(s.ugwuaji), ugwuaji_ts, [s.ugwuaji], t(s.ugwuaji)),
      row(106, 'MARKUDI TS', c2(s.markudi), markudi_ts, [s.markudi], t(s.markudi)),
      row(107, 'EKIM TS', c2(s.ekim), ekim_ts, [s.ekim], t(s.ekim)),
      row(108, 'PORTHARCOURT MAIN TS', c2(s.phMain), phMain_ts, [s.phMain], t(s.phMain)),
      row(109, 'EKET TS', c2(s.eket), eket_ts, [s.eket], t(s.eket)),
    ];
    return { generation, transmission, totalGeneration, totalTransmission };
  }

  render() {
    const { generation, transmission, totalGeneration, totalTransmission } = this.computeView();
    const freq = this.state.frequency && this.state.frequency.value ? this.state.frequency.value : null;
    const genOn = generation.filter((r) => isConnected(r.status)).length;
    const trOn = transmission.filter((r) => isConnected(r.status)).length;
    const top = generation.filter((r) => isConnected(r.status)).map((r) => ({ label: r.label, mw: Number(r.mw) })).filter((r) => Number.isFinite(r.mw)).sort((a, b) => b.mw - a.mw)[0];
    const trend = this.state.trend;
    const freqPoints = trend.filter((p) => p.f !== null).length;
    return (
      <main className="gx-main">
        <div className="fx-tiles">
          <div className="fx-tile hero"><span>Total IoT generation</span><b>{totalGeneration.toFixed(2)}<small>MW</small></b><em>{genOn} of {generation.length} stations connected</em></div>
          <div className="fx-tile hero"><span>Transmission stations</span><b>{totalTransmission.toFixed(2)}<small>MW</small></b><em>{trOn} of {transmission.length} connected</em></div>
          <div className="fx-tile"><span>Frequency</span><b>{freq !== null ? freq : '—'}<small>Hz</small></b><em>Grid frequency, live</em></div>
          <div className="fx-tile"><span>Highest generation</span><b>{top ? top.mw.toFixed(2) : '—'}<small>MW</small></b><em>{top ? top.label : 'No station connected'}</em></div>
        </div>

        <div className="gx-grid-2">
          <section className="gx-panel">
            <header><h2>Total IoT generation</h2><span>Last 2 hours, sampled every 10 s since this page opened</span></header>
            {/* key: remounted once drawn, so the chart measures its drawn box (see FixCharts useWidth) */}
            <TrendChart key={trend.length > 1 ? 'drawn' : 'empty'} series={[{ key: 'gen', label: 'Total generation', color: '#3987e5', points: trend.map((p) => ({ t: p.t, v: p.gen })) }]} unit="MW" digits={2} height={240}
              emptyText="The trend starts 20 seconds after the page opens." />
          </section>
          <section className="gx-panel">
            <header><h2>Frequency</h2><span>Same period</span></header>
            <TrendChart key={freqPoints > 1 ? 'drawn' : 'empty'} series={[{ key: 'f', label: 'Frequency', color: '#3987e5', points: trend.filter((p) => p.f !== null).map((p) => ({ t: p.t, v: p.f })) }]} unit="Hz" digits={2} height={240}
              refLines={[{ v: 50, label: '50 Hz' }]} emptyText="Waiting for frequency readings." />
          </section>
        </div>

        <StationTable title="IoT power stations" rows={generation} total={totalGeneration} totalLabel="Total generation" onRowClick={this.setModalTrue}
          note="Totals and connection rules are the same as /home. Negative MW is counted as 0 in the total." />
        <StationTable title="IoT transmission stations" rows={transmission} total={totalTransmission} totalLabel="Total transmission" onRowClick={this.setModalTrue} />

        <section className="gx-panel">
          <header><h2>Tools</h2><span>Reports and analysis</span></header>
          <div className="fx-cards">
            {TOOLS.map(([to, label, text]) => <Link key={to} to={to} className="fx-card"><b>{label}</b><span>{text}</span></Link>)}
          </div>
        </section>
        {this.state.ModalState && <ModalFix setModalFalse={this.setModalFalse} modalData={this.state.modal_data} />}
      </main>
    );
  }
}

export default function HomeFix() {
  return (
    <FixPage title="IoT power stations" eyebrow="NCC live" live>
      {() => <HomeFixView />}
    </FixPage>
  );
}

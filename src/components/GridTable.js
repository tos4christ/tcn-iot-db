// GridTable.js
import React, { Component } from 'react';
import { withRouter, Redirect } from 'react-router-dom';
import socket from './utility/socketIO';
import get_stations from "./stations_adder";
// import socket from "./utility/socketIO";
// import '../styles/GridTable.css';
import '../styles/general.css'

class GridTable extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      stations: [],
      currentTime: new Date(),
      activeInstruction: null,
      frequency: "",
      markudi: {},
      starPipe: {},
      quantum: {},
      kamSteel: {},
      ikorodu1: {},
      ikorodu2: {},
      phoenix: {},
      sagamu: {},
      pulkitSteel: {},
      africanFoundriesLimited: {},
      sunflag: {},
      topSteel: {},
      monarch: {},
      larfarge: {},
      afamIv_vPs: {},
      shiroroPs: {},
      egbinPs: {},
      kainjiTs: {},
      jebbaTs: {},
      okpaiGs: {},
      deltaGs: {},
      omotosho2: {},
      omotosho1: {},
      eket: {},
      phMain: {},
      afamViTs: {},
      alaoji: {},
      sapeleNippPs: {},
      omotoshoNippPs: {},
      odukpaniGs: {},
      odukpaniNippPs: {},
      ekim: {},
      gereguPs: {},
      ikotEkpene: {},
      riversIppPs: {},
      omokuPs1: {},
      ihovborNippPs: {},
      olorunsogo1: {},
      delta2: {},
      delta3: {},
      parasEnergyPs: {},
      olorunsogoPhase1Gs: {},
      gbarain: {},
      dadinKowaGs: {},
      asaba: {},
      lokojaTs: {},
      ugwuaji: {},
      gwagwalada: {},
      zungeru: {},
      taopex: {},
      afamVPs: {},
     };
  }

  componentDidMount() {
    console.log(this.props.location.pathname, 'pathname');
    if(this.props.history.location.pathname === "/api/gridtable" ) {
        socket.on("client_message_111", data => {
            const { message } = data;
            let parsedMessage = {};
            try {
            parsedMessage = JSON.parse(message);
            } catch(e) {} 
            parsedMessage.server_time = (new Date()).getTime();
            const station = parsedMessage.name ? parsedMessage.name : parsedMessage.id ? parsedMessage.id : null;
            const returnObject = {}
            // console.log(parsedMessage, 'c1 message');
            this.setState(prevState => {
            prevState[station] = parsedMessage;
            returnObject[station] = prevState[station]
            return returnObject;
            })
        });
        socket.on("client_message_222", data => {
            const { message } = data;
            let parsedMessage = {};
            try {
            parsedMessage = JSON.parse(message);
            } catch(e) {} 
            parsedMessage.server_time = (new Date()).getTime();
            const station = parsedMessage.name ? parsedMessage.name : parsedMessage.id ? parsedMessage.id : null;
            const returnObject = {}
            // console.log(parsedMessage, 'c2 message');
            this.setState(prevState => {
            prevState[station] = parsedMessage;
            returnObject[station] = prevState[station]
            return returnObject;
            })
        });
        socket.on("frequency001", data => {
            const { message } = data;
            let parsedMessage;
            try {
            parsedMessage = JSON.parse(message);
            } catch(e) { console(e) }        
            const returnObject = {}
            this.setState(prevState => {
            prevState["frequency"] = parsedMessage;
            returnObject["frequency"] = prevState["frequency"];
            return returnObject;
            })
        });
        // Setup socket listeners
        socket.on('initial_data', (data) => {
        this.setState({ stations: data });
        });
        socket.on('station_update', (stations) => {
        this.setState({ stations });
        });
        socket.on('timer_update', (stations) => {
        this.setState({ stations });
        });
        // Update current time every second
        this.timeInterval = setInterval(() => {
        this.setState({ currentTime: new Date() });
        }, 1000);
    } 
  }

  componentWillUnmount() {
    clearInterval(this.timeInterval);
    socket.disconnect();
  }

  render() {
    let { stations, currentTime } = this.state;
    stations = stations.sort((a, b) => b.currentTimer.localeCompare(a.currentTimer));
    const stations_array = get_stations(this.state);
    const stations_array_data = {
     olorunsogonipp_gs : stations_array['OLORUNSOGO NIPP'],
     ihovbor_gs : stations_array['IHOVBOR NIPP (GAS)'],
     omoku_gs : stations_array['OMOKU (GAS)'],
     riversipp_gs : stations_array['RIVERS IPP (GAS)'],
     geregugas_gs : stations_array['GEREGU (GAS)'],
     omotosogas_gs : stations_array['OMOTOSHO (GAS)'],
     odukpani_gs : stations_array['ODUKPANI NIPP (GAS)'],
     sapelenipp_gs : stations_array['SAPELE NIPP (GAS)'],
     sapelesteam_gs : stations_array['SAPELE (STEAM)'],
     alaoji_gs : stations_array['ALAOJI NIPP (GAS)'],
     afam6_gs : stations_array['AFAM VI (GAS/STEAM)'],
     jebba_gs : stations_array['JEBBA (HYDRO)'],
     delta_gs : stations_array['DELTA (GAS)'],
     okpai_gs : stations_array['OKPAI (GAS/STEAM)'],
     egbin_gs : stations_array['EGBIN (STEAM)'],
     kainji_gs : stations_array['KAINJI (HYDRO)'],
     afam4_gs : stations_array['AFAM IV & V (GAS)'],
     shiroro_gs : stations_array['SHIRORO (HYDRO)'],
     paras_gs : stations_array['PARAS ENERGY (GAS)'],
     omotosonipp_gs : stations_array['OMOTOSHO NIPP (GAS)'],
     geregunipp_gs : stations_array['GEREGU NIPP (GAS)'],
     azura_gs : stations_array['AZURA-EDO IPP (GAS)'],
     phMain_ts : stations_array['PORT-HARCOURT MAIN'],
     transamadi_gs : stations_array['PORT-HARCOURT MAIN'],
     ibom_gs : stations_array['IBOM POWER (GAS)'],
     gbarain_gs : stations_array['GBARAIN NIPP (GAS)'],
     olorunsogogas_gs : stations_array['OLORUNSOGO (GAS)'],
     dadinkowa_gs : stations_array['DADINKOWA G.S (HYDRO)'],
     zungeru_gs : stations_array['ZUNGERU'],
     taopex_gs : stations_array['TAOPEX'],
    }

    const totalGeneration = (Number(stations_array_data.riversipp_gs.mw) < 0 ? 0 : Number(stations_array_data.riversipp_gs.mw))+
    (Number(stations_array_data.afam6_gs.mw) < 0 ? 0 : Number(stations_array_data.afam6_gs.mw))+ 
    (Number(stations_array_data.paras_gs.mw) < 0 ? 0 : Number(stations_array_data.paras_gs.mw))+ 
    (Number(stations_array_data.geregugas_gs.mw) < 0 ? 0 : Number(stations_array_data.geregugas_gs.mw))+ 
    (Number(stations_array_data.geregunipp_gs.mw) < 0 ? 0 : Number(stations_array_data.geregunipp_gs.mw))+ 
    (Number(stations_array_data.omotosogas_gs.mw) < 0 ? 0 : Number(stations_array_data.omotosogas_gs.mw))+ 
    (Number(stations_array_data.omotosonipp_gs.mw) < 0 ? 0 : Number(stations_array_data.omotosonipp_gs.mw))+ 
    (Number(stations_array_data.sapelenipp_gs.mw) < 0 ? 0 : Number(stations_array_data.sapelenipp_gs.mw))+ 
    (Number(stations_array_data.sapelesteam_gs.mw) < 0 ? 0 : Number(stations_array_data.sapelesteam_gs.mw))+
    (Number(stations_array_data.omoku_gs.mw) < 0 ? 0 : Number(stations_array_data.omoku_gs.mw))+ 
    (Number(stations_array_data.odukpani_gs.mw) < 0 ? 0 : Number(stations_array_data.odukpani_gs.mw))+ 
    (Number(stations_array_data.alaoji_gs.mw) < 0 ? 0 : Number(stations_array_data.alaoji_gs.mw))+ 
    (Number(stations_array_data.azura_gs.mw) < 0 ? 0 : Number(stations_array_data.azura_gs.mw))+ 
    (Number(stations_array_data.zungeru_gs.mw) < 0 ? 0 : Number(stations_array_data.zungeru_gs.mw))+ 
    (Number(stations_array_data.taopex_gs.mw) < 0 ? 0 : Number(stations_array_data.taopex_gs.mw))+
    (Number(stations_array_data.olorunsogonipp_gs.mw) < 0 ? 0 : Number(stations_array_data.olorunsogonipp_gs.mw)) + 
    (Number(stations_array_data.ihovbor_gs.mw) < 0 ? 0 : Number(stations_array_data.ihovbor_gs.mw))+ 
    (Number(stations_array_data.phMain_ts.mw) < 0 ? 0 : Number(stations_array_data.phMain_ts.mw))+
    (Number(stations_array_data.ibom_gs.mw) < 0 ? 0 : Number(stations_array_data.ibom_gs.mw))+ 
    (Number(stations_array_data.olorunsogogas_gs.mw) < 0 ? 0 : Number(stations_array_data.olorunsogogas_gs.mw))+ 
    (Number(stations_array_data.gbarain_gs.mw) < 0 ? 0 : Number(stations_array_data.gbarain_gs.mw))+ 
    (Number(stations_array_data.shiroro_gs.mw) < 0 ? 0 : Number(stations_array_data.shiroro_gs.mw))+ 
    (Number(stations_array_data.afam4_gs.mw) < 0 ? 0 : Number(stations_array_data.afam4_gs.mw))+ 
    (Number(stations_array_data.kainji_gs.mw) < 0 ? 0 : Number(stations_array_data.kainji_gs.mw))+ 
    (Number(stations_array_data.egbin_gs.mw) < 0 ? 0 : Number(stations_array_data.egbin_gs.mw))+ 
    (Number(stations_array_data.okpai_gs.mw) < 0 ? 0 : Number(stations_array_data.okpai_gs.mw))+ 
    (Number(stations_array_data.delta_gs.mw) < 0 ? 0 : Number(stations_array_data.delta_gs.mw))+ 
    (Number(stations_array_data.jebba_gs.mw) < 0 ? 0 : Number(stations_array_data.jebba_gs.mw))+ 
    (Number(stations_array_data.dadinkowa_gs.mw) < 0 ? 0 : Number(stations_array_data.dadinkowa_gs.mw));

    return (
      <div className="card grid-card">
        <div className="grid-header">
          <h1 className="grid-title">POWER GRID MONITORING SYSTEM</h1>
          <div className="info-bar">
            <div className="system-time">
              <i className="fas fa-clock"></i>  System Time: {currentTime.toLocaleTimeString()}
            </div>
            <div className="station-count">
              <i className="fas fa-bolt"></i> Active Stations: {stations.filter(s => s.status === 'Online').length}/{stations.length}
            </div>
          </div>
        </div>
        <div className="grid-content">
            <div className="table-container">
                <table className="grid-table">
                    <thead>
                    <tr>
                        <th className="col-sn">S/N</th>
                        <th className="col-station">STATIONS</th>
                        <th className="col-status">STATUS</th>
                        <th className="col-power">POWER (MW)</th>
                        <th className="col-voltage">VOLTAGE (KV)</th>
                        <th className="col-declaration">DECLARATION</th>
                        <th className="col-reserve">RESERVE (%)</th>
                        <th className="col-time">TIME SINCE INSTRUCTION</th>
                    </tr>
                    </thead>
                    <tbody>
                    {stations.map(station => {
                        // if(station.lastInstructionTime) {
                        //     const lastInstructionTime = new Date(station.lastInstructionTime);
                        //     const currentTime = new Date();
                        //     const timeDiff = currentTime - lastInstructionTime; // in milliseconds
                        //     const seconds = Math.floor((timeDiff / 1000) % 60);
                        //     const minutes = Math.floor((timeDiff / (1000 * 60)) % 60);
                        //     const hours = Math.floor((timeDiff / (1000 * 60 * 60)) % 24);
                        //     station.currentTimer = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
                        //     console.log(station.currentTimer, 'station currentTimer');
                        // } 
                        
                        return (
                        <tr key={station.id} className={station.status === 'Offline' ? 'offline' : ''}>
                        <td className="col-sn">{station.id}</td>
                        <td className="col-station">{station.name}</td>
                        <td className='col-status'>
                            <span className={`status-indicator ${station.status.toLowerCase()}`}>
                            {station.status}
                            </span>
                        </td>
                        <td className="col-power">{stations_array_data[station.alias].mw}</td>
                        <td className="col-voltage">{stations_array_data[station.alias].kv}</td>
                        <td className={`declaration-${station.declaration} col-declaration`}>
                            {station.declaration}
                        </td>
                        <td className='col-reserve'>
                            <div className="reserve-bar-container">
                            <div 
                                className="reserve-bar " 
                                style={{ width: `${station.reserve}%` }}
                            ></div>
                            <span className="reserve-text">{(station.reserve)}%</span>
                            </div>
                        </td>
                        <td className="time-cell col-time">
                            {station.lastInstructionTime ? station.currentTimer : '--:--:--'}
                        </td>
                        </tr>
                    )})}
                    </tbody>
                </table>
            </div>
            
            <div className="grid-footer">
                <div className="status-legend">
                    <div className="legend-item">
                    <span className="legend-indicator online-indicator"></span> Online
                    </div>
                    <div className="legend-item">
                    <span className="legend-indicator offline-indicator"></span> Offline
                    </div>
                    <div className="legend-item">
                    <span className="legend-indicator updated-indicator"></span> Updated in last 5 min
                    </div>
                </div>
                <div className="last-update">
                    Last Full Update: {currentTime.toLocaleString()}
                </div>
            </div>
        </div>
      </div>
    );
  }
}

export default withRouter(GridTable);
/**
 * MESL_PageFix: copy of components/MESL_Page.js for its *_fix route, with the bug fixes applied.
 * The original page is unchanged. Generated changes:
 *   - socket listeners: added and removed through scopedSocket, so leaving this page removes only
 *     its own listeners (socket.off("event") removed every page's listener for that event)
 *   - console(e) -> console.error(e) (console is not a function; the old line threw a second error),
 *     and a malformed or empty message is skipped, keeping the last good reading
 *   - the live-data check uses this page's *_fix path (the page only listens on its own path)
 *   - setState no longer modifies the current state in place
 *   - meter detail uses ModalFix (reads lines, units, transformers and single-meter payloads)
 *   - sign-in is checked by the server session on the route, not by the localStorage token
 *   - debugging console.log statements are commented out
 */
import React from "react";
import { withRouter, Redirect } from 'react-router-dom';
import { scopedSocket } from "../live";
import Modal from "../ModalFix";
import { BilateralTable, HarmonicsSection } from '../../BilateralHarmonics';

 class MESL_Page extends React.Component {
   constructor(props) {
     super(props);
    this.live = scopedSocket(); // removes only this page's listeners (fix 5)
     this.setModalFalse = this.setModalFalse.bind(this);
     this.setModalTrue = this.setModalTrue.bind(this);
     this.state = { 
      frequency: "",      
      connected: false,
      ModalState: false,
      modal_data: "",
      zeberced: {},
      Niamey: {},
      Inner_Galaxy2: {},
      Inner_Galaxy1: {},
      PSML: {},
      ATVL: {},
      Gazaoua: {},
      kam: {},
      KamInd33kV: {},
      quantum: {},
      HYDROPOLIS: {},
      yongxing: {},
      amil: {},
      AENL: {},
      glml: {},
      phedc: {},
     };
   }
   componentDidMount() {
    if(this.props.history.location.pathname === "/mesl_bilaterals_fix") {
      this.live.on("client_message_mesl", data => {
        const { message } = data;
        let parsedMessage = {};
        try {
          parsedMessage = JSON.parse(message);
        } catch(e) {} 
        parsedMessage.server_time = (new Date()).getTime();
        const station = parsedMessage.name ? parsedMessage.name : parsedMessage.id ? parsedMessage.id : null;
        // console.log(parsedMessage, 'c1 message');
        this.setState({ [station]: parsedMessage })
      });
      this.live.on("frequency001", data => {
        const { message } = data;
        let parsedMessage;
        try {
          parsedMessage = JSON.parse(message);
        } catch(e) { console.error(e) }
        if (parsedMessage === undefined || parsedMessage === null) return; // keep the last good reading
        this.setState({ frequency: parsedMessage })
      });
    }
   }
    componentWillUnmount() {
    this.live.offAll();
    this.live.off("client_message_mesl");
    this.live.off("frequency001");
    }
   getEpoch(time) {
    if(!time || time === undefined || time === null) {
      return 0;
    }
    // Convert the time input to epoch time
    var options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    const date = new Date().toLocaleDateString("en-GB", options).split('/').reverse().join('-');
    const timeTemp = time.split(':');
    const hour = timeTemp[0];
    const minute = timeTemp[1]
    const seconds = timeTemp[2]
    const dateTemp = date.split('-');
    return new Date(Number(dateTemp[0]), Number(dateTemp[1]-1), Number(dateTemp[2]), Number(hour), Number(minute), Number(seconds)); 
   }
   checkConnection2(server_time) {
    const connected = <span className="text-success"> CN </span>
    const disconnected = <span className="text-danger"> NC </span>
    if (server_time === undefined || server_time === null) {
      return disconnected
    }
    try {
      // Get current epoch time
      const time_now = (new Date()).getTime();     
      // if 30 seconds have passed without the time changing from the current time then return disconnected
      // 30 seconds equals to 30,000 milliseconds
      // if the time difference is greater than time_diff then return disconnected
      const time_diff = (time_now - server_time) > 30000;
      if (server_time.length === 0 || time_diff ) {
          return disconnected
      } else if (!isNaN(server_time)) {
          return connected
      }
    } catch(e) {
      // console.log(e);
      return disconnected;
    }
   }
   checkConnection3(t1, t2) {
    const connected = <span className="text-success"> CN </span>
    const disconnected = <span className="text-danger"> NC </span>
    if ((t1 === undefined || t1 === null) && (t2 === undefined || t2 === null)) {
      return disconnected
    }
    try {
      t1 = t1 ? t1 : '';
      t2 = t2 ? t2 : '';
      // Get current epoch time
      const time_now = (new Date()).getTime();
      // if 30 seconds have passed without the time changing from the current time then return disconnected
      // 30 seconds equals to 30,000 milliseconds
      // if the time difference is greater than time_diff then return disconnected
      const time_diff_1 = (time_now - t1) > 30000;
      const time_diff_2 = (time_now - t2) > 30000;
      if ( time_diff_1 || time_diff_2 ) {
        return disconnected
      } else if (!isNaN(t1) && !isNaN(t2)) {
          return connected
      } 
    } catch(e) {
      // console.log(e);
      return disconnected;
    }    
   }
   onClickDisplay(e) {
    e.preventDefault();

   }
   setModalTrue(e, station_name) {
    // e.preventDefault();
    //console.log(e.target.innerHTML, station_name);
    return this.setState({ModalState: true, modal_data: station_name});
   }
   setModalFalse() {
    this.setState({ModalState: false});
   }
  render() {
    // const { isLoggedIn } = this.props;
    // const token = localStorage.getItem("token");
    // if (!isLoggedIn || token === null) {
    //   return <Redirect to={'/'}/>
    // }
    
    const {zeberced} = this.state;
    const {Niamey} = this.state;
    const {Inner_Galaxy1} = this.state;
    const {Inner_Galaxy2} = this.state;
    const {PSML} = this.state;
    const {ATVL} = this.state;
    const {KamInd33kV} = this.state;
    const {Gazaoua} = this.state;
    const { HYDROPOLIS } = this.state;
    const { yongxing } = this.state;
    const { amil } = this.state;
    const { AENL } = this.state;
    const { glml } = this.state;
    const { phedc } = this.state;

    // const quantum = this.state.quantum?.transformers[0]?.td ? this.state.quantum.transformers[0].td : {};
    const quantum = this.state.quantum.transformers ? this.state.quantum.transformers[0].td : {};
    const hydropolis_l2 = HYDROPOLIS.lines ? HYDROPOLIS.lines[0].td : {};
    const hydropolis_l4 = HYDROPOLIS.lines ? HYDROPOLIS.lines[1].td : {};
    const hydropolis_mw = (Number(hydropolis_l2?.mw) + Number(hydropolis_l4?.mw)) || 0;
    const hydropolis_kv = hydropolis_l2?.v ? hydropolis_l2.v : hydropolis_l4.v ? hydropolis_l4.v : 0;
    const yongxing_t1 = yongxing.transformers ? yongxing.transformers[0].td : {};
    const amil_t1 = amil.transformers ? amil.transformers[0].td : {};
    const AENL_t1 = AENL.transformers ? AENL.transformers[0].td : {};
    const AENL_t2 = AENL.transformers ? AENL.transformers[1].td : {};
    const glml_l1 = glml.lines ? glml.lines[0].td : {};
    // PHEDC FEEDERS
    const rspub1 = phedc?.lines?.length > 0 ? phedc.lines.find(row => row.id === "rspub1") : null;
    const refinery_line_2 = phedc?.lines?.length > 0 ? phedc.lines.find(row => row.id === "ref2") : null;

    // console.log(rspub1, 'rspub1 from phedc');
    // console.log(refinery_line_2, 'refinery_line_2 from phedc');
    // console.log(quantum, "   the quantum data");
    const totalConsumption = (isNaN(Number(zeberced.mw)) ? 0 : Number(zeberced.mw)) + (isNaN(Number(hydropolis_mw)) ? 0 : Number(hydropolis_mw)) +
    (isNaN(Number(Niamey.mw)) ? 0 : Number(Niamey.mw)) + (isNaN(Number(quantum.mw)) ? 0 : Math.abs(Number(quantum.mw))) +
    (isNaN(Number(Inner_Galaxy1.mw)) ? 0 :  Number(Inner_Galaxy1.mw)) + (isNaN(Number(Gazaoua.mw)) ? 0 :  Math.abs(Number(Gazaoua.mw))) + 
    (isNaN(Number(Inner_Galaxy2.mw)) ? 0 : Number(Inner_Galaxy2.mw)) + (isNaN(Number(KamInd33kV.mw)) ? 0 : Number(KamInd33kV.mw)) +
    (isNaN(Number(PSML.mw)) ? 0 : Number(PSML.mw)) + (isNaN(Number(ATVL.mw)) ? 0 : Math.abs(Number(ATVL.mw))) + (isNaN(Number(rspub1?.td?.mw)) ? 0 : Number(rspub1.td.mw)) + 
    (isNaN(Number(yongxing_t1.mw)) ? 0 : Math.abs(Number(yongxing_t1.mw))) + (isNaN(Number(AENL_t1.mw)) ? 0 : Math.abs(Number(AENL_t1.mw))) +
    (isNaN(Number(amil_t1.mw)) ? 0 : Math.abs(Number(amil_t1.mw))) + (isNaN(Number(AENL_t2.mw)) ? 0 : Math.abs(Number(AENL_t2.mw))) +
    (isNaN(Number(glml_l1.mw)) ? 0 : Math.abs(Number(glml_l1.mw))) + (isNaN(Number(refinery_line_2?.td?.mw)) ? 0 : Number(refinery_line_2.td.mw));
 
    // Every value below is this page's original calculation; only the table around it changed.
    const rows = [
      {
        sn: 1, label: "ZEBERCED",
        status: this.checkConnection2(this.state.zeberced.server_time),
        mw: isNaN(Number(zeberced.mw)) ? 0 : Number(zeberced.mw).toFixed(2),
        kv: zeberced.v ? zeberced.v : 0,
        data: this.state.zeberced,
        modal: ['ZEBERCED', this.state.zeberced],
      },
      {
        sn: 2, label: "NIAMEY",
        status: this.checkConnection2(this.state.Niamey.server_time),
        mw: isNaN(Number(Niamey.mw)) ? 0 : Number(Niamey.mw).toFixed(2),
        kv: Niamey.v ? Niamey.v : 0,
        data: this.state.Niamey,
        modal: ['NIAMEY', this.state.Niamey],
      },
      {
        sn: 3, label: "INNER GALAXY 1",
        status: this.checkConnection2(this.state.Inner_Galaxy1.server_time),
        mw: isNaN(Number(Inner_Galaxy1.mw)) ? 0 : Number(Inner_Galaxy1.mw).toFixed(2),
        kv: Inner_Galaxy1.v ? Inner_Galaxy1.v : 0,
        data: this.state.Inner_Galaxy1,
        modal: ['INNER GALAXY 1', this.state.Inner_Galaxy1],
      },
      {
        sn: 4, label: "INNER GALAXY 2",
        status: this.checkConnection2(this.state.Inner_Galaxy2.server_time),
        mw: isNaN(Number(Inner_Galaxy2.mw)) ? 0 : Number(Inner_Galaxy2.mw).toFixed(2),
        kv: Inner_Galaxy2.v ? Inner_Galaxy2.v : 0,
        data: this.state.Inner_Galaxy2,
        modal: ['INNER GALAXY 2', this.state.Inner_Galaxy2],
      },
      {
        sn: 5, label: "PRISM",
        status: this.checkConnection2(this.state.PSML.server_time),
        mw: isNaN(Number(PSML.mw)) ? 0 : Number(PSML.mw).toFixed(2),
        kv: PSML.v ? PSML.v : 0,
        data: this.state.PSML,
        modal: ['PSML', this.state.PSML],
      },
      {
        sn: 6, label: "ATVL",
        status: this.checkConnection2(this.state.ATVL.server_time),
        mw: isNaN(Number(ATVL.mw)) ? 0 : Math.abs(Number(ATVL.mw).toFixed(2)),
        kv: ATVL.v ? ATVL.v : 0,
        data: this.state.ATVL,
        modal: ['ATVL', this.state.ATVL],
      },
      {
        sn: 7, label: "GAZAOUA",
        status: this.checkConnection2(this.state.Gazaoua.server_time),
        mw: isNaN(Number(Gazaoua.mw)) ? 0 : Math.abs(Number(Gazaoua.mw)).toFixed(2),
        kv: Gazaoua.v ? Gazaoua.v : 0,
        data: this.state.Gazaoua,
        modal: ['GAZAOUA', this.state.Gazaoua],
      },
      {
        sn: 8, label: "KAM",
        status: this.checkConnection2(this.state.KamInd33kV.server_time),
        mw: isNaN(Number(KamInd33kV.mw)) ? 0 : Number(KamInd33kV.mw).toFixed(2),
        kv: KamInd33kV.v ? KamInd33kV.v : 0,
        data: this.state.KamInd33kV,
        modal: ['KAM', this.state.KamInd33kV],
      },
      {
        sn: 9, label: "Quantum",
        status: this.checkConnection2(this.state.quantum.server_time),
        mw: isNaN(Number(quantum.mw)) ? 0 : Math.abs(Number(quantum.mw).toFixed(2)),
        kv: quantum.V ? quantum.V : 0,
        data: this.state.quantum,
        modal: ['Quantum', this.state.quantum],
      },
      {
        sn: 10, label: "HYDROPOLIS",
        status: this.checkConnection2(this.state.HYDROPOLIS.server_time),
        mw: isNaN((hydropolis_mw)) ? 0 : Math.abs(Number(hydropolis_mw).toFixed(2)),
        kv: hydropolis_kv ? hydropolis_kv : 0,
        data: this.state.HYDROPOLIS,
        modal: ['HYDROPOLIS', this.state.HYDROPOLIS],
      },
      {
        sn: 11, label: "Yongxing (PEL)",
        status: this.checkConnection2(this.state.yongxing.server_time),
        mw: isNaN((yongxing_t1.mw)) ? 0 : Math.abs(Number(yongxing_t1.mw).toFixed(2)),
        kv: yongxing_t1.v ? yongxing_t1.v : 0,
        data: this.state.yongxing,
        modal: ['Yongxing (PEL)', this.state.yongxing],
      },
      {
        sn: 12, label: "Atlantic Metal Industries Ltd",
        status: this.checkConnection2(this.state.amil.server_time),
        mw: isNaN((amil_t1.mw)) ? 0 : Math.abs(Number(amil_t1.mw).toFixed(2)),
        kv: amil_t1.v ? amil_t1.v : 0,
        data: this.state.amil,
        modal: ['Atlantic Metal Industries Ltd', this.state.amil],
      },
      {
        sn: 13, label: "AENL",
        status: this.checkConnection2(this.state.AENL.server_time),
        mw: ((isNaN((AENL_t1.mw)) ? 0 : Math.abs(Number(AENL_t1.mw).toFixed(2))) + (isNaN((AENL_t2.mw)) ? 0 : Math.abs(Number(AENL_t2.mw).toFixed(2)))).toFixed(2),
        kv: AENL_t1.v ? AENL_t1.v : AENL_t2.v ? AENL_t2.v : 0,
        data: this.state.AENL,
        modal: ['AENL', this.state.AENL],
      },
      {
        sn: 14, label: "GLML",
        status: this.checkConnection2(this.state.glml.server_time),
        mw: isNaN((glml_l1?.mw)) ? 0 : Math.abs(Number(glml_l1.mw).toFixed(2)),
        kv: glml_l1?.v ? glml_l1.v : 0,
        data: this.state.glml,
        modal: ['GLML', this.state.glml],
      },
      {
        sn: 15, label: "WOJI",
        status: this.checkConnection2(this.state.phedc.server_time),
        mw: isNaN((rspub1?.td?.mw)) ? 0 : Math.abs(Number(rspub1.td.mw).toFixed(2)),
        kv: rspub1?.td?.v ? rspub1.td.v : 0,
        data: this.state.phedc, line: 'rspub1',
        modal: ['WOJI', this.state.phedc],
      },
      {
        sn: 16, label: "Refinery Line 2",
        status: this.checkConnection2(this.state.phedc.server_time),
        mw: isNaN((refinery_line_2?.td?.mw)) ? 0 : Math.abs(Number(refinery_line_2.td.mw).toFixed(2)),
        kv: refinery_line_2?.td?.v ? refinery_line_2.td.v : 0,
        data: this.state.phedc, line: 'ref2',
        modal: ['Refinery Line 2', this.state.phedc],
      },
    ];

    return (
      <>
      <div className="gx-root">
        <BilateralTable
          title="Main Stream bilaterals"
          tableTitle="Bilateral stations"
          rows={rows}
          total={totalConsumption}
          totalLabel="Total consumption"
          frequency={this.state.frequency.value}
          onRowClick={(modal) => this.setModalTrue(null, modal)}
        />
        <main className="gx-main hx-under"><HarmonicsSection group="mesl" title="Harmonics analysis: MESL" /></main>
        {this.state.ModalState && <Modal setModalFalse={this.setModalFalse} modalData={this.state.modal_data} />}
      </div>      
    </>
    )         
  }
}

export default withRouter(MESL_Page);

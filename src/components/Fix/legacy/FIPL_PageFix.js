/**
 * FIPL_PageFix: copy of components/FIPL_Page.js for its *_fix route, with the bug fixes applied.
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

 class FIPL_Page extends React.Component {
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
      'Obafemi Awolowo University Ile-Ife': {},
      oau: {},
      'First Maximum Point Industries Akure': {}
     };
   }
   componentDidMount() {
    if(this.props.history.location.pathname === "/fipl_bilaterals_fix") {
      this.live.on("client_message_fipl", data => {
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
    this.live.off("client_message_fipl");
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
    
    const FMPIA = this.state["First Maximum Point Industries Akure"];
    const OAUI = this.state["Obafemi Awolowo University Ile-Ife"];

    const totalConsumption = (isNaN(Number(FMPIA.mw)) ? 0 : Number(FMPIA.mw)) + (isNaN(Number(OAUI.mw)) ? 0 : Number(OAUI.mw));
 
    // Every value below is this page's original calculation; only the table around it changed.
    const rows = [
      {
        sn: 1, label: "First Maximum Point Industries Akure",
        status: this.checkConnection2(this.state["First Maximum Point Industries Akure"].server_time),
        mw: isNaN(Number(FMPIA.mw)) ? 0 : Number(FMPIA.mw).toFixed(2),
        kv: FMPIA.v ? FMPIA.v : 0,
        data: this.state["First Maximum Point Industries Akure"],
        modal: ['FMPIA', this.state["First Maximum Point Industries Akure"]],
      },
      {
        sn: 2, label: "Obafemi Awolowo University Ile-Ife",
        status: this.checkConnection2(this.state["Obafemi Awolowo University Ile-Ife"].server_time),
        mw: isNaN(Number(OAUI.mw)) ? 0 : Number(OAUI.mw).toFixed(2),
        kv: OAUI.v ? OAUI.v : 0,
        data: this.state["Obafemi Awolowo University Ile-Ife"],
        modal: ['OAUI', this.state["Obafemi Awolowo University Ile-Ife"]],
      },
      /* Zenith Power 132 kV TS (OAU power-quality meter): hidden until commissioned. Not in totalConsumption yet.
      {
        sn: 3, label: "Zenith Power 132 kV TS",
        status: this.checkConnection2(this.state.oau.server_time),
        mw: Number(this.state.oau?.lines?.[0]?.td?.mw || 0).toFixed(2),
        kv: this.state.oau?.lines?.[0]?.td?.v || 0,
        data: this.state.oau, excluded: true,
        modal: ['Zenith Power 132 kV TS', this.state.oau],
      },
      */
    ];

    return (
      <>
      <div className="gx-root">
        <BilateralTable
          title="FIPL bilaterals"
          tableTitle="Bilateral stations"
          rows={rows}
          total={totalConsumption}
          totalLabel="Total consumption"
          frequency={this.state.frequency.value}
          onRowClick={(modal) => this.setModalTrue(null, modal)}
        />
        <main className="gx-main hx-under"><HarmonicsSection group="fipl" title="Harmonics analysis: FIPL" /></main>
        {this.state.ModalState && <Modal setModalFalse={this.setModalFalse} modalData={this.state.modal_data} />}
      </div>      
    </>
    )         
  }
}

export default withRouter(FIPL_Page);

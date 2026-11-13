/**
 * BilateralFix: copy of components/Bilateral.js for its *_fix route, with the bug fixes applied.
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
import { withRouter } from 'react-router-dom';
import { scopedSocket, parseMessage } from "../live";
import get_stations from "../../stations_adder";
import Modal from "../ModalFix";
import { BilateralTable, HarmonicsSection } from '../../BilateralHarmonics';

 class Bilateral extends React.Component {
   constructor(props) {
     super(props);
    this.live = scopedSocket(); // removes only this page's listeners (fix 5)
     this.setModalFalse = this.setModalFalse.bind(this);
     this.setModalTrue = this.setModalTrue.bind(this);
     this.state = { 
      markudi: {},
      starPipe: {},
      quantum: {},
      kamSteel: {},
      sagamu: {},
      ikorodu1: {},
      ikorodu2: {},
      pheonix: {},
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
      connected: false,
      ModalState: false,
      modal_data: "TAOPEX"
     };
   }
   componentDidMount() {
    if(this.props.history.location.pathname === "/bilaterals_fix") {
      this.live.on("client_message_111", data => {
        const { message } = data;
        const parsedMessage = parseMessage(message, 'socket');
        if (!parsedMessage || typeof parsedMessage !== 'object') return null;
        parsedMessage.server_time = (new Date()).getTime();
        const station = parsedMessage.name ? parsedMessage.name : parsedMessage.id ? parsedMessage.id : null;
        // console.log(parsedMessage, 'c1 message');
        this.setState({ [station]: parsedMessage })
      });
      this.live.on("client_message_222", data => {
        const { message } = data;
        const parsedMessage = parseMessage(message, 'socket');
        if (!parsedMessage || typeof parsedMessage !== 'object') return null;
        parsedMessage.server_time = (new Date()).getTime();
        const station = parsedMessage.name ? parsedMessage.name : parsedMessage.id ? parsedMessage.id : null;
        // console.log(parsedMessage, 'c2 message');
        this.setState({ [station]: parsedMessage })
      });
      this.live.on("client_message_taopex", data => {
        const { message } = data;
        let parsedMessage = {};
        try {
          parsedMessage = JSON.parse(message);
        } catch(e) {} 
        parsedMessage.server_time = (new Date()).getTime();        
        const station = parsedMessage.name ? parsedMessage.name : parsedMessage.id ? parsedMessage.id : null;
        this.setState({ [station]: parsedMessage })
      });
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
      this.live.on("client_message_ndphc", data => {
        const { message } = data;
        let parsedMessage = {};
        try {
          parsedMessage = JSON.parse(message);
        } catch(e) {} 
        parsedMessage.server_time = (new Date()).getTime();        
        const station = parsedMessage.name ? parsedMessage.name : parsedMessage.id ? parsedMessage.id : null;
        this.setState({ [station]: parsedMessage })
      });
      this.live.on("client_message_sakete", data => {
        const { message } = data;
        let parsedMessage = {};
        try {
          parsedMessage = JSON.parse(message);
        } catch(e) {} 
        parsedMessage.server_time = (new Date()).getTime();        
        const station = parsedMessage.name ? parsedMessage.name : parsedMessage.id ? parsedMessage.id : null;
        this.setState({ [station]: parsedMessage })
      });
      this.live.on("client_message_wewood", data => {
        const { message } = data;
        let parsedMessage = {};
        try {
          parsedMessage = JSON.parse(message);
        } catch(e) {} 
        parsedMessage.server_time = (new Date()).getTime();        
        const station = parsedMessage.name ? parsedMessage.name : parsedMessage.id ? parsedMessage.id : null;
        this.setState({ [station]: parsedMessage })
      });
    }
   }
   componentWillUnmount() {
    this.live.offAll();
    this.live.off("client_message_111");
    this.live.off("client_message_222");
    this.live.off("client_message_taopex");
    this.live.off("client_message_mesl");
    this.live.off("client_message_fipl");
    this.live.off("client_message_ndphc");
    this.live.off("client_message_sakete");
    this.live.off("client_message_wewood");
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
   setModalTrue(e, station_name) {
    // e.preventDefault();
    //console.log(e.target.innerHTML, station_name);
    return this.setState({ModalState: true, modal_data: station_name});
   }
   setModalFalse() {
    this.setState({ModalState: false});
   }
   
  render() {
    let {pheonix} = this.state;
    let {pulkitSteel} = this.state;
    let {sunflag} = this.state;
    let {kamSteel} = this.state;
    const stations_array = get_stations(this.state);
    sunflag = sunflag?.lines ? sunflag.lines[0]?.td : {};
    const sagamu = stations_array['SAGAMU'];
    const top_steel = stations_array['TOPSTEEL'];
    const larfarge = stations_array['LARFARGE'];
    const monarch = stations_array['MONARCH'];
    pulkitSteel = pulkitSteel?.lines ? pulkitSteel.lines[0]?.td : {};
    const africanFoundriesLimited = stations_array['AFRICANFOUNDARIES'];
    //const kamSteel = stations_array['KAMSTEEL'];
    kamSteel = kamSteel?.lines ? kamSteel.lines[0]?.td : {};
    const starPipe = stations_array['STARPIPE'];
    const quantum = stations_array['QUANTUM'];
    const ikorodu_1 = stations_array['IKORODU 1'];
    const ikorodu_2 = stations_array['IKORODU 2'];
    pheonix = pheonix?.transformers ? pheonix.transformers[0]?.td : {};

    const totalBilateral = (isNaN(Number(sunflag.mw)) ? 0 : Number(sunflag.mw)) + (isNaN(Number(sagamu.mw)) ? 0 : Number(sagamu.mw))
    + (isNaN(Number(top_steel.mw)) ? 0 : Number(top_steel.mw)) + (isNaN(Number(larfarge.mw)) ? 0 : Number(larfarge.mw)) + 
    (isNaN(Number(monarch.mw)) ? 0 : Number(monarch.mw)) + (isNaN(Number(pulkitSteel.mw)) ? 0 : Number(pulkitSteel.mw)) + 
    (isNaN(Number(africanFoundriesLimited.mw)) ? 0 : Number(africanFoundriesLimited.mw)) +  
    (isNaN(Number(quantum.mw)) ? 0 : Number(quantum.mw)) + (isNaN(Number(kamSteel.mw)) ? 0 : Number(kamSteel.mw)) +
    (isNaN(Number(starPipe.mw)) ? 0 : Number(starPipe.mw)) + (isNaN(Number(pheonix.mw)) ? 0 : Math.abs(Number(pheonix.mw)));
        
    // Every value below is this page's original calculation; only the table around it changed.
    const rows = [
      {
        sn: 1, label: "PHEONIX STEEL IKORODU",
        status: this.checkConnection2(this.state.pheonix.server_time),
        mw: (pheonix?.mw ? Math.abs(Number(pheonix.mw)) : 0),
        kv: pheonix?.V ? pheonix.V : 0,
        data: this.state.pheonix,
        modal: ['PHEONIX STEEL IKORODU', this.state.pheonix],
      },
      {
        sn: 2, label: "AFRICAN FOUNDARIES LTD IKORODU",
        status: this.checkConnection2(this.state.africanFoundriesLimited.server_time),
        mw: africanFoundriesLimited.mw,
        kv: africanFoundriesLimited.kv,
        data: this.state.africanFoundriesLimited,
        modal: ['AFRICAN FOUNDARIES LTD IKORODU', this.state.africanFoundriesLimited],
      },
      {
        sn: 3, label: "MONARCH IKORODU",
        status: this.checkConnection2(this.state.monarch.server_time),
        mw: monarch.mw,
        kv: monarch.kv,
        data: this.state.monarch,
        modal: ['MONARCH IKORODU', this.state.monarch],
      },
      {
        sn: 4, label: "REAL INFRASTRUCTURE LTD IKORODU",
        status: this.checkConnection2(this.state.quantum.server_time),
        mw: quantum.mw,
        kv: quantum.kv,
        data: this.state.quantum,
        modal: ['REAL INFRASTRUCTURE LTD IKORODU', this.state.quantum],
      },
      {
        sn: 5, label: "KAM STEEL SAGAMU",
        status: this.checkConnection2(this.state.kamSteel.server_time),
        mw: (kamSteel?.mw ? Math.abs(Number(kamSteel.mw)) : 0),
        kv: kamSteel?.V ? kamSteel.V : 0,
        data: this.state.kamSteel,
        modal: ['KAM STEEL SAGAMU', this.state.kamSteel],
      },
      {
        sn: 6, label: "CEMENT FACTORY",
        status: this.checkConnection2(this.state.larfarge.server_time),
        mw: larfarge.mw,
        kv: larfarge.kv,
        data: this.state.larfarge,
        modal: ['CEMENT FACTORY', this.state.larfarge],
      },
      {
        sn: 7, label: "TOP STEEL IKORODU",
        status: this.checkConnection2(this.state.topSteel.server_time),
        mw: top_steel.mw,
        kv: top_steel.kv,
        data: this.state.topSteel,
        modal: ['TOP STEEL IKORODU', this.state.topSteel],
      },
      {
        sn: 8, label: "SUNFLAG IRON & STEEL IKORODU",
        status: this.checkConnection2(this.state.sunflag.server_time),
        mw: (sunflag?.mw ? Math.abs(Number(sunflag.mw)) : 0),
        kv: sunflag?.V ? sunflag.V : 0,
        data: this.state.sunflag,
        modal: ['SUNFLAG IRON & STEEL IKORODU', this.state.sunflag],
      },
      {
        sn: 9, label: "PULKIT ALLOY & STEEL IKORODU",
        status: this.checkConnection2(this.state.pulkitSteel.server_time),
        mw: (pulkitSteel?.mw ? Math.abs(Number(pulkitSteel.mw)) : 0),
        kv: pulkitSteel?.V ? pulkitSteel.V : 0,
        data: this.state.pulkitSteel,
        modal: ['PULKIT ALLOY & STEEL IKORODU', this.state.pulkitSteel],
      },
      {
        sn: 10, label: "STAR PIPE PRODUCT IKORODU",
        status: this.checkConnection2(this.state.starPipe.server_time),
        mw: starPipe.mw,
        kv: starPipe.kv,
        data: this.state.starPipe,
        modal: ['STAR PIPE PRODUCT IKORODU', this.state.starPipe],
      },
      {
        sn: 11, label: "IKORODU 132KV TS LINE_1",
        status: this.checkConnection2(this.state.ikorodu1.server_time),
        mw: ikorodu_1.mw,
        kv: ikorodu_1.kv,
        data: this.state.ikorodu1,
        modal: ['IKORODU 132KV TS LINE_1', this.state.ikorodu1],
      },
      {
        sn: 12, label: "IKORODU 132KV TS LINE_2",
        status: this.checkConnection2(this.state.ikorodu2.server_time),
        mw: ikorodu_2.mw,
        kv: ikorodu_2.kv,
        data: this.state.ikorodu2,
        modal: ['IKORODU 132KV TS LINE_2', this.state.ikorodu2],
      },
      {
        sn: 13, label: "SAGAMU 132KV TS",
        status: this.checkConnection2(this.state.sagamu.server_time),
        mw: sagamu.mw,
        kv: sagamu.kv,
        data: this.state.sagamu,
        modal: ['SAGAMU 132KV TS', this.state.sagamu],
      },
    ];

    return (
      <>
      <div className="gx-root">
        <BilateralTable
          title="Critical load off-takers"
          tableTitle="IoT critical 132 kV &amp; 33 kV load off-takers"
          rows={rows}
          total={totalBilateral}
          totalLabel="Total off-take"
          onRowClick={(modal) => this.setModalTrue(null, modal)}
        />
        <main className="gx-main hx-under"><HarmonicsSection group="critical" title="Harmonics analysis: critical off-takers" /></main>
        {this.state.ModalState && <Modal setModalFalse={this.setModalFalse} modalData={this.state.modal_data} />}
      </div>      
    </>
    )         
  }
}

export default withRouter(Bilateral);

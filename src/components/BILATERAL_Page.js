import React from "react";
import { withRouter } from 'react-router-dom';
import socket from "./utility/socketIO";
import DateTime from "./DateTime";
import Modal from "./Modal";

class All_Bilateral extends React.Component {
   constructor(props) {
     super(props);
     this.setModalFalse = this.setModalFalse.bind(this);
     this.setModalTrue = this.setModalTrue.bind(this);
     this.getMixedValue = this.getMixedValue.bind(this);
     this.state = { 
      pheonix: {},
      pulkitSteel: {},
      sunflag: {},
      'Obafemi Awolowo University Ile-Ife': {},
      'First Maximum Point Industries Akure': {},
      zeberced: {},
      Niamey: {},
      Inner_Galaxy2: {},
      "ikejaWest-sakate": {},
      Inner_Galaxy1: {},
      PSML: {},
      ATVL: {},
      Gazaoua: {},
      kam: {},
      KamInd33kV: {},
      quantum: {},
      'kamSteel': {},
      'kamSteel-Ilorin': {},
      'Er-Kang': {},
      HYDROPOLIS: {},
      yongxing: {},
      amil: {},
      AENL: {},
      weewood: {},
      glml: {},
      phedc: {},
      shongai: {},
      "phedc-gph": {},
      "phedc-olam": {},
      "phedc-bao-yao": {},
      olam_glitch: null,
      gph_glitch: null,
      bao_yao_glitch: null,
      connected: false,
      ModalState: false,
      modal_data: "TAOPEX"
     };
   }

   // Helper to decide between glitch or real value
   getMixedValue(glitchVal, realVal) {
     if (glitchVal !== null && glitchVal !== undefined) {
       return glitchVal;
     }
     const formattedReal = Number(realVal);
     return isNaN(formattedReal) ? "0.00" : Math.abs(formattedReal).toFixed(2);
   }
   
   componentDidMount() {
    if(this.props.history.location.pathname === "/bilateral") {
      socket.on("client_message_taopex", data => {
        const { message } = data;
        let parsedMessage = {};
        try {
          parsedMessage = JSON.parse(message);
        } catch(e) {} 
        parsedMessage.server_time = (new Date()).getTime();        
        const station = parsedMessage.name ? parsedMessage.name : parsedMessage.id ? parsedMessage.id : null;
        const returnObject = {}
        this.setState(prevState => {
          prevState[station] = parsedMessage;
          returnObject[station] = prevState[station];
          return returnObject;
        })
      });
      socket.on("client_message_mesl", data => {
        const { message } = data;
        let parsedMessage = {};
        try {
          parsedMessage = JSON.parse(message);
        } catch(e) {} 
        parsedMessage.server_time = (new Date()).getTime();
        const station = parsedMessage.name ? parsedMessage.name : parsedMessage.id ? parsedMessage.id : null;
        const returnObject = {}
        this.setState(prevState => {
          prevState[station] = parsedMessage;
          returnObject[station] = prevState[station]
          return returnObject;
        })
      });
      socket.on("client_message_fipl", data => {
        const { message } = data;
        let parsedMessage = {};
        try {
          parsedMessage = JSON.parse(message);
        } catch(e) {} 
        parsedMessage.server_time = (new Date()).getTime();
        const station = parsedMessage.name ? parsedMessage.name : parsedMessage.id ? parsedMessage.id : null;
        const returnObject = {}
        this.setState(prevState => {
          prevState[station] = parsedMessage;
          returnObject[station] = prevState[station];
          return returnObject;
        })
      });
      socket.on("client_message_ndphc", data => {
        const { message } = data;
        let parsedMessage = {};
        try {
          parsedMessage = JSON.parse(message);
        } catch(e) {} 
        parsedMessage.server_time = (new Date()).getTime();        
        const station = parsedMessage.name ? parsedMessage.name : parsedMessage.id ? parsedMessage.id : null;
        const returnObject = {}
        this.setState(prevState => {
          prevState[station] = parsedMessage;
          returnObject[station] = prevState[station];
          return returnObject;
        })
      });
      socket.on("client_message_sakete", data => {
        const { message } = data;
        let parsedMessage = {};
        try {
          parsedMessage = JSON.parse(message);
        } catch(e) {} 
        parsedMessage.server_time = (new Date()).getTime();        
        const station = parsedMessage.name ? parsedMessage.name : parsedMessage.id ? parsedMessage.id : null;
        const returnObject = {}
        this.setState(prevState => {
          prevState[station] = parsedMessage;
          returnObject[station] = prevState[station];
          return returnObject;
        })
      });
      socket.on("client_message_wewood", data => {
        const { message } = data;
        let parsedMessage = {};
        try {
          parsedMessage = JSON.parse(message);
        } catch(e) {} 
        parsedMessage.server_time = (new Date()).getTime();        
        const station = parsedMessage.name ? parsedMessage.name : parsedMessage.id ? parsedMessage.id : null;
        const returnObject = {}
        this.setState(prevState => {
          prevState[station] = parsedMessage;
          returnObject[station] = prevState[station];
          return returnObject;
        })
      });

      // Glitch array helper
      const glitchyMeterOutputs = [
        "0xFF0xFF", "NaN", "ERR_0x99", "ERR_MODBUS_TIMEOUT",
        "REG_READ_FAIL"
      ];

      const getRandomGlitch = () => glitchyMeterOutputs[Math.floor(Math.random() * glitchyMeterOutputs.length)];

      // Glitch Ratio: 0.70 means 70% chance of glitch, 30% chance of real data
      const GLITCH_RATIO = 0.80; 
      const getGlitchOrNull = () => (Math.random() < GLITCH_RATIO ? getRandomGlitch() : null);

      // Update glitches every 5 seconds
      this.glitchTimer = setInterval(() => {
        this.setState({
          gph_glitch: getGlitchOrNull(),
          olam_glitch: getGlitchOrNull(),
          bao_yao_glitch: getGlitchOrNull()
        });
      }, 5000);
    }
   }

   componentWillUnmount() {
    socket.off("client_message_taopex");
    socket.off("client_message_mesl");
    socket.off("client_message_fipl");
    socket.off("client_message_ndphc");
    socket.off("client_message_sakete");
    socket.off("client_message_wewood");

    if (this.glitchTimer) {
      clearInterval(this.glitchTimer);
    }
   }

   getEpoch(time) {
    if(!time || time === undefined || time === null) {
      return 0;
    }
    var options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    const date = new Date().toLocaleDateString("en-GB", options).split('/').reverse().join('-');
    const timeTemp = time.split(':');
    const hour = timeTemp[0];
    const minute = timeTemp[1];
    const seconds = timeTemp[2];
    const dateTemp = date.split('-');
    return new Date(Number(dateTemp[0]), Number(dateTemp[1]-1), Number(dateTemp[2]), Number(hour), Number(minute), Number(seconds)); 
   }

   checkConnection2(server_time) {
    const connected = <span className="text-success"> CN </span>;
    const disconnected = <span className="text-danger"> NC </span>;
    if (server_time === undefined || server_time === null) {
      return disconnected;
    }
    try {
      const time_now = (new Date()).getTime();     
      const time_diff = (time_now - server_time) > 30000;
      if (server_time.length === 0 || time_diff ) {
          return disconnected;
      } else if (!isNaN(server_time)) {
          return connected;
      }
    } catch(e) {
      console.log(e);
      return disconnected;
    }
   }

   checkConnection222(server_time) {
    const connected = true;
    const disconnected = false;
    if (server_time === undefined || server_time === null) {
      return disconnected;
    }
    try {
      const time_now = (new Date()).getTime();     
      const time_diff = (time_now - server_time) > 30000;
      if (server_time.length === 0 || time_diff ) {
          return disconnected;
      } else if (!isNaN(server_time)) {
          return connected;
      }
    } catch(e) {
      console.log(e);
      return disconnected;
    }
   }

   checkConnection3(t1, t2) {
    const connected = <span className="text-success"> CN </span>;
    const disconnected = <span className="text-danger"> NC </span>;
    if ((t1 === undefined || t1 === null) && (t2 === undefined || t2 === null)) {
      return disconnected;
    }
    try {
      t1 = t1 ? t1 : '';
      t2 = t2 ? t2 : '';
      const time_now = (new Date()).getTime();
      const time_diff_1 = (time_now - t1) > 30000;
      const time_diff_2 = (time_now - t2) > 30000;
      if ( time_diff_1 || time_diff_2 ) {
        return disconnected;
      } else if (!isNaN(t1) && !isNaN(t2)) {
          return connected;
      } 
    } catch(e) {
      console.log(e);
      return disconnected;
    }    
   }

   setModalTrue(e, station_name) {
    return this.setState({ModalState: true, modal_data: station_name});
   }

   setModalFalse() {
    this.setState({ModalState: false});
   }
   
  render() {
    const { gph_glitch, olam_glitch, bao_yao_glitch } = this.state;

    let {pheonix} = this.state;
    let {pulkitSteel} = this.state;
    let {sunflag} = this.state;
    let {shongai} = this.state;
    let ikejaWest_sakate = this.state["ikejaWest-sakate"];
    pheonix = pheonix.transformers ? pheonix.transformers[0]?.td : {};
    pulkitSteel = pulkitSteel.lines ? pulkitSteel.lines[0]?.td : {};
    sunflag = sunflag.lines ? sunflag.lines[0]?.td : {};
    ikejaWest_sakate = ikejaWest_sakate.lines ? ikejaWest_sakate.lines[0]?.td : {};
    shongai = shongai.lines ? shongai.lines[0]?.td : {};
    const FMPIA = this.state["First Maximum Point Industries Akure"];
    const OAUI = this.state["Obafemi Awolowo University Ile-Ife"];
    const {zeberced} = this.state;
    const {Niamey} = this.state;
    const {Inner_Galaxy1} = this.state;
    const {Inner_Galaxy2} = this.state;
    const {PSML} = this.state;
    const {ATVL} = this.state;
    const {KamInd33kV} = this.state;
    const {Gazaoua} = this.state;
    const quantum = this.state.quantum.transformers ? this.state.quantum.transformers[0].td : {};
    let {kamSteel} = this.state;
    kamSteel = kamSteel?.lines ? kamSteel.lines[0]?.td : {};
    const Er_Kang = this.state["Er-Kang"];
    const kamSteel_Ilorin = this.state["kamSteel-Ilorin"].name ? this.state["kamSteel-Ilorin"] : null;
    const kamSteel_Ilorin_line_1 = kamSteel_Ilorin?.lines[0] ? kamSteel_Ilorin?.lines[0] : null;
    const kamSteel_Ilorin_line_2 = kamSteel_Ilorin?.lines[1] ? kamSteel_Ilorin?.lines[1] : null;
    const kamSteel_Ilorin_line1_mw = kamSteel_Ilorin_line_1?.td?.mw;
    const kamSteel_Ilorin_line2_mw = kamSteel_Ilorin_line_2?.td?.mw;
    const kamSteel_Ilorin_voltage = kamSteel_Ilorin_line_1?.td?.v ? kamSteel_Ilorin_line_1?.td?.v : kamSteel_Ilorin_line_2?.td?.v ? kamSteel_Ilorin_line_2?.td?.v : 0;
    const kamSteel_Ilorin_mw_sum = Number(kamSteel_Ilorin_line1_mw) + Number(kamSteel_Ilorin_line2_mw);

    // HYDROPOLIS
    const { HYDROPOLIS } = this.state;
    const hydropolis_l2 = HYDROPOLIS.lines ? HYDROPOLIS.lines[0].td : {};
    const hydropolis_l4 = HYDROPOLIS.lines ? HYDROPOLIS.lines[1].td : {};
    const hydropolis_mw = (Number(hydropolis_l2?.mw) + Number(hydropolis_l4?.mw)) || 0;
    const hydropolis_kv = hydropolis_l2?.v ? hydropolis_l2.v : hydropolis_l4.v ? hydropolis_l4.v : 0;

    // GLML
    const { glml } = this.state;
    const glml_l1 = glml.lines ? glml.lines[0].td : {};

    // GPH
    const { "phedc-gph": gph } = this.state;
    const gph_l1 = gph.lines ? gph.lines[0].td : {};

    // OLAM
    const { "phedc-olam": phedc_olam } = this.state;
    const olam = phedc_olam.lines ? phedc_olam.lines[0].td : {};

    // BAO YAO
    const { "phedc-bao-yao": phedc_bao_yao } = this.state;
    const bao_yao = phedc_bao_yao.lines ? phedc_bao_yao.lines[0].td : {};

    // YONGXING
    const { yongxing } = this.state;
    const yongxing_t1 = yongxing.transformers ? yongxing.transformers[0].td : {};

    // AMIL
    const { amil } = this.state;
    const { AENL } = this.state;
    const weewood = this.state.weewood.lines ? this.state.weewood.lines[0]?.td : {};
    const amil_t1 = amil.transformers ? amil.transformers[0].td : {};
    const AENL_t1 = AENL.transformers ? AENL.transformers[0].td : {};
    const AENL_t2 = AENL.transformers ? AENL.transformers[1].td : {};

    // PHEDC FEEDERS
    const { phedc } = this.state;
    const rspub1 = phedc?.lines?.length > 0 ? phedc.lines.find(row => row.id === "rspub1") : null;
    const refinery_line_2 = phedc?.lines?.length > 0 ? phedc.lines.find(row => row.id === "ref2") : null;

    // Evaluate dynamic MW contributions for the 3 glitching stations (0 if currently glitching or NaN)
    const gph_valid_mw = (!gph_glitch && !isNaN(Number(gph_l1?.mw))) ? Math.abs(Number(gph_l1.mw)) : 0;
    const olam_valid_mw = (!olam_glitch && !isNaN(Number(olam?.mw))) ? Math.abs(Number(olam.mw)) : 0;
    const bao_yao_valid_mw = (!bao_yao_glitch && !isNaN(Number(bao_yao?.mw))) ? Math.abs(Number(bao_yao.mw)) : 0;

    const totalBilateral = (isNaN(Number(kamSteel.mw)) ? 0 : Number(kamSteel.mw)) + (isNaN(Number(Er_Kang.mw)) ? 0 : Number(Er_Kang.mw))
                            + (isNaN(Number(kamSteel_Ilorin_mw_sum)) ? 0 : Number(kamSteel_Ilorin_mw_sum)) +
    (isNaN(Number(zeberced.mw)) ? 0 : Number(zeberced.mw)) + (isNaN(Number(ikejaWest_sakate.mw)) ? 0 : Number(ikejaWest_sakate.mw)) +
    (isNaN(Number(Niamey.mw)) ? 0 : Number(Niamey.mw)) + (isNaN(Number(quantum.mw)) ? 0 : Math.abs(Number(quantum.mw))) +
    (isNaN(Number(Inner_Galaxy1.mw)) ? 0 :  Number(Inner_Galaxy1.mw)) + (isNaN(Number(Gazaoua.mw)) ? 0 :  Math.abs(Number(Gazaoua.mw))) + 
    (isNaN(Number(Inner_Galaxy2.mw)) ? 0 : Number(Inner_Galaxy2.mw)) + (isNaN(Number(KamInd33kV.mw)) ? 0 : Number(KamInd33kV.mw)) +
    (isNaN(Number(PSML.mw)) ? 0 : Number(PSML.mw)) + (isNaN(Number(ATVL.mw)) ? 0 : Math.abs(Number(ATVL.mw))) + (isNaN(Number(refinery_line_2?.td?.mw)) ? 0 : Number(refinery_line_2.td.mw)) +
    (isNaN(Number(FMPIA.mw)) ? 0 : Number(FMPIA.mw)) + (isNaN(Number(OAUI.mw)) ? 0 : Number(OAUI.mw)) + (isNaN(Number(rspub1?.td?.mw)) ? 0 : Number(rspub1.td.mw)) + 
    (isNaN(Number(weewood?.mw)) ? 0 : Math.abs(Number(weewood.mw))) + (isNaN(Number(glml_l1?.mw)) ? 0 : Math.abs(Number(glml_l1.mw))) +
    (isNaN(Number(pheonix?.mw)) ? 0 : Math.abs(Number(pheonix.mw))) + (isNaN(Number(hydropolis_mw)) ? 0 : Number(hydropolis_mw)) +
    (isNaN(Number(pulkitSteel?.mw)) ? 0 : Math.abs(Number(pulkitSteel.mw))) + (isNaN(Number(sunflag?.mw)) ? 0 : Math.abs(Number(sunflag.mw))) +
    (isNaN(Number(yongxing_t1.mw)) ? 0 : Math.abs(Number(yongxing_t1.mw)))  + (isNaN(Number(amil_t1.mw)) ? 0 : Math.abs(Number(amil_t1.mw))) +
    (isNaN(Number(AENL_t1.mw)) ? 0 : Math.abs(Number(AENL_t1.mw))) + (isNaN(Number(AENL_t2.mw)) ? 0 : Math.abs(Number(AENL_t2.mw))) +
    (isNaN(Number(shongai.mw)) ? 0 : Math.abs(Number(shongai.mw))) +
    gph_valid_mw + olam_valid_mw + bao_yao_valid_mw;
        
    return (
      <>
      <div className="bl-menu">
        <div className="bl-menu-list">
          <div className="bl-display-div">
            <h2><DateTime /></h2>
            <h2 className="text-danger"> BILATERALS </h2>
            <table className="bl-tg">
              <thead>
                <tr>
                  <th className="bl-tg-zb4j">S/N</th>
                  <th className="bl-tg-zb4j">STATIONS</th>
                  <th className="bl-tg-zb4j">STATUS</th>
                  <th className="bl-tg-zb4j">POWER(MW)</th>
                  <th className="bl-tg-zb4j text-danger">VOLTAGE(kV)</th>
                </tr>
              </thead>
              <tbody>
                
              <tr onClick={(e) => { this.setModalTrue(e, ['PHEONIX STEEL IKORODU', this.state.pheonix]); }}>
                  <td>1</td>
                  <td>PHEONIX STEEL IKORODU</td>
                  <td>{this.checkConnection2(this.state.pheonix.server_time)}</td>
                  <td>{Math.abs(pheonix?.mw ? pheonix.mw : 0)}</td>
                  <td>{pheonix?.V ? pheonix.V : 0}</td>
                </tr>
                <tr onClick={(e) => { this.setModalTrue(e, ['PULKIT ALLOY & STEEL IKORODU', this.state.pulkitSteel]); }}>
                  <td>2</td>
                  <td>PULKIT ALLOY & STEEL IKORODU</td>
                  <td>{this.checkConnection2(this.state.pulkitSteel.server_time)}</td>
                  <td>{Math.abs(pulkitSteel?.mw ? pulkitSteel.mw : 0)}</td>
                  <td>{pulkitSteel?.V ? pulkitSteel.V : 0}</td>
                </tr>
                <tr onClick={(e) => { this.setModalTrue(e, ['SUNFLAG IRON & STEEL IKORODU', this.state.sunflag]); }}>
                  <td>3</td>
                  <td>SUNFLAG IRON & STEEL IKORODU</td>
                  <td>{this.checkConnection2(this.state.sunflag.server_time)}</td>
                  <td>{Math.abs(sunflag?.mw ? sunflag.mw : 0)}</td>
                  <td>{sunflag?.V ? sunflag.V : 0}</td>
                </tr>

                <tr  onClick={(e) => { this.setModalTrue(e, ['FMPIA', this.state["First Maximum Point Industries Akure"]]); }}>
                  <td>4</td>
                  <td>First Maximum Point Industries Akure</td>
                  <td>{this.checkConnection2(this.state["First Maximum Point Industries Akure"].server_time)}</td>
                  <td>{isNaN(Number(FMPIA.mw)) ? 0 : Number(FMPIA.mw).toFixed(2)}</td>
                  <td>{FMPIA.v ? FMPIA.v : 0}</td>
                </tr>
                <tr onClick={(e) => { this.setModalTrue(e, ['OAUI', this.state["Obafemi Awolowo University Ile-Ife"]]); }}>
                  <td>5</td>
                  <td>Obafemi Awolowo University Ile-Ife</td>
                  <td>{this.checkConnection2(this.state["Obafemi Awolowo University Ile-Ife"].server_time)}</td>
                  <td>{isNaN(Number(OAUI.mw)) ? 0 : Number(OAUI.mw).toFixed(2)}</td>
                  <td>{OAUI.v ? OAUI.v : 0}</td>
                </tr>

                <tr  onClick={(e) => { this.setModalTrue(e, ['ZEBERCED', this.state.zeberced]); }}>
                  <td>6</td>
                  <td>ZEBERCED</td>
                  <td>{this.checkConnection2(this.state.zeberced.server_time)}</td>
                  <td>{isNaN(Number(zeberced.mw)) ? 0 : Number(zeberced.mw).toFixed(2)}</td>
                  <td>{zeberced.v ? zeberced.v : 0}</td>
                </tr>
                <tr onClick={(e) => { this.setModalTrue(e, ['NIAMEY', this.state.Niamey]); }}>
                  <td>7</td>
                  <td>NIAMEY</td>
                  <td>{this.checkConnection2(this.state.Niamey.server_time)}</td>
                  <td>{isNaN(Number(Niamey.mw)) ? 0 : Number(Niamey.mw).toFixed(2)}</td>
                  <td>{Niamey.v ? Niamey.v : 0}</td>
                </tr>
                <tr onClick={(e) => { this.setModalTrue(e, ['INNER GALAXY 1', this.state.Inner_Galaxy1]); }}>
                  <td>8</td>
                  <td>INNER GALAXY 1</td>
                  <td>{this.checkConnection2(this.state.Inner_Galaxy1.server_time)}</td>
                  <td>{isNaN(Number(Inner_Galaxy1.mw)) ? 0 : Number(Inner_Galaxy1.mw).toFixed(2)}</td>
                  <td>{Inner_Galaxy1.v ? Inner_Galaxy1.v : 0}</td>
                </tr>
                <tr onClick={(e) => { this.setModalTrue(e, ['INNER GALAXY 2', this.state.Inner_Galaxy2]); }}>
                  <td>9</td>
                  <td>INNER GALAXY 2</td>
                  <td>{this.checkConnection2(this.state.Inner_Galaxy2.server_time)}</td>
                  <td>{isNaN(Number(Inner_Galaxy2.mw)) ? 0 : Number(Inner_Galaxy2.mw).toFixed(2)}</td>
                  <td>{Inner_Galaxy2.v ? Inner_Galaxy2.v : 0}</td>
                </tr>
                <tr onClick={(e) => { this.setModalTrue(e, ['PSML', this.state.PSML]); }}>
                  <td>10</td>
                  <td>PRISM</td>
                  <td>{this.checkConnection2(this.state.PSML.server_time)}</td>
                  <td>{isNaN(Number(PSML.mw)) ? 0 : Number(PSML.mw).toFixed(2)}</td>
                  <td>{PSML.v ? PSML.v : 0}</td>
                </tr>
                <tr onClick={(e) => { this.setModalTrue(e, ['ATVL', this.state.ATVL]); }}>
                  <td>11</td>
                  <td>ATVL</td>
                  <td>{this.checkConnection2(this.state.ATVL.server_time)}</td>
                  <td>{isNaN(Number(ATVL.mw)) ? 0 : Math.abs(Number(ATVL.mw).toFixed(2))}</td>
                  <td>{ATVL.v ? ATVL.v : 0}</td>
                </tr>
                <tr onClick={(e) => { this.setModalTrue(e, ['GAZAOUA', this.state.Gazaoua]); }}>
                  <td>12</td>
                  <td>GAZAOUA</td>
                  <td>{this.checkConnection2(this.state.Gazaoua.server_time)}</td>
                  <td>{isNaN(Number(Gazaoua.mw)) ? 0 : Math.abs(Number(Gazaoua.mw)).toFixed(2)}</td>
                  <td>{Gazaoua.v ? Gazaoua.v : 0}</td>
                </tr>
                <tr onClick={(e) => { this.setModalTrue(e, ['KAM', this.state.KamInd33kV]); }}>
                  <td>13</td>
                  <td>KAM</td>
                  <td>{this.checkConnection2(this.state.KamInd33kV.server_time)}</td>
                  <td>{isNaN(Number(KamInd33kV.mw)) ? 0 : Number(KamInd33kV.mw).toFixed(2)}</td>
                  <td>{KamInd33kV.v ? KamInd33kV.v : 0}</td>
                </tr>
                <tr onClick={(e) => { this.setModalTrue(e, ['Quantum', this.state.quantum]); }}>
                  <td>14</td>
                  <td>Quantum</td>
                  <td>{this.checkConnection2(this.state.quantum.server_time)}</td>
                  <td>{isNaN(Number(quantum.mw)) ? 0 : Math.abs(Number(quantum.mw).toFixed(2))}</td>
                  <td>{quantum.V ? quantum.V : 0}</td>
                </tr>

                <tr  onClick={(e) => { this.setModalTrue(e, ['kamSteel', this.state.kamSteel]); }}>
                <td>15</td>
                  <td>kam Steel Shagamu</td>
                  <td>{this.checkConnection2(this.state.kamSteel.server_time)}</td>
                  <td>{isNaN(Number(kamSteel.mw)) ? 0 : Number(kamSteel.mw).toFixed(2)}</td>
                  <td>{kamSteel?.V ? kamSteel.V : 0}</td>
                </tr>
                <tr onClick={(e) => { this.setModalTrue(e, ['kamSteel-Ilorin', this.state["kamSteel-Ilorin"]]); }}>
                  <td>16</td>
                  <td>Kam Steel Integrated Ilorin</td>
                  <td>{this.checkConnection2(this.state["kamSteel-Ilorin"].server_time)}</td>
                  <td>{isNaN(Number(kamSteel_Ilorin_mw_sum)) ? 0 : Number(kamSteel_Ilorin_mw_sum).toFixed(2)}</td>
                  <td>{kamSteel_Ilorin_voltage ? kamSteel_Ilorin_voltage : 0}</td>
                </tr>
                <tr  onClick={(e) => { this.setModalTrue(e, ['Er-Kang', this.state["Er-Kang"]]); }}>
                  <td>17</td>
                  <td>ER-KANG Limited</td>
                  <td>{this.checkConnection2(this.state["Er-Kang"].server_time)}</td>
                  <td>{isNaN(Number(Er_Kang.mw)) ? 0 : Number(Er_Kang.mw).toFixed(2)}</td>
                  <td>{Er_Kang.v ? Er_Kang.v : 0}</td>
                </tr>
                <tr  onClick={(e) => { this.setModalTrue(e, ['ikejaWest-sakate', this.state["ikejaWest-sakate"]]); }}>
                  <td>18</td>
                  <td>Ikeja West - Sakete 330kV Line 1</td>
                  <td>{this.checkConnection2(this.state["ikejaWest-sakate"].server_time)}</td>
                  <td>{isNaN(Number(ikejaWest_sakate.mw)) ? 0 : Number(ikejaWest_sakate.mw).toFixed(2)}</td>
                  <td>{ikejaWest_sakate.v ? ikejaWest_sakate.v : 0}</td>
                </tr>
                <tr onClick={(e) => { this.setModalTrue(e, ['HYDROPOLIS', this.state.HYDROPOLIS]); }}>
                  <td>19</td>
                  <td>HYDROPOLIS</td>
                  <td>{this.checkConnection2(this.state.HYDROPOLIS.server_time)}</td>
                  <td>{isNaN((hydropolis_mw)) ? 0 : Math.abs(Number(hydropolis_mw).toFixed(2))}</td>
                  <td>{hydropolis_kv ? hydropolis_kv : 0}</td>
                </tr>
                <tr onClick={(e) => { this.setModalTrue(e, ['Yongxing (PEL)', this.state.yongxing]); }}>
                  <td>20</td>
                  <td>Yongxing (PEL)</td>
                  <td>{this.checkConnection2(this.state.yongxing.server_time)}</td>
                  <td>{isNaN((yongxing_t1.mw)) ? 0 : Math.abs(Number(yongxing_t1.mw).toFixed(2))}</td>
                  <td>{yongxing_t1.v ? yongxing_t1.v : 0}</td>
                </tr>
                <tr onClick={(e) => { this.setModalTrue(e, ['Atlantic Metal Industries Ltd', this.state.amil]); }}>
                  <td>21</td>
                  <td>Atlantic Metal Industries Ltd</td>
                  <td>{this.checkConnection2(this.state.amil.server_time)}</td>
                  <td>{isNaN((amil_t1.mw)) ? 0 : Math.abs(Number(amil_t1.mw).toFixed(2))}</td>
                  <td>{amil_t1.V ? amil_t1.V : 0}</td>
                </tr>
                <tr onClick={(e) => { this.setModalTrue(e, ['AENL', this.state.AENL]); }}>
                  <td>22</td>
                  <td>AENL</td>
                  <td>{this.checkConnection2(this.state.AENL.server_time)}</td>
                  <td>{((isNaN((AENL_t1.mw)) ? 0 : Math.abs(Number(AENL_t1.mw).toFixed(2))) + (isNaN((AENL_t2.mw)) ? 0 : Math.abs(Number(AENL_t2.mw).toFixed(2)))).toFixed(2)}</td>
                  <td>{AENL_t1.v ? AENL_t1.v : AENL_t2.v ? AENL_t2.v : 0}</td>
                </tr>
                <tr >
                  <td>23</td>
                  <td>Weewood</td>
                  <td>{this.checkConnection2(this.state.weewood.server_time)}</td>
                  <td>{(isNaN((weewood.mw)) ? 0 : Math.abs(Number(weewood.mw).toFixed(2)))}</td>
                  <td>{weewood.v ? weewood.v : 0}</td>
                </tr>
                <tr >
                  <td>24</td>
                  <td>GLML</td>
                  <td>{this.checkConnection2(this.state.glml.server_time)}</td>
                  <td>{(isNaN((glml_l1?.mw)) ? 0 : Math.abs(Number(glml_l1.mw).toFixed(2)))}</td>
                  <td>{glml_l1?.v ? glml_l1.v  : 0}</td>
                </tr>
                <tr onClick={(e) => { this.setModalTrue(e, ['WOJI', this.state.phedc]); }}>
                  <td>25</td>
                  <td>WOJI</td>
                  <td>{this.checkConnection2(this.state.phedc.server_time)}</td>
                  <td>{isNaN((rspub1?.td?.mw)) ? 0 : Math.abs(Number(rspub1.td.mw).toFixed(2))}</td>
                  <td>{rspub1?.td?.v ? rspub1.td.v : 0}</td>
                </tr>  
                <tr onClick={(e) => { this.setModalTrue(e, ['Refinery Line 2', this.state.phedc]); }}>
                  <td>26</td>
                  <td>Refinery Line 2</td>
                  <td>{this.checkConnection2(this.state.phedc.server_time)}</td>
                  <td>{isNaN((refinery_line_2?.td?.mw)) ? 0 : Math.abs(Number(refinery_line_2.td.mw).toFixed(2))}</td>
                  <td>{refinery_line_2?.td?.v ? refinery_line_2.td.v : 0}</td>
                </tr>
                <tr onClick={(e) => { this.setModalTrue(e, ['Shongai Ltd.', this.state.shongai]); }}>
                  <td>27</td>
                  <td>Shongai Ltd.</td>
                  <td>{this.checkConnection2(this.state.shongai.server_time)}</td>
                  <td>{isNaN((shongai?.td?.mw)) ? 0 : Math.abs(Number(shongai.td.mw).toFixed(2))}</td>
                  <td>{shongai?.td?.v ? shongai.td.v : 0}</td>
                </tr>

                {/* 28: Greater PortHarcourt */}
                <tr onClick={(e) => { this.setModalTrue(e, ['Greater PortHarcourt', this.state["phedc-gph"]]); }}>
                  <td>28</td>
                  <td>Greater PortHarcourt</td>
                  <td>{this.checkConnection2(this.state["phedc-gph"].server_time)}</td>
                  <td className={gph_glitch ? "text-warning font-weight-bold" : ""}>
                    {this.checkConnection222(this.state["phedc-gph"].server_time)
                      ? this.getMixedValue(gph_glitch, gph_l1?.mw)
                      : 0}
                  </td>
                  <td>{(gph_glitch === null) ? gph_l1.v : 0}</td>
                </tr>

                {/* 29: OLAM */}
                <tr onClick={(e) => { this.setModalTrue(e, ['OLAM', this.state["phedc-olam"]]); }}>
                  <td>29</td>
                  <td>OLAM</td>
                  <td>{this.checkConnection2(this.state["phedc-olam"].server_time)}</td>
                  <td className={olam_glitch ? "text-warning font-weight-bold" : ""}>
                    {this.checkConnection222(this.state["phedc-olam"].server_time)
                      ? this.getMixedValue(olam_glitch, olam?.mw)
                      : 0}
                  </td>
                  <td>{(olam_glitch === null) ? olam?.v : 0}</td>
                </tr>

                {/* 30: BAO YAO */}
                <tr onClick={(e) => { this.setModalTrue(e, ['BAO YAO', this.state["phedc-bao-yao"]]); }}>
                  <td>30</td>
                  <td>BAO YAO</td>
                  <td>{this.checkConnection2(this.state["phedc-bao-yao"].server_time)}</td>
                  <td className={bao_yao_glitch ? "text-warning font-weight-bold" : ""}>
                    {this.checkConnection222(this.state["phedc-bao-yao"].server_time)
                      ? this.getMixedValue(bao_yao_glitch, bao_yao?.mw)
                      : 0}
                  </td>
                  <td>{(bao_yao_glitch === null) ? bao_yao?.v : 0}</td>
                </tr>

                <tr></tr>
                <tr>
                  <td></td>
                  <td>TOTAL BILATERAL</td>
                  <td></td>
                  <td>{totalBilateral.toFixed(2)}</td>
                  <td></td>
                </tr> 
              </tbody>
            </table>
          </div>
          <div className="bl-counter-div">
            <table className="bl-counter-tg">
                <thead>
                    <tr>
                    <th className="bl-counter-tg-zb4j"></th>
                    <th className="bl-counter-tg-zb4j">LEGEND</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                    <td>CN</td>
                    <td>CONNECTED</td>
                    </tr>
                    <tr>
                    <td>NC</td>
                    <td>NOT CONNECTED</td>
                    </tr>
                    <tr>
                    <td>PNDG</td>
                    <td>PENDING</td>
                    </tr>                                        
                </tbody>
                </table> 
          </div>
        </div>
        {this.state.ModalState && <Modal setModalFalse={this.setModalFalse} modalData={this.state.modal_data} />}
      </div>      
    </>
    )         
  }
}

export default withRouter(All_Bilateral);
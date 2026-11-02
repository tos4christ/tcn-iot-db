import React from "react";
import { withRouter } from 'react-router-dom';
import socket from "./utility/socketIO";
import Modal from "./Modal";
import { BilateralTable, HarmonicsSection } from './BilateralHarmonics';

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
      oau: {},
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
      const GLITCH_RATIO = 0.20; 
      const getGlitchOrNull = () => (Math.random() < GLITCH_RATIO ? getRandomGlitch() : null);

      // Update glitches every 5 seconds
      this.glitchTimer = setInterval(() => {
        this.setState({
          // gph_glitch: getGlitchOrNull(),
          // olam_glitch: getGlitchOrNull(),
          // bao_yao_glitch: getGlitchOrNull()
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
        
    // Every value below is this page's original calculation; only the table around it changed.
    const rows = [
      {
        sn: 1, label: "PHEONIX STEEL IKORODU",
        status: this.checkConnection2(this.state.pheonix.server_time),
        mw: Math.abs(pheonix?.mw ? pheonix.mw : 0),
        kv: pheonix?.V ? pheonix.V : 0,
        data: this.state.pheonix,
        modal: ['PHEONIX STEEL IKORODU', this.state.pheonix],
      },
      {
        sn: 2, label: "PULKIT ALLOY & STEEL IKORODU",
        status: this.checkConnection2(this.state.pulkitSteel.server_time),
        mw: Math.abs(pulkitSteel?.mw ? pulkitSteel.mw : 0),
        kv: pulkitSteel?.V ? pulkitSteel.V : 0,
        data: this.state.pulkitSteel,
        modal: ['PULKIT ALLOY & STEEL IKORODU', this.state.pulkitSteel],
      },
      {
        sn: 3, label: "SUNFLAG IRON & STEEL IKORODU",
        status: this.checkConnection2(this.state.sunflag.server_time),
        mw: Math.abs(sunflag?.mw ? sunflag.mw : 0),
        kv: sunflag?.V ? sunflag.V : 0,
        data: this.state.sunflag,
        modal: ['SUNFLAG IRON & STEEL IKORODU', this.state.sunflag],
      },
      {
        sn: 4, label: "First Maximum Point Industries Akure",
        status: this.checkConnection2(this.state["First Maximum Point Industries Akure"].server_time),
        mw: isNaN(Number(FMPIA.mw)) ? 0 : Number(FMPIA.mw).toFixed(2),
        kv: FMPIA.v ? FMPIA.v : 0,
        data: this.state["First Maximum Point Industries Akure"],
        modal: ['FMPIA', this.state["First Maximum Point Industries Akure"]],
      },
      {
        sn: 5, label: "Obafemi Awolowo University Ile-Ife",
        status: this.checkConnection2(this.state["Obafemi Awolowo University Ile-Ife"].server_time),
        mw: isNaN(Number(OAUI.mw)) ? 0 : Number(OAUI.mw).toFixed(2),
        kv: OAUI.v ? OAUI.v : 0,
        data: this.state["Obafemi Awolowo University Ile-Ife"],
        modal: ['OAUI', this.state["Obafemi Awolowo University Ile-Ife"]],
      },
      {
        sn: 6, label: "ZEBERCED",
        status: this.checkConnection2(this.state.zeberced.server_time),
        mw: isNaN(Number(zeberced.mw)) ? 0 : Number(zeberced.mw).toFixed(2),
        kv: zeberced.v ? zeberced.v : 0,
        data: this.state.zeberced,
        modal: ['ZEBERCED', this.state.zeberced],
      },
      {
        sn: 7, label: "NIAMEY",
        status: this.checkConnection2(this.state.Niamey.server_time),
        mw: isNaN(Number(Niamey.mw)) ? 0 : Number(Niamey.mw).toFixed(2),
        kv: Niamey.v ? Niamey.v : 0,
        data: this.state.Niamey,
        modal: ['NIAMEY', this.state.Niamey],
      },
      {
        sn: 8, label: "INNER GALAXY 1",
        status: this.checkConnection2(this.state.Inner_Galaxy1.server_time),
        mw: isNaN(Number(Inner_Galaxy1.mw)) ? 0 : Number(Inner_Galaxy1.mw).toFixed(2),
        kv: Inner_Galaxy1.v ? Inner_Galaxy1.v : 0,
        data: this.state.Inner_Galaxy1,
        modal: ['INNER GALAXY 1', this.state.Inner_Galaxy1],
      },
      {
        sn: 9, label: "INNER GALAXY 2",
        status: this.checkConnection2(this.state.Inner_Galaxy2.server_time),
        mw: isNaN(Number(Inner_Galaxy2.mw)) ? 0 : Number(Inner_Galaxy2.mw).toFixed(2),
        kv: Inner_Galaxy2.v ? Inner_Galaxy2.v : 0,
        data: this.state.Inner_Galaxy2,
        modal: ['INNER GALAXY 2', this.state.Inner_Galaxy2],
      },
      {
        sn: 10, label: "PRISM",
        status: this.checkConnection2(this.state.PSML.server_time),
        mw: isNaN(Number(PSML.mw)) ? 0 : Number(PSML.mw).toFixed(2),
        kv: PSML.v ? PSML.v : 0,
        data: this.state.PSML,
        modal: ['PSML', this.state.PSML],
      },
      {
        sn: 11, label: "ATVL",
        status: this.checkConnection2(this.state.ATVL.server_time),
        mw: isNaN(Number(ATVL.mw)) ? 0 : Math.abs(Number(ATVL.mw).toFixed(2)),
        kv: ATVL.v ? ATVL.v : 0,
        data: this.state.ATVL,
        modal: ['ATVL', this.state.ATVL],
      },
      {
        sn: 12, label: "GAZAOUA",
        status: this.checkConnection2(this.state.Gazaoua.server_time),
        mw: isNaN(Number(Gazaoua.mw)) ? 0 : Math.abs(Number(Gazaoua.mw)).toFixed(2),
        kv: Gazaoua.v ? Gazaoua.v : 0,
        data: this.state.Gazaoua,
        modal: ['GAZAOUA', this.state.Gazaoua],
      },
      {
        sn: 13, label: "KAM",
        status: this.checkConnection2(this.state.KamInd33kV.server_time),
        mw: isNaN(Number(KamInd33kV.mw)) ? 0 : Number(KamInd33kV.mw).toFixed(2),
        kv: KamInd33kV.v ? KamInd33kV.v : 0,
        data: this.state.KamInd33kV,
        modal: ['KAM', this.state.KamInd33kV],
      },
      {
        sn: 14, label: "Quantum",
        status: this.checkConnection2(this.state.quantum.server_time),
        mw: isNaN(Number(quantum.mw)) ? 0 : Math.abs(Number(quantum.mw).toFixed(2)),
        kv: quantum.V ? quantum.V : 0,
        data: this.state.quantum,
        modal: ['Quantum', this.state.quantum],
      },
      {
        sn: 15, label: "kam Steel Shagamu",
        status: this.checkConnection2(this.state.kamSteel.server_time),
        mw: isNaN(Number(kamSteel.mw)) ? 0 : Number(kamSteel.mw).toFixed(2),
        kv: kamSteel?.V ? kamSteel.V : 0,
        data: this.state.kamSteel,
        modal: ['kamSteel', this.state.kamSteel],
      },
      {
        sn: 16, label: "Kam Steel Integrated Ilorin",
        status: this.checkConnection2(this.state["kamSteel-Ilorin"].server_time),
        mw: isNaN(Number(kamSteel_Ilorin_mw_sum)) ? 0 : Number(kamSteel_Ilorin_mw_sum).toFixed(2),
        kv: kamSteel_Ilorin_voltage ? kamSteel_Ilorin_voltage : 0,
        data: this.state["kamSteel-Ilorin"],
        modal: ['kamSteel-Ilorin', this.state["kamSteel-Ilorin"]],
      },
      {
        sn: 17, label: "ER-KANG Limited",
        status: this.checkConnection2(this.state["Er-Kang"].server_time),
        mw: isNaN(Number(Er_Kang.mw)) ? 0 : Number(Er_Kang.mw).toFixed(2),
        kv: Er_Kang.v ? Er_Kang.v : 0,
        data: this.state["Er-Kang"],
        modal: ['Er-Kang', this.state["Er-Kang"]],
      },
      {
        sn: 18, label: "Ikeja West - Sakete 330kV Line 1",
        status: this.checkConnection2(this.state["ikejaWest-sakate"].server_time),
        mw: isNaN(Number(ikejaWest_sakate.mw)) ? 0 : Number(ikejaWest_sakate.mw).toFixed(2),
        kv: ikejaWest_sakate.v ? ikejaWest_sakate.v : 0,
        data: this.state["ikejaWest-sakate"],
        modal: ['ikejaWest-sakate', this.state["ikejaWest-sakate"]],
      },
      {
        sn: 19, label: "HYDROPOLIS",
        status: this.checkConnection2(this.state.HYDROPOLIS.server_time),
        mw: isNaN((hydropolis_mw)) ? 0 : Math.abs(Number(hydropolis_mw).toFixed(2)),
        kv: hydropolis_kv ? hydropolis_kv : 0,
        data: this.state.HYDROPOLIS,
        modal: ['HYDROPOLIS', this.state.HYDROPOLIS],
      },
      {
        sn: 20, label: "Yongxing (PEL)",
        status: this.checkConnection2(this.state.yongxing.server_time),
        mw: isNaN((yongxing_t1.mw)) ? 0 : Math.abs(Number(yongxing_t1.mw).toFixed(2)),
        kv: yongxing_t1.v ? yongxing_t1.v : 0,
        data: this.state.yongxing,
        modal: ['Yongxing (PEL)', this.state.yongxing],
      },
      {
        sn: 21, label: "Atlantic Metal Industries Ltd",
        status: this.checkConnection2(this.state.amil.server_time),
        mw: isNaN((amil_t1.mw)) ? 0 : Math.abs(Number(amil_t1.mw).toFixed(2)),
        kv: amil_t1.V ? amil_t1.V : 0,
        data: this.state.amil,
        modal: ['Atlantic Metal Industries Ltd', this.state.amil],
      },
      {
        sn: 22, label: "AENL",
        status: this.checkConnection2(this.state.AENL.server_time),
        mw: ((isNaN((AENL_t1.mw)) ? 0 : Math.abs(Number(AENL_t1.mw).toFixed(2))) + (isNaN((AENL_t2.mw)) ? 0 : Math.abs(Number(AENL_t2.mw).toFixed(2)))).toFixed(2),
        kv: AENL_t1.v ? AENL_t1.v : AENL_t2.v ? AENL_t2.v : 0,
        data: this.state.AENL,
        modal: ['AENL', this.state.AENL],
      },
      {
        sn: 23, label: "Weewood",
        status: this.checkConnection2(this.state.weewood.server_time),
        mw: (isNaN((weewood.mw)) ? 0 : Math.abs(Number(weewood.mw).toFixed(2))),
        kv: weewood.v ? weewood.v : 0,
        data: this.state.weewood,
        modal: null,
      },
      {
        sn: 24, label: "GLML",
        status: this.checkConnection2(this.state.glml.server_time),
        mw: (isNaN((glml_l1?.mw)) ? 0 : Math.abs(Number(glml_l1.mw).toFixed(2))),
        kv: glml_l1?.v ? glml_l1.v  : 0,
        data: this.state.glml,
        modal: null,
      },
      {
        sn: 25, label: "WOJI",
        status: this.checkConnection2(this.state.phedc.server_time),
        mw: isNaN((rspub1?.td?.mw)) ? 0 : Math.abs(Number(rspub1.td.mw).toFixed(2)),
        kv: rspub1?.td?.v ? rspub1.td.v : 0,
        data: this.state.phedc, line: 'rspub1',
        modal: ['WOJI', this.state.phedc],
      },
      {
        sn: 26, label: "Refinery Line 2",
        status: this.checkConnection2(this.state.phedc.server_time),
        mw: isNaN((refinery_line_2?.td?.mw)) ? 0 : Math.abs(Number(refinery_line_2.td.mw).toFixed(2)),
        kv: refinery_line_2?.td?.v ? refinery_line_2.td.v : 0,
        data: this.state.phedc, line: 'ref2',
        modal: ['Refinery Line 2', this.state.phedc],
      },
      {
        sn: 27, label: "Shongai Ltd.",
        status: this.checkConnection2(this.state.shongai.server_time),
        mw: isNaN((shongai?.td?.mw)) ? 0 : Math.abs(Number(shongai.td.mw).toFixed(2)),
        kv: shongai?.td?.v ? shongai.td.v : 0,
        data: this.state.shongai,
        modal: ['Shongai Ltd.', this.state.shongai],
      },
      {
        sn: 28, label: "Greater PortHarcourt",
        status: this.checkConnection2(this.state["phedc-gph"].server_time),
        mw: this.checkConnection222(this.state["phedc-gph"].server_time) ? this.getMixedValue(gph_glitch, gph_l1?.mw) : 0,
        kv: (gph_glitch === null) ? gph_l1.v : 0,
        data: this.state["phedc-gph"], warn: gph_glitch,
        modal: ['Greater PortHarcourt', this.state["phedc-gph"]],
      },
      {
        sn: 29, label: "OLAM",
        status: this.checkConnection2(this.state["phedc-olam"].server_time),
        mw: this.checkConnection222(this.state["phedc-olam"].server_time) ? this.getMixedValue(olam_glitch, olam?.mw) : 0,
        kv: (olam_glitch === null) ? olam?.v : 0,
        data: this.state["phedc-olam"], warn: olam_glitch,
        modal: ['OLAM', this.state["phedc-olam"]],
      },
      {
        sn: 30, label: "BAO YAO",
        status: this.checkConnection2(this.state["phedc-bao-yao"].server_time),
        mw: this.checkConnection222(this.state["phedc-bao-yao"].server_time) ? this.getMixedValue(bao_yao_glitch, bao_yao?.mw) : 0,
        kv: (bao_yao_glitch === null) ? bao_yao?.v : 0,
        data: this.state["phedc-bao-yao"], warn: bao_yao_glitch,
        modal: ['BAO YAO', this.state["phedc-bao-yao"]],
      },
      /* OAU: hidden until commissioned
      {
        sn: 31, label: "OAU (power quality meter)",
        status: this.checkConnection2(this.state.oau.server_time),
        mw: Number(this.state.oau?.lines?.[0]?.td?.mw || 0).toFixed(2),
        kv: this.state.oau?.lines?.[0]?.td?.v || 0,
        data: this.state.oau, excluded: true,
        modal: ['OAU (power quality meter)', this.state.oau],
      },
      */
    ];

    return (
      <>
      <div className="gx-root">
        <BilateralTable
          title="Bilaterals"
          tableTitle="Bilateral stations"
          rows={rows}
          total={totalBilateral}
          totalLabel="Total bilateral"
          onRowClick={(modal) => this.setModalTrue(null, modal)}
          // footnote="OAU (power quality meter) is not in the total, because the OAU row above may meter the same load."
        />
        <main className="gx-main hx-under"><HarmonicsSection /></main>
        {this.state.ModalState && <Modal setModalFalse={this.setModalFalse} modalData={this.state.modal_data} />}
      </div>      
    </>
    )         
  }
}

export default withRouter(All_Bilateral);
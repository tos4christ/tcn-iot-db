import React from "react";
import CanvasJSReact from "./canvasjs.react";
import { withRouter, Redirect } from 'react-router-dom';
import socket from "../utility/socketIO";
import get_stations from "../stations_adder";
import DateTime from "../DateTime";
// var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

var startTime = 0, options, dataPoints = [], dataPoints_2 = [], time_holder = [], endTime = 0;

  
class AccidentRepLive extends React.Component {
    constructor(props) {
        super(props);
        this.updateFeederState = this.updateFeederState.bind(this);
        this.dataPoints_async = [];
        this.dataPoints_2_async = [];
        this.state = {
            dataPoints: [{x: 0, y: 0}],
            timer: 1,
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
    endTime = new Date();
    // document.getElementById("timeToRender").innerHTML = "Time to Render: " + (endTime - startTime) + "ms";
    if(this.props.history.location.pathname === "/charts") {
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
            // console.log(parsedMessage, 'frequency001 message');
          } catch(e) { console(e) }        
          const returnObject = {}
          this.setState(prevState => {
            prevState["frequency"] = parsedMessage;
            returnObject["frequency"] = prevState["frequency"];
            return returnObject;
          })
        });
        this.updateFeederState();
    }
    this.canvas = this.chart.canvas;
    if(this.canvas) {
        this.ctxx = this.canvas.getContext("2d", { willReadFrequently: true });
    }
  }

  componentWillUnmount() {  
    socket.off("client_message_111");
    socket.off("client_message_222");
    socket.off("frequency001");
  }
//   componentDidUpdate() {
//     endTime = new Date();
//     //document.getElementById("timeToRender").innerHTML = "Time to Render: " + (endTime - startTime) + "ms";
//   }

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
  if (server_time === undefined || server_time === null) {
    return false;
  }
  try {
    // Get current epoch time
    const time_now = (new Date()).getTime();     
    // if 30 seconds have passed without the time changing from the current time then return disconnected
    // 30 seconds equals to 30,000 milliseconds
    // if the time difference is greater than time_diff then return disconnected
    const time_diff = (time_now - server_time) > 30000;
    if (server_time.length === 0 || time_diff ) {
        return false;
    } else if (!isNaN(server_time)) {
        return true;
    }
  } catch(e) {
    // console.log(e);
    return false;
  }
 }
 checkConnection3(t1, t2) {
  const connected = true;
  const disconnected = false;
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
    console.log(e);
    return disconnected;
  }    
 }
 checkConnection4(t1, t2, t3) {
  const connected = true;
  const disconnected = false;
  if ((t1 === undefined || t1 === null) && (t2 === undefined || t2 === null) && (t3 === undefined || t3 === null)) {
    return disconnected
  }
  try {
    t1 = t1 ? t1 : '';
    t2 = t2 ? t2 : '';
    t3 = t3 ? t3 : '';
    // Get current epoch time
    const time_now = (new Date()).getTime();  
    // if 30 seconds have passed without the time changing from the current time then return disconnected
    // 30 seconds equals to 30,000 milliseconds
    // if the time difference is greater than time_diff then return disconnected
    const time_diff_1 = (time_now - t1) > 30000;
    const time_diff_2 = (time_now - t2) > 30000;
    const time_diff_3 = (time_now - t3) > 30000;
    if ( time_diff_1 || time_diff_2 || time_diff_3 ) {
      return disconnected
    } else if (!isNaN(t1) && !isNaN(t2) && !isNaN(t3)) {
        return connected
    }
  } catch(e) {
    console.log(e);
    return disconnected;
  }    
 }
 checkConnection3_b(t1, t2) {
  const connected = true;
  const disconnected = false;
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
    if ( time_diff_1 && time_diff_2 ) {
      return disconnected
    } else if (!isNaN(t1) || !isNaN(t2)) {
        return connected
    } 
  } catch(e) {
    console.log(e);
    return disconnected;
  }    
 }
 checkConnection4_delta(t1, t2, t3) {
  const connected = true;
  const disconnected = false;
  if ((t1 === undefined || t1 === null) && (t2 === undefined || t2 === null) && (t3 === undefined || t3 === null)) {
    return disconnected
  }
  try {
    t1 = t1 ? t1 : '';
    t2 = t2 ? t2 : '';
    t3 = t3 ? t3 : '';
    // Get current epoch time
    const time_now = (new Date()).getTime();  
    // if 30 seconds have passed without the time changing from the current time then return disconnected
    // 30 seconds equals to 30,000 milliseconds
    // if the time difference is greater than time_diff then return disconnected
    const time_diff_1 = (time_now - t1) > 30000;
    const time_diff_2 = (time_now - t2) > 30000;
    const time_diff_3 = (time_now - t3) > 30000;
    if (time_diff_1  && time_diff_3) {
      return disconnected
    } else if ( !isNaN(t1) || !isNaN(t3) ) {
        return connected
    }
  } catch(e) {
    console.log(e);
    return disconnected;
  }    
 }
 updateFeederState() {
  
  setTimeout(() => {
    setInterval(() => {
      // console.log(disconnectedFeeders, 'disconnected feeders');
      this.props.getDisconnectedFeeders(this.disconnectedFeeders);
      this.props.getFeeders(this.Feeders);
      // console.log(this.disconnectedFeeders, 'disconnected feeders');
    }, 2000);
  }, 10000);
  
 }

  render() {
    // startTime = Date.now();
  
    const stations_array = get_stations(this.state);
    const olorunsogonipp_gs = stations_array['OLORUNSOGO NIPP'];
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
    const kainji_gs = stations_array['KAINJI (HYDRO)'];
    const afam4_gs = stations_array['AFAM IV & V (GAS)'];
    const shiroro_gs = stations_array['SHIRORO (HYDRO)'];
    const paras_gs = stations_array['PARAS ENERGY (GAS)'];
    const omotosonipp_gs = stations_array['OMOTOSHO NIPP (GAS)'];
    const geregunipp_gs = stations_array['GEREGU NIPP (GAS)'];
    const azura_gs = stations_array['AZURA-EDO IPP (GAS)'];
    const phMain_ts = stations_array['PORT-HARCOURT MAIN'];
    // const transamadi_gs = stations_array['TRANS-AMADI (GAS)'];
    const ibom_gs = stations_array['IBOM POWER (GAS)'];
    const gbarain_gs = stations_array['GBARAIN NIPP (GAS)'];
    const olorunsogogas_gs = stations_array['OLORUNSOGO (GAS)'];
    const dadinkowa_gs = stations_array['DADINKOWA G.S (HYDRO)'];
    const zungeru_gs = stations_array['ZUNGERU'];
    const taopex_gs = stations_array['TAOPEX'];


    const totalGeneration = (Number(riversipp_gs.mw) < 0 ? 0 : Number(riversipp_gs.mw))+
    (Number(afam6_gs.mw) < 0 ? 0 : Number(afam6_gs.mw))+ 
    (Number(paras_gs.mw) < 0 ? 0 : Number(paras_gs.mw))+ 
    (Number(geregugas_gs.mw) < 0 ? 0 : Number(geregugas_gs.mw))+ 
    (Number(geregunipp_gs.mw) < 0 ? 0 : Number(geregunipp_gs.mw))+ 
    (Number(omotosogas_gs.mw) < 0 ? 0 : Number(omotosogas_gs.mw))+ 
    (Number(omotosonipp_gs.mw) < 0 ? 0 : Number(omotosonipp_gs.mw))+ 
    (Number(sapelenipp_gs.mw) < 0 ? 0 : Number(sapelenipp_gs.mw))+ 
    (Number(sapelesteam_gs.mw) < 0 ? 0 : Number(sapelesteam_gs.mw))+
    (Number(omoku_gs.mw) < 0 ? 0 : Number(omoku_gs.mw))+ 
    (Number(odukpani_gs.mw) < 0 ? 0 : Number(odukpani_gs.mw))+ 
    (Number(alaoji_gs.mw) < 0 ? 0 : Number(alaoji_gs.mw))+ 
    (Number(azura_gs.mw) < 0 ? 0 : Number(azura_gs.mw))+ 
    (Number(zungeru_gs.mw) < 0 ? 0 : Number(zungeru_gs.mw))+ 
    (Number(taopex_gs.mw) < 0 ? 0 : Number(taopex_gs.mw))+
    (Number(olorunsogonipp_gs.mw) < 0 ? 0 : Number(olorunsogonipp_gs.mw)) + 
    (Number(ihovbor_gs.mw) < 0 ? 0 : Number(ihovbor_gs.mw))+ 
    (Number(phMain_ts.mw) < 0 ? 0 : Number(phMain_ts.mw))+
    (Number(ibom_gs.mw) < 0 ? 0 : Number(ibom_gs.mw))+ 
    (Number(olorunsogogas_gs.mw) < 0 ? 0 : Number(olorunsogogas_gs.mw))+ 
    (Number(gbarain_gs.mw) < 0 ? 0 : Number(gbarain_gs.mw))+ 
    (Number(shiroro_gs.mw) < 0 ? 0 : Number(shiroro_gs.mw))+ 
    (Number(afam4_gs.mw) < 0 ? 0 : Number(afam4_gs.mw))+ 
    (Number(kainji_gs.mw) < 0 ? 0 : Number(kainji_gs.mw))+ 
    (Number(egbin_gs.mw) < 0 ? 0 : Number(egbin_gs.mw))+ 
    (Number(okpai_gs.mw) < 0 ? 0 : Number(okpai_gs.mw))+ 
    (Number(delta_gs.mw) < 0 ? 0 : Number(delta_gs.mw))+ 
    (Number(jebba_gs.mw) < 0 ? 0 : Number(jebba_gs.mw))+ 
    (Number(dadinkowa_gs.mw) < 0 ? 0 : Number(dadinkowa_gs.mw));

    // Create an Array of objects to hold the data points for disconnected feeders
    this.Feeders = [
      {name: "RIVERS IPP (GAS)", isOn: this.checkConnection2(this.state.riversIppPs.server_time), mw: riversipp_gs.mw},
      {name: "AFAM VI (GAS/STEAM)", isOn: this.checkConnection2(this.state.afamViTs.server_time), mw: afam6_gs.mw},
      {name: "GEREGU (GAS)", isOn: this.checkConnection2(this.state.gereguPs.server_time), mw: geregugas_gs.mw},
      {name: "OMOTOSHO (GAS)", isOn: this.checkConnection3(this.state.omotosho2.server_time, this.state.omotosho1.server_time), mw: omotosogas_gs.mw},
      {name: "OMOTOSHO NIPP (GAS)", isOn: this.checkConnection2(this.state.omotoshoNippPs.server_time), mw: omotosonipp_gs.mw},
      {name: "DELTA (GAS)", isOn: this.checkConnection4_delta(this.state.delta3.server_time , this.state.deltaGs.server_time, this.state.delta2.server_time), mw: delta_gs.mw},
      {name: "SAPELE NIPP (GAS)", isOn: this.checkConnection2(this.state.sapeleNippPs.server_time), mw: sapelenipp_gs.mw},
      {name: "OMOKU (GAS)", isOn: this.checkConnection2(this.state.omokuPs1.server_time), mw: omoku_gs.mw},
      {name: "AZURA-EDO IPP (GAS)", isOn: this.checkConnection2(this.state.ihovborNippPs.server_time), mw: azura_gs.mw},
      {name: "TRANS-AMADI (GAS)", isOn: this.checkConnection2(this.state.phMain.server_time), mw: phMain_ts.mw},
      {name: "GEREGU NIPP (GAS)", isOn: this.checkConnection2(this.state.gereguPs.server_time), mw: geregunipp_gs.mw},
      {name: "GBARAIN NIPP (GAS)", isOn: true, mw: gbarain_gs.mw},
      {name: "DADINKOWA G.S (HYDRO)", isOn: this.checkConnection2(this.state.dadinKowaGs.server_time), mw: dadinkowa_gs.mw},
      {name: "PARAS ENERGY (GAS)", isOn: this.checkConnection2(this.state.parasEnergyPs.server_time), mw: paras_gs.mw},
      {name: "IBOM POWER (GAS)", isOn: this.checkConnection2(this.state.eket.server_time), mw: ibom_gs.mw},
      {name: "JEBBA (HYDRO)", isOn: this.checkConnection2(this.state.jebbaTs.server_time), mw: jebba_gs.mw},
      {name: "OLORUNSOGO (GAS)", isOn: this.checkConnection3(this.state.olorunsogo1.server_time, this.state.olorunsogoPhase1Gs.server_time), mw: olorunsogogas_gs.mw},
      {name: "OLORUNSOGO NIPP", isOn: this.checkConnection3(this.state.olorunsogo1.server_time, this.state.olorunsogoPhase1Gs.server_time), mw: olorunsogonipp_gs.mw},
      {name: "SAPELE (STEAM)", isOn: this.checkConnection2(this.state.sapeleNippPs.server_time), mw: sapelesteam_gs.mw},
      {name: "ODUKPANI NIPP (GAS)", isOn: this.checkConnection2(this.state.odukpaniNippPs.server_time), mw: odukpani_gs.mw},
      {name: "ALAOJI NIPP (GAS)", isOn: this.checkConnection2(this.state.alaoji.server_time), mw: alaoji_gs.mw},
      {name: "IHOVBOR NIPP (GAS)", isOn: this.checkConnection2(this.state.ihovborNippPs.server_time), mw: ihovbor_gs.mw},
      {name: "SHIRORO (HYDRO)", isOn: this.checkConnection2(this.state.shiroroPs.server_time), mw: shiroro_gs.mw},
      {name: 'AFAM IV & V (GAS)', isOn: this.checkConnection3_b(this.state.afamVPs.server_time, this.state.afamIv_vPs.server_time), mw: afam4_gs.mw},
      {name: "KAINJI (HYDRO)", isOn: this.checkConnection2(this.state.kainjiTs.server_time), mw: kainji_gs.mw},
      {name: "EGBIN (STEAM)", isOn: this.checkConnection2(this.state.egbinPs.server_time), mw: egbin_gs.mw},
      {name: "OKPAI (GAS/STEAM)", isOn: this.checkConnection2(this.state.okpaiGs.server_time), mw: okpai_gs.mw},
      {name: "ZUNGERU G.S", isOn: this.checkConnection2(this.state.zungeru.server_time), mw: zungeru_gs.mw},
      {name: "TAOPEX G.S", isOn: this.checkConnection2(this.state.taopex.server_time), mw: taopex_gs.mw},
      {totalGeneration, isOn: true}
    ]
    this.disconnectedFeeders = this.Feeders.filter((feeder) => !feeder.isOn);
    
    var data = [];
    var dataSeries = { type: "line", name: "generation", cursor: "crosshair",  axisYIndex: 0 };
    var dataSeries_2 = { type: "line", name: "frequency", cursor: "crosshair", lineDashType: "dash", axisYIndex: 1};
    
    const this_time = Math.round(Date.now()/1000);
    time_holder.push(this_time);
    // Hold state frequency in a variable
    var frequency = parseFloat(this.state.frequency?.value ? parseFloat(this.state.frequency.value) : 0);
        
    if( time_holder.length == 40 ) {
        const common_time = new Date();
        // Create Temporary Object to hold the data points for total generation
        const total_gen = Number(totalGeneration.toFixed(2));
        const temp_object = {x: (common_time), y: total_gen};

        // Create Temporary Object to hold the data points for frequency
        const frequency_object = {x: (common_time), y: frequency};

        dataPoints.push(temp_object);
        dataPoints_2.push(frequency_object);
        this.dataPoints_async.push(temp_object);
        this.dataPoints_2_async.push(frequency_object);

        // Create a permanent DataPoints Array that will not be shifted to hold all data
        time_holder = [];
    } 

    //console.log(this.dataPoints_async, 'dataPoints_async');
    //console.log(this.dataPoints_2_async, 'dataPoints_2_async');
    //console.log(dataPoints, 'dataPoints ');
    //console.log(dataPoints_2, 'dataPoints_2');

    // Check if the data points are greater than 100, if so, shift the data points to remove the first element
    if( this.dataPoints_async.length > 100 || this.dataPoints_2_async.length > 100 ) {
      const common_time = new Date();
      // Create Temporary Object to hold the data points for total generation
      const total_gen = Number(totalGeneration.toFixed(2));
      const temp_object = {x: (common_time), y: 0};

      // Create Temporary Object to hold the data points for frequency
      const frequency_object = {x: (common_time), y: 0};

      dataPoints.push(temp_object);
      dataPoints_2.push(frequency_object);
      //this.dataPoints_async.push(temp_object);
      //this.dataPoints_2_async.push(frequency_object);

      // this.dataPoints_async.shift();
      // this.dataPoints_2_async.shift();
  } 

    if(dataPoints.length > 25 || dataPoints_2.length > 25) {
        dataPoints.shift();
        dataPoints_2.shift();
    }

    dataSeries.dataPoints = dataPoints;
    dataSeries_2.dataPoints = dataPoints_2;

    data.push(dataSeries);
    data.push(dataSeries_2);
   
    options = {
        zoomEnabled: true,
        zoomType: "xy",
        theme: "light1",
        height : 500,
        width : 800,
        exportEnabled: true,
        animationEnabled: true,
        toolTip: {
            contentFormatter: function(e) {
                //console.log(e.entries);
                return e.entries[0].dataPoint.y + " MW" + " @ " + e.entries[0].dataPoint.x.toLocaleTimeString() + "<br />" + e.entries[1].dataPoint.y + " Hz" + " @ " + e.entries[1].dataPoint.x.toLocaleTimeString();
            },
            shared: true,
            //content: "x: {x}: y: {y}"
        },
        title: {
            text: "Real-Time Representation of Total Generation",
        },        
        axisX: {
            title: "Time",
            includeZero: false,
            crosshair: {
              enabled: true,
              snapToDataPoint: true,
            },
            titleFontSize: 20,
            titleFontWeight: 'bolder',
            titleMaxWidth: 100,
            // labelFormatter: function(e) {
            //     return DateTime(e.value).toLocaleTimeString();
            // },
            interval: 6,
            valueFormatString: "HH:mm:ss",
            intervalType: "second",
        },
        axisY: [{
            title: "Total Generation (MW)",
            lineColor: "#369EAD",
            titleFontSize: 20,
            titleMaxWidth: 500,
            titleFontWeight: 'bolder',
            crosshair: {
              enabled: true
            },
            //suffix: "MW",
            // maximum: 5500,
            // minimum: 2000,
            includeZero: false,
            titleWrap: true,
        },
        {
          title: "Frequency (Hz)",
          axisType: "secondary",
          lineColor: "#C24642",
          titleMaxWidth: 500,
          titleFontSize: 20,
          titleWrap: true,
          titleFontWeight: 'bolder',
          crosshair: {
            enabled: true
          },
          toolTipContent: "<b>{x}</b>: {y}hz",
          //suffix: "Hz",
          // maximum: 60,
          // minimum: 40,
          includeZero: false,
      }],
        data: data,
        };
    
    return (
      <div>
        <CanvasJSChart options={options} onRef={(ref) => (this.chart = ref)} />
        {/*You can get reference to the chart instance as shown above using onRef. This allows you to access all chart properties and methods*/}
      </div>
    );
  }
}

export default withRouter(AccidentRepLive);

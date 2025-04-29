import React from "react";
import CanvasJSReact from "./canvasjs.react";
import { withRouter, Redirect } from 'react-router-dom';
import socket from "../utility/socketIO";
import get_stations from "../stations_adder";
import DateTime from "../DateTime";
// var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

var startTime = 0,
  endTime = 0;
class AccidentRepLive extends React.Component {
    constructor(props) {
        super(props);
        this.updateDataPoints = this.updateDataPoints.bind(this);
        //this.updateDataPoints = this.updateDataPoints.bind(this);
        this.state = {
            dataPoints: [{x: 0, y: 0}],
            timer: 1,
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
    //document.getElementById("timeToRender").innerHTML = "Time to Render: " + (endTime - startTime) + "ms";
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
    }
    const canvas = this.chart.current;
    if(canvas) {
        this.ctx = canvas.getContext("2d", { willReadFrequently: true });
    }
    //const ctx = canvas.getContext("2d", { willReadFrequently: true });
  }

  updateDataPoints() {      
    const { dataPoints } = this.state;
    let { timer } = this.state;
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

    timer += 1;
    const newDataPoint = {
      x: timer,
      y: totalGeneration,
    };
    let finalDataPoint = [];
    if(dataPoints.length > 10000) {
      const update_dataPoints = dataPoints.slice(5000);
      finalDataPoint = update_dataPoints;
    } else {
        finalDataPoint = dataPoints;
    }
    this.setState({
      dataPoints: [...finalDataPoint, newDataPoint],
        timer: timer,
    });
    this.chart.render();
  }
  componentWillUnmount() {  
    socket.off("client_message_111");
    socket.off("client_message_222");
  }
  componentDidUpdate() {
    endTime = new Date();
    //document.getElementById("timeToRender").innerHTML = "Time to Render: " + (endTime - startTime) + "ms";
  }

  render() {
    startTime = new Date();
    
    var data = [];
    var dataSeries = { type: "line" };
    
    dataSeries.dataPoints = this.state.dataPoints;
    data.push(dataSeries);

    const spanStyle = {
        position: "absolute",
        top: "10px",
        fontSize: "20px",
        fontWeight: "bold",
        backgroundColor: "#d85757",
        padding: "0px 4px",
        color: "#ffffff",
      };
  
      const options = {
        zoomEnabled: true,
        animationEnabled: true,
        title: {
          text: "Real-Time Representation of Total Generation",
        },        
        axisX: {
          title: "Time",
          includeZero: false,
        },
        axisY: {
          title: "Total Generation (MW)",
          suffix: "MW",
          prefix: "",
          includeZero: false,
        },
        data: data, // random data
        context: this.ctx,
      };
    

    setInterval(() => {
        this.updateDataPoints();
        
        // this.chart.data[0].addTo("dataPoints", {
        //     x: timer,
        //     y: totalGeneration,
        // });
        //dataSeries.dataPoints = dataPoints;
    //data.push(dataSeries);
        this.chart.render();
    }, 1000);
    
   
    
    return (
      <div>
        <CanvasJSChart options={options} onRef={(ref) => (this.chart = ref)} />
        {/*You can get reference to the chart instance as shown above using onRef. This allows you to access all chart properties and methods*/}
        <span id="timeToRender" style={spanStyle}></span>
      </div>
    );
  }
}

export default withRouter(AccidentRepLive);

import React from "react";
import CanvasJSReact from "./canvasjs.react";
// var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

class AccidentAreasLive extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      
    };
  }
  componentDidMount() {
    this.canvas = this.chart.canvas;
    if(this.canvas) {
        this.ctxx = this.canvas.getContext("2d", { willReadFrequently: true });
    }
  } 
  render() {
    // console.log(this.props.feeders, "  The feeders");
    const totalGeneration = this.props.feeders[29]?.totalGeneration ? this.props.feeders[29].totalGeneration : 1;
    // console.log(Math.floor(Number(this.props.feeders[0]?.riversipp_gs?.mw ? (this.props.feeders[0].riversipp_gs.mw/totalGeneration)*100 : 0)), " rivers ipp gas");
    const options = {
      exportEnabled: true,
      animationEnabled: true,
      title: {
        text: "Generation by Power Plants",
      },
      data: [
        {
          type: "pie",
          startAngle: 75,
          toolTipContent: "<b>{label}</b>: {y}%",
          showInLegend: "true",
          legendText: "{label}",
          indexLabelFontSize: 16,
          indexLabel: "{label} - {y}%",
          dataPoints: [
            {y: Math.floor(Number(this.props.feeders[0]?.mw ? (this.props.feeders[0].mw/totalGeneration)*100 : 0)), label: "RIVERS IPP (GAS)"},
            {y: Math.floor(Number(this.props.feeders[1]?.mw ? (this.props.feeders[1].mw/totalGeneration)*100 : 0 )), label: "AFAM VI (GAS/STEAM)"},
            {y: Math.floor(Number(this.props.feeders[2]?.mw ? (this.props.feeders[2].mw/totalGeneration)*100 : 0)), label: "GEREGU (GAS)"},
            {y: Math.floor(Number(this.props.feeders[3]?.mw ? (this.props.feeders[3].mw/totalGeneration)*100 : 0)), label: "OMOTOSHO (GAS)"},
            {y: Math.floor(Number(this.props.feeders[4]?.mw ? (this.props.feeders[4].mw/totalGeneration)*100 : 0)), label: "OMOTOSHO NIPP (GAS)"},
            {y: Math.floor(Number(this.props.feeders[5]?.mw ? (this.props.feeders[5]?.mw/totalGeneration)*100 : 0)), label: "DELTA (GAS)"},
            {y: Math.floor(Number(this.props.feeders[6]?.mw ? (this.props.feeders[6]?.mw/totalGeneration)*100 : 0)), label: "SAPELE NIPP (GAS)"},
            {y: Math.floor(Number(this.props.feeders[7]?.mw ? (this.props.feeders[7]?.mw/totalGeneration)*100 : 0)), label: "OMOKU (GAS)"},
            {y: Math.floor(Number(this.props.feeders[8]?.mw ? (this.props.feeders[8]?.mw/totalGeneration)*100 : 0)), label: "AZURA-EDO IPP (GAS)"},
            {y: Math.floor(Number(this.props.feeders[9]?.mw ? (this.props.feeders[9]?.mw/totalGeneration)*100 : 0)), label: "TRANS-AMADI (GAS)"},
            {y: Math.floor(Number(this.props.feeders[10]?.mw ? (this.props.feeders[10]?.mw/totalGeneration)*100 : 0)), label: "GEREGU NIPP (GAS)"},
            {y: Math.floor(Number(this.props.feeders[11]?.mw ? (this.props.feeders[11]?.mw/totalGeneration)*100 : 0)), label: "GBARAIN NIPP (GAS)"},
            {y: Math.floor(Number(this.props.feeders[12]?.mw ? (this.props.feeders[12]?.mw/totalGeneration)*100 : 0)), label: "DADINKOWA G.S (HYDRO)"},
            {y: Math.floor(Number(this.props.feeders[13]?.mw ? (this.props.feeders[13]?.mw/totalGeneration)*100 : 0)), label: "PARAS ENERGY (GAS)"},
            {y: Math.floor(Number(this.props.feeders[14]?.mw ? (this.props.feeders[14]?.mw/totalGeneration)*100 : 0)), label: "IBOM POWER (GAS)"},
            {y: Math.floor(Number(this.props.feeders[15]?.mw ? (this.props.feeders[15]?.mw/totalGeneration)*100 : 0)), label: "JEBBA (HYDRO)"},
            {y: Math.floor(Number(this.props.feeders[16]?.mw ? (this.props.feeders[16]?.mw/totalGeneration)*100 : 0)), label: "OLORUNSOGO (GAS)"},
            {y: Math.floor(Number(this.props.feeders[17]?.mw ? (this.props.feeders[17]?.mw/totalGeneration)*100 : 0)), label: "OLORUNSOGO NIPP"},
            {y: Math.floor(Number(this.props.feeders[18]?.mw ? (this.props.feeders[18]?.mw/totalGeneration)*100 : 0)), label: "SAPELE (STEAM)"},
            {y: Math.floor(Number(this.props.feeders[19]?.mw ? (this.props.feeders[19]?.mw/totalGeneration)*100 : 0)), label: "ODUKPANI NIPP (GAS)"},
            {y: Math.floor(Number(this.props.feeders[20]?.mw ? (this.props.feeders[20]?.mw/totalGeneration)*100 : 0)), label: "ALAOJI NIPP (GAS)"},
            {y: Math.floor(Number(this.props.feeders[21]?.mw ? (this.props.feeders[21]?.mw/totalGeneration)*100 : 0)), label: "IHOVBOR NIPP (GAS)"},
            {y: Math.floor(Number(this.props.feeders[22]?.mw ? (this.props.feeders[22]?.mw/totalGeneration)*100 : 0)), label: "SHIRORO (HYDRO)"},
            {y: Math.floor(Number(this.props.feeders[23]?.mw ? (this.props.feeders[23]?.mw/totalGeneration)*100 : 0)), label: 'AFAM IV & V (GAS)'},
            {y: Math.floor(Number(this.props.feeders[24]?.mw ? (this.props.feeders[24]?.mw/totalGeneration)*100 : 0)), label: "KAINJI (HYDRO)"},
            {y: Math.floor(Number(this.props.feeders[25]?.mw ? (this.props.feeders[25]?.mw/totalGeneration)*100 : 0)), label: "EGBIN (STEAM)"},
            {y: Math.floor(Number(this.props.feeders[26]?.mw ? (this.props.feeders[26]?.mw/totalGeneration)*100 : 0)), label: "OKPAI (GAS/STEAM)"},
            {y: Math.floor(Number(this.props.feeders[27]?.mw ? (this.props.feeders[27]?.mw/totalGeneration)*100 : 0)), label: "ZUNGERU G.S"},
            {y: Math.floor(Number(this.props.feeders[28]?.mw ? (this.props.feeders[28]?.mw/totalGeneration)*100 : 0)), label: "TAOPEX G.S"}
          ],
        },
      ],
    };
    return (
      <div>
        <CanvasJSChart
          options={options}
          onRef={ref => this.chart = ref}
          /* onRef={ref => this.chart = ref} */
        />
        {/*You can get reference to the chart instance as shown above using onRef. This allows you to access all chart properties and methods*/}
      </div>
    );
  }
}

export default AccidentAreasLive;

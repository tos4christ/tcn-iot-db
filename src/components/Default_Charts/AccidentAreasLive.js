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
      theme: "light2",
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
            {y: Math.floor(Number(this.props.feeders[0]?.mw ? (this.props.feeders[0].mw/totalGeneration)*100 : 0)), label: "RIVERS IPP (GAS)", color: "#FFD700", legendMarkerColor: "#FFD700"},
            {y: Math.floor(Number(this.props.feeders[1]?.mw ? (this.props.feeders[1].mw/totalGeneration)*100 : 0 )), label: "AFAM VI (GAS/STEAM)", color: "#40E0D0", legendMarkerColor: "#40E0D0"},
            {y: Math.floor(Number(this.props.feeders[2]?.mw ? (this.props.feeders[2].mw/totalGeneration)*100 : 0)), label: "GEREGU (GAS)", color: "#FF7F50", legendMarkerColor: "#FF7F50"}, 
            {y: Math.floor(Number(this.props.feeders[2]?.mw ? (this.props.feeders[2].mw/totalGeneration)*100 : 0)), label: "GEREGU (GAS)", color: "#95A5A6", legendMarkerColor: "#95A5A6"},
            {y: Math.floor(Number(this.props.feeders[3]?.mw ? (this.props.feeders[3].mw/totalGeneration)*100 : 0)), label: "OMOTOSHO (GAS)", color: "#ECF0F1", legendMarkerColor: "#ECF0F1"},
            {y: Math.floor(Number(this.props.feeders[4]?.mw ? (this.props.feeders[4].mw/totalGeneration)*100 : 0)), label: "OMOTOSHO NIPP (GAS)", color: "#34495E", legendMarkerColor: "#34495E"},
            {y: Math.floor(Number(this.props.feeders[5]?.mw ? (this.props.feeders[5]?.mw/totalGeneration)*100 : 0)), label: "DELTA (GAS)", color: "#7F8C8D", legendMarkerColor: "#7F8C8D"},
            {y: Math.floor(Number(this.props.feeders[6]?.mw ? (this.props.feeders[6]?.mw/totalGeneration)*100 : 0)), label: "SAPELE NIPP (GAS)", color: "#D35400", legendMarkerColor: "#D35400"},
            {y: Math.floor(Number(this.props.feeders[7]?.mw ? (this.props.feeders[7]?.mw/totalGeneration)*100 : 0)), label: "OMOKU (GAS)", color: "#E67E22", legendMarkerColor: "#E67E22"},
            {y: Math.floor(Number(this.props.feeders[8]?.mw ? (this.props.feeders[8]?.mw/totalGeneration)*100 : 0)), label: "AZURA-EDO IPP (GAS)", color: "#2ECC71", legendMarkerColor: "#2ECC71"},
            {y: Math.floor(Number(this.props.feeders[9]?.mw ? (this.props.feeders[9]?.mw/totalGeneration)*100 : 0)), label: "TRANS-AMADI (GAS)", color: "#F1C40F", legendMarkerColor: "#F1C40F"},
            {y: Math.floor(Number(this.props.feeders[10]?.mw ? (this.props.feeders[10]?.mw/totalGeneration)*100 : 0)), label: "GEREGU NIPP (GAS)", color: "#E74C3C", legendMarkerColor: "#E74C3C"},
            {y: Math.floor(Number(this.props.feeders[11]?.mw ? (this.props.feeders[11]?.mw/totalGeneration)*100 : 0)), label: "GBARAIN NIPP (GAS)", color: "#3498DB", legendMarkerColor: "#3498DB"},
            {y: Math.floor(Number(this.props.feeders[12]?.mw ? (this.props.feeders[12]?.mw/totalGeneration)*100 : 0)), label: "DADINKOWA G.S (HYDRO)", color: "#8E44AD", legendMarkerColor: "#8E44AD"},
            {y: Math.floor(Number(this.props.feeders[13]?.mw ? (this.props.feeders[13]?.mw/totalGeneration)*100 : 0)), label: "PARAS ENERGY (GAS)", color: "#F2994A", legendMarkerColor: "#F2994A"},
            {y: Math.floor(Number(this.props.feeders[14]?.mw ? (this.props.feeders[14]?.mw/totalGeneration)*100 : 0)), label: "IBOM POWER (GAS)", color: "#27AE60", legendMarkerColor: "#27AE60"},
            {y: Math.floor(Number(this.props.feeders[15]?.mw ? (this.props.feeders[15]?.mw/totalGeneration)*100 : 0)), label: "JEBBA (HYDRO)", color: "#2D9CDB", legendMarkerColor: "#2D9CDB"},
            {y: Math.floor(Number(this.props.feeders[16]?.mw ? (this.props.feeders[16]?.mw/totalGeneration)*100 : 0)), label: "OLORUNSOGO (GAS)", color: "#EB5757", legendMarkerColor: "#EB5757"},
            {y: Math.floor(Number(this.props.feeders[17]?.mw ? (this.props.feeders[17]?.mw/totalGeneration)*100 : 0)), label: "OLORUNSOGO NIPP", color: "#F2D1D1", legendMarkerColor: "#F2D1D1"},
            {y: Math.floor(Number(this.props.feeders[18]?.mw ? (this.props.feeders[18]?.mw/totalGeneration)*100 : 0)), label: "SAPELE (STEAM)", color: "#1B998B", legendMarkerColor: "#1B998B"},
            {y: Math.floor(Number(this.props.feeders[19]?.mw ? (this.props.feeders[19]?.mw/totalGeneration)*100 : 0)), label: "ODUKPANI NIPP (GAS)", color: "#6B4226", legendMarkerColor: "#6B4226"},
            {y: Math.floor(Number(this.props.feeders[20]?.mw ? (this.props.feeders[20]?.mw/totalGeneration)*100 : 0)), label: "ALAOJI NIPP (GAS)", color: "#FF6F61", legendMarkerColor: "#FF6F61"},
            {y: Math.floor(Number(this.props.feeders[21]?.mw ? (this.props.feeders[21]?.mw/totalGeneration)*100 : 0)), label: "IHOVBOR NIPP (GAS)", color: "#581845", legendMarkerColor: "#581845"},
            {y: Math.floor(Number(this.props.feeders[22]?.mw ? (this.props.feeders[22]?.mw/totalGeneration)*100 : 0)), label: "SHIRORO (HYDRO)", color: "#900C3F", legendMarkerColor: "#900C3F"},
            {y: Math.floor(Number(this.props.feeders[23]?.mw ? (this.props.feeders[23]?.mw/totalGeneration)*100 : 0)), label: 'AFAM IV & V (GAS)', color: "#C70039", legendMarkerColor: "#C70039"},
            {y: Math.floor(Number(this.props.feeders[24]?.mw ? (this.props.feeders[24]?.mw/totalGeneration)*100 : 0)), label: "KAINJI (HYDRO)", color: "#DAF7A6", legendMarkerColor: "#DAF7A6"},
            {y: Math.floor(Number(this.props.feeders[25]?.mw ? (this.props.feeders[25]?.mw/totalGeneration)*100 : 0)), label: "EGBIN (STEAM)", color: "#FFC300", legendMarkerColor: "#FFC300"},
            {y: Math.floor(Number(this.props.feeders[26]?.mw ? (this.props.feeders[26]?.mw/totalGeneration)*100 : 0)), label: "OKPAI (GAS/STEAM)", color: "#5733FF", legendMarkerColor: "#5733FF"},
            {y: Math.floor(Number(this.props.feeders[27]?.mw ? (this.props.feeders[27]?.mw/totalGeneration)*100 : 0)), label: "ZUNGERU G.S", color: "#33FF57", legendMarkerColor: "#33FF57"},
            {y: Math.floor(Number(this.props.feeders[28]?.mw ? (this.props.feeders[28]?.mw/totalGeneration)*100 : 0)), label: "TAOPEX G.S", color: "#FF5733", legendMarkerColor: "#FF5733"}
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

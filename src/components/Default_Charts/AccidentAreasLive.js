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
      // legend:{
      //   cursor: "pointer",
      //   verticalAlign: "top",
      //   horizontalAlign: "right",
      //   dockInsidePlotArea: true,
      //   itemclick: function(e) {
      //     if (typeof(e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
      //       e.dataSeries.visible = false;
      //     } else{
      //       e.dataSeries.visible = true;
      //     }
      //     e.chart.render();
      //   }
      // },
      title: {
        text: "Generation by Power Plants",
      },
      //theme: "light3",
      data: [
        {
          type: "pie",
          radius: "85%",
          explodeOnClick: true,
          startAngle: 5,
          toolTipContent: "<b>{label}</b>: {y}%",
          showInLegend: "true",
          legendText: "{label}",
          indexLabelFontSize: 12,
          indexLabel: "{label}-{y}%",
          dataPoints: [
            {exploded: true, y: Math.floor(Number(this.props.feeders[0]?.mw ? (this.props.feeders[0].mw/totalGeneration)*100 : 0)), label: "RIVERS IPP", color: "#FFD700", legendMarkerColor: "#FFD700"},
            {exploded: true,y: Math.floor(Number(this.props.feeders[1]?.mw ? (this.props.feeders[1].mw/totalGeneration)*100 : 0 )), label: "AFAM VI", color: "#40E0D0", legendMarkerColor: "#40E0D0"},
            {exploded: true,y: Math.floor(Number(this.props.feeders[2]?.mw ? (this.props.feeders[2].mw/totalGeneration)*100 : 0)), label: "GEREGU", color: "#FF7F50", legendMarkerColor: "#FF7F50"}, 
            {exploded: true,y: Math.floor(Number(this.props.feeders[3]?.mw ? (this.props.feeders[3].mw/totalGeneration)*100 : 0)), label: "OMOTOSHO", color: "#ECF0F1", legendMarkerColor: "#ECF0F1"},
            {exploded: true,y: Math.floor(Number(this.props.feeders[4]?.mw ? (this.props.feeders[4].mw/totalGeneration)*100 : 0)), label: "OMOTOSHO NIPP", color: "#34495E", legendMarkerColor: "#34495E"},
            {exploded: true,y: Math.floor(Number(this.props.feeders[5]?.mw ? (this.props.feeders[5]?.mw/totalGeneration)*100 : 0)), label: "DELTA ", color: "#7F8C8D", legendMarkerColor: "#7F8C8D"},
            {y: Math.floor(Number(this.props.feeders[6]?.mw ? (this.props.feeders[6]?.mw/totalGeneration)*100 : 0)), label: "SAPELE NIPP", color: "#D35400", legendMarkerColor: "#D35400"},
            {y: Math.floor(Number(this.props.feeders[7]?.mw ? (this.props.feeders[7]?.mw/totalGeneration)*100 : 0)), label: "OMOKU", color: "#E67E22", legendMarkerColor: "#E67E22"},
            {y: Math.floor(Number(this.props.feeders[8]?.mw ? (this.props.feeders[8]?.mw/totalGeneration)*100 : 0)), label: "AZURA-EDO IPP", color: "#2ECC71", legendMarkerColor: "#2ECC71"},
            {exploded: true,y: Math.floor(Number(this.props.feeders[9]?.mw ? (this.props.feeders[9]?.mw/totalGeneration)*100 : 0)), label: "TRANS-AMADI", color: "#F1C40F", legendMarkerColor: "#F1C40F"},
            {exploded: true,y: Math.floor(Number(this.props.feeders[10]?.mw ? (this.props.feeders[10]?.mw/totalGeneration)*100 : 0)), label: "GEREGU NIPP", color: "#E74C3C", legendMarkerColor: "#E74C3C"},
            {y: Math.floor(Number(this.props.feeders[11]?.mw ? (this.props.feeders[11]?.mw/totalGeneration)*100 : 0)), label: "GBARAIN NIPP", color: "#3498DB", legendMarkerColor: "#3498DB"},
            {y: Math.floor(Number(this.props.feeders[12]?.mw ? (this.props.feeders[12]?.mw/totalGeneration)*100 : 0)), label: "DADINKOWA G.S", color: "#8E44AD", legendMarkerColor: "#8E44AD"},
            {y: Math.floor(Number(this.props.feeders[13]?.mw ? (this.props.feeders[13]?.mw/totalGeneration)*100 : 0)), label: "PARAS ENERGY", color: "#F2994A", legendMarkerColor: "#F2994A"},
            {y: Math.floor(Number(this.props.feeders[14]?.mw ? (this.props.feeders[14]?.mw/totalGeneration)*100 : 0)), label: "IBOM POWER", color: "#27AE60", legendMarkerColor: "#27AE60"},
            {y: Math.floor(Number(this.props.feeders[15]?.mw ? (this.props.feeders[15]?.mw/totalGeneration)*100 : 0)), label: "JEBBA", color: "#2D9CDB", legendMarkerColor: "#2D9CDB"},
            {y: Math.floor(Number(this.props.feeders[16]?.mw ? (this.props.feeders[16]?.mw/totalGeneration)*100 : 0)), label: "OLORUNSOGO", color: "#EB5757", legendMarkerColor: "#EB5757"},
            {y: Math.floor(Number(this.props.feeders[17]?.mw ? (this.props.feeders[17]?.mw/totalGeneration)*100 : 0)), label: "OLORUNSOGO NIPP", color: "#F2D1D1", legendMarkerColor: "#F2D1D1"},
            {exploded: true,y: Math.floor(Number(this.props.feeders[18]?.mw ? (this.props.feeders[18]?.mw/totalGeneration)*100 : 0)), label: "SAPELE", color: "#1B998B", legendMarkerColor: "#1B998B"},
            {exploded: true,y: Math.floor(Number(this.props.feeders[19]?.mw ? (this.props.feeders[19]?.mw/totalGeneration)*100 : 0)), label: "ODUKPANI NIPP", color: "#6B4226", legendMarkerColor: "#6B4226"},
            {exploded: true,y: Math.floor(Number(this.props.feeders[20]?.mw ? (this.props.feeders[20]?.mw/totalGeneration)*100 : 0)), label: "ALAOJI NIPP", color: "#FF6F61", legendMarkerColor: "#FF6F61"},
            {exploded: true,y: Math.floor(Number(this.props.feeders[21]?.mw ? (this.props.feeders[21]?.mw/totalGeneration)*100 : 0)), label: "IHOVBOR NIPP", color: "#581845", legendMarkerColor: "#581845"},
            {y: Math.floor(Number(this.props.feeders[22]?.mw ? (this.props.feeders[22]?.mw/totalGeneration)*100 : 0)), label: "SHIRORO", color: "#900C3F", legendMarkerColor: "#900C3F"},
            {y: Math.floor(Number(this.props.feeders[23]?.mw ? (this.props.feeders[23]?.mw/totalGeneration)*100 : 0)), label: "AFAM IV & V", color: "#C70039", legendMarkerColor: "#C70039"},
            {y: Math.floor(Number(this.props.feeders[24]?.mw ? (this.props.feeders[24]?.mw/totalGeneration)*100 : 0)), label: "KAINJI", color: "#DAF7A6", legendMarkerColor: "#DAF7A6"},
            {exploded: true,y: Math.floor(Number(this.props.feeders[25]?.mw ? (this.props.feeders[25]?.mw/totalGeneration)*100 : 0)), label: "EGBIN", color: "#FFC300", legendMarkerColor: "#FFC300"},
            {exploded: true,y: Math.floor(Number(this.props.feeders[26]?.mw ? (this.props.feeders[26]?.mw/totalGeneration)*100 : 0)), label: "OKPAI", color: "#5733FF", legendMarkerColor: "#5733FF"},
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

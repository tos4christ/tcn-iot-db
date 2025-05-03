import React from "react";
import DashboardNavLive from '../components/Header/DashboardNavLive';
import AccidentAreasLive from '../components/Default_Charts/AccidentAreasLive';
import AccidentRepLive from '../components/Default_Charts/AccidentsRepLive';
import FeederCard from "../components/Default_Charts/FeederCard";


// const body = <div className='container-fluid' >
//     <div className="row my-1 pt-4 text-justify">
//       <div className="col-sm-3">
//         <div className='bg-white shadow m-1 p-3'>
//           <AccidentAreasLive/>
//         </div>
//       </div>
//       <div className="col-sm-9">
//         <div> <FeederCard name="Geregu" isOn={true} display="none" /> </div>
//         <div className='bg-white shadow m-1 p-3'><AccidentRepLive getDisconnectedFeeders={getDisconnectedFeeders} /></div>
//       </div>
//     </div>
//   </div>

class DashboardHomeLive extends React.Component {
    constructor(props) {
        super(props);
        this.getDisconnectedFeeders = this.getDisconnectedFeeders.bind(this);
        this.getFeeders = this.getFeeders.bind(this);
        this.state = {
          disconnectedFeeders: [],
          name: "Dashboard",
          isOn: true,
          display: "flex",
          feeders: []
        }
    }
  componentDidMount() {
    //localStorage.setItem("isLoggedIn", true);
  }
  getDisconnectedFeeders(feeders) {
    const disconnectedFeeders = feeders
    this.setState({ disconnectedFeeders: disconnectedFeeders });
  }
  getFeeders(feeders) {
    this.setState({feeders: feeders});
    // console.log("Feeders: ", feeders);
  }

  render() {

    const disconnectedFeedersDisplay = this.state.disconnectedFeeders.map((feeder) => {
      return <FeederCard name={feeder.name} isOn={feeder.isOn} display={"flex"} />;
    }
    );
    // console.log("Disconnected Feeders Display: ", disconnectedFeedersDisplay);
    //console.log("Disconnected Feeders Display: ", this.state.disconnectedFeeders);
    const body = <div className='container-fluid' >
            <div className="row my-1 pt-1 text-justify">
              <div className="col-sm-3">
                <div className='bg-white shadow m-0 p-1'>
                  <AccidentAreasLive feeders={this.state.feeders} />
                </div>
              </div>
              <div className="col-sm-9">
                <div style={{display: "flex"}}> {disconnectedFeedersDisplay} </div>
                <div className='bg-white shadow m-1 p-3'><AccidentRepLive getDisconnectedFeeders={this.getDisconnectedFeeders} getFeeders={this.getFeeders} /></div>
              </div>
            </div>
          </div>

    return (
        <DashboardNavLive body={body}/>
    );
  }
}

export default DashboardHomeLive;

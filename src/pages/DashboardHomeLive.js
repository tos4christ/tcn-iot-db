import React from "react";
import DashboardNavLive from '../components/Header/DashboardNavLive';
import AccidentAreasLive from '../components/Default_Charts/AccidentAreasLive';
import AccidentRepLive from '../components/Default_Charts/AccidentsRepLive';

const body = <div className='container-fluid' >
    <div className="row my-4 pt-4 text-justify">
      <div className="col-sm-3">
        <div className='bg-white shadow m-1 p-3'>
          <AccidentAreasLive/>
        </div>
      </div>
      <div className="col-sm-9">
        <div className='bg-white shadow m-1 p-3'><AccidentRepLive/></div>
      </div>
    </div>
  </div>

class DashboardHomeLive extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }
  componentDidMount() {
    //localStorage.setItem("isLoggedIn", true);
  }
  render() {

    return (
        <DashboardNavLive body={body}/>
    );
  }
}

export default DashboardHomeLive;

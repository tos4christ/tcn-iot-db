import React from "react";
import "../assets/css/Modal.css";
//import get_stations from "./stations_splitter";

class Modal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            setModal: {},
            modalData: this.props.modalData
        }
    }
    
    render() {
      // Iterate over the length of the array
      // get all the lines that add up to the station
      // display all the components in a table in the modal
      const li_array = [];
      li_array.push(<li className="li_table"><span>Time</span>|<span>Equipment</span>|<span>Power</span>|<span>KV</span>|<span>AMP</span>|<span>MVAR</span></li>);
      const equipment_array = this.state.modalData.slice(1);
      const station_name = this.props.modalData[0];
      const time = equipment_array[0].t;
      this.props.modalData.slice(1).forEach(element => {
        if(element.units) {
          const units = element.units;
          units.forEach(unit => {
            const line_name = unit.id;
            if(unit.gd) {
              const item = unit.gd;
              const power = item.mw;
              const voltage = item.V;
              const reactive_power = item.mvar;
              const current = item.A;
              li_array.push(<li className="li_table"><span>{time}</span>|<span>{line_name}</span>|<span>{power}</span>|<span>{voltage}</span>|<span>{current}</span>|<span>{reactive_power}</span></li>);
            } else if(unit.td) {
              const item = unit.td;
              const power = item.mw;
              const voltage = item.V;
              const reactive_power = item.mvar;
              const current = item.A;
              li_array.push(<li className="li_table"><span>{time}</span>|<span>{line_name}</span>|<span>{power}</span>|<span>{voltage}</span>|<span>{current}</span>|<span>{reactive_power}</span></li>);
            }
          })          
        } else if(element.lines) {
          const lines = element.lines;
          lines.forEach(line => {
            const line_name = line.id;
            if(line.gd) {
              const item = line.gd;
              const power = item.mw;
              const voltage = item.V;
              const reactive_power = item.mvar;
              const current = item.A;
              li_array.push(<li className="li_table"><span>{time}</span>|<span>{line_name}</span>|<span>{power}</span>|<span>{voltage}</span>|<span>{current}</span>|<span>{reactive_power}</span></li>);
            } else if(line.td) {
              const item = line.td;
              const power = item.mw;
              const voltage = item.V;
              const reactive_power = item.mvar;
              const current = item.A;
              li_array.push(<li className="li_table"><span>{time}</span>|<span>{line_name}</span>|<span>{power}</span>|<span>{voltage}</span>|<span>{current}</span>|<span>{reactive_power}</span></li>);
            }
          })          
        }        
      });
      
      // console.log(li_div_array, " this is the li array");
      

      // Iterate over each item
      // this.props.modalData.forEach( line => {

      //   // add each item to each array

      // });

        return (
            <div className="modalBackground">
              <div className="modalContainer">
                <div className="titleCloseBtn">
                  <button
                    onClick={() => {
                      return this.props.setModalFalse();
                    }}
                  >
                    X
                  </button>
                </div>
                <div className="title">
                    { station_name }
                </div>
                <div className="body">
                  <ul className="">                    
                    {
                      li_array
                    }
                  </ul>
                </div>
                <div className="footer">
                  <button
                    onClick={() => {
                      return this.props.setModalFalse();
                    }}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          );
    }
}

export default Modal;

import React from "react";
// import "../assets/css/Modal.css";
import get_stations from "./stations_splitter";

class Modal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            setModal: {}
        }
    }

    render() {
      // Iterate over the length of the array
      // get all the lines that add up to the station
      // display all the components in a table in the modal
      const lines_name = [];
      const power = [];
      const voltage = [];
      const reactive_power = [];
      const current = [];
      console.log(this.props.modalData, " this is the modal data ");
      // const items_length = this.props.modalData.length;

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
                  Station | Load | Voltage | MegaWatt | Current
                </div>
                <div className="body">
                  <p>The next page looks amazing. Hope you want to go there!</p>
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

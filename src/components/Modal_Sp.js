import React from "react";
import "../assets/css/Modal.css";

const style = {
    modal: {
        position: "fixed",
        top: "5%",
        left: "15%",
        width: "70%",
        height: "100%",
        background: "grey",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      },      
      modal_content: {
        background: "grey",
        padding: "20px",
        borderRadius: "8px",
        textAlign: "center",
        width: "100%",
        height: "100%",
        overflow: "scroll"
      }
}

class Modal_Sp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
            dataArray: []
        }
    }
    handleSubmission(e, position) {
        // console.log(position, e.target.value);
        const value = {};
        value[position] = e.target.value;
        this.props.setDeclaration([position, e.target.value]);
        // Set The state of the data for the target

    }
    
    render() {
      // Iterate over the length of the array
      // get all the lines that add up to the station
      // display all the components in a table in the modal

        return (
            <div className="">
                {this.props.isOpen && (
                    <div className="modal" style={style.modal}>
                        <div className="modal-content" style={style.modal_content}>
                            <div className="title">
                                INPUT/EDIT DECLARATION FOR GENERATING STATIONS
                            </div>
                            <div className="body">
                            <table className="sp-tg">
                                <thead>
                                    <tr>
                                    <th className="ncc-tg-zb4j">S/N</th>
                                    <th className="ncc-tg-zb4j">STATIONS</th>                                    
                                    <th className="ncc-tg-zb4j ">DECLARATION</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr >
                                        <td>1</td>
                                        <td>RIVERS IPP (GAS)</td>                                        
                                        <td>
                                            <input onChange={(e) => this.handleSubmission(e, 1)} placeholder="Declared MW"></input>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>2</td>
                                        <td>AFAM VI (GAS/STEAM)</td>                                    
                                        <td>
                                            <input onChange={(e) => this.handleSubmission(e, 2)} placeholder="Declared MW"></input>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>3</td>
                                        <td>GEREGU (GAS)</td>                                    
                                        <td>
                                            <input onChange={(e) => this.handleSubmission(e, 3)} placeholder="Declared MW"></input>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>4</td>
                                        <td>OMOTOSHO (GAS)</td>                                    
                                        <td>
                                            <input onChange={(e) => this.handleSubmission(e, 4)} placeholder="Declared MW"></input>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>5</td>
                                        <td>OMOTOSHO NIPP (GAS)</td>                                    
                                        <td>
                                            <input onChange={(e) => this.handleSubmission(e, 5)} placeholder="Declared MW"></input>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>6</td>
                                        <td>DELTA (GAS)</td>                                    
                                        <td>
                                            <input onChange={(e) => this.handleSubmission(e, 6)} placeholder="Declared MW"></input>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>7</td>
                                        <td>SAPELE NIPP (GAS)</td>                                    
                                        <td>
                                            <input onChange={(e) => this.handleSubmission(e, 7)} placeholder="Declared MW"></input>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>8</td>
                                        <td>OMOKU (GAS)</td>                                    
                                        <td>
                                            <input onChange={(e) => this.handleSubmission(e, 8)} placeholder="Declared MW"></input>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>9</td>
                                        <td>AZURA-EDO IPP (GAS)</td>                                    
                                        <td>
                                            <input onChange={(e) => this.handleSubmission(e, 9)} placeholder="Declared MW"></input>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>10</td>
                                        <td>TRANS-AMADI (GAS)</td>                                    
                                        <td>
                                            <input onChange={(e) => this.handleSubmission(e, 10)} placeholder="Declared MW"></input>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>11</td>
                                        <td>GEREGU NIPP (GAS)</td>                                    
                                        <td>
                                            <input onChange={(e) => this.handleSubmission(e, 11)} placeholder="Declared MW"></input>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>12</td>
                                        <td>GBARAIN NIPP (GAS)</td>                                    
                                        <td>
                                            <input onChange={(e) => this.handleSubmission(e, 12)} placeholder="Declared MW"></input>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>13</td>
                                        <td>DADINKOWA G.S (HYDRO)</td>                                    
                                        <td>
                                            <input onChange={(e) => this.handleSubmission(e, 13)} placeholder="Declared MW"></input>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>14</td>
                                        <td>PARAS ENERGY (GAS)</td>                                    
                                        <td>
                                            <input onChange={(e) => this.handleSubmission(e, 14)} placeholder="Declared MW"></input>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>15</td>
                                        <td>IBOM POWER (GAS)</td>                                    
                                        <td>
                                            <input onChange={(e) => this.handleSubmission(e, 15)} placeholder="Declared MW"></input>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>16</td>
                                        <td>JEBBA (HYDRO)</td>                                    
                                        <td>
                                            <input onChange={(e) => this.handleSubmission(e, 16)} placeholder="Declared MW"></input>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>17</td>
                                        <td>OLORUNSOGO (GAS)</td>                                    
                                        <td>
                                            <input onChange={(e) => this.handleSubmission(e, 17)} placeholder="Declared MW"></input>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>18</td>
                                        <td>OLORUNSOGO NIPP</td>                                    
                                        <td>
                                            <input onChange={(e) => this.handleSubmission(e, 18)} placeholder="Declared MW"></input>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>19</td>
                                        <td>SAPELE (STEAM)</td>                                    
                                        <td>
                                            <input onChange={(e) => this.handleSubmission(e, 19)} placeholder="Declared MW"></input>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>20</td>
                                        <td>ODUKPANI NIPP (GAS)</td>                                    
                                        <td>
                                            <input onChange={(e) => this.handleSubmission(e, 20)} placeholder="Declared MW"></input>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>21</td>
                                        <td>ALAOJI NIPP (GAS)</td>                                    
                                        <td>
                                            <input onChange={(e) => this.handleSubmission(e, 21)} placeholder="Declared MW"></input>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>22</td>
                                        <td>IHOVBOR NIPP (GAS)</td>                                    
                                        <td>
                                            <input onChange={(e) => this.handleSubmission(e, 22)} placeholder="Declared MW"></input>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>23</td>
                                        <td>SHIRORO (HYDRO)</td>                                    
                                        <td>
                                            <input onChange={(e) => this.handleSubmission(e, 23)} placeholder="Declared MW"></input>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>24</td>
                                        <td>{'AFAM IV & V (GAS)'}</td>                                    
                                        <td>
                                            <input onChange={(e) => this.handleSubmission(e, 24)} placeholder="Declared MW"></input>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>25</td>
                                        <td>KAINJI (HYDRO)</td>                                    
                                        <td>
                                            <input onChange={(e) => this.handleSubmission(e, 25)} placeholder="Declared MW"></input>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>26</td>
                                        <td>EGBIN (STEAM)</td>                                    
                                        <td>
                                            <input onChange={(e) => this.handleSubmission(e, 26)} placeholder="Declared MW"></input>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>27</td>
                                        <td>OKPAI (GAS/STEAM)</td>                                    
                                        <td>
                                            <input onChange={(e) => this.handleSubmission(e, 27)} placeholder="Declared MW"></input>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>28</td>
                                        <td>ZUNGERU G.S</td>                                    
                                        <td>
                                            <input onChange={(e) => this.handleSubmission(e, 28)} placeholder="Declared MW"></input>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>29</td>
                                        <td>TAOPEX G.S</td>                                    
                                        <td>
                                            <input onChange={(e) => this.handleSubmission(e, 29)} placeholder="Declared MW"></input>
                                        </td>
                                    </tr>
                                    <tr></tr>
                                    <tr>
                                    <td></td>
                                    </tr> 
                                </tbody>
                                </table> 
                            </div>
                        </div>
                    </div>
                )}
            </div>
          );
    }
}

export default Modal_Sp;

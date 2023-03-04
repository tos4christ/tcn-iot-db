import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faWind } from '@fortawesome/free-solid-svg-icons'

class WeatherWidget extends React.Component {

    render() {
        return (
            <section className="container-fluid" style={{"background-color": "#4B515D"}}>
                <div className="row">
                    <div className="col-9 py-3" style={{"background-color": "#4B515D"}}>
                        <div className="row d-flex py-3 justify-content-center align-items-center">
                            <div className="col-md-8 col-lg-6 col-xl-4">
                                <div className="card" style={{"color": "#4B515D", "border-radius": "35px"}}>
                                    <div className="card-body p-4">
                                        <div className="d-flex">
                                        <h6 className="flex-grow-1">ODUKPANI G.S</h6>
                                        <h6>15:07</h6>
                                        </div>
                                        <div className="d-flex flex-column text-center mt-5 mb-4">
                                        <h6 className="display-4 mb-0 font-weight-bold" style={{"color": "#1C2331"}}> 13°C </h6>
                                        <span className="small" style={{"color": "#868B94"}}>Stormy</span>
                                        </div>
                                        <div className="d-flex align-items-center">
                                        <div className="flex-grow-1" style={{"fontSize": "1rem"}}>
                                            <div><i className="fas fa-wind fa-fw" style={{"color": "#868B94"}}></i> <span className="ms-1"> 40 km/h
                                            </span></div>
                                            <div><i className="fas fa-tint fa-fw" style={{"color": "#868B94"}}></i> <span className="ms-1"> 84% </span>
                                            </div>
                                            <div><i className="fas fa-sun fa-fw" style={{"color": "#868B94"}}></i> <span className="ms-1"> 0.2h </span>
                                            </div>
                                        </div>
                                        <div>
                                            <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-weather/ilu1.webp"
                                            width="100px"/>
                                        </div>
                                        {/* {https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-weather/ilu3.webp -- Sunny} */}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-8 col-lg-6 col-xl-4">
                                <div className="card" style={{"color": "#4B515D", "border-radius": "35px"}}>
                                <div className="card-body p-4">
                                    <div className="d-flex">
                                    <h6 className="flex-grow-1">OKPAI G.S</h6>
                                    <h6>15:07</h6>
                                    </div>
                                    <div className="d-flex flex-column text-center mt-5 mb-4">
                                    <h6 className="display-4 mb-0 font-weight-bold" style={{"color": "#1C2331"}}> 13°C </h6>
                                    <span className="small" style={{"color": "#868B94"}}>Stormy</span>
                                    </div>
                                    <div className="d-flex align-items-center">
                                    <div className="flex-grow-1" style={{"fontSize": "1rem"}}>
                                        <div><i className="fas fa-wind fa-fw" style={{"color": "#868B94"}}></i> <span className="ms-1"> 40 km/h
                                        </span></div>
                                        <div><i className="fas fa-tint fa-fw" style={{"color": "#868B94"}}></i> <span className="ms-1"> 84% </span>
                                        </div>
                                        <div><i className="fas fa-sun fa-fw" style={{"color": "#868B94"}}></i> <span className="ms-1"> 0.2h </span>
                                        </div>
                                    </div>
                                    <div>
                                        <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-weather/ilu1.webp"
                                        width="100px"/>
                                    </div>
                                    {/* {https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-weather/ilu3.webp -- Sunny} */}
                                    </div>
                                </div>
                                </div>
                            </div>
                            <div className="col-md-8 col-lg-6 col-xl-4">
                                <div className="card" style={{"color": "#4B515D", "border-radius": "35px"}}>
                                <div className="card-body p-4">
                                    <div className="d-flex">
                                    <h6 className="flex-grow-1">OMOTOSHO GAS G.S</h6>
                                    <h6>15:07</h6>
                                    </div>
                                    <div className="d-flex flex-column text-center mt-5 mb-4">
                                    <h6 className="display-4 mb-0 font-weight-bold" style={{"color": "#1C2331"}}> 13°C </h6>
                                    <span className="small" style={{"color": "#868B94"}}>Stormy</span>
                                    </div>
                                    <div className="d-flex align-items-center">
                                    <div className="flex-grow-1" style={{"fontSize": "1rem"}}>
                                        <div><i className="fas fa-wind fa-fw" style={{"color": "#868B94"}}></i> <span className="ms-1"> 40 km/h
                                        </span></div>
                                        <div><i className="fas fa-tint fa-fw" style={{"color": "#868B94"}}></i> <span className="ms-1"> 84% </span>
                                        </div>
                                        <div><i className="fas fa-sun fa-fw" style={{"color": "#868B94"}}></i> <span className="ms-1"> 0.2h </span>
                                        </div>
                                    </div>
                                    <div>
                                        <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-weather/ilu1.webp"
                                        width="100px"/>
                                    </div>
                                    {/* {https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-weather/ilu3.webp -- Sunny} */}
                                    </div>
                                </div>
                                </div>
                            </div>
                        </div>
                        <div className="row d-flex py-3 justify-content-center align-items-center">
                            <div className="col-md-8 col-lg-6 col-xl-4">
                                <div className="card" style={{"color": "#4B515D", "border-radius": "35px"}}>
                                <div className="card-body p-4">
                                    <div className="d-flex">
                                    <h6 className="flex-grow-1">OLORUNSOGO NIPP G.S</h6>
                                    <h6>15:07</h6>
                                    </div>
                                    <div className="d-flex flex-column text-center mt-5 mb-4">
                                    <h6 className="display-4 mb-0 font-weight-bold" style={{"color": "#1C2331"}}> 13°C </h6>
                                    <span className="small" style={{"color": "#868B94"}}>Stormy</span>
                                    </div>
                                    <div className="d-flex align-items-center">
                                    <div className="flex-grow-1" style={{"fontSize": "1rem"}}>
                                        <div><i className="fas fa-wind fa-fw" style={{"color": "#868B94"}}></i> <span className="ms-1"> 40 km/h
                                        </span></div>
                                        <div><i className="fas fa-tint fa-fw" style={{"color": "#868B94"}}></i> <span className="ms-1"> 84% </span>
                                        </div>
                                        <div><i className="fas fa-sun fa-fw" style={{"color": "#868B94"}}></i> <span className="ms-1"> 0.2h </span>
                                        </div>
                                    </div>
                                    <div>
                                        <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-weather/ilu1.webp"
                                        width="100px"/>
                                    </div>
                                    {/* {https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-weather/ilu3.webp -- Sunny} */}
                                    </div>
                                </div>
                                </div>
                            </div>
                            <div className="col-md-8 col-lg-6 col-xl-4">
                                <div className="card" style={{"color": "#4B515D", "border-radius": "35px"}}>
                                <div className="card-body p-4">
                                    <div className="d-flex">
                                    <h6 className="flex-grow-1">AFAM VI G.S</h6>
                                    <h6>15:07</h6>
                                    </div>
                                    <div className="d-flex flex-column text-center mt-5 mb-4">
                                    <h6 className="display-4 mb-0 font-weight-bold" style={{"color": "#1C2331"}}> 13°C </h6>
                                    <span className="small" style={{"color": "#868B94"}}>Stormy</span>
                                    </div>
                                    <div className="d-flex align-items-center">
                                    <div className="flex-grow-1" style={{"fontSize": "1rem"}}>
                                        <div><i className="fas fa-wind fa-fw" style={{"color": "#868B94"}}></i> <span className="ms-1"> 40 km/h
                                        </span></div>
                                        <div><i className="fas fa-tint fa-fw" style={{"color": "#868B94"}}></i> <span className="ms-1"> 84% </span>
                                        </div>
                                        <div><i className="fas fa-sun fa-fw" style={{"color": "#868B94"}}></i> <span className="ms-1"> 0.2h </span>
                                        </div>
                                    </div>
                                    <div>
                                        <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-weather/ilu1.webp"
                                        width="100px"/>
                                    </div>
                                    {/* {https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-weather/ilu3.webp -- Sunny} */}
                                    </div>
                                </div>
                                </div>
                            </div>
                            <div className="col-md-8 col-lg-6 col-xl-4">
                                <div className="card" style={{"color": "#4B515D", "border-radius": "35px"}}>
                                <div className="card-body p-4">
                                    <div className="d-flex">
                                    <h6 className="flex-grow-1">AZURA-EDO IPP G.S</h6>
                                    <h6>15:07</h6>
                                    </div>
                                    <div className="d-flex flex-column text-center mt-5 mb-4">
                                    <h6 className="display-4 mb-0 font-weight-bold" style={{"color": "#1C2331"}}> 13°C </h6>
                                    <span className="small" style={{"color": "#868B94"}}>Stormy</span>
                                    </div>
                                    <div className="d-flex align-items-center">
                                    <div className="flex-grow-1" style={{"fontSize": "1rem"}}>
                                        <div><i className="fas fa-wind fa-fw" style={{"color": "#868B94"}}></i> <span className="ms-1"> 40 km/h
                                        </span></div>
                                        <div><i className="fas fa-tint fa-fw" style={{"color": "#868B94"}}></i> <span className="ms-1"> 84% </span>
                                        </div>
                                        <div><i className="fas fa-sun fa-fw" style={{"color": "#868B94"}}></i> <span className="ms-1"> 0.2h </span>
                                        </div>
                                    </div>
                                    <div>
                                        <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-weather/ilu1.webp"
                                        width="100px"/>
                                    </div>
                                    {/* {https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-weather/ilu3.webp -- Sunny} */}
                                    </div>
                                </div>
                                </div>
                            </div>
                        </div>
                        {/* <div>
                            <FontAwesomeIcon icon={faWind} />
                        </div> */}
                    </div>
                    <div className="col-3 border border-3">
                        <div>
                            <h3 className="weather_h3 text-center">Weather Forecast</h3>
                            <ul className="weather_ul">
                                <li><marquee width="100%" height="30" direction="left" scrollamount="4" scrolldelay="10">EXPECT LIGHT SHOWERS AT ODUKPANI BETWEEN 1200-1400HRS</marquee></li>
                                <li><marquee width="100%" height="30" direction="left" scrollamount="4"> Clear Skies at Okpai all day </marquee></li>
                            </ul>
                        </div>
                    </div>
                </div>
                
                
            </section>
        )
    }
}
export default WeatherWidget;

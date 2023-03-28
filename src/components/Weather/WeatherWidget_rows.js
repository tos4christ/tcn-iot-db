import React from "react";
import { useParams, withRouter } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
    faEnvelope, faWind, faCloud, faSun, faCloudShowersHeavy, faTint,
    faTemperature0, faTornado, faSmog, faCloudSunRain, faCloudSun,
    faCloudRain, faCloudShowersWater, faCloudBolt, faBoltLightning,
    faCircle
 } from '@fortawesome/free-solid-svg-icons'



class WeatherWidget_rows extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            
        }
    }

    render() {
        return (
            <section className="container-fluid" style={{"backgroundColor": "#4B515D"}}>
                <div className="row">
                    <div className="col-9 py-3" style={{"backgroundColor": "#4B515D"}}>
                        <div className="row d-flex py-3 justify-content-center align-items-center">
                            <ul>
                                <li>
                                    <div className="weather_widget_row">
                                        <span>Station Name</span>
                                        <span>Date</span>
                                        <span>Icon</span>
                                        <span><FontAwesomeIcon icon={faTemperature0} /> Temp</span>
                                        <span><FontAwesomeIcon icon={faTemperature0} /> Feel</span>
                                        <span>Desc</span>
                                        <span><FontAwesomeIcon icon={faTint} /> Humidity</span>
                                        <span><FontAwesomeIcon icon={faWind} /> Speed</span>
                                        <span><FontAwesomeIcon icon={faWind} /> Degree</span>
                                        <span><FontAwesomeIcon icon={faWind} /> Gust</span>
                                        <span>Pressure</span>
                                    </div>
                                </li>
                                <li>
                                    <div className="weather_widget_row">
                                        <span>Ajah T.S</span>
                                        <span className="text_date"><b>14</b><br/> <i>19/06</i></span>
                                        <span><FontAwesomeIcon icon={faCloudShowersHeavy} /></span>
                                        <span> 15 °C</span>
                                        <span> 15 °C</span>
                                        <span>Cloudy</span>
                                        <span> 40%</span>
                                        <span> 2 kmph</span>
                                        <span>24 °C</span>
                                        <span>1 kmph</span>
                                        <span>Pressure</span>
                                    </div>
                                </li>
                                <li>
                                    <div className="weather_widget_row">
                                        <span>Abeokuta</span>
                                        <span className="text_date"><b>14</b><br/> <i>19/06</i></span>
                                        <span><FontAwesomeIcon icon={faCloudRain} /></span>
                                        <span> 10 °C</span>
                                        <span>11 °C</span>
                                        <span>Rainfall</span>
                                        <span>  10%</span>
                                        <span>8 kmph</span>
                                        <span>27 °C</span>
                                        <span>5 kmph</span>
                                        <span>Pressure</span>
                                    </div>
                                </li>
                            </ul>
                            
                            
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
export default withRouter(WeatherWidget_rows);

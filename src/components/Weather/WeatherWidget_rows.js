import React from "react";
import { useParams, withRouter } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
    faEnvelope, faWind, faCloud, faSun, faCloudShowersHeavy, faTint,
    faTemperature0, faTornado, faSmog, faCloudSunRain, faCloudSun,
    faCloudRain, faCloudShowersWater, faCloudBolt, faBoltLightning,
    faCircle
 } from '@fortawesome/free-solid-svg-icons'
 import socket from "../utility/socketIO";



class WeatherWidget_rows extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            weather_data: this.props.data,
            data_in_use: [],
            display_data: [],
            start: 0,
            stop: 20,
            stations: [],
            current_weather_stations_generation: [],
            current_weather_stations_transmission: [],
            hourly3_weather_stations_generation: [],
            hourly3_weather_stations_transmission: [],
            daily_weather_stations_generation: [],
            daily_weather_stations_transmission: [],
        }
    }
    componentDidMount() {
        if(this.props.history.location.pathname === "/nccweather") {
            socket.on("client_message_weather_current", data => {
              const { message } = data;
              const parsedStation = JSON.parse(message);
              const weather_stations_generation = parsedStation.filter(station => station.type === 'GENERATION');
              const weather_stations_transmission = parsedStation.filter(station => station.type === 'TRANSMISSION');
              const returnObject = {}
              this.setState(prevState => {
                prevState["current_weather_stations_generation"] = weather_stations_generation;
                prevState["current_weather_stations_transmission"] = weather_stations_transmission;
                returnObject["current_weather_stations_generation"] = prevState["current_weather_stations_generation"];
                returnObject["current_weather_stations_transmission"] = prevState["current_weather_stations_transmission"]
                return returnObject;
              })
            });
            socket.on("client_message_weather_hourly3", data => {
                const { message } = data;
                const parsedStation = JSON.parse(message);
                const weather_stations_generation = parsedStation.filter(station => station.type === 'GENERATION');
                const weather_stations_transmission = parsedStation.filter(station => station.type === 'TRANSMISSION');
                const returnObject = {}
                this.setState(prevState => {
                  prevState["hourly3_weather_stations_generation"] = weather_stations_generation;
                  prevState["hourly3_weather_stations_transmission"] = weather_stations_transmission;
                  returnObject["hourly3_weather_stations_generation"] = prevState["hourly3_weather_stations_generation"];
                  returnObject["hourly3_weather_stations_transmission"] = prevState["hourly3_weather_stations_transmission"]
                  return returnObject;
                })
            });
            socket.on("client_message_weather_daily", data => {
            const { message } = data;
            const parsedStation = JSON.parse(message);
            const weather_stations_generation = parsedStation.filter(station => station.type === 'GENERATION');
            const weather_stations_transmission = parsedStation.filter(station => station.type === 'TRANSMISSION');
            const returnObject = {}
            this.setState(prevState => {
                prevState["daily_weather_stations_generation"] = weather_stations_generation;
                prevState["daily_weather_stations_transmission"] = weather_stations_transmission;
                returnObject["daily_weather_stations_generation"] = prevState["daily_weather_stations_generation"];
                returnObject["daily_weather_stations_transmission"] = prevState["daily_weather_stations_transmission"]
                return returnObject;
            })
            });
          }
        if(this.props.data === "generation") {
            const display_data = this.state.current_weather_stations_generation.slice(this.state.start, (this.state.start + 6))
            this.setState({display_data});
            this.setState({data_in_use: this.state.current_weather_stations_generation})
        } else if(this.props.data === "transmission") {
            const display_data = this.state.current_weather_stations_transmission.slice(this.state.start, (this.state.start + 6))
            this.setState({display_data})
            this.setState({data_in_use: this.state.current_weather_stations_transmission})
        } 
    }
    next() {
        const { start } = this.state;
        const length = this.state.data_in_use.length;
        if(start + 6 <= length) {
            const display_data = this.state.data_in_use.slice(start, (start + 6))
            this.setState({display_data, start: (start + 6)})
        }        
    }
    previous() {
        const { start } = this.state;
        const length = this.state.data_in_use.length;
        if(start - 6 >= 0) {
            const display_data = this.state.data_in_use.slice((start - 6), start)
            this.setState({display_data, start: (start - 6)})
        }        
    }

    render() {
        function getIconUrl(icon_id)  {
            return `https://openweathermap.org/img/wn/${icon_id}@2x.png`
        }
        function getTime(dt) {
            const newDate = new Date(dt*1000);
            const hour = newDate.getHours();
            const minute = "0" + newDate.getMinutes();  
            return hour + ':' + minute.substring(1);
        }
        let stations;
        if(this.props.data === "generation") {
            stations = this.state.current_weather_stations_generation;
        } else if(this.props.data === "transmission") {
            stations = this.state.current_weather_stations_transmission;
        }   
        const display_1 = [];
        [0,1,2].forEach(index => {
            const station_weather_data = stations[index]?.current_weather_data ? stations[index].current_weather_data : null;
            if(!station_weather_data) {
                return;
            }
            const station_name = stations[index].name;
            const timer = getTime(station_weather_data.dt);
            const main = station_weather_data.weather[0].main;
            const description = station_weather_data.weather[0].description;
            const icon_url = getIconUrl(station_weather_data.weather[0].icon);
            const temp = station_weather_data.main.temp;
            const feels_like = station_weather_data.main.feels_like;
            const rain = station_weather_data.rain ? station_weather_data.rain["1h"] : "";
            const wind_speed = station_weather_data.wind.speed;
            const wind_degree = station_weather_data.wind.deg;
            const wind_gust = station_weather_data.wind.gust;
            const humidity = station_weather_data.main.humidity;
            display_1.push(
                <>                   
                             
                </>
            )
        });
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

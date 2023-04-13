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
        this.next = this.next.bind(this);
        this.previous = this.previous.bind(this);
        this.state = {
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
        // if(this.props.history.location.pathname === "/nccweather") {
        //     socket.on("client_message_weather_current", data => {
        //       const { message } = data;
        //       const parsedStation = JSON.parse(message);
        //       const weather_stations_generation = parsedStation.filter(station => station.type === 'GENERATION');
        //       const weather_stations_transmission = parsedStation.filter(station => station.type === 'TRANSMISSION');
        //       const returnObject = {}
        //       this.setState(prevState => {
        //         prevState["current_weather_stations_generation"] = weather_stations_generation;
        //         prevState["current_weather_stations_transmission"] = weather_stations_transmission;
        //         returnObject["current_weather_stations_generation"] = prevState["current_weather_stations_generation"];
        //         returnObject["current_weather_stations_transmission"] = prevState["current_weather_stations_transmission"]
        //         return returnObject;
        //       })
        //     });
        //     socket.on("client_message_weather_hourly3", data => {
        //         const { message } = data;
        //         const parsedStation = JSON.parse(message);
        //         const weather_stations_generation = parsedStation.filter(station => station.type === 'GENERATION');
        //         const weather_stations_transmission = parsedStation.filter(station => station.type === 'TRANSMISSION');
        //         const returnObject = {}
        //         this.setState(prevState => {
        //           prevState["hourly3_weather_stations_generation"] = weather_stations_generation;
        //           prevState["hourly3_weather_stations_transmission"] = weather_stations_transmission;
        //           returnObject["hourly3_weather_stations_generation"] = prevState["hourly3_weather_stations_generation"];
        //           returnObject["hourly3_weather_stations_transmission"] = prevState["hourly3_weather_stations_transmission"]
        //           return returnObject;
        //         })
        //     });
        //     socket.on("client_message_weather_daily", data => {
        //     const { message } = data;
        //     const parsedStation = JSON.parse(message);
        //     const weather_stations_generation = parsedStation.filter(station => station.type === 'GENERATION');
        //     const weather_stations_transmission = parsedStation.filter(station => station.type === 'TRANSMISSION');
        //     const returnObject = {}
        //     this.setState(prevState => {
        //         prevState["daily_weather_stations_generation"] = weather_stations_generation;
        //         prevState["daily_weather_stations_transmission"] = weather_stations_transmission;
        //         returnObject["daily_weather_stations_generation"] = prevState["daily_weather_stations_generation"];
        //         returnObject["daily_weather_stations_transmission"] = prevState["daily_weather_stations_transmission"]
        //         return returnObject;
        //     })
        //     });
        // } 
    }
    next() {
        const { stop } = this.state;
        const length = this.props.data === "generation" ? this.state.current_weather_stations_generation.length : this.state.current_weather_stations_transmission.length
        const remainder = length - stop;
        if(remainder >= 20) {            
            this.setState({start: stop, stop: (stop + 20)});
        } else if(remainder < 20 && remainder > 0) {
            this.setState({start: stop, stop: length});
        } else if(remainder === 0 || remainder < 0) {
            return;
        }      
    }
    previous() {
        const { start, stop } = this.state;
        const remainder = start - 20;
        if(remainder >= 20) {            
            this.setState({start: (start - 20), stop: (stop - 20)});
        } else if(remainder < 20 ) {
            return;
        } else if(remainder === 0) {
            this.setState({start: 0, stop: 20});
        }         
    }

    render() {
        function getIconUrl(icon_id)  {
            return `https://openweathermap.org/img/wn/${icon_id}@2x.png`
        }
        function getTime(dt) {
            const newDate = new Date(dt*1000);
            const hour = newDate.getHours();
            const minute = newDate.getMinutes();  
            return `${hour}:${minute.toString().length == 1 ? "0" + minute : minute}`;
        }
        let stations;
        if(this.props.data === "generation") {
            // const sortedStations = this.state.current_weather_stations_generation.sort((a, b) => a.name[0] - b.name[0]);
            const sortedStations = this.props.datas.sort((a, b) => a.name[0] - b.name[0]);
            stations = sortedStations.slice(this.state.start, this.state.stop);
        } else if(this.props.data === "transmission") {
            const sortedStations = this.props.datas.sort((a, b) => a.name[0] - b.name[0]);
            stations = sortedStations.slice(this.state.start, this.state.stop);
        }  
        const display_1 = [];
        let todaysDate = new Date();
        todaysDate = todaysDate.toLocaleDateString().substring(0, 5);
        Array(20).fill(1).forEach((item, index) => {
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
            const rain = station_weather_data.rain ? station_weather_data.rain["1h"] : station_weather_data.clouds ? station_weather_data.clouds.all : "";
            const wind_speed = station_weather_data.wind.speed;
            const wind_degree = station_weather_data.wind.deg;
            const wind_gust = station_weather_data.wind.gust;
            const humidity = station_weather_data.main.humidity;
            const pressure = station_weather_data.main.pressure;
            display_1.push(
                <li>
                    <div className="weather_widget_row">
                        <span>{station_name}</span>
                        <span>{todaysDate}</span>
                        <span><img src={icon_url} width="60px" height="40px"></img></span>
                        <span> {temp} °C</span>                        
                        <span>{main}</span>
                        <span> {description}</span>
                        <span> {humidity}%</span>
                        <span> {wind_speed}kmph</span>
                        <span>{wind_degree}°</span>
                        <span>{wind_gust}kmph</span>
                        <span>{pressure}</span>
                    </div>
                </li>
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
                                        <span>Weather</span>
                                        <span> Desc</span>
                                        <span><FontAwesomeIcon icon={faTint} /> Humidity</span>
                                        <span><FontAwesomeIcon icon={faWind} /> Speed</span>
                                        <span><FontAwesomeIcon icon={faWind} /> Degree</span>
                                        <span><FontAwesomeIcon icon={faWind} /> Gust</span>
                                        <span>Pressure</span>
                                    </div>
                                </li>
                                {display_1}
                            </ul>                            
                        </div>                        
                        <div>
                            <button onClick={this.next}>Next</button>
                            <button onClick={this.previous}>Previous</button>
                        </div>
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

import React from "react";
import { useParams, withRouter } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faWind } from '@fortawesome/free-solid-svg-icons'
import { icon } from "@fortawesome/fontawesome-svg-core";
import socket from "../utility/socketIO";

class WeatherWidget_cards extends React.Component {
    constructor(props) {
        super(props);
        this.next = this.next.bind(this);
        this.previous = this.previous.bind(this);
        this.state = {
            start: 0,
            stop: 6,
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
        //const length = this.props.data === "generation" ? this.state.current_weather_stations_generation.length : this.state.current_weather_stations_transmission.length
        const length = this.props.datas.length;
        const remainder = length - stop;
        if(remainder >= 6) {            
            this.setState({start: stop, stop: (stop + 6)});
        } else if(remainder < 6 && remainder > 0) {
            this.setState({start: stop, stop: length});
        } else if(remainder === 0 || remainder < 0) {
            return;
        }
    }
    previous() {
        const { start, stop } = this.state;
        const remainder = start - 6;
        if(remainder >= 6) {            
            this.setState({start: (start - 6), stop: (stop - 6)});
        } else if(remainder < 6 ) {
            return;
        } else if(remainder === 0) {
            this.setState({start: 0, stop: 6});
        }   
    }
    render() {
        function getIconUrl(icon_id)  {
            return `https://openweathermap.org/img/wn/${icon_id}@2x.png`
        }
        function getTime(dt) {
            const newDate = new Date(dt*1000);
            const hour = newDate.getHours();
            const minute =  newDate.getMinutes();  
            return `${hour}:${minute.toString().length == 1 ? "0" + minute : minute}`;
        }
        let stations;
        const sortedStations = this.props.datas.sort((a, b) => a.name < b.name ? -1 : 1);
        stations = sortedStations.slice(this.state.start, this.state.stop);

        // if(this.props.data === "generation") {
        //     //const sortedStations = this.state.current_weather_stations_generation.sort((a, b) => a.name[0] - b.name[0]);
        //     const sortedStations = this.props.datas.sort((a, b) => a.name[0] - b.name[0]);
        //     stations = sortedStations.slice(this.state.start, this.state.stop);
        // } else if(this.props.data === "transmission") {
        //     const sortedStations = this.props.datas.sort((a, b) => a.name[0] - b.name[0]);
        //     stations = sortedStations.slice(this.state.start, this.state.stop);
        // }        
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
            const rain = station_weather_data.rain ? station_weather_data.rain["1h"] : station_weather_data.clouds ? station_weather_data.clouds.all : "";
            const wind_speed = station_weather_data.wind.speed;
            const wind_degree = station_weather_data.wind.deg;
            const wind_gust = station_weather_data.wind.gust;
            const humidity = station_weather_data.main.humidity;
            display_1.push(
                <>
                    <div className="col-md-8 col-lg-6 col-xl-4">
                        <div className="card" style={{"color": "#4B515D", "border-radius": "35px"}}>
                            <div className="card-body p-4">
                                <div className="d-flex">
                                <h6 className="flex-grow-1">{station_name}</h6>
                                <h6>{timer}</h6>
                                </div>
                                <div className="d-flex flex-column text-center mt-5 mb-4">
                                <h6 className="display-4 mb-0 font-weight-bold" style={{"color": "#1C2331"}}> {temp}°C </h6>
                                <span className="large" style={{"color": "#868B94"}}>{main}</span>
                                <span className="small" style={{"color": "#868B94"}}>{description}</span>
                                </div>
                                <div className="d-flex align-items-center">
                                    <div className="flex-grow-1" style={{"fontSize": "1rem"}}>
                                        <div><i className="fas fa-wind fa-fw" style={{"color": "#868B94"}}></i> <span className="ms-1"> {wind_speed}km/h
                                        </span></div>
                                        <div><i className="fas fa-tint fa-fw" style={{"color": "#868B94"}}></i> <span className="ms-1"> {humidity}% </span>
                                        </div>
                                        <div><i className="fas fa-sun fa-fw" style={{"color": "#868B94"}}></i> <span className="ms-1"> {rain}h </span>
                                        </div>
                                    </div>
                                    <div>
                                        <img src={icon_url} width="100px"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )
        });
        const display_2 = [];
        [3,4,5].forEach(index => {
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
            display_2.push(
                <>
                    <div className="col-md-8 col-lg-6 col-xl-4">
                        <div className="card" style={{"color": "#4B515D", "border-radius": "35px"}}>
                            <div className="card-body p-4">
                                <div className="d-flex">
                                <h6 className="flex-grow-1">{station_name}</h6>
                                <h6>{timer}</h6>
                                </div>
                                <div className="d-flex flex-column text-center mt-5 mb-4">
                                <h6 className="display-4 mb-0 font-weight-bold" style={{"color": "#1C2331"}}> {temp}°C </h6>
                                <span className="large" style={{"color": "#868B94"}}>{main}</span>
                                <span className="small" style={{"color": "#868B94"}}>{description}</span>
                                </div>
                                <div className="d-flex align-items-center">
                                    <div className="flex-grow-1" style={{"fontSize": "1rem"}}>
                                        <div><i className="fas fa-wind fa-fw" style={{"color": "#868B94"}}></i> <span className="ms-1"> {wind_speed}km/h
                                        </span></div>
                                        <div><i className="fas fa-tint fa-fw" style={{"color": "#868B94"}}></i> <span className="ms-1"> {humidity}% </span>
                                        </div>
                                        <div><i className="fas fa-sun fa-fw" style={{"color": "#868B94"}}></i> <span className="ms-1"> {rain}h </span>
                                        </div>
                                    </div>
                                    <div>
                                        <img src={icon_url} width="100px"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )
        })
        const display_rain = [];
        const { rain_station } = this.props;
        display_rain.push(<li><span className="px-2">Station</span> | <span className="px-2">Description</span></li>)        
        if(rain_station !== null & rain_station.length > 0) {
            rain_station.forEach(station => {
                const station_data = station.current_weather_data;
                const station_name = station.name;
                const main = station_data.weather[0].main;
                const description = station_data.weather[0].description;
                display_rain.push(<li><span className="px-2">{station_name}</span> | <span className="px-2">{description}</span></li>)
            })
        }
        return (
            <section className="container-fluid" style={{"background-color": "#4B515D"}}>
                <div className="row">
                    <div className="col-9 py-3" style={{"background-color": "#4B515D"}}>
                        <div className="row d-flex py-3 justify-content-center align-items-center">                            
                            {display_1}
                        </div>
                        <div className="row d-flex py-3 justify-content-center align-items-center">
                            {display_2}
                        </div>
                        <div>
                            <button onClick={this.next}>Next</button>
                            <button onClick={this.previous}>Previous</button>
                        </div>
                    </div>
                    <div className="col-lg-3 col-xs-0 border border-3 weather-alert">
                        <div>
                            <h3 className="weather_h3 text-center">Stations with Rainfall</h3>
                            <ul className="weather_ul">                                
                                {display_rain}                            
                            </ul>
                        </div>
                    </div>
                </div>                
            </section>
        )
    }
}
export default withRouter(WeatherWidget_cards);

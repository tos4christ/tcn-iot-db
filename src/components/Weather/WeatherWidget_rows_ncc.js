import React from "react";
import { withRouter } from 'react-router-dom';

class WeatherWidget_rows extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            display_data: [],
            start: 0,
            counter: 1,
            stations: [],
            current_weather_stations_generation: [],
            current_weather_stations_transmission: [],
            hourly3_weather_stations_generation: [],
            hourly3_weather_stations_transmission: [],
            daily_weather_stations_generation: [],
            daily_weather_stations_transmission: [],
            station_name_0: '',
            icon_url_0: '',
            temp_0: '',
            humidity_0: '',
            main_0: '',
            description_0: '',
            station_name_1: '',
            icon_url_1: '',
            temp_1: '',
            humidity_1: '',
            main_1: '',
            description_1: '',
            station_name_2: '',
            icon_url_2: '',
            temp_2: '',
            humidity_2: '',
            main_2: '',
            description_2: '',
            station_name_3: '',
            icon_url_3: '',
            temp_3: '',
            humidity_3: '',
            main_3: '',
            description_3: '',
            station_name_4: '',
            icon_url_4: '',
            temp_4: '',
            humidity_4: '',
            main_4: '',
            description_4: '',
            station_name_5: '',
            icon_url_5: '',
            temp_5: '',
            humidity_5: '',
            main_5: '',
            description_5: '',
            station_name_6: '',
            icon_url_6: '',
            temp_6: '',
            humidity_6: '',
            main_6: '',
            description_6: '',
            station_name_7: '',
            icon_url_7: '',
            temp_7: '',
            humidity_7: '',
            main_7: '',
            description_7: '',
            station_name_8: '',
            icon_url_8: '',
            temp_8: '',
            humidity_8: '',
            main_8: '',
            description_8: '',
            station_name_9: '',
            icon_url_9: '',
            temp_9: '',
            humidity_9: '',
            main_9: '',
            description_9: '',
            weather_class_0: 'd-none',
            weather_class_1: 'd-none',
            weather_class_2: 'd-none',
            weather_class_3: 'd-none',
            weather_class_4: 'd-none',
            weather_class_5: 'd-none',
            weather_class_6: 'd-none',
            weather_class_7: 'd-none',
            weather_class_8: 'd-none',
            weather_class_9: 'd-none'
        }
    }
    componentDidMount() {
        let stations, sortedStations;
        sortedStations = this.props.datas.sort((a, b) => a.name < b.name ? -1 : 1);        
        const stations_length = sortedStations.length;
        const count_amount = Math.round(stations_length/10);  
        let timer;
        // Function to run setInterval on that will keep changing the values
        setInterval(() => {
            stations = sortedStations.slice(this.state.start, this.state.start + 10);
            // cancel the timer
            clearTimeout(timer);
            // Array function to change data
            Array(10).fill(1).forEach((item, index) => {                
                const station_weather_data = stations[index]?.current_weather_data ? stations[index].current_weather_data : null;
                if(!station_weather_data) {
                    return;
                }
                const station_name = stations[index].name;
                // const timer = getTime(station_weather_data.dt);
                const main = station_weather_data.weather[0].main;
                const description = station_weather_data.weather[0].description;
                const icon_url = this.getIconUrl(station_weather_data.weather[0].icon);
                const temp = station_weather_data.main.temp;
                // const feels_like = station_weather_data.main.feels_like;
                // const rain = station_weather_data.rain ? station_weather_data.rain["1h"] : station_weather_data.clouds ? station_weather_data.clouds.all : "";
                // const wind_speed = station_weather_data.wind.speed;
                // const wind_degree = station_weather_data.wind.deg;
                // const wind_gust = station_weather_data.wind.gust;
                const humidity = station_weather_data.main.humidity;
                // const pressure = station_weather_data.main.pressure;
                this.setState((prevState) => {
                    prevState[`station_name_${index}`] = station_name;
                    prevState[`icon_url_${index}`] = icon_url;
                    prevState[`temp_${index}`] = temp;
                    prevState[`humidity_${index}`] = humidity;
                    prevState[`main_${index}`] = main;
                    prevState[`description_${index}`] = description;
                    // Name the keys
                    const return_object = {};
                    return_object[`station_name_${index}`] = prevState[`station_name_${index}`];
                    return_object[`icon_url_${index}`] = prevState[`icon_url_${index}`];
                    return_object[`temp_${index}`] = prevState[`temp_${index}`];
                    return_object[`humidity_${index}`] = prevState[`humidity_${index}`];
                    return_object[`main_${index}`] = prevState[`main_${index}`];
                    return_object[`description_${index}`] = prevState[`description_${index}`];

                    return return_object;
                });
            });
            // End of the Array function

            // Set the class to play animation
            this.setState((prevState) => {
                prevState.weather_class_0 = 'weather-texter-0';
                prevState.weather_class_1 = 'weather-texter-1';
                prevState.weather_class_2 = 'weather-texter-2';
                prevState.weather_class_3 = 'weather-texter-3';
                prevState.weather_class_4 = 'weather-texter-4';
                prevState.weather_class_5 = 'weather-texter-5';
                prevState.weather_class_6 = 'weather-texter-6';
                prevState.weather_class_7 = 'weather-texter-7';
                prevState.weather_class_8 = 'weather-texter-8';
                prevState.weather_class_9 = 'weather-texter-9';
                let {counter} = this.state;
                let {start} = this.state;
                // Increase the counter and check if its below the count_amount
                if (counter < count_amount) {
                    start += 10;
                    counter += 1;
                } else if (counter >= count_amount) {
                    start = 0;
                    counter = 1;
                }
                prevState.counter = counter;
                prevState.start = start;
                return {
                    weather_class_0 : prevState.weather_class_0,
                    weather_class_1 : prevState.weather_class_1,
                    weather_class_2 : prevState.weather_class_2,
                    weather_class_3 : prevState.weather_class_3,
                    weather_class_4 : prevState.weather_class_4,
                    weather_class_5 : prevState.weather_class_5,
                    weather_class_6 : prevState.weather_class_6,
                    weather_class_7 : prevState.weather_class_7,
                    weather_class_8 : prevState.weather_class_8,
                    weather_class_9 : prevState.weather_class_9,
                    counter: prevState.counter,
                    start: prevState.start
                }
            })
            // Set Timeout to remove class to stop animation
            timer = setTimeout(() => {
                this.setState((prevState) => {
                    prevState.weather_class_0 = 'd-none';
                    prevState.weather_class_1 = 'd-none';
                    prevState.weather_class_2 = 'd-none';
                    prevState.weather_class_3 = 'd-none';
                    prevState.weather_class_4 = 'd-none';
                    prevState.weather_class_5 = 'd-none';
                    prevState.weather_class_6 = 'd-none';
                    prevState.weather_class_7 = 'd-none';
                    prevState.weather_class_8 = 'd-none';
                    prevState.weather_class_9 = 'd-none';
                    return {
                        weather_class_0 : prevState.weather_class_0,
                        weather_class_1 : prevState.weather_class_1,
                        weather_class_2 : prevState.weather_class_2,
                        weather_class_3 : prevState.weather_class_3,
                        weather_class_4 : prevState.weather_class_4,
                        weather_class_5 : prevState.weather_class_5,
                        weather_class_6 : prevState.weather_class_6,
                        weather_class_7 : prevState.weather_class_7,
                        weather_class_8 : prevState.weather_class_8,
                        weather_class_9 : prevState.weather_class_9,
                    }
                })
            }, 8000);            
            
        }, 9200);
        
    }    
    getIconUrl(icon_id)  {
        return `https://openweathermap.org/img/wn/${icon_id}@2x.png`
    }
    getTime(dt) {
        const newDate = new Date(dt*1000);
        const hour = newDate.getHours();
        const minute = newDate.getMinutes();  
        return `${hour}:${minute.toString().length == 1 ? "0" + minute : minute}`;
    }
    render() {
        // console.log(this.props.datas, " check the datas data");
        // Raining stations to display
        const display_rain = [];
        const { rain_station } = this.props;
        display_rain.push(<li><span className="px-2 border-bottom first-li text-success fw-bold">Station</span> | <span className="px-2 border-bottom second-li text-success fw-bold">Description</span></li>)        
        if(rain_station !== null & rain_station.length > 0) {
            rain_station.forEach(station => {
                const station_data = station.current_weather_data;
                const station_name = station.name;
                const main = station_data.weather[0].main;
                const description = station_data.weather[0].description;
                display_rain.push(<li>
                        <span className="px-2 first-li">{station_name}</span> | <span className="px-2 second-li">{description}</span>
                    </li>)
            })
        }
        return (
            <section className="container-fluid" style={{"backgroundColor": ""}}>
                <div className="row w-rows">
                    <div className="col-lg-9 col-xs-12 py-0 "  style={{"backgroundColor": ""}}>
                        <div className="row d-flex py-3 justify-content-center align-items-center">
                            <ul>                            
                                {/* Dummy list to replicate live data */}
                                {<>
                                    <li key={0} id="li-0" className="weather-container">
                                        <div className="color-badge">
                    
                                        </div>
                                        <div className="country-badge">
                                            <div className={this.state.weather_class_0} id="country-0">{this.state.station_name_0}</div>
                                        </div>
                                        <div className="icon-badge" >
                                            <img id="icon-0" className={this.state.weather_class_0} src={this.state.icon_url_0} width="80px" height="60px"></img>
                                        </div>
                                        <div className="temp-badge" >
                                            <div id="temp-holder-0" className={this.state.weather_class_0}> 
                                                <span id="span-01">{this.state.temp_0} °C </span> <span className="text-white"> | </span>   <span id="span-02">{this.state.humidity_0}  %</span> 
                                            </div>
                                        </div>
                                        <div className="desc-badge" >
                                            <div className={this.state.weather_class_0}> 
                                                <span>{this.state.main_0}</span>  |  <span>{this.state.description_0}</span> 
                                            </div>
                                        </div> 
                                    </li>
                                    <li key={1} id="li-1" className="weather-container">
                                        <div className="color-badge">
                    
                                        </div>
                                        <div className="country-badge">
                                            <div className={this.state.weather_class_1} id="country-1">{this.state.station_name_1}</div>
                                        </div>
                                        <div className="icon-badge" >
                                            <img id="icon-1" className={this.state.weather_class_1} src={this.state.icon_url_1} width="80px" height="60px"></img>
                                        </div>
                                        <div className="temp-badge" >
                                            <div id="temp-holder-1" className={this.state.weather_class_1}> 
                                                <span id="span-11">{this.state.temp_1}  °C </span> <span className="text-white"> | </span>   <span id="span-12">{this.state.humidity_1}  %</span> 
                                            </div>
                                        </div>
                                        <div className="desc-badge" >
                                            <div className={this.state.weather_class_1}> 
                                                <span>{this.state.main_1}</span>  |  <span>{this.state.description_1}</span> 
                                            </div>
                                        </div> 
                                    </li>
                                    <li key={2} id="li-2" className="weather-container">
                                        <div className="color-badge">
                    
                                        </div>
                                        <div className="country-badge">
                                            <div className={this.state.weather_class_2} id="country-2">{this.state.station_name_2}</div>
                                        </div>
                                        <div className="icon-badge" >
                                            <img id="icon-2" className={this.state.weather_class_2} src={this.state.icon_url_2} width="80px" height="60px"></img>
                                        </div>
                                        <div className="temp-badge" >
                                            <div id="temp-holder-2" className={this.state.weather_class_2}> 
                                                <span id="span-21">{this.state.temp_2}  °C </span> <span className="text-white"> | </span>   <span id="span-22">{this.state.humidity_2}  %</span> 
                                            </div>
                                        </div>
                                        <div className="desc-badge" >
                                            <div className={this.state.weather_class_2}> 
                                                <span>{this.state.main_2}</span>  |  <span>{this.state.description_2}</span> 
                                            </div>
                                        </div> 
                                    </li>
                                    <li key={3} id="li-3" className="weather-container">
                                        <div className="color-badge">
                    
                                        </div>
                                        <div className="country-badge">
                                            <div className={this.state.weather_class_3} id="country-3">{this.state.station_name_3}</div>
                                        </div>
                                        <div className="icon-badge" >
                                            <img id="icon-3" className={this.state.weather_class_3} src={this.state.icon_url_3} width="80px" height="60px"></img>
                                        </div>
                                        <div className="temp-badge" >
                                            <div id="temp-holder-3" className={this.state.weather_class_3}> 
                                                <span id="span-31">{this.state.temp_3}  °C </span> <span className="text-white"> | </span>   <span id="span-32">{this.state.humidity_3}  %</span> 
                                            </div>
                                        </div>
                                        <div className="desc-badge" >
                                            <div className={this.state.weather_class_3}> 
                                                <span>{this.state.main_3}</span>  |  <span>{this.state.description_3}</span> 
                                            </div>
                                        </div> 
                                    </li>
                                    <li key={4} id="li-4" className="weather-container">
                                        <div className="color-badge">
                    
                                        </div>
                                        <div className="country-badge">
                                            <div className={this.state.weather_class_4} id="country-4">{this.state.station_name_4}</div>
                                        </div>
                                        <div className="icon-badge" >
                                            <img id="icon-4" className={this.state.weather_class_4} src={this.state.icon_url_4} width="80px" height="60px"></img>
                                        </div>
                                        <div className="temp-badge" >
                                            <div id="temp-holder-4" className={this.state.weather_class_4}> 
                                                <span id="span-41">{this.state.temp_4}  °C </span> <span className="text-white"> | </span>   <span id="span-42">{this.state.humidity_4}  %</span> 
                                            </div>
                                        </div>
                                        <div className="desc-badge" >
                                            <div className={this.state.weather_class_4}> 
                                                <span>{this.state.main_4}</span>  |  <span>{this.state.description_4}</span> 
                                            </div>
                                        </div> 
                                    </li>
                                    <li key={5} id="li-5" className="weather-container">
                                        <div className="color-badge">
                    
                                        </div>
                                        <div className="country-badge">
                                            <div className={this.state.weather_class_5} id="country-5">{this.state.station_name_5}</div>
                                        </div>
                                        <div className="icon-badge" >
                                            <img id="icon-5" className={this.state.weather_class_5} src={this.state.icon_url_5} width="80px" height="60px"></img>
                                        </div>
                                        <div className="temp-badge" >
                                            <div id="temp-holder-5" className={this.state.weather_class_5}> 
                                                <span id="span-51">{this.state.temp_5}  °C </span> <span className="text-white"> | </span>   <span id="span-52">{this.state.humidity_5}  %</span> 
                                            </div>
                                        </div>
                                        <div className="desc-badge" >
                                            <div className={this.state.weather_class_5}> 
                                                <span>{this.state.main_5}</span>  |  <span>{this.state.description_5}</span> 
                                            </div>
                                        </div> 
                                    </li>
                                    <li key={6} id="li-6" className="weather-container">
                                        <div className="color-badge">
                    
                                        </div>
                                        <div className="country-badge">
                                            <div className={this.state.weather_class_6} id="country-6">{this.state.station_name_6}</div>
                                        </div>
                                        <div className="icon-badge" >
                                            <img id="icon-6" className={this.state.weather_class_6} src={this.state.icon_url_6} width="80px" height="60px"></img>
                                        </div>
                                        <div className="temp-badge" >
                                            <div id="temp-holder-6" className={this.state.weather_class_6}> 
                                                <span id="span-61">{this.state.temp_6}  °C </span> <span className="text-white"> | </span>   <span id="span-62">{this.state.humidity_6}  %</span> 
                                            </div>
                                        </div>
                                        <div className="desc-badge" >
                                            <div className={this.state.weather_class_6}> 
                                                <span>{this.state.main_6}</span>  |  <span>{this.state.description_6}</span> 
                                            </div>
                                        </div> 
                                    </li>
                                    <li key={7} id="li-7" className="weather-container">
                                        <div className="color-badge">
                    
                                        </div>
                                        <div className="country-badge">
                                            <div className={this.state.weather_class_7} id="country-7">{this.state.station_name_7}</div>
                                        </div>
                                        <div className="icon-badge" >
                                            <img id="icon-7" className={this.state.weather_class_7} src={this.state.icon_url_7} width="80px" height="60px"></img>
                                        </div>
                                        <div className="temp-badge" >
                                            <div id="temp-holder-7" className={this.state.weather_class_7}> 
                                                <span id="span-71">{this.state.temp_7}  °C </span> <span className="text-white"> | </span>   <span id="span-72">{this.state.humidity_7}  %</span> 
                                            </div>
                                        </div>
                                        <div className="desc-badge" >
                                            <div className={this.state.weather_class_7}> 
                                                <span>{this.state.main_7}</span>  |  <span>{this.state.description_7}</span> 
                                            </div>
                                        </div> 
                                    </li>
                                    <li key={8} id="li-8" className="weather-container">
                                        <div className="color-badge">
                    
                                        </div>
                                        <div className="country-badge">
                                            <div className={this.state.weather_class_8} id="country-8">{this.state.station_name_8}</div>
                                        </div>
                                        <div className="icon-badge" >
                                            <img id="icon-8" className={this.state.weather_class_8} src={this.state.icon_url_8} width="80px" height="60px"></img>
                                        </div>
                                        <div className="temp-badge" >
                                            <div id="temp-holder-8" className={this.state.weather_class_8}> 
                                                <span id="span-81">{this.state.temp_8}  °C </span> <span className="text-white"> | </span>   <span id="span-82">{this.state.humidity_8}  %</span> 
                                            </div>
                                        </div>
                                        <div className="desc-badge" >
                                            <div className={this.state.weather_class_8}> 
                                                <span>{this.state.main_8}</span>  |  <span>{this.state.description_8}</span> 
                                            </div>
                                        </div> 
                                    </li>
                                    <li key={9} id="li-9" className="weather-container">
                                        <div className="color-badge">
                    
                                        </div>
                                        <div className="country-badge">
                                            <div className={this.state.weather_class_9} id="country-9">{this.state.station_name_9}</div>
                                        </div>
                                        <div className="icon-badge" >
                                            <img id="icon-9" className={this.state.weather_class_9} src={this.state.icon_url_9} width="80px" height="60px"></img>
                                        </div>
                                        <div className="temp-badge" >
                                            <div id="temp-holder-9" className={this.state.weather_class_9}> 
                                                <span id="span-91">{this.state.temp_9}  °C </span> <span className="text-white"> | </span>   <span id="span-92">{this.state.humidity_9}  %</span> 
                                            </div>
                                        </div>
                                        <div className="desc-badge" >
                                            <div className={this.state.weather_class_9}> 
                                                <span>{this.state.main_9}</span>  |  <span>{this.state.description_9}</span> 
                                            </div>
                                        </div> 
                                    </li>
                                </>}
                            </ul>                            
                        </div>
                    </div>
                    <div className="col-lg-3 col-xs-0 border border-3 weather-alert">
                        <div>
                            <h3 className="weather_h3 text-center text-danger">Stations with Rainfall</h3>
                            <ul className="weather_ul">                                
                                {display_rain}
                                {/* <li>
                                    <span className="px-2 first-li">{'AJAH'}</span> | <span className="px-2 second-li">{'Rainfall'}</span>
                                </li>
                                <li>
                                    <span className="px-2 first-li">{'Osogbo'}</span> | <span className="px-2 second-li">{'Sunny'}</span>
                                </li> */}
                            </ul>
                        </div>
                    </div>
                </div>
                
                
            </section>
        )
    }
}
export default withRouter(WeatherWidget_rows);

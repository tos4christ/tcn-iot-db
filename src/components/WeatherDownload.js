import React from "react";
import {Redirect} from 'react-router-dom';
import { Spinner, Button } from "react-bootstrap";
import epochConverter from "../utility/epochConverter";
const stations = [
  "Aba TS", "Afam TS", "Aja Area Control", "Ajaokuta Area Control", `Akangba 330`, "Akure 132KV TS", `Gwagwalada`, `ALAOJI PS`,
  "Akwanga TS", `Alagbon 132`, `Alaoji TS`, `Apo 132`, `Asaba 132KV`, `Ayede`, `Bauchi`, `Benin Main`, `Ijora 132KV`, `DELTA GS`,
  `Bida TS`, `Birnin Kebbi`, `Calabar TS`, `Delta TS`, `Egbin 330`, `Ganmo Area Control`, `Gombe Area Control`, `OMOKU PS`,
  `Ikeja W Area Control`, `Ikorodu 132KV`, `Ilupeju 132KV TS`, `Iwo Area Control`, `Jericho 132KV TS`, `Jos Area Control`, `Katampe 330`,
  `Katsina TS`, `Lokoja 132KV`, `Maiduguri TS`, `Minna TS`, `New haven`, `Nkalagu`, `Obajana 330KV`, `Ondo 132KV TS`, `Onitsha`,
  `Osogbo TS`, `Papalanto TS`, `PH Main`, `Shiroro Area Control`, `Sokoto TS`, `Suleja TS`, `Tegina TS`, `GEREGU PS`, `DADINKOWA GS`, 
  `KAINJI HYDRO`, `JEBBA HYDRO`, `SHIRORO HYDRO`, `EGBIN PS`, `OLORUNSOGO PS`, `OMOTOSHO PS`, `GBARAIN PS`, `AZURA EDO IPP`, `AFAM VI PS`
  ];

 class WeatherDownload extends React.Component {
  constructor(props) {
    super(props);
    this.setDate = this.setDate.bind(this);
    this.handleSubmitWeather = this.handleSubmitWeather.bind(this);
    this.sortWeather = this.sortWeather.bind(this);
    this.state = {
      startDate_weather: '',
      loading: false
    }
  }
  setDate(e) {    
    const name = e.target.name;
    this.setState( prevState => {
      prevState[name] = this[name].value.split('T');
      return {name : prevState[name]}
    })
  }
  handleSubmitWeather() {
    const startDate = this.state.startDate_weather[0];
    const token = localStorage.getItem("token");
    // verify that the startDate is lower than the endDate
    // This is already handled at the backend by replacing the lower to be the start
    const getTem = startDate;
    if(getTem) {
      const url = '/api/weather/getweatherreport';
      const data = {
        startDate
      };
      // add a spinner method while request is loading
      this.setState({loading: true}, () => {
        fetch(url, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            credentials: 'include'
          },
          body: JSON.stringify(data)
        })
        .then(response => {
          return response.blob();
        })
        .then( blob => {
          this.setState({loading: false});
          var url = window.URL.createObjectURL(blob);
          var a = document.createElement('a');
          a.href = url;
          a.download = "weather.xlsx";
          document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
          a.click();
          a.remove();  //afterwards we remove the element again 
        });
      })      
    }    
  }
  sortWeather(weather_data=[]) {
    // Sort all the data according to station in ascending order
    const station_container = {};
    stations.forEach(station => {
      const station_data = weather_data.filter(items => [`${station}`].includes(items.station_name));
      if(station_data[0]) {
        const station_name = station_data[0].station_name;
        station_container[station_name] = station_data;
      }
    });
    const station_keys = Object.keys(station_container);
    let weather_timeline = {};
    let station_weather_report = {};
    let start_time = '', end_time = '';
    station_keys.forEach(station => {
      const current_station = station_container[station].sort((a,b) => a.time < b.time);
      current_station.sort((a,b) => a.time < b.time).forEach((item, index, array) => {
        const next_data = array[index+1];
        if(next_data) {      
          // check if it starts with rainfall        
          if(array[0].main_weather == "Rain" && index == 0) {
            start_time = array[0].time;
          } else if(item.main_weather !== "Rain" && next_data.main_weather == "Rain" && index > 0) {
            // condition to pick a start
            start_time = next_data.time;
          }
          // condition to pick a stop
          if(item.main_weather == "Rain" && next_data.main_weather !== "Rain" && index > 0) {
            end_time = next_data.time;
          }
          if(end_time.length > 0 && start_time.length > 0) {
            const time_obj = epochConverter(start_time, end_time, "weather");
            weather_timeline[start_time] = {start_date: time_obj.start_date, end_date: time_obj.end_date, start: start_time, 
              end: end_time, date: item.date, rain_volume_1h: item.rain_volume_1h, rain_volume_3h: item.rain_volume_3h,
              main_temp: item.main_temperature, start_time: time_obj.rainfall_start_time, end_time: time_obj.rainfall_end_time,
              wind_degree: item.wind_degree, wind_speed: item.wind_speed, humidity: item.main_humidity};
            start_time = '';
            end_time = '';
          }        
        }
      });
      station_weather_report[station] = weather_timeline;
      weather_timeline = {};
    });
    console.log(station_weather_report);    
    return station_weather_report;
  }

  render() {
    const { isLoggedIn } = this.props;
    if (!isLoggedIn) {
      return <Redirect to={'/'}/>
    }
    const { loading } = this.state;
    return (
      <div className="item-div">
        <a style={{margin: '10px', 'fontSize': '15px'}} type="button" href="/home"> back</a>        
        <div>
          <h2 className="history-text">Select a Date to download Weather Report</h2>
          <div className="line"> </div>
          {/* Select Start Date */}    
          <div className="tem options">
            <label> Report Date </label> 
            <input type={'date'} name="startDate_weather" onChange={this.setDate} ref={node => this.startDate_weather = node}></input>
          </div>
          <div className="line"> </div>
          <button className="tem submit-button" onClick={this.handleSubmitWeather}> Download Rainfall Data </button>
        </div>        
        <div className="table-div">
          {loading ? 
            <Button className="spinner" variant="primary" disabled>
            <Spinner
              as="span"
              animation="border"
              size="sm"
              role="status"
              aria-hidden="true"
            />
            Downloading... Please Wait
          </Button>
            : 
            <div>
             {/* Display successful download message here */}
            </div>
          }         
        </div>
      </div> 
    )         
  }
}

export default WeatherDownload;

import React from "react";
import { useParams } from 'react-router-dom';
import {
  MDBCard,
  MDBCardBody,
  MDBCol,
  MDBContainer,
  MDBIcon,
  MDBRow,
  MDBTypography,
} from "mdb-react-ui-kit";

class SingleWeatherWidget extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    // Hit the api for the hourly and daily forecast of the single
    // station in the query property which contains the name and lon/lat
    // of the station

  }

  render() {
    function getIconUrl(icon_id)  {
      return `https://openweathermap.org/img/wn/${icon_id}@2x.png`
    }
    function getDay(epoch) {
      const dated = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"];
      const day = new Date(epoch*1000).getDay();
      return dated[day];
    }
    const { weatherData } = this.props;
    // const {current: currentWeather, daily: dailyForecast, hourly: hourlyForecast} = weatherData;
    const {current: currentWeather, hourly: hourlyForecast} = weatherData;
    const {list: hourly_list} = hourlyForecast;
    // const {list: daily_list} = dailyForecast;
    //const current_icon_url = getIconUrl(currentWeather.weather[0].icon);
    return (
      <section className="vh-100" style={{ backgroundColor: "#C1CFEA" }}>
        <MDBContainer className="h-100">
          <MDBRow
            className="justify-content-center align-items-center h-100"
            style={{ color: "#282828" }}
          >
            <MDBCol md="9" lg="7" xl="5">
              <MDBCard
                className="mb-4 gradient-custom"
                style={{ borderRadius: "25px" }}
              >
                <MDBCardBody className="p-4">
                  <div className="d-flex justify-content-between pb-2">
                    <div>
                      <h2 className="display-2">
                        <strong>{currentWeather.main.temp}°C</strong>
                      </h2>
                      <p className="text-muted mb-0" style={{fontSize: "50px"}}>{this.props.station_name}</p>
                    </div>
                    <div>
                      <img
                        src={getIconUrl(currentWeather.weather[0].icon)}
                        width="140px"
                      />
                    </div>
                  </div>
                </MDBCardBody>
              </MDBCard>
  
              <MDBCard className="mb-4" style={{ borderRadius: "25px" }}>
                <MDBCardBody className="p-4">
                  <div className="d-flex justify-content-around text-center pb-3 pt-2">
                    <div className="flex-column">
                      <p className="small">
                        <strong>{hourly_list[0].main.temp}°C</strong>
                      </p>
                      
                      <img src={getIconUrl(hourly_list[0].weather[0].icon)}>
                      </img>
                      <p className="mb-0">
                        <strong>{hourly_list[0].dt_txt.split(" ")[1]}</strong>
                      </p>
                      <p
                        className="mb-0 text-muted"
                        style={{ fontSize: ".65rem" }}
                      >
                        PM
                      </p>
                    </div>
                    <div className="flex-column">
                      <p className="small">
                        <strong>{hourly_list[1].main.temp}°C</strong>
                      </p>
                      <img src={getIconUrl(hourly_list[1].weather[0].icon)}>
                      </img>
                      <p className="mb-0">
                        <strong>{hourly_list[1].dt_txt.split(" ")[1]}</strong>
                      </p>
                      <p
                        className="mb-0 text-muted"
                        style={{ fontSize: ".65rem" }}
                      >
                        PM
                      </p>
                    </div>
                    <div className="flex-column">
                      <p className="small">
                        <strong>{hourly_list[2].main.temp}°C</strong>
                      </p>
                      <img src={getIconUrl(hourly_list[2].weather[0].icon)}>
                      </img>
                      <p className="mb-0">
                        <strong>{hourly_list[2].dt_txt.split(" ")[1]}</strong>
                      </p>
                      <p
                        className="mb-0 text-muted"
                        style={{ fontSize: ".65rem" }}
                      >
                        PM
                      </p>
                    </div>
                    <div className="flex-column">
                      <p className="small">
                        <strong>{hourly_list[3].main.temp}°C</strong>
                      </p>
                      <img src={getIconUrl(hourly_list[3].weather[0].icon)}>
                      </img>
                      <p className="mb-0">
                        <strong>{hourly_list[3].dt_txt.split(" ")[1]}</strong>
                      </p>
                      <p
                        className="mb-0 text-muted"
                        style={{ fontSize: ".65rem" }}
                      >
                        PM
                      </p>
                    </div>
                    <div className="flex-column">
                      <p className="small">
                        <strong>{hourly_list[4].main.temp}°C</strong>
                      </p>
                      <img src={getIconUrl(hourly_list[4].weather[0].icon)}>
                      </img>
                      <p className="mb-0">
                        <strong>{hourly_list[4].dt_txt.split(" ")[1]}</strong>
                      </p>
                      <p
                        className="mb-0 text-muted"
                        style={{ fontSize: ".65rem" }}
                      >
                        PM
                      </p>
                    </div>
                  </div>
                </MDBCardBody>
              </MDBCard>
  
              {/* <MDBCard className="mb-4" style={{ borderRadius: "25px" }}>
                <MDBCardBody className="p-4">
                  <div className="d-flex justify-content-around text-center pb-3 pt-2">
                    <div className="flex-column">
                      <p className="small">
                        <strong>{((daily_list[0].temp.max + daily_list[0].temp.min)/2).toFixed(2)}°C</strong>
                      </p>
                      <img src={getIconUrl(daily_list[0].weather[0].icon)}>
                      </img>
                      <p className="mb-0">
                        <strong>{getDay(daily_list[0].dt)}</strong>
                      </p>
                    </div>
                    <div className="flex-column">
                      <p className="small">
                        <strong>{((daily_list[1].temp.max + daily_list[1].temp.min)/2).toFixed(2)}°C</strong>
                      </p>
                      <img src={getIconUrl(daily_list[1].weather[0].icon)}>
                      </img>
                      <p className="mb-0">
                        <strong>{getDay(daily_list[1].dt)}</strong>
                      </p>
                    </div>
                    <div className="flex-column">
                      <p className="small">
                        <strong>{((daily_list[2].temp.max + daily_list[2].temp.min)/2).toFixed(2)}°C</strong>
                      </p>
                      <img src={getIconUrl(daily_list[2].weather[0].icon)}>
                      </img>
                      <p className="mb-0">
                        <strong>{getDay(daily_list[2].dt)}</strong>
                      </p>
                    </div>
                    <div className="flex-column">
                      <p className="small">
                        <strong>{((daily_list[3].temp.max + daily_list[3].temp.min)/2).toFixed(2)}°C</strong>
                      </p>
                      <img src={getIconUrl(daily_list[3].weather[0].icon)}>
                      </img>
                      <p className="mb-0">
                        <strong>{getDay(daily_list[3].dt)}</strong>
                      </p>
                    </div>
                    <div className="flex-column">
                      <p className="small">
                        <strong>{((daily_list[4].temp.max + daily_list[4].temp.min)/2).toFixed(2)}°C</strong>
                      </p>
                      <img src={getIconUrl(daily_list[4].weather[0].icon)}>
                      </img>
                      <p className="mb-0">
                        <strong>{getDay(daily_list[4].dt)}</strong>
                      </p>
                    </div>
                    
                  </div>
                </MDBCardBody>
              </MDBCard> */}
            </MDBCol>
          </MDBRow>
        </MDBContainer>
      </section>
    );
  }
}

export default SingleWeatherWidget;

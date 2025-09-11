import React from "react";

const dateStyle = {
  color: "#ffffff",
  fontWeight: "bold",
  fontSize: "1rem",
  padding: "8px 12px",
  borderRadius: "8px",
  backgroundColor: "rgba(0,0,0,0.3)", // semi-transparent box
  boxShadow: "0px 4px 15px rgba(0,0,0,0.2)",
  textAlign: "center",
  whiteSpace: "nowrap", // keep date + time on one line
};

let date_interval;

class DateTime extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      date: new Date(),
    };
  }

  componentDidMount() {
    date_interval = setInterval(() => this.setState({ date: new Date() }), 1000);
  }

  componentWillUnmount() {
    clearInterval(date_interval);
  }

  render() {
    return (
      <div>
        <div style={dateStyle}>
          <p>
            {this.state.date.toDateString()} -- {this.state.date.toLocaleTimeString()}
          </p>
        </div>
      </div>
    );
  }
}

export default DateTime;

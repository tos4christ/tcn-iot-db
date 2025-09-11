import React from "react";

const containerStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "10vh", // full screen height
  background: "linear-gradient(135deg, #1e3c72, #2a5298)", // smooth background gradient
};

const dateStyle = {
  color: "#ffffff",
  fontWeight: "bold",
  fontSize: "1.5rem",
  padding: "20px 40px",
  borderRadius: "12px",
  backgroundColor: "rgba(0,0,0,0.3)", // semi-transparent box
  boxShadow: "0px 4px 15px rgba(0,0,0,0.2)",
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
      <div style={containerStyle}>
        <div style={dateStyle}>
          <p>
            {this.state.date.toDateString()} ---{" "}
            {this.state.date.toLocaleTimeString()}
          </p>
        </div>
      </div>
    );
  }
}

export default DateTime;

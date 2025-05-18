import React, {useState, useEffect} from "react";

const dateStyle = {
    color: "#DC4C64",
    fontWeight: "bold"
 }

 let date_interval;

class DateTime extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            date: new Date()
        }
    }
    componentDidMount() {
        date_interval = setInterval(() => this.setState({date: new Date()}), 1000);
    }
    componentWillUnmount() {
        clearInterval(date_interval);
    }
    render() {
        return(
            <div style={dateStyle}>
                <p>{this.state.date.toDateString()} --- {this.state.date.toLocaleTimeString()}</p>
            </div>
        )
    }
}

export default DateTime;

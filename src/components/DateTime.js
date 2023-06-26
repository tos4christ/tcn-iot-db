import React, {useState, useEffect} from "react";

const dateStyle = {
    color: "#DC4C64",
    fontWeight: "bold"
 }

class DateTime extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            date: new Date()
        }
    }
    componentDidMount() {
        setInterval(() => this.setState({date: new Date()}), 1000);
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

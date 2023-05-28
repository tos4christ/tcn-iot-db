import React, {useState, useEffect} from "react";

const dateStyle = {
    color: "white",
    fontWeight: "bold"
 }

const DateTime = () => {
    var [date, setDate] = useState(new Date());
    useEffect(() => {
        var timer = setInterval(() => setDate(new Date()), 1000);
        return function cleanup(){
            clearInterval(timer);
        }
    });

    return(
        <div style={dateStyle}>
            <p>Date: {date.toDateString()} --- {date.toLocaleTimeString()}</p>
        </div>
    )
}

export default DateTime
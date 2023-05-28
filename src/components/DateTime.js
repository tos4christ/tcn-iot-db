import React, {useState, useEffect} from "react";

const dateStyle = {
    color: "#DC4C64",
    fontWeight: "bold"
 }

const DateTime = () => {
    var [date, setDate] = useState(new Date());
    useEffect(() => {
        var timer = setInterval(() => setDate(new Date()), 1000);
    });

    return(
        <div style={dateStyle}>
            <p>{date.toDateString()} --- {date.toLocaleTimeString()}</p>
        </div>
    )
}

export default DateTime
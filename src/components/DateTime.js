import React, {useState, useEffect} from "react";

const dateStyle = {
    color: "#DC4C64",
    fontWeight: "bold"
 }

const DateTime = () => {
    const [date, setDate] = useState(new Date());
    useEffect(() => {
        setInterval(() => setDate(new Date()), 1000);
    });
    console.log(date.toDateString(), "the other ", date.toLocaleTimeString())
    return(
        <div style={dateStyle}>
            <p>{date.toDateString()} --- {date.toLocaleTimeString()}</p>
        </div>
    )
}

export default DateTime
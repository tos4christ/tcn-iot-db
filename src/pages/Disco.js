import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import DashboardNavUser from "../components/Header/DashboardNavDisco";
import DiscoFormEdit from "../forms/DiscoFormEdit";
import DiscoFormNew from "../forms/DiscoFormNew";

const Disco = (props) => {
    const history = useHistory();
    const route = history.location.pathname;
    const [listItem, setListItem] = useState([]);
    const [tickets, setTickets] = useState([]);
    const [listItemArr, setListItemArr] = useState([]);
    const [ticketLength, setticketLength] = useState(0);
    const [station, setStation] = useState("");
    const [equipment, setEquipment] = useState("");
    const [comment, setComment] = useState("");
    const [priority, setPriority] = useState("");
    const disco = "Eko";
    const listItemArray = [];
    let tt;
    function loadTickets() {
        const url = `https://tcnnas.org/tickets/get?disco=${disco}`;
        fetch(url, {
        method: "GET",
        mode: "cors",
        headers: {
            "Content-Type": "application/json",
        },
        })
        .then((res) => res.json())
        .then((response) => {
            const tick = response.data;
            // Set the state of listItems to be displayed
            setTickets(tick);
            // Set the ticketLength
            setticketLength(tick.length);  
            function setList() {
                if(tickets.length > 0 ) {
                    tickets.forEach(
                        (item, index) => {
                            listItemArray.push(                        
                                <li className="list-items" key={index}> 
                                    <span> <a href="item-1">{item.station}--{item.equipment}</a></span> <span>{item.status}</span><span>{item.id} </span> <a href={`/disco/edit?key=${index}`} className="text-dark">edit</a>
                                </li>
                            )
                        }                
                    )            
                }
                setListItemArr(listItemArray);
            }
            setList();          
        })
        .catch((error) => console.error(error.message));
    }
    function createTickets(e) {
        tt = ticketLength + 1;
        setticketLength(tt);
        const url = "https://tcnnas.org/tickets/new";
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };   
        const date = new Date().toLocaleDateString("en-GB", options).split('/').reverse().join('-');
        const data = { 
            disco, station, equipment, comment, date, ticket_id: ticketLength + 1, priority
        };
        fetch(url, {
        method: "POST",
        mode: "cors",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json",
        },
        })
        .then((res) => res.json())
        .then((response) => {
            history.push("/disco");
        })
        .catch((error) => console.error(error.message));
    }
    function editTickets(e) {
        e.preventDefault();
        const url = "https://tcnnas.org/tickets/edit";
        if (true) {
        return;
        }
        const data = { email: "password" };
        fetch(url, {
        method: "POST",
        mode: "cors",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json",
        },
        })
        .then((res) => res.json())
        .then((response) => {
            history.push("/disco");
        })
        .catch((error) => console.error(error.message));
    }
    useEffect(() => {
        loadTickets();
        // connect to the database on startup to retrieve the files
        
    }, [ticketLength]);
    
    const getData = (dat) => {
        const {station, equipment, comment, priority} = dat;
        setStation(station);
        setEquipment(equipment);
        setComment(comment);
        setPriority(priority);
        // push list items object from the getdata into an array of listItem here
        // First of all load any items from the database it shoudl be paginated to reduce the amount to display
        // The returned data is used to populate the list of items at start up
        // Any additional addition to the form is sent to the database,
        // while its pushed to the state of the component to keep fresh data
        // When component reloads, then it pulls all from the database again
    }
    const setDataHandler = (index) => {
        const data = listItem[index];
    }
  const body = (
    <div className="container-fluid  bg-white">
      <div className="row" id="home">
        {/* Form Section where tickets are populated and submitted */}
        <div className="col-sm-7 col-xs-7 p-3">
            <a href="/api/tickets/disco/new">New Form</a>
            {route === '/api/tickets/disco/new' ? <DiscoFormNew getData={getData} submit={createTickets} /> : route === '/api/tickets/disco/edit' ? <DiscoFormEdit tickets={tickets} /> : ""}            
        </div>
        {/* Stream section where new tickets are displayed with their current properties */}
        <div className="col-sm-5 col-xs-7 p-3">            
            <div className="border bg-info text-center py-4 shadow">
                <h2 className='my-4  text-light'>Recent Tickets</h2>
                <ul className='my-4  text-light'>
                    <li className="ticket-header">
                        <span>Ticket Summary</span> <span>status</span> <span> Ticket ID</span>
                    </li>
                    {listItemArr}
                </ul>
            </div>            
        </div>
      </div>
      <div className="row">

      </div>
    </div>
  );
  return <DashboardNavUser body={body} />;
};

export default Disco;

import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import DashboardNavTcn from "../components/Header/DashboardNavTcn";
import TcnForm from "../forms/TcnForm";

class Disco extends React.Component {
    constructor(props) {
        super(props);
        this.loadTickets = this.loadTickets.bind(this);
        this.state = {
            tickets: [],
        }
    }
    componentDidMount() {
        const new_tickets = this.props.tickets;
        this.setState({tickets: new_tickets})
    }
    loadTickets() {
        const url = `/tickets/getall`;
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
                            if(item.status === "pending") {
                                listItemArray.push(                        
                                    <li className="list-items" key={index}> 
                                        <span> <a href="item-1">{item.station}--{item.equipment}</a></span> <span>{item.status}</span><span>{item.ticket_id} </span> <a href={`/tcn/review?key=${index}&appr=${1}`} className="text-dark">review</a>
                                    </li>
                                )
                            }                        
                        }                
                    )            
                }
                setListItemArray(listItemArray);
            }
            setList();          
        })
        .catch((error) => console.error(error.message));
    }
}

const Disco = (props) => {
    const history = useHistory();
    const route = history.location.pathname;
    const [listItemArray, setListItemArray] = useState([]);
    const [ticketLength, setticketLength] = useState(0);
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [userName, setUserName] = useState(localStorage.getItem("userName"));
    const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem("isLoggedIn"));
    const [department, setDepartment] = useState("department");
    const [approval_level, setApprovalLevel] = useState("approval_level");
    const [company, setCompany] = useState("company");
    const [email, setEmail] = useState("email");
    const handleClick = (index) => {
        console.log(index, "the index");
    }
    const handleStatus = (status) => {
        console.log(status, " the status ");
    }
    if(true ) {
        [].forEach(
            (item, index) => {
                //console.log(item, "this i ");
                listItemArray.push(                        
                    <li className="tcn text-dark border" key={index}> 
                       <a href="#" onClick={() => handleClick(index)}> <span>{item.station}</span> <span> {item.equipment}</span> <span> {item.comment}</span> <span>  </span> </a>
                    </li>
                )
            }                
        )            
    }
    useEffect(() => {
        if(this.props.history.location.pathname === "/api/tickets/tcn/tickets" || 
        this.props.history.location.pathname === "/api/tickets/tcn") {
            this.loadTickets();
        }
        loadTickets();
        // connect to the database on startup to retrieve the files
        
    }, [ticketLength]);

  const body = (
    <div className="container-fluid  bg-white">
          <h4 className='my-2'>List of Tickets</h4>
      <div className="row" id="home">
        {/* Form Section where tickets are populated and submitted */}
        <div className="col-sm-7 p-3">
        <ul className='my-4  text-dark'>
            {listItemArray}
        </ul>
        </div>
        {/* Stream section where new tickets are displayed with their current properties */}
        <div className="col-sm-5 p-3">
            <a href="#home">
                <div className="border bg-info text-center py-4 shadow">
                    <h2 className='my-4  text-light'>View Single Ticket</h2>
                    { route === '/api/tickets/tcn/review' ? <TcnForm tickets={tickets} />: "" }                    
                </div>
            </a>
        </div>
      </div>
    </div>
  );
  return <DashboardNavTcn company={company} department={department} userName={userName} body={body} />;
};

export default Disco;

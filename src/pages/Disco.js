import React, { useState, useEffect } from "react";
import { withRouter, Link } from "react-router-dom";
import PropTypes from "prop-types";
import DashboardNavDisco from "../components/Header/DashboardNavDisco";
import DiscoFormEdit from "../forms/DiscoFormEdit";
import DiscoFormNew from "../forms/DiscoFormNew";

const listItemArray = [];
class Disco extends React.Component {
    constructor(props) {
        super(props);
        this.setList = this.setList.bind(this);
        this.loadTickets = this.loadTickets.bind(this);
        this.createTickets = this.createTickets.bind(this);
        this.editTickets = this.editTickets.bind(this);
        this.getData = this.getData.bind(this);
        this.state = {
            tickets: [],
            listItemArr: [],
            ticketLength: 0,
            station: '',
            equipment: '',
            comment: '',
            priority: '',
            company: localStorage.getItem("company"),
            token: localStorage.getItem("token"),
            userName: localStorage.getItem("userName"),
            department: localStorage.getItem("department"),
            email: localStorage.getItem("email")
        }
    }
    componentDidMount() {
        if(this.props.history.location.pathname === "/api/tickets/disco/tickets" || 
        this.props.history.location.pathname === "/api/tickets/disco") {
            this.loadTickets();
        }
        
        // const route = this.props.history.location.pathname;
    }
    setList() {
        if(this.state.tickets.length > 0 ) {
            this.state.tickets.forEach(
                (item, index) => {
                    listItemArray.push(                        
                        <li className="list-items" key={index}> 
                            <span> <a href="item-1">{item.station}--{item.equipment}</a></span> <span>{item.status}</span><span>{item.id} </span> <Link to={`/api/tickets/disco/edit?key=${index}`} className="text-dark">edit</Link>
                        </li>
                    )
                }                
            )            
        }
        this.setState({listItemArr: listItemArray});
    }    
    loadTickets() {
        const url = `https://tcnnas.org/tickets/get?disco=${this.state.department}`;
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
            this.setState({tickets: tick});
            this.setList();          
        })
        .catch((error) => console.error(error.message));
    }
    createTickets(e) {
        const url = "https://tcnnas.org/tickets/new";
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };   
        const date = new Date().toLocaleDateString("en-GB", options).split('/').reverse().join('-');
        const {department, station, equipment, comment, priority} = this.state;
        const disco = department;
        const data = { 
            disco, station, equipment, comment, date, ticket_id: 1, priority
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
            // console.log(response, "this is the response")
            const url = "/api/tickets/disco";
            this.props.history.push(url);
            window.location = url;
            window.location.href = url;
            window.location.replace(url);
            window.open(url);
            window.open(url, "_self");
            //window.open(url, "_blank");
            //window.open(url, "newWindow");
            //window.open(url, "newwin");
            window.location.reload(true);
        })
        .catch((error) => console.error(error.message));
    }
    editTickets(e) {
        //e.preventDefault();
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
            this.props.history.push("/disco");
        })
        .catch((error) => console.error(error.message));
    }
    getData(dat) {
        const {station, equipment, comment, priority} = dat;
        this.setState({station: station});
        this.setState({equipment: equipment});
        this.setState({comment: comment});
        this.setState({priority: priority});
        // push list items object from the getdata into an array of listItem here
        // First of all load any items from the database it shoudl be paginated to reduce the amount to display
        // The returned data is used to populate the list of items at start up
        // Any additional addition to the form is sent to the database,
        // while its pushed to the state of the component to keep fresh data
        // When component reloads, then it pulls all from the database again
    }

    render() {
        const route = this.props.history.location.pathname;
        const { tickets } = this.state;
        const body = (
            <div className="container-fluid  bg-white">
              <div className="row" id="home">
                {/* Form Section where tickets are populated and submitted */}
                <div className="col-sm-7 p-3">
                    <a href="/api/tickets/disco/new">New Form</a>
                    {route === '/api/tickets/disco/new' ? <DiscoFormNew getData={this.getData} submit={this.createTickets} /> : route === '/api/tickets/disco/edit' ? <DiscoFormEdit tickets={tickets} /> : ""}            
                </div>
                {/* Stream section where new tickets are displayed with their current properties */}
                <div className="col-sm-5 p-3">            
                    <div className="border bg-info text-center py-4 shadow">
                        <h2 className='my-4  text-light'>Recent Tickets</h2>
                        <ul className='my-4  text-light'>
                            <li className="ticket-header">
                                <span>Ticket Summary</span> <span>status</span> <span> Ticket ID</span>
                            </li>
                            {this.state.listItemArr}
                        </ul>
                    </div>            
                </div>
              </div>
              <div className="row">
        
              </div>
            </div>
          );
          return <DashboardNavDisco company={this.state.company} department={this.state.department} userName={this.state.userName} body={body} />;
    }
}

export default withRouter(Disco);

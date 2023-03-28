import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import DashboardNavUser from "../components/Header/DashboardNavDisco";
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
            department: 'EKEDC'
        }
    }
    componentDidMount() {
        this.loadTickets();
        // const route = this.props.history.location.pathname;
    }
    setList() {
        if(this.state.tickets.length > 0 ) {
            this.state.tickets.forEach(
                (item, index) => {
                    listItemArray.push(                        
                        <li className="list-items" key={index}> 
                            <span> <a href="item-1">{item.station}--{item.equipment}</a></span> <span>{item.status}</span><span>{item.id} </span> <a href={`/api/tickets/disco/edit?key=${index}`} className="text-dark">edit</a>
                        </li>
                    )
                }                
            )            
        }
        this.setState({listItemArray: listItemArray});
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
            setList();          
        })
        .catch((error) => console.error(error.message));
    }
    createTickets(e) {
        const url = "https://tcnnas.org/tickets/new";
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };   
        const date = new Date().toLocaleDateString("en-GB", options).split('/').reverse().join('-');
        const {disco, station, equipment, comment, priority} = this.state;
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
            this.props.history.push("/api/tickets/disco");
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
            history.push("/disco");
        })
        .catch((error) => console.error(error.message));
    }
    getData(dat) {
        const {station, equipment, comment, priority} = dat;
        this.setState({station});
        this.setState({equipment});
        this.setState({comment});
        this.setState({priority});
        // push list items object from the getdata into an array of listItem here
        // First of all load any items from the database it shoudl be paginated to reduce the amount to display
        // The returned data is used to populate the list of items at start up
        // Any additional addition to the form is sent to the database,
        // while its pushed to the state of the component to keep fresh data
        // When component reloads, then it pulls all from the database again
    }

    render() {
        const body = (
            <div className="container-fluid  bg-white">
              <div className="row" id="home">
                {/* Form Section where tickets are populated and submitted */}
                <div className="col-sm-7 p-3">
                    <a href="/api/tickets/disco/new">New Form</a>
                    {route === '/api/tickets/disco/new' ? <DiscoFormNew getData={this.getData} submit={this.createTickets} /> : route === '/api/tickets/disco/edit' ? <DiscoFormEdit tickets={this.state.tickets} /> : ""}            
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
          return <DashboardNavUser company={this.state.department} body={body} />;
    }
}

export default Disco;

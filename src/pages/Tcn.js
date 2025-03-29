import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import DashboardNavTcn from "../components/Header/DashboardNavTcn";
import TcnForm from "../forms/TcnForm";

class Tcn extends React.Component {
    constructor(props) {
        super(props);
        this.loadTickets = this.loadTickets.bind(this);
        this.setList = this.setList.bind(this);
        this.state = {
            tickets: [],
            ticketLength: 0,
            listItemArray: [],
            token: localStorage.getItem("token"),
            userName: localStorage.getItem("userName"),
            isLoggedIn: localStorage.getItem("isLoggedIn"),
            department: localStorage.getItem("department"),
            approval_level: localStorage.getItem("approval_level"),
            company: localStorage.getItem("company"),
            email: localStorage.getItem("email")
        }
    }
    componentDidMount() {
        if(this.props.history.location.pathname === "/api/tickets/tcn/tickets" || 
        this.props.history.location.pathname === "/api/tickets/tcn") {
            this.loadTickets();
        }
    }
    setList() {
        const listItemArr = [];
        if(this.state.tickets.length > 0 ) {
            this.state.tickets.forEach(
                (item, index) => {
                    if(item.status === "pending") {
                        listItemArr.push(                        
                            <li className="list-items" key={index}> 
                                <span> <a href="item-1">{item.station}--{item.equipment}</a></span> <span>{item.status}</span><span>{item.id} </span> <a href={`/tcn/review?key=${index}&appr=${this.state.approval_level}`} className="text-dark">review</a>
                            </li>
                        )
                    }                        
                }                
            )            
        }
        this.setState({listItemArray: listItemArr});
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
            this.setState({tickets: tick});            
            this.setList();
        })
        .catch((error) => console.error(error.message));
    }

    render() {
        const route = this.props.history.location.pathname;
        const body = (
            <div className="container-fluid  bg-white">
                  <h4 className='my-2'>List of Tickets</h4>
              <div className="row" id="home">
                {/* Form Section where tickets are populated and submitted */}
                <div className="col-sm-7 p-3">
                <ul className='my-4  text-dark'>
                    {this.state.listItemArray}
                </ul>
                </div>
                {/* Stream section where new tickets are displayed with their current properties */}
                <div className="col-sm-5 p-3">
                    <a href="#home">
                        <div className="border bg-info text-center py-4 shadow">
                            <h2 className='my-4  text-light'>View Single Ticket</h2>
                            { route === '/api/tickets/tcn/review' ? <TcnForm tickets={this.state.tickets} />: "" }                    
                        </div>
                    </a>
                </div>
              </div>
            </div>
          );
          return <DashboardNavTcn company={this.state.company} department={this.state.department} userName={this.state.userName} body={body} />;
    }
}

export default Tcn;

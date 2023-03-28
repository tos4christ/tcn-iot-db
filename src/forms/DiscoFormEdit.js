import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";

let formData;

class Form extends React.Component {
    constructor(props) {
        super(props);
        this.updateTickets = this.updateTickets.bind(this);
        this.getRadio = this.getRadio.bind(this);
        this.state = {
            comment: '',
            station: '',
            equipment: '',
            priority: '',
            disco: '',
            ticketLength: null
        }
    }

    componentDidMount() {
        const index = this.props.match.params.key;
        if(Array.isArray(this.props.tickets) && this.props.tickets.length > 0) {
            formData = this.props.tickets[index];
            this.setState({comment: formData.comment});
            this.setState({station: formData.station});
            this.setState({equipment: formData.equipment});
            this.setState({priority: formData.priority});
            this.setState({disco: formData.disco});
            this.setState({ticketLength: formData.ticket_id});
        }
    }

    updateTickets(e) {
        const url = "/tickets/edit";
        const { disco, station, equipment, comment, priority } = this.state;
        const data = { 
            disco, station, equipment, comment, ticket_id: this.state.ticketLength, priority
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
            // How to reload automatically if history.push is not working
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
    getRadio = (e) => {
        this.setState({priority: e.target.value})
    }

    render() {
        return (
            <form className='disco_form' onSubmit={this.updateTickets}>
                <label className='disco_form_label'>
                    Urgent
                    <input 
                        type="radio"
                        value="Urgent"
                        name="checks"
                        id="checks"
                        checked={this.state.priority === 'Urgent'}
                        onChange={this.getRadio}
                    />                    
                    Normal
                    <input 
                        type="radio"
                        value="Normal"
                        name="checks"
                        id="checks"
                        checked={this.state.priority === 'Normal'}
                        onChange={this.getRadio}
                    />
                </label>
                <br/>
                <label className='disco_form_label'>
                    Select Station
                    <select value={this.state.station} onChange={e => this.setState({station:e.target.value}) } >
                        <option>Akangba</option>
                        <option>Lekki</option>
                        <option>Ajah</option>
                    </select>
                </label>
                <br/>
                <label className='disco_form_label' >
                    Select Equipment
                    <select value={this.state.equipment} onChange={e => this.setState({equipment: e.target.value})} >
                        <option>TR3</option>
                        <option>TR2</option>
                        <option>TR1</option>                
                    </select>
                </label>
                <br/>
                <label className='disco_form_label'>
                    <textarea 
                        onChange={e => this.setState({comment: e.target.value})  }
                        placeholder="Comment"
                        required
                        value={this.state.comment}
                        name="comment"
                    />
                    <br/>
                    <button type="submit" className='disco_form_label'>Report</button>
                </label>        
            </form>
          );
    }

}

export default Form;

import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";

function Form({tickets}) {
    const history = useHistory();    
    const queryParams = new URLSearchParams(history.location.search);
    const index = queryParams.get("key");
    const appr_no = queryParams.get("appr")
    let formData;
    const [comment, setComment] = useState('');
    const [station, setStation] = useState('');
    const [equipment, setEquipment] = useState('');
    const [priority, setPriority] = useState('');
    const [disco, setDisco] = useState('');
    const [ticketId, setticketId] = useState(null);
    const [appr_value, setApprValue] = useState('');
 
  useEffect(() => {
        if(Array.isArray(tickets) && tickets.length > 0) {
            formData = tickets[index];
            setComment(formData.comment);
            setStation(formData.station);
            setEquipment(formData.equipment);
            setPriority(formData.priority);
            setDisco(formData.disco);
            setticketId(formData.ticket_id);
        }    
    }, [tickets]);
  const handleSubmit = (e) => {
    console.log('submitted');
    e.preventDefault();
    updateTicketsStatus(e);
  }
  function updateTicketsStatus(e) {
    e.preventDefault();
    const url = "/tickets/editstatus";
    const appr_number = appr_no;
    const data = { 
        disco, appr_number, appr_value, ticket_id: ticketId
    };
    console.log(data, "the data to update ticket");
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
        console.log(response, "this is the response");
        // How to reload automatically if history.push is not working
        // const url = "/tcn";
        // history.push(url);
        // window.location = url;
        // window.location.href = url;
        // window.location.replace(url);
        // window.open(url);
        // window.open(url, "_self");
        // window.location.reload(true);

    })
    .catch((error) => console.error(error.message));
}
  const handleStatus = (e) => {
    //e.preventDefault();
    const appr_value_input = e.target.value;
    if(appr_value_input == 'Approve') {
        setApprValue(true);
    } else if(appr_value_input == 'Decline') {
        setApprValue(false);
    }
  }
  
  return (
    <form  onSubmit={handleSubmit}>
        <label className='disco_form_label'>
           Priority: {priority}
        </label>
        <br/>
        <label className='text-white'>
            Station: {station}
        </label>
        <br/>
        <label className='text-white' >
            Equipment: {equipment}
        </label>
        <br/>
        <label className='text-white' >
            Disco: {disco}
        </label>
        <br/>
        <label className='text-white'>
            Comment: {comment}
            <br/>
            <button type="submit" value={"Approve"} className='disco_form_label' onClick={handleStatus}>Approve</button>
            <button type="submit" value={"Decline"} className='disco_form_label' onClick={handleStatus}>Decline</button>
        </label>
        
        
    </form>
  );
}
export default Form;

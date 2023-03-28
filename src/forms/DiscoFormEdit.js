import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";

function Form({tickets}) {
    let formData;
    console.log(tickets, "the edit tickets");
    const history = useHistory();
    const index = Number(history.location.search.split("=")[1]);
    const [comment, setComment] = useState('');
    const [station, setStation] = useState('');
    const [equipment, setEquipment] = useState('');
    const [priority, setPriority] = useState('');
    const [disco, setDisco] = useState('');
    const [ticketLength, setticketLength] = useState(null);
    useEffect(() => {
        if(Array.isArray(tickets) && tickets.length > 0) {
            formData = tickets[index];
            setComment(formData.comment);
            setStation(formData.station);
            setEquipment(formData.equipment);
            setPriority(formData.priority);
            setDisco(formData.disco);
            setticketLength(formData.ticket_id);
        }
        
    }, [tickets]);  
     function updateTickets(e) {
        const url = "/tickets/edit";
        const data = { 
            disco, station, equipment, comment, ticket_id: ticketLength, priority
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
            const url = "/disco";
            history.push(url);
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
  const getRadio = (e) => {
    setPriority(e.target.value)
  }
  return (
    <form className='disco_form' onSubmit={updateTickets}>
        <label className='disco_form_label'>
            Urgent
            <input 
                type="radio"
                value="Urgent"
                name="checks"
                id="checks"
                checked={priority === 'Urgent'}
                onChange={getRadio}
            />                    
            Normal
            <input 
                type="radio"
                value="Normal"
                name="checks"
                id="checks"
                checked={priority === 'Normal'}
                onChange={getRadio}
            />
        </label>
        <br/>
        <label className='disco_form_label'>
            Select Station
            <select value={station} onChange={e => setStation(e.target.value) } >
                <option>Akangba</option>
                <option>Lekki</option>
                <option>Ajah</option>
            </select>
        </label>
        <br/>
        <label className='disco_form_label' >
            Select Equipment
            <select value={equipment} onChange={e => setEquipment(e.target.value)} >
                <option>TR3</option>
                <option>TR2</option>
                <option>TR1</option>                
            </select>
        </label>
        <br/>
        <label className='disco_form_label'>
            <textarea 
                onChange={e => setComment(e.target.value)  }
                placeholder="Comment"
                required
                value={comment}
                name="comment"
            />
            <br/>
            <button type="submit" className='disco_form_label'>Report</button>
        </label>        
    </form>
  );
}
export default Form;

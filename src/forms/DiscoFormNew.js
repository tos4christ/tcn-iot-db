import React, { useState } from 'react';

function New_Form({getData, submit}) {
  let normalRadio, urgentRadio;
  const [comment, setComment] = useState('');
  const [station, setStation] = useState('Akangba');
  const [equipment, setEquipment] = useState('TR1');
  const [priority, setPriority] = useState('Normal');

  const changeHandler = () => {
    // Write submit logic to append data to the stream section
    const formInputs = {
        station,
        equipment,
        comment,
        priority
    }
    //console.log(formInputs, "the form inputs");
    getData(formInputs);
  }
  const getRadio = (e) => {
    setPriority(e.target.value)
  }
  
  return (
    <form className='disco_form' onSubmit={submit} onChange={changeHandler}>
        <label className='disco_form_label'>
            Urgent
            <input 
                type="radio"
                value="Urgent"
                name="checks"
                id="checks"
                onChange={getRadio}
                ref={node => urgentRadio = node}
            />                    
            Normal
            <input 
                type="radio"
                value="Normal"
                name="checks"
                id="checks"
                onChange={getRadio}
                ref={node => normalRadio = node}
            />
        </label>
        <br/>
        <label className='disco_form_label'>
            Select Station
            <select required value={station} onChange={e => setStation(e.target.value) } >
                <option value="Akangba">Akangba</option>
                <option value="Lekki">Lekki</option>
                <option value="Ajah">Ajah</option>
            </select>
        </label>
        <br/>
        <label className='disco_form_label' >
            Select Equipment
            <select required value={equipment} onChange={e => setEquipment(e.target.value)} >    
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
export default New_Form;

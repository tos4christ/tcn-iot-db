import React from 'react';

class Row extends React.Component {
    render() {
        const { data } = this.props;
        const date = data.date.split('T')[0];
        let tempDate = date.split('-');
        tempDate[2] = Number(date.split('-')[2]) + 1
        const time = data.hour + ':' + data.minute + ':' + data.seconds;        
        return (
            <tr>
                <td className="tg-zb4j">{tempDate.join('-')}</td>
                <td className="tg-zb4j">{time}</td>
                <td className="tg-zb4j">{data.station}</td>
                <td className="tg-zb4j">{data.equipment}</td>                
                <td className="tg-zb4j">{data[data.parameter]}</td>
            </tr>
        )
    }
}

export default Row;

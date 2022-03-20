import React from 'react';

class Row extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }
    componentDidMount() {
        
    }
    render() {
        const { data } = this.props;
        let date = data.date.split('T')[0];
        let tempDate = date.split('-');
        tempDate[2] = Number(date.split('-')[2]) + 1
        const time = data.hour + ':' + data.minute + ':' + data.seconds;        
        return (
            <tr>
                <td className="tg-zb4j">{data.station}</td>
                <td className="tg-zb4j">{data.line_name}</td>
                <td className="tg-zb4j">{tempDate.join('-')}</td>
                <td className="tg-zb4j">{time}</td>
                <td className="tg-zb4j">{data.mw}</td>
                <td className="tg-zb4j">{data.amp}</td>
                <td className="tg-zb4j">{data.kv}</td>
                <td className="tg-zb4j">{data.mvar}</td>
            </tr>
        )
    }
}

export default Row;

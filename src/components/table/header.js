import React from 'react';

class Header extends React.Component {

  render() {
    return (
      <thead>
        <tr>
          <th className="tg-zb4j">Station</th>
          <th className="tg-zb4j">Equipment</th>
          <th className="tg-zb4j">Date</th>
          <th className="tg-zb4j">Time</th>
          <th className="tg-zb4j">Power</th>
          <th className="tg-zb4j">Current</th>
          <th className="tg-zb4j">Voltage</th>
          <th className="tg-zb4j">Reactive Power</th>
        </tr>
      </thead>
    )
  }
}

export default Header;

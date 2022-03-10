import React from 'react';

class Header extends React.Component {
    constructor(props) {
        super(props);
    }

  render() {
    return (
      <thead>
        <tr>
        <th className="tg-zb4j">Date</th>
          <th className="tg-zb4j">Time</th>
          <th className="tg-zb4j">Station</th>
          <th className="tg-zb4j">Equipment</th>
          <th className="tg-zb4j">{this.props.profileType}</th>          
        </tr>
      </thead>
    )
  }
}

export default Header;

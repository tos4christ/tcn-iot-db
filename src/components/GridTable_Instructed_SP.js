// InstructedPage.js
import React, { Component } from 'react';
import '../styles/InstructedPage.css'; // Assuming you have a CSS file for styles

class InstructedPage extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      instructedLoad: '',
      selectedStations: [],
      stations: [],
      isLoading: false,
      isSubmitted: false,
      submittedStations: []
    };
  }

  async componentDidMount() {
    try {
      const response = await fetch('https://tcnnas.org/api/stations');
      const data = await response.json();
      this.setState({ stations: data });
    } catch (error) {
      console.error('Failed to fetch stations:', error);
    }
  }

  handleSubmit = async (e) => {
    e.preventDefault();
    this.setState({ isLoading: true });
    
    try {
      const response = await fetch('https://tcnnas.org/api/instruction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          instructedLoad: this.state.instructedLoad,
          stationIds: this.state.selectedStations
        })
      });
      
      const data = await response.json();
      if (response.ok) {
        this.setState({ 
          isSubmitted: true,
          isLoading: false,
          submittedStations: data.updatedStations,
          instructedLoad: '',
          selectedStations: []
        });
        setTimeout(() => this.setState({ isSubmitted: false }), 5000);
      }
    } catch (error) {
      console.error('Submission error:', error);
      this.setState({ isLoading: false });
    }
  };

  handleLoadChange = (e) => {
    this.setState({ instructedLoad: e.target.value });
  };

  handleStationChange = (id) => {
    this.setState(prevState => {
      if (prevState.selectedStations.includes(id)) {
        return {
          selectedStations: prevState.selectedStations.filter(sid => sid !== id)
        };
      } else {
        return {
          selectedStations: [...prevState.selectedStations, id]
        };
      }
    });
  };

  render() {
    const { stations, instructedLoad, selectedStations, isLoading, isSubmitted, submittedStations } = this.state;
    const onlineStations = stations.filter(s => s.status === 'Online');

    return (
      <div className="instructed-container">
        <div className="instruction-card">
          <h2 className="instruction-title">LOAD INSTRUCTION PANEL</h2>
          
          <form onSubmit={this.handleSubmit}>
            <div className="input-group">
              <label htmlFor="loadInput">Enter Instructed Load (MW)</label>
              <input
                id="loadInput"
                type="number"
                value={instructedLoad}
                onChange={this.handleLoadChange}
                placeholder="Enter load value"
                required
                min="1"
              />
            </div>
            
            <div className="station-selection">
              <h3>Select Stations ({selectedStations.length} selected)</h3>
              <div className="station-grid">
                {stations.map(station => (
                  <div 
                    key={station.id}
                    className={`station-card ${selectedStations.includes(station.id) ? 'selected' : ''} ${station.status === 'Offline' ? 'offline' : ''}`}
                    onClick={() => station.status === 'Online' && this.handleStationChange(station.id)}
                  >
                    <div className="station-id">{station.id}</div>
                    <div className="station-name">{station.name}</div>
                    <div className={`station-status ${station.status.toLowerCase()}`}>
                      {station.status}
                    </div>
                    {submittedStations.includes(station.id) && isSubmitted && (
                      <div className="update-indicator">✓ Updated</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            <button 
              type="submit" 
              className="submit-button-sp"
              disabled={isLoading || selectedStations.length === 0}
            >
              {isLoading ? 'BROADCASTING...' : `SEND TO ${selectedStations.length} STATION${selectedStations.length !== 1 ? 'S' : ''}`}
            </button>
          </form>
          
          {isSubmitted && (
            <div className="success-message">
              ✔ Instruction successfully broadcasted to {selectedStations.length} station(s)
            </div>
          )}
        </div>
        
        <div className="instruction-guidelines">
          <h3>OPERATION GUIDELINES</h3>
          <ul>
            <li>Enter load value in megawatts (MW)</li>
            <li>Select stations to receive the instruction</li>
            <li>Offline stations cannot receive instructions</li>
            <li>Verify station statuses before instruction</li>
            <li>Maximum load capacity: 500 MW per station</li>
            <li>Confirm with control room before submission</li>
          </ul>
          
          <div className="system-status">
            <h4>System Status</h4>
            <div className="status-item">
              <span className="status-label">Online Stations:</span>
              <span className="status-value">{onlineStations.length}/{stations.length}</span>
            </div>
            <div className="status-item">
              <span className="status-label">Avg. Reserve:</span>
              <span className="status-value">
                {stations.length ? Math.round(stations.reduce((sum, s) => sum + s.reserve, 0) / stations.length) : 0}%
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default InstructedPage;
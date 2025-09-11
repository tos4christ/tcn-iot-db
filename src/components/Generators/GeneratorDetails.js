import React, { Component } from 'react';
import './generator.css';
import './generator_units.css';
import GeneratorTableRow from './GeneratorTableRow';

class GeneratorDetails extends Component {
  downloadStationData = () => {
    const { selectedStation } = this.props;
    if (!selectedStation) return;
    
    const dataStr = JSON.stringify(selectedStation, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${selectedStation.name.replace(/\s+/g, '_')}_all_units.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  downloadAllStationsData = () => {
    const { allStations } = this.props;
    const allUnitsData = allStations.flatMap(station => 
      station.units.map(unit => ({
        stationName: station.name,
        stationType: station.type,
        ...unit
      }))
    );
    
    const dataStr = JSON.stringify(allUnitsData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'all_stations_generators.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  downloadUnitData = (unit) => {
    const { selectedStation } = this.props;
    const unitData = {
      stationName: selectedStation.name,
      stationType: selectedStation.type,
      ...unit
    };
    
    const dataStr = JSON.stringify(unitData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${selectedStation.name.replace(/\s+/g, '_')}_${unit.name.replace(/\s+/g, '_')}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  render() {
    try {
      const { selectedStation, testStation, allStations } = this.props;
      const checkid = selectedStation ? selectedStation.id : "";
      const chosenStation = allStations.filter(station => station.id === checkid)[0] ? allStations.filter(station => station.id === checkid)[0] : [];
    //   console.log(chosenStation, " the chosen station");
      if (chosenStation.length === 0) {
        return (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <div className="icon-zap text-6xl text-gray-400 mb-4"></div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                Select a Power Station
              </h3>
              <p className="text-gray-500 mb-6">
                Choose a station from the sidebar to view generator details
              </p>
              <button
                onClick={this.downloadAllStationsData}
                className="download-btn"
              >
                <div className="icon-download text-lg"></div>
                Download All Generators Data
              </button>
            </div>
          </div>
        );
      }

      return (
        <div className="flex-1 flex flex-col">
          <div className="bg-white border-b border-gray-200 p-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {chosenStation.name}
                </h1>
                <p className="text-gray-600 mt-1">
                  {chosenStation.units.length} Generator Units • Total Active Power: {
                    chosenStation.units.reduce((sum, unit) => sum + Number(unit.activePower), 0).toFixed(2)
                  } MW
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={this.downloadAllStationsData}
                  className="download-btn bg-green-600 hover:bg-green-700"
                >
                  <div className="icon-database text-lg"></div>
                  All Stations
                </button>
                <button
                  onClick={this.downloadStationData}
                  className="download-btn"
                >
                  <div className="icon-download text-lg"></div>
                  This Station
                </button>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-auto p-6 bg-gray-50">
            <div className="bg-white rounded-lg shadow-md overflow-x-auto">
              <table className="w-full generator-table">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-3 py-3 text-left text-sm font-semibold text-gray-900">Unit Name</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                    <th className="px-3 py-3 text-left text-sm font-semibold text-gray-900"> (MW)</th>
                    <th className="px-3 py-3 text-left text-sm font-semibold text-gray-900"> (KV)</th>
                    <th className="px-3 py-3 text-left text-sm font-semibold text-gray-900"> (MVAR)</th>
                    <th className="px-3 py-3 text-left text-sm font-semibold text-gray-900"> (PF)</th>
                    <th className="px-3 py-3 text-left text-sm font-semibold text-gray-900"> (Hz)</th>
                    <th className="px-3 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {chosenStation.units.map((unit, index) => (
                    <GeneratorTableRow 
                      key={unit.id} 
                      unit={unit} 
                      index={index}
                      onDownload={() => this.downloadUnitData(unit)}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      );
    } catch (error) {
      console.error('GeneratorDetails component error:', error);
      return null;
    }
  }
}

export default GeneratorDetails;
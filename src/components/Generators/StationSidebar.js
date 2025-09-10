import React, { Component } from 'react';

class StationSidebar extends Component {
  render() {
    try {
      const { stations, selectedStation, onStationSelect } = this.props;

      return (
        <div 
          className="bg-white border-r border-gray-300 flex flex-col"
          style={{ width: 'var(--sidebar-width)' }}
        >
          <div className="p-4 border-b border-gray-200 bg-gray-100">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <div className="icon-zap text-xl text-blue-600"></div>
              Power Stations
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {stations.length} stations
            </p>
          </div>

          <div className="flex-1 overflow-y-auto">
            {stations.map((station) => (
              <div
                key={station.id}
                className={`station-item ${
                  selectedStation?.id === station.id ? 'active' : ''
                }`}
                onClick={() => onStationSelect(station)}
              >
                <div className="flex items-center gap-2">
                  <div className="icon-building text-lg text-gray-600"></div>
                  <div>
                    <div className="font-medium text-gray-900 text-sm">
                      {station.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {station.units.length} units
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    } catch (error) {
      console.error('StationSidebar component error:', error);
      return null;
    }
  }
}

export default StationSidebar;
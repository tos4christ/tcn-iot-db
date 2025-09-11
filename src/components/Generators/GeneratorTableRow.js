import React, { Component } from 'react';

class GeneratorTableRow extends Component {
  getStatusColor(status) {
    switch (status) {
      case 'online': return 'text-green-700 bg-green-100';
      case 'offline': return 'text-red-700 bg-red-100';
      case 'maintenance': return 'text-yellow-700 bg-yellow-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  }

  getStatusIcon(status) {
    switch (status) {
      case 'online': return 'icon-check-circle';
      case 'offline': return 'icon-x-circle';
      case 'maintenance': return 'icon-wrench';
      default: return 'icon-help-circle';
    }
  }

  render() {
    try {
      const { unit, index, onDownload } = this.props;

      return (
        <tr 
          className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 transition-colors duration-150`}
        >
          <td className="px-4 py-4">
            <div className="font-medium text-gray-900">{unit.name}</div>
          </td>
          
          <td className="px-3 py-4">
            <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${this.getStatusColor(unit.status)}`}>
              <div className={`${this.getStatusIcon(unit.status)} text-xs`}></div>
              <span className="capitalize">{unit.status}</span>
            </div>
          </td>
            
          <td className="px-4 py-4">
            <div className="text-sm font-medium text-gray-900">{unit.activePower}</div>
          </td>
            
          <td className="px-4 py-4">
            <div className="text-sm font-medium text-gray-900">{unit.voltage}</div>
          </td>
          <td className="px-4 py-4">
            <div className="text-sm font-medium text-gray-900">{unit.reactivePower}</div>
          </td>
          <td className="px-4 py-4">
            <div className="text-sm font-medium text-gray-900">{isNaN(unit.powerFactor) ? 0 : unit.powerFactor}</div>
          </td>
          <td className="px-4 py-4">
            <div className="text-sm font-medium text-gray-900">{isNaN(unit.frequency) ? 0 : unit.frequency}</div>
          </td>

          <td className="px-4 py-4">
            <button
              onClick={onDownload}
              className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 p-1 rounded transition-colors duration-150"
              title="Download unit data"
            >
              <div className="icon-download text-lg"></div>
            </button>
          </td>
        </tr>
      );
    } catch (error) {
      console.error('GeneratorTableRow component error:', error);
      return null;
    }
  }
}

export default GeneratorTableRow;
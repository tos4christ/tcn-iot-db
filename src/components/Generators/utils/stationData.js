export function generateStations() {
  const stationTypes = ['Thermal', 'Hydro', 'Nuclear', 'Wind', 'Solar', 'Gas'];
  const unitTypes = ['Steam Turbine', 'Gas Turbine', 'Hydro Turbine', 'Wind Generator', 'Solar Panel Array'];
  const statuses = ['online', 'offline', 'maintenance'];
  
  const stations = [];
  
  for (let i = 3; i <= 150; i++) {
    const stationType = stationTypes[Math.floor(Math.random() * stationTypes.length)];
    const numUnits = Math.floor(Math.random() * 8) + 2; // 2-10 units per station
    
    const units = [];
    for (let j = 1; j <= numUnits; j++) {
      const capacity = Math.floor(Math.random() * 500) + 50; // 50-550 MW
      // const currentOutput = Math.floor(Math.random() * capacity);
      // const efficiency = Math.floor(Math.random() * 20) + 75; // 75-95%
      
      const activePower = Math.floor(Math.random() * capacity);
      const voltage = (Math.random() * 10 + 10).toFixed(1); // 10-20 KV
      const reactivePower = (Math.random() * 50).toFixed(1); // 0-50 MVAR
      const powerFactor = (Math.random() * 0.3 + 0.7).toFixed(2); // 0.70-1.00
      const frequency = (Math.random() * 2 + 49).toFixed(1); // 49-51 Hz
      
      units.push({
        id: `unit-${i}-${j}`,
        name: `Unit ${j}`,
        activePower: activePower,
        voltage: voltage,
        reactivePower: reactivePower,
        powerFactor: powerFactor,
        frequency: frequency,
        status: statuses[Math.floor(Math.random() * statuses.length)]
      });
    }
    
    stations.push({
      id: `station-${i}`,
      name: `${stationType} Power Station ${i.toString().padStart(3, '0')}`,
      type: stationType,
      units: units,
      location: `Location ${i}`,
      commissioned: Math.floor(Math.random() * 30) + 1990 // 1990-2020
    });
  }
  
  return stations.sort((a, b) => a.name.localeCompare(b.name));
}
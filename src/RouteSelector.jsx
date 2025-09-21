import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';

export default function RouteSelector({ onSelect }) {
  const [routes, setRoutes] = useState([]);
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [originQuery, setOriginQuery] = useState('');
  const [destinationQuery, setDestinationQuery] = useState('');

  useEffect(() => {
    const fetchRoutes = async () => {
      const { data, error } = await supabase.from('routes').select('*');
      if (!error) setRoutes(data || []);
    };
    fetchRoutes();
  }, []);

  // Get unique origins and destinations
  const origins = Array.from(
    new Map(
      routes.map(r => [r.src_iata, { iata: r.src_iata, city: r.src_city }])
    ).values()
  );
  const destinations = Array.from(
    new Map(
      routes.map(r => [r.dst_iata, { iata: r.dst_iata, city: r.dst_city }])
    ).values()
  );

  // Filter by query
  const filteredOrigins = origins.filter(
    o =>
      o.iata.toLowerCase().includes(originQuery.toLowerCase()) ||
      o.city.toLowerCase().includes(originQuery.toLowerCase())
  );
  const filteredDestinations = destinations.filter(
    d =>
      d.iata.toLowerCase().includes(destinationQuery.toLowerCase()) ||
      d.city.toLowerCase().includes(destinationQuery.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', gap: 24, alignItems: 'center', margin: '2em 0' }}>
      <div>
        <label htmlFor="origin">Origin</label>
        <input
          id="origin"
          type="text"
          placeholder="Type city or IATA..."
          value={originQuery}
          onChange={e => setOriginQuery(e.target.value)}
          style={{ display: 'block', marginBottom: 8, width: 200 }}
        />
        <select
          value={origin}
          onChange={e => {
            setOrigin(e.target.value);
            setOriginQuery('');
            if (onSelect) onSelect({ origin: e.target.value, destination });
          }}
          style={{ width: 200 }}
        >
          <option value="">Select origin</option>
          {filteredOrigins.map(o => (
            <option key={o.iata} value={o.iata}>
              {o.iata} - {o.city}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="destination">Destination</label>
        <input
          id="destination"
          type="text"
          placeholder="Type city or IATA..."
          value={destinationQuery}
          onChange={e => setDestinationQuery(e.target.value)}
          style={{ display: 'block', marginBottom: 8, width: 200 }}
        />
        <select
          value={destination}
          onChange={e => {
            setDestination(e.target.value);
            setDestinationQuery('');
            if (onSelect) onSelect({ origin, destination: e.target.value });
          }}
          style={{ width: 200 }}
        >
          <option value="">Select destination</option>
          {filteredDestinations.map(d => (
            <option key={d.iata} value={d.iata}>
              {d.iata} - {d.city}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

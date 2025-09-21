
import { useEffect, useState } from 'react';

import { supabase } from './supabaseClient';
import RouteSelector from './RouteSelector';
import RouteInfo from './RouteInfo';
import './App.css';


function App() {
  const [selected, setSelected] = useState({ origin: '', destination: '' });

  return (
    <div className="App">
      <h1>Flight Route Selector</h1>
      <RouteSelector onSelect={setSelected} />
      <div style={{ marginTop: 32 }}>
        <h2>Selected Route</h2>
        <pre style={{ textAlign: 'left', background: '#111', color: '#f4f4f4', padding: '1em', borderRadius: 6 }}>
          {JSON.stringify(selected, null, 2)}
        </pre>
        <RouteInfo origin={selected.origin} destination={selected.destination} />
      </div>
    </div>
  );
}

export default App

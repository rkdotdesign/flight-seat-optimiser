import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';

export default function RouteInfo({ origin, destination }) {
  const [route, setRoute] = useState(null);
  const [sceneDetails, setSceneDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setRoute(null);
    setSceneDetails(null);
    setError(null);
  }, [origin, destination]);

  const fetchRouteInfo = async () => {
    setLoading(true);
    setError(null);
    setRoute(null);
    setSceneDetails(null);
    // Fetch route info
    const { data, error } = await supabase
      .from('routes')
      .select('*')
      .eq('src_iata', origin)
      .eq('dst_iata', destination)
      .maybeSingle();
    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }
    setRoute(data);
    if (data && data.scenic_side && data.scenic_side !== 'NONE') {
      // Fetch scene details from scene_details table using src_iata and dst_iata
      const { data: scene, error: sceneError } = await supabase
        .from('scene_details')
        .select('scenic_side,scene_type,scene_description')
        .eq('src_iata', origin)
        .eq('dst_iata', destination)
        .maybeSingle();
      if (!sceneError && scene) {
        setSceneDetails(scene);
      } else {
        setSceneDetails(null);
      }
    } else {
      setSceneDetails(null);
    }
    setLoading(false);
  };

  return (
    <div style={{ marginTop: 24 }}>
      <button onClick={fetchRouteInfo} disabled={!origin || !destination || loading}>
        {loading ? 'Loading...' : 'Show Route Info'}
      </button>
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {route === null && !loading && (
        <div style={{ marginTop: 16, color: 'red' }}>
          No route exists between the selected locations.
        </div>
      )}
      {route && (
        <div style={{ marginTop: 16 }}>
          {route.sunrise_side && (
            <div><b>Sunrise Side:</b> {route.sunrise_side}</div>
          )}
          {route.sunset_side && (
            <div><b>Sunset Side:</b> {route.sunset_side}</div>
          )}
          {route.scenic_side && route.scenic_side !== 'NONE' ? (
            sceneDetails ? (
              <div style={{ marginTop: 12 }}>
                <b>Scenic Side:</b> {sceneDetails.scenic_side}<br />
                <b>Scene Type:</b> {sceneDetails.scene_type}<br />
                <b>Description:</b> {sceneDetails.scene_description}
              </div>
            ) : (
              <div style={{ marginTop: 12 }}>
                <b>Scenic Side:</b> {route.scenic_side}<br />
                <i>Scene details not found.</i>
              </div>
            )
          ) : (
            <div style={{ marginTop: 12 }}>
              No scenic location between these two locations.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

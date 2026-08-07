import { useEffect } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Auto-fit the map to the route bounds whenever the trip changes
function BoundsFitter({ waypoints }) {
  const map = useMap();
  useEffect(() => {
    if (waypoints.length > 1) {
      map.fitBounds(waypoints, { padding: [32, 32] });
    }
  }, [map, waypoints]);
  return null;
}

function makeStopIcon(label, isStart, isEnd) {
  const bg = isStart ? '#059669' : isEnd ? '#dc2626' : '#2563eb';
  const html = `
    <div style="
      background:${bg};
      color:white;
      width:30px;
      height:30px;
      border-radius:50%;
      display:flex;
      align-items:center;
      justify-content:center;
      font-weight:700;
      font-size:12px;
      border:2px solid white;
      box-shadow:0 2px 6px rgba(0,0,0,0.35);
      font-family:sans-serif;
    ">${label}</div>`;
  return L.divIcon({ html, className: '', iconSize: [30, 30], iconAnchor: [15, 15] });
}

export default function TripRouteMap({ trip }) {
  const { waypoints, stops } = trip.route;

  // Center on the midpoint of all waypoints as a fallback
  const centerLat = waypoints.reduce((s, w) => s + w[0], 0) / waypoints.length;
  const centerLng = waypoints.reduce((s, w) => s + w[1], 0) / waypoints.length;

  return (
    <MapContainer
      center={[centerLat, centerLng]}
      zoom={7}
      style={{ height: '380px', width: '100%', borderRadius: '0.5rem' }}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Route polyline */}
      <Polyline
        positions={waypoints}
        pathOptions={{ color: trip.colorFrom, weight: 4, dashArray: '8 6', opacity: 0.85 }}
      />

      {/* Stop markers */}
      {stops.map((stop, i) => {
        const isStart = i === 0;
        const isEnd = i === stops.length - 1;
        const label = isStart ? '🏠' : isEnd ? '📍' : String(i);
        return (
          <Marker
            key={stop.name}
            position={stop.coords}
            icon={makeStopIcon(label, isStart, isEnd)}
          >
            <Popup>
              <div style={{ minWidth: '160px' }}>
                <p style={{ fontWeight: 700, marginBottom: 4 }}>{stop.name}</p>
                {stop.night != null && (
                  <p style={{ fontSize: 12, color: '#2563eb', marginBottom: 4 }}>
                    Night {stop.night} overnight
                  </p>
                )}
                <p style={{ fontSize: 12, color: '#475569' }}>{stop.description}</p>
              </div>
            </Popup>
          </Marker>
        );
      })}

      <BoundsFitter waypoints={waypoints} />
    </MapContainer>
  );
}

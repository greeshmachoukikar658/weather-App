import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Fix Vite + Leaflet broken default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

export default function MapView({ cities }) {
  return (
    <MapContainer
      center={[20, 78]}
      zoom={2}
      scrollWheelZoom={false}
      style={{ height: "400px", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {cities.map((c) => (
        <Marker key={c.name} position={[c.lat, c.lon]}>
          <Popup>
            <strong>{c.name}</strong><br />{c.temp}°C
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

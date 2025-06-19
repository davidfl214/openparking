import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

function HomeMap() {
    return (
        <div style={{ height: "100vh" }}>
            <MapContainer center={[43.263, -2.935]} zoom={13} style={{ height: "100%" }}>
                <TileLayer
                    attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
            </MapContainer>
        </div>
    );
}

export default HomeMap;

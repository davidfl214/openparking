import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function Map() {
    return (
        <MapContainer
            center={[43.532541129545194, -5.661245469585264]}
            zoom={14}
            scrollWheelZoom={true}
            className="h-[80vh] w-[100wh]"
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[43.54090244826075, -5.659484602848297]}>
                <Popup>Parking CC San Agustín</Popup>
            </Marker>
            <Marker position={[43.54011653870023, -5.640089963864758]}>
                <Popup>Parque Hermanos Castro</Popup>
            </Marker>
        </MapContainer>
    );
}

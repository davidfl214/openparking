import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useGeolocation } from "../hooks/useGeolocation";
import { useContext, useEffect, useState, type JSX } from "react";
import { type LatLngTuple } from "leaflet";
import Swal from "sweetalert2";
import type { ParkingData } from "../types/parking";
import { createStyledMarker, getMarkerColorClass } from "../utils/markerStyles";
import {
    MarkerLocationClickHandler,
    SearchLocationHandler,
    UserLocationHandler,
} from "../utils/locationHandler";
import { LocationContext } from "../context/LocationContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import { Directions, Favorite, FavoriteBorder } from "@mui/icons-material";
import { handleFavoriteButton } from "../utils/handleFavoriteButton";
import { DEFAULT_COORDINATES } from "../constants/constants";
import { useMapData } from "../hooks/useMapData";

export default function Map(): JSX.Element {
    const {
        latitudeSearch,
        longitudeSearch,
        parkingData,
        isMobile,
        setParkingData,
        authResponse,
        setAuthResponse,
    } = useContext(LocationContext);
    const { position: userLocation, error: locationError } = useGeolocation();
    const { loading } = useMapData(setParkingData, isMobile);
    const [markerLocation, setMarkerLocation] = useState<LatLngTuple | null>(
        null
    );
    const navigate = useNavigate();

    useEffect(() => {
        if (locationError) {
            Swal.fire({
                toast: true,
                position: isMobile ? "top" : "top-end",
                icon: "error",
                title: "<strong>Location Error</strong>",
                html: locationError,
                showConfirmButton: false,
                timer: 2000,
                background: "#fef2f2",
                color: "#991b1b",
                timerProgressBar: true,
            });
        }
    }, [locationError]);

    const defaultCenter: LatLngTuple = DEFAULT_COORDINATES;

    return (
        <MapContainer
            center={defaultCenter}
            zoom={14}
            scrollWheelZoom={true}
            className="min-h-[82vh] tablet:min-h-[85vh] w-[100vw]"
        >
            <UserLocationHandler userLocation={userLocation} />
            <MarkerLocationClickHandler markerLocation={markerLocation} />
            <SearchLocationHandler
                latitudeSearch={latitudeSearch}
                longitudeSearch={longitudeSearch}
            />
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {!loading &&
                parkingData.map(
                    (parking: ParkingData) =>
                        parking.enabled && (
                            <Marker
                                key={parking.id}
                                position={[parking.latitude, parking.longitude]}
                                icon={createStyledMarker(
                                    getMarkerColorClass(parking)
                                )}
                                eventHandlers={{
                                    click: () => {
                                        setMarkerLocation([
                                            parking.latitude,
                                            parking.longitude,
                                        ]);
                                    },
                                }}
                            >
                                <Popup>
                                    <div className="text-center p-1">
                                        <h2 className="font-bold text-lg">
                                            {parking.name}
                                        </h2>
                                        <p className="text-gray-600 max-w-[250px] mx-auto">
                                            {parking.location}
                                        </p>
                                        <div className="flex justify-center gap-2 mt-2">
                                            <span className="text-green-600 font-semibold">
                                                {parking.totalSlots -
                                                    parking.occupiedSlots}{" "}
                                                Free
                                            </span>
                                            <span className="text-red-600 font-semibold">
                                                {parking.occupiedSlots} Occupied
                                            </span>
                                        </div>
                                        <div className="flex justify-center items-center gap-4 mt-4">
                                            <Button
                                                variant="contained"
                                                sx={{
                                                    bgcolor:
                                                        "var(--color-primary)",
                                                    fontWeight: "bold",
                                                }}
                                                onClick={() =>
                                                    navigate(
                                                        `/parkings/${parking.id}`
                                                    )
                                                }
                                            >
                                                Ver detalles
                                            </Button>
                                            <Directions
                                                fontSize="large"
                                                sx={{
                                                    cursor: "pointer",
                                                }}
                                                onClick={() => {
                                                    const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${parking.latitude},${parking.longitude}`;
                                                    window.open(
                                                        mapsUrl,
                                                        "_blank"
                                                    );
                                                }}
                                            />
                                            {authResponse &&
                                                (authResponse.parkingFavorites &&
                                                authResponse.parkingFavorites.includes(
                                                    parking.id
                                                ) ? (
                                                    <Favorite
                                                        fontSize="large"
                                                        sx={{
                                                            cursor: "pointer",
                                                            color: "#ef4444",
                                                        }}
                                                        onClick={async () => {
                                                            try {
                                                                await handleFavoriteButton(
                                                                    parking.id,
                                                                    authResponse,
                                                                    setAuthResponse
                                                                );
                                                            } catch (error) {
                                                                Swal.fire({
                                                                    toast: true,
                                                                    position:
                                                                        isMobile
                                                                            ? "top"
                                                                            : "top-end",
                                                                    icon: "error",
                                                                    title: "<strong>Error</strong>",
                                                                    html: "Ha habido un problema al actualizar el favorito.",
                                                                    showConfirmButton:
                                                                        false,
                                                                    timer: 2000,
                                                                    background:
                                                                        "#fef2f2",
                                                                    color: "#991b1b",
                                                                    timerProgressBar:
                                                                        true,
                                                                });
                                                            }
                                                        }}
                                                    />
                                                ) : (
                                                    <FavoriteBorder
                                                        fontSize="large"
                                                        sx={{
                                                            cursor: "pointer",
                                                        }}
                                                        onClick={async () => {
                                                            try {
                                                                await handleFavoriteButton(
                                                                    parking.id,
                                                                    authResponse,
                                                                    setAuthResponse
                                                                );
                                                            } catch (error) {
                                                                Swal.fire({
                                                                    toast: true,
                                                                    position:
                                                                        isMobile
                                                                            ? "top"
                                                                            : "top-end",
                                                                    icon: "error",
                                                                    title: "<strong>Error</strong>",
                                                                    html: "Ha habido un problema al actualizar el favorito.",
                                                                    showConfirmButton:
                                                                        false,
                                                                    timer: 2000,
                                                                    background:
                                                                        "#fef2f2",
                                                                    color: "#991b1b",
                                                                    timerProgressBar:
                                                                        true,
                                                                });
                                                            }
                                                        }}
                                                    />
                                                ))}
                                        </div>
                                    </div>
                                </Popup>
                            </Marker>
                        )
                )}
        </MapContainer>
    );
}

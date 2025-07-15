import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useGeolocation } from "../../hooks/useGeolocation";
import { useContext, useEffect, useRef, useState, type JSX } from "react";
import { type LatLngTuple } from "leaflet";
import Swal from "sweetalert2";
import type { ParkingData } from "../../types/parking";
import { fetchParkings } from "../../utils/getParkingData";
import {
    createStyledMarker,
    getMarkerColorClass,
} from "../../utils/markerStyles";
import {
    MarkerLocationClickHandler,
    SearchLocationHandler,
    UserLocationHandler,
} from "../../utils/locationHandler";
import { Stomp, type Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { LocationContext } from "../../context/LocationContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import { Favorite, FavoriteBorder } from "@mui/icons-material";
import { handleFavoriteButton } from "../../utils/handleFavoriteButton";

const PARKINGS_MICROSERVICE_BASE_URL =
    import.meta.env.VITE_PARKINGS_MICROSERVICE_URL || "http://localhost:8080";

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
    const [loading, setLoading] = useState<boolean>(true);
    const [markerLocation, setMarkerLocation] = useState<LatLngTuple | null>(
        null
    );
    const stompClientRef = useRef<Client | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        let stompClient: Client | null = null;

        const loadInitialParkings = async (): Promise<void> => {
            try {
                const data = await fetchParkings(
                    PARKINGS_MICROSERVICE_BASE_URL
                );
                setParkingData(data);
            } catch (error) {
                Swal.fire({
                    toast: true,
                    position: isMobile ? "top" : "top-end",
                    icon: "error",
                    title: "<strong>Failed to load initial parking data</strong>",
                    showConfirmButton: false,
                    timer: 3000,
                    background: "#fef2f2",
                    color: "#991b1b",
                    timerProgressBar: true,
                });
            } finally {
                setLoading(false);
            }
        };

        const connectWebSocket = () => {
            const socket = new SockJS(`${PARKINGS_MICROSERVICE_BASE_URL}/ws`);
            stompClient = Stomp.over(socket);

            stompClientRef.current = stompClient;

            stompClient.debug = () => {};

            stompClient.onConnect = () => {
                stompClient?.subscribe("/topic/parkingStatus", (message) => {
                    const updatedParking: ParkingData = JSON.parse(
                        message.body
                    );
                    setParkingData((prevParkings) => {
                        const existingIndex = prevParkings.findIndex(
                            (p) => p.id === updatedParking.id
                        );
                        if (existingIndex > -1) {
                            const newParkings = [...prevParkings];
                            newParkings[existingIndex] = updatedParking;
                            return newParkings;
                        } else {
                            return [...prevParkings, updatedParking];
                        }
                    });
                });
            };

            stompClient.onStompError = () => {
                Swal.fire({
                    toast: true,
                    position: isMobile ? "top" : "top-end",
                    icon: "error",
                    title: "<strong>WebSocket Error</strong>",
                    html: "Could not connect to real-time updates. Please refresh.",
                    showConfirmButton: false,
                    timer: 5000,
                    background: "#fef2f2",
                    color: "#991b1b",
                    timerProgressBar: true,
                });
            };

            stompClient.activate();
        };

        loadInitialParkings();
        connectWebSocket();

        return () => {
            if (stompClientRef.current?.connected) {
                stompClientRef.current.deactivate();
            }
        };
    }, []);

    useEffect(() => {
        if (locationError) {
            Swal.fire({
                toast: true,
                position: isMobile ? "top" : "top-end",
                icon: "error",
                title: "<strong>Location Error</strong>",
                html: locationError,
                showConfirmButton: false,
                timer: 3000,
                background: "#fef2f2",
                color: "#991b1b",
                timerProgressBar: true,
            });
        }
    }, [locationError]);

    const defaultCenter: LatLngTuple = [
        40.416918404895505, -3.7034907813021767,
    ];

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
                                    <div className="text-center p-2">
                                        <h2 className="font-bold text-lg">
                                            {parking.name}
                                        </h2>
                                        <p className="text-gray-600">
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
                                                                    timer: 3000,
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
                                                                    timer: 3000,
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

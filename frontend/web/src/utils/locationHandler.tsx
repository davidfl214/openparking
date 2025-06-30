import type { LatLngTuple } from "leaflet";
import { useEffect } from "react";
import { useMap } from "react-leaflet";

export function UserLocationHandler({
    userLocation,
}: {
    userLocation: { latitude: number; longitude: number } | null;
}) {
    const map = useMap();

    useEffect(() => {
        if (userLocation) {
            map.setView([userLocation.latitude, userLocation.longitude], 14);
        }
    }, [userLocation, map]);

    return null;
}

export function MarkerLocationClickHandler({
    markerLocation,
}: {
    markerLocation: LatLngTuple | null;
}) {
    const map = useMap();

    useEffect(() => {
        if (markerLocation) {
            map.flyTo(markerLocation, 15);
        }
    }, [markerLocation, map]);

    return null;
}
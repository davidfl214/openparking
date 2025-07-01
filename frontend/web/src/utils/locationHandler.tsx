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

export function SearchLocationHandler({
    latitudeSearch,
    longitudeSearch,
}: {
    latitudeSearch: number | null;
    longitudeSearch: number | null;
}) {
    const map = useMap();

    useEffect(() => {
        if (latitudeSearch !== null && longitudeSearch !== null) {
            map.flyTo([latitudeSearch, longitudeSearch], 14,
                {
                    animate: true,
                    duration: 3,
                }
            );
        }
    }, [latitudeSearch, longitudeSearch, map]);

    return null;
}

import { useEffect, useState } from "react";
import type { GeolocationState, UserPosition } from "../types/geolocationData";

const getErrorMessage = (error: GeolocationPositionError) : string => {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            return "Location access denied. Please enable location permissions and try again.";
        case error.POSITION_UNAVAILABLE:
            return "Location unavailable. Please check your connection.";
        case error.TIMEOUT:
            return "Location request timed out. Please try again.";
        default:
            return "Unable to get your location. Please try again.";
    }
}

export const useGeolocation = (): GeolocationState => {
    const [position, setPosition] = useState<UserPosition | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!navigator.geolocation) {
            setError("Geolocation is not supported by this browser.");
            return;
        }

        const handleSuccess = (position: GeolocationPosition) => {
            const userPosition: UserPosition = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
            };
            setPosition(userPosition);
            setError(null);
        };

        const handleError = (error: GeolocationPositionError) => {
            setPosition(null);
            setError(getErrorMessage(error));
        };

        navigator.geolocation.getCurrentPosition(handleSuccess, handleError, {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 0,
        });
        
    }, []);

    return { position, error }
};

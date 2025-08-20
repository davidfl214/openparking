import type { AuthResponse } from "../types/authResponse";

const StorageKeys = {
    ROLE: "userRole",
    EMAIL: "userEmail",
    NAME: "userName",
    EXPIRATION: "expiration",
    PARKING_FAVORITES: "parkingFavorites",
};

export const getStoredAuthResponse = (): AuthResponse | null => {
    const { ROLE, EMAIL, NAME, EXPIRATION, PARKING_FAVORITES } = StorageKeys;

    const role = localStorage.getItem(ROLE);
    const email = localStorage.getItem(EMAIL);
    const name = localStorage.getItem(NAME);
    const expiration = localStorage.getItem(EXPIRATION);
    const parkingFavorites = localStorage.getItem(PARKING_FAVORITES);

    const expirationTime = expiration ? parseInt(expiration, 10) : null;
    const isExpired = expirationTime && expirationTime < Date.now();

    if (!expiration || isExpired) {
        localStorage.removeItem(ROLE);
        localStorage.removeItem(EMAIL);
        localStorage.removeItem(NAME);
        localStorage.removeItem(EXPIRATION);
        localStorage.removeItem(PARKING_FAVORITES);
        return null;
    }

    let parsedParkingFavorites = null;
    if (parkingFavorites) {
        try {
            parsedParkingFavorites = JSON.parse(parkingFavorites);
        } catch (error) {
            console.error("Error parsing parking favorites:", error);
        }
    }

    return {
        role,
        email,
        name,
        expirationDate: expiration,
        parkingFavorites: parsedParkingFavorites,
    };
};

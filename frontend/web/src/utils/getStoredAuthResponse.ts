import type { AuthResponse } from "../types/authResponse";

const StorageKeys = {
    ROLE: "userRole",
    EMAIL: "userEmail",
    NAME: "userName",
    EXPIRATION: "expiration",
};

export const getStoredAuthResponse = (): AuthResponse | null => {
    const { ROLE, EMAIL, NAME, EXPIRATION } = StorageKeys;

    const role = localStorage.getItem(ROLE);
    const email = localStorage.getItem(EMAIL);
    const name = localStorage.getItem(NAME);
    const expiration = localStorage.getItem(EXPIRATION);

    const expirationTime = expiration ? parseInt(expiration, 10) : null;
    const isExpired = expirationTime && expirationTime < Date.now();

    if (!expiration || isExpired) {
        localStorage.removeItem(ROLE);
        localStorage.removeItem(EMAIL);
        localStorage.removeItem(NAME);
        localStorage.removeItem(EXPIRATION);
        return null;
    }

    return {
        role,
        email,
        name,
        expirationDate: expiration,
    };
};

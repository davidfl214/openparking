import type { AuthResponse } from "../types/authResponse";

export const getStoredAuthResponse = (): AuthResponse | null => {
    const role = localStorage.getItem("userRole");
    const email = localStorage.getItem("userEmail");
    const name = localStorage.getItem("userName");
    const expiration = localStorage.getItem("expiration");
    
    if (!expiration || expiration < Date.now().toString()) {
        localStorage.removeItem("userRole");
        localStorage.removeItem("userEmail");
        localStorage.removeItem("userName");
        localStorage.removeItem("expiration");
        return null;
    }

    return {
        role: role ? role : null,
        email: email ? email : null,
        name: name ? name : null,
        expirationDate: expiration ? expiration : null
    }
};
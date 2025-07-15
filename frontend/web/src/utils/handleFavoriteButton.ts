import type { AuthResponse } from "../types/authResponse";

const AUTH_MICROSERVICE_BASE_URL =
    import.meta.env.VITE_AUTH_MICROSERVICE_URL || "http://localhost:8080";

export const handleFavoriteButton = async (
    parkingId: string, 
    authResponse: AuthResponse,
    setAuthResponse: (authResponse: AuthResponse) => void
) => {
    if (!authResponse) {
        console.error("User is not authenticated.");
        return;
    }

    const isFavorite = authResponse.parkingFavorites?.includes(parkingId);

    if (isFavorite) {
        const res = await fetch(
            `${AUTH_MICROSERVICE_BASE_URL}/api/auth/favorite-parking?parkingId=${parkingId}`,
            {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            }
        );

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(
                errorData?.message || "Error removing parking from favorites"
            );
        }

        localStorage.setItem("parkingFavorites", JSON.stringify(authResponse.parkingFavorites?.filter((id) => id !== parkingId)));

        const updatedAuthResponse = {
            ...authResponse,
            parkingFavorites: authResponse.parkingFavorites?.filter((id) => id !== parkingId) ?? null
        };
        setAuthResponse(updatedAuthResponse);
    } else {
        const res = await fetch(
            `${AUTH_MICROSERVICE_BASE_URL}/api/auth/favorite-parking?parkingId=${parkingId}`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            }
        );

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(
                errorData?.message || "Error adding parking to favorites"
            );
        }

        localStorage.setItem("parkingFavorites", JSON.stringify([...authResponse.parkingFavorites || [], parkingId]));

        const updatedAuthResponse = {
            ...authResponse,
            parkingFavorites: [...(authResponse.parkingFavorites || []), parkingId]
        };
        setAuthResponse(updatedAuthResponse);
    }
};

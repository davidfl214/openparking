import type { AuthResponse } from "../types/authResponse";

const AUTH_MICROSERVICE_BASE_URL =
    import.meta.env.VITE_AUTH_MICROSERVICE_URL;

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

    const method = isFavorite ? "DELETE" : "PATCH";
    const actionText = isFavorite ? "removing" : "adding";

    const res = await fetch(
        `${AUTH_MICROSERVICE_BASE_URL}/api/auth/favorite-parking?parkingId=${parkingId}`,
        {
            method,
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        }
    );

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(
            errorData?.message || `Error ${actionText} parking from favorites`
        );
    }

    if (isFavorite) {
        localStorage.setItem(
            "parkingFavorites",
            JSON.stringify(
                authResponse.parkingFavorites?.filter((id) => id !== parkingId)
            )
        );

        const updatedAuthResponse = {
            ...authResponse,
            parkingFavorites: authResponse.parkingFavorites?.filter((id) => id !== parkingId) ?? null
        };
        setAuthResponse(updatedAuthResponse);
    } else {
        localStorage.setItem(
            "parkingFavorites",
            JSON.stringify([...authResponse.parkingFavorites || [], parkingId])
        );

        const updatedAuthResponse = {
            ...authResponse,
            parkingFavorites: [...(authResponse.parkingFavorites || []), parkingId]
        };
        setAuthResponse(updatedAuthResponse);
    }
};

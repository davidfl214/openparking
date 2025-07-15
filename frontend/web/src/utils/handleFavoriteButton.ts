import { useContext } from "react";
import { LocationContext } from "../context/LocationContext";

const AUTH_MICROSERVICE_BASE_URL =
    import.meta.env.VITE_AUTH_MICROSERVICE_URL || "http://localhost:8080";
const { authResponse } = useContext(LocationContext);

export const handleFavoriteButton = async (parkingId: string) => {
    if (!authResponse) {
        console.error("User is not authenticated.");
        return;
    }

    const isFavorite = authResponse.parkingFavorites?.includes(parkingId);

    if (isFavorite) {
        const res = await fetch(
            `${AUTH_MICROSERVICE_BASE_URL}/favorite-parking`,
            {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ parkingId }),
                credentials: "include",
            }
        );

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(
                errorData?.message || "Error removing parking from favorites"
            );
        }

        localStorage.setItem(
            "parkingFavorites",
            JSON.stringify([
                ...(authResponse.parkingFavorites || []),
                parkingId,
            ])
        );
        authResponse.parkingFavorites =
            authResponse.parkingFavorites?.filter((id) => id !== parkingId) ??
            null;
    } else {
        const res = await fetch(
            `${AUTH_MICROSERVICE_BASE_URL}/favorite-parking`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ parkingId }),
                credentials: "include",
            }
        );

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(
                errorData?.message || "Error adding parking to favorites"
            );
        }

        localStorage.setItem(
            "parkingFavorites",
            JSON.stringify([
                ...(authResponse.parkingFavorites || []),
                parkingId,
            ])
        );

        authResponse.parkingFavorites = [
            ...(authResponse.parkingFavorites || []),
            parkingId,
        ];
    }
};

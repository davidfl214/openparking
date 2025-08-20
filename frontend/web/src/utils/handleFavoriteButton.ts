import { AUTH_MICROSERVICE_BASE_URL } from "../constants/constants";

export const handleFavoriteButton = async (
    parkingId: string,
    isFavorite: boolean,
    setParkingFavorites: React.Dispatch<React.SetStateAction<string[]>>
) => {
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

    const parkingFavorites = await res.json();

    setParkingFavorites(parkingFavorites);
};

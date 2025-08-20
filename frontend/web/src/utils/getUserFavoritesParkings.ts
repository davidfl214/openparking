import { AUTH_MICROSERVICE_BASE_URL } from "../constants/constants";

export const getUserFavoritesParkings = async () => {
    const res = await fetch(
        `${AUTH_MICROSERVICE_BASE_URL}/api/auth/favorite-parkings`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        }
    );

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(
            errorData.message || "Failed to fetch favorite parkings"
        );
    }

    const data = await res.json();
    return data;
};

import { PARKINGS_MICROSERVICE_BASE_URL } from "../constants/constants";
import type Parking from "../types/Parking";

export const createParking = async (parking: Parking) => {
    for (const [key, value] of Object.entries(parking)) {
        if (value === undefined || value === null || value === "") {
            throw new Error(`La propiedad '${key}' está vacía o indefinida en el nuevo parking`);
        }
    }

    try {
        const response = await fetch(`${PARKINGS_MICROSERVICE_BASE_URL}/api/parkings`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(parking),
            credentials: "include",
        });

        if (!response.ok) {
            throw new Error(`Error al crear el parking`);
        }

        const data = await response.json();
        return data;
    } catch (err) {
        throw new Error(`Error al crear el parking`);
    }
};

export const updateParking = async (parking: Parking) => {
    for (const [key, value] of Object.entries(parking)) {
        if (value === undefined || value === null || value === "") {
            throw new Error(`La propiedad '${key}' está vacía o indefinida en el parking con ID: ${parking.id}`);
        }
    }

    try {
        const response = await fetch(`${PARKINGS_MICROSERVICE_BASE_URL}/api/parkings/${parking.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(parking),
            credentials: "include",
        });

        if (!response.ok) {
            throw new Error(`Error al actualizar el parking con ID: ${parking.id}`);
        }

        return await response.json();
    } catch (err) {
        throw new Error(`Error al actualizar el parking con ID: ${parking.id}`);
    }
}

export const deleteParking = async (parkingId: string) => {
    try {
        const response = await fetch(`${PARKINGS_MICROSERVICE_BASE_URL}/api/parkings/${parkingId}`, {
            method: "DELETE",
            credentials: "include",
        });

        if (!response.ok) {
            throw new Error(`Error al borrar el parking con ID: ${parkingId}`);
        }

        const data = await response.json();

        return data;
    } catch (err) {
        throw new Error(`Error al borrar el parking con ID: ${parkingId}`);
    }
};

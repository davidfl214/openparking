import type Parking from "../types/Parking";

export default async function getParkings(): Promise<Parking[]> {
    const PARKING_MICROSERVICE_BASE_URL =
        import.meta.env.VITE_PARKINGS_MICROSERVICE_URL ||
        "http://localhost:8081";

    const response = await fetch(`${PARKING_MICROSERVICE_BASE_URL}/api/parkings`, {
        method: "GET"
    });

    if (!response.ok) {
        console.error("Error al obtener los parkings:", response.statusText);
        throw new Error("Error al obtener los parkings");
    }

    const data: Parking[] = await response.json();
    return data;
}

import type { ParkingData } from "../types/parking";

const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 2000;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const fetchParkings = async (): Promise<ParkingData[]> => {
    let attempt = 0;
    while (attempt < MAX_RETRIES) {
        try {
            const response = await fetch(`${API_BASE_URL}/parkings/status`);

            if (!response.ok) {
                throw new Error(`Failed to fetch parking data: ${response.status}`);
            }

            const data: ParkingData[] = await response.json();
            return data;
        } catch (error) {
            attempt++;
            if (attempt >= MAX_RETRIES) {
                console.error("Error fetching parking data:", error);
                throw error;
            }
            await delay(RETRY_DELAY_MS);
        }
    }
    throw new Error("Failed to fetch parking data after retries.");
};
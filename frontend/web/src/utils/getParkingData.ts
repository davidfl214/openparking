import type { ParkingData } from "../types/parking";

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 2000;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const fetchParkings = async (microserviceUrl: string): Promise<ParkingData[]> => {
    let attempt = 0;
    while (attempt < MAX_RETRIES) {
        try {
            const response = await fetch(`${microserviceUrl}/parkings/status`);

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
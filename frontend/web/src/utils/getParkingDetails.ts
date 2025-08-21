import type { ParkingSlotData } from "../types/parkingSlotData";

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 2000;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const getParkingsDetails = async (microserviceUrl: string, id: string): Promise<ParkingSlotData[]> => {
    let attempt = 0;
    while (attempt < MAX_RETRIES) {
        try {
            const response = await fetch(`${microserviceUrl}/api/parking-slots/parking/${id}`);

            if (!response.ok) {
                throw new Error(`Failed to fetch parking data: ${response.status}`);
            }

            const data: ParkingSlotData[] = await response.json();
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
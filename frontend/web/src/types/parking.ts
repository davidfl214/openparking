export interface ParkingData {
    id: string;
    name: string;
    location: string;
    latitude: number;
    longitude: number;
    totalSlots: number;
    occupiedSlots: number;
    enabled: boolean;
}
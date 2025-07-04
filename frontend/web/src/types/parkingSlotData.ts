export interface Parking {
    id: string;
    name: string;
    administratorEmail: string;
    location: string;
    latitude: number;
    longitude: number;
    numberOfFloors: number;
    slotsPerFloor: number;
    enabled: boolean;
}

export interface ParkingSlotData {
    id: string;
    parking: Parking;
    floor: number;
    slot: number;
    lastUpdated: string;
    occupied: boolean;
}
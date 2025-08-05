export default interface Parking {
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
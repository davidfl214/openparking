export interface UserPosition {
    latitude: number;
    longitude: number;
}

export interface GeolocationState {
    position: UserPosition | null;
    error: string | null;
}

import type { LatLngTuple } from "leaflet";

export const PARKINGS_MICROSERVICE_BASE_URL = import.meta.env
    .VITE_PARKINGS_MICROSERVICE_URL;
export const AUTH_MICROSERVICE_BASE_URL = import.meta.env
    .VITE_AUTH_MICROSERVICE_URL;

// MAP Constants
    export const DEFAULT_COORDINATES: LatLngTuple = [
    40.416918404895505, -3.7034907813021767,
];

// REGISTER Constants
export const MIN_PASSWORD_LENGTH = 8;


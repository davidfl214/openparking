import React, { type Dispatch, type SetStateAction } from "react";
import type { ParkingData } from "../types/parking";
import type { AuthResponse } from "../types/authResponse";
import { getStoredAuthResponse } from "../utils/getStoredAuthResponse";

interface LocationContextType {
    latitudeSearch: number | null;
    longitudeSearch: number | null;
    parkingData: ParkingData[];
    isMobile: boolean;
    authResponse: AuthResponse | null;
    setLatitudeSearch: Dispatch<SetStateAction<number | null>>;
    setLongitudeSearch: Dispatch<SetStateAction<number | null>>;
    setParkingData: Dispatch<SetStateAction<ParkingData[]>>;
    setAuthResponse: Dispatch<SetStateAction<AuthResponse | null>>;
}

export const LocationContext = React.createContext<LocationContextType>({
    latitudeSearch: null,
    longitudeSearch: null,
    parkingData: [],
    isMobile: window.innerWidth <= 640,
    authResponse: getStoredAuthResponse(),
    setLatitudeSearch: () => {},
    setLongitudeSearch: () => {},
    setParkingData: () => {},
    setAuthResponse: () => {},
});

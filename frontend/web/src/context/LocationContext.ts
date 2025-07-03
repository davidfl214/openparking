import React, { type Dispatch, type SetStateAction } from "react";
import type { ParkingData } from "../types/parking";

interface LocationContextType {
    latitudeSearch: number | null;
    longitudeSearch: number | null;
    parkingData: ParkingData[];
    isMobile: boolean;
    setLatitudeSearch: Dispatch<SetStateAction<number | null>>;
    setLongitudeSearch: Dispatch<SetStateAction<number | null>>;
    setParkingData: Dispatch<SetStateAction<ParkingData[]>>;
}

export const LocationContext = React.createContext<LocationContextType>(
    {
        latitudeSearch: null,
        longitudeSearch: null,
        parkingData: [],
        isMobile: window.innerWidth <= 640,
        setLatitudeSearch: () => {},
        setLongitudeSearch: () => {},
        setParkingData: () => {}
    }
);
import React, { type Dispatch, type SetStateAction } from "react";

interface LocationContextType {
    latitudeSearch: number | null;
    longitudeSearch: number | null;
    setLatitudeSearch: Dispatch<SetStateAction<number | null>>;
    setLongitudeSearch: Dispatch<SetStateAction<number | null>>;
}

export const LocationContext = React.createContext<LocationContextType>(
    {
        latitudeSearch: null,
        longitudeSearch: null,
        setLatitudeSearch: () => {},
        setLongitudeSearch: () => {},
    }
);
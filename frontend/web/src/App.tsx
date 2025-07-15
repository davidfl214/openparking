import { useState } from "react";
import "./App.css";
import { LocationContext } from "./context/LocationContext";
import type { ParkingData } from "./types/parking";
import GlobalRouter from "./routes/GlobalRouter";
import { getStoredAuthResponse } from "./utils/getStoredAuthResponse";
import type { AuthResponse } from "./types/authResponse";

function App() {

    const [latitudeSearch, setLatitudeSearch] = useState<number | null>(null);
    const [longitudeSearch, setLongitudeSearch] = useState<number | null>(null);
    const [parkingData, setParkingData] = useState<ParkingData[]>([]);
    const [authResponse, setAuthResponse] = useState<AuthResponse | null>(getStoredAuthResponse());
    const isMobile = window.innerWidth <= 640;

    return (
        <LocationContext.Provider value={{ latitudeSearch, longitudeSearch, parkingData, isMobile, authResponse, setLatitudeSearch, setLongitudeSearch, setParkingData, setAuthResponse }}>
            <GlobalRouter />
        </LocationContext.Provider>
    );
}

export default App;

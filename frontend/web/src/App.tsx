import { useState } from "react";
import "./App.css";
import { LocationContext } from "./context/LocationContext";
import type { ParkingData } from "./types/parking";
import GlobalRouter from "./routes/GlobalRouter";

function App() {

    const [latitudeSearch, setLatitudeSearch] = useState<number | null>(null);
    const [longitudeSearch, setLongitudeSearch] = useState<number | null>(null);
    const [parkingData, setParkingData] = useState<ParkingData[]>([]);
    const isMobile = window.innerWidth <= 640;

    return (
        <LocationContext.Provider value={{ latitudeSearch, longitudeSearch, parkingData, isMobile, setLatitudeSearch, setLongitudeSearch, setParkingData }}>
            <GlobalRouter />
        </LocationContext.Provider>
    );
}

export default App;

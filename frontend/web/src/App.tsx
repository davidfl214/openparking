import { useState } from "react";
import "./App.css";
import Map from "./components/Map";
import Navbar from "./components/Navbar";
import { LocationContext } from "./context/LocationContext";

function App() {

    const [latitudeSearch, setLatitudeSearch] = useState<number | null>(null);
    const [longitudeSearch, setLongitudeSearch] = useState<number | null>(null);

    return (
        <LocationContext.Provider value={{ latitudeSearch, longitudeSearch, setLatitudeSearch, setLongitudeSearch }}>
            <Navbar />
            <Map />
        </LocationContext.Provider>
    );
}

export default App;

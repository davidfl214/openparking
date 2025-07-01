import { useContext, useState, type JSX } from "react";
import { searchLocation } from "../utils/searchLocation";
import { LocationContext } from "../context/LocationContext";

export default function Navbar(): JSX.Element {
    const { setLatitudeSearch, setLongitudeSearch } = useContext(LocationContext);
    const [locationSearch, setLocationSearch] = useState<string>("");

    const handleSearch = async () => {
        const {latitude, longitude} = await searchLocation(locationSearch)
        if (latitude !== null && longitude !== null) {
            setLatitudeSearch(latitude);
            setLongitudeSearch(longitude);
        }
        setLocationSearch("");
    }

    return (
        <nav className="bg-gray-800 p-4 min-h-[15vh] laptop:min-h-[10vh]">
            <div className="flex flex-col items-center">
                <h1 className="text-white text-2xl font-bold mb-2">OpenParking</h1>
                <input
                    type="text"
                    placeholder="Search for a location..."
                    className="p-1 rounded w-full max-w-md bg-white text-gray-800 focus:outline-none focus:ring-0"
                    value={locationSearch}
                    onChange={(e) => setLocationSearch(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            handleSearch();
                        }
                    }}
                />
            </div>
        </nav>
    );
}

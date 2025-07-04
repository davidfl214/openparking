import { useContext, useState, type JSX } from "react";
import { searchLocation } from "../utils/searchLocation";
import { LocationContext } from "../context/LocationContext";
import { TextField } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import { Link } from "react-router-dom";
import { LocationOn } from "@mui/icons-material";

export default function Navbar(): JSX.Element {
    const { setLatitudeSearch, setLongitudeSearch } =
        useContext(LocationContext);
    const [locationSearch, setLocationSearch] = useState<string>("");

    const handleSearch = async () => {
        const { latitude, longitude } = await searchLocation(locationSearch);
        if (latitude !== null && longitude !== null) {
            setLatitudeSearch(latitude);
            setLongitudeSearch(longitude);
        }
        setLocationSearch("");
    };

    return (
        <nav className="bg-primary p-4 min-h-[18vh] tablet:min-h-[15vh] flex items-center justify-center relative">
            <div className="flex flex-col h-full w-full items-center gap-4 laptop:gap-2">
                <div className="flex items-center justify-between laptop:justify-evenly w-full max-w-md">
                    <div className="flex gap-2 items-center">
                        <LocationOn
                            className="text-secondary"
                            sx={{ fontSize: 35 }}
                        />
                        <h1 className="text-white text-3xl font-bold mb-2">
                            OpenParking
                        </h1>
                    </div>
                    <Link
                        to="/login"
                        className="cursor-pointer p-1 border-white border-2 rounded-md transition-colors hover:bg-white/15 laptop:hidden"
                    >
                        <PersonIcon
                            fontSize="large"
                            color="inherit"
                            sx={{ color: "white" }}
                        />
                    </Link>
                </div>
                <div className="flex justify-center w-full">
                    <TextField
                        variant="outlined"
                        placeholder="Busca una ubicación..."
                        value={locationSearch}
                        onChange={(e) => setLocationSearch(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                handleSearch();
                            }
                        }}
                        className="w-full max-w-md bg-white rounded"
                        size="small"
                    />
                </div>
            </div>
            <Link
                to="/login"
                className="hidden laptop:block absolute right-20 top-1/2 -translate-y-1/2 border-white border-2 rounded-md p-2 transition-colors cursor-pointer hover:bg-white/15"
            >
                <PersonIcon
                    fontSize="large"
                    color="inherit"
                    sx={{ color: "white" }}
                />
            </Link>
        </nav>
    );
}

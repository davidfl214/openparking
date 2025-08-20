import type { JSX } from "react";
import type { ParkingData } from "../types/parking";
import { Map } from "@mui/icons-material";

export default function ParkingDetailsBox({
    parking,
}: {
    parking: ParkingData;
}): JSX.Element {
    const percentOccupied = (parking.occupiedSlots / parking.totalSlots) * 100;

    const getColorClasses = () => {
        if (percentOccupied <= 60) {
            return "border-green-400 bg-green-100";
        } else if (percentOccupied < 100) {
            return "border-orange-400 bg-orange-100";
        } else {
            return "border-red-400 bg-red-100";
        }
    };

    const handleOpenMaps = () => {
        const { latitude, longitude } = parking;
        const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
        window.open(mapsUrl, "_blank");
    };

    return (
        <div
            key={parking.id}
            className={`p-4 rounded-lg shadow-md border-2 flex flex-col gap-2 justify-between ${getColorClasses()}`}
        >
            <h2 className="font-bold text-lg">{parking.name}</h2>
            <p className="text-gray-600 truncate" title={parking.location}>
                {parking.location}
            </p>
            <p className="text-md">
                Total de plazas:{" "}
                <span className="font-bold">{parking.totalSlots}</span>
            </p>
            <p className="text-md">
                % ocupación:{" "}
                <span className="font-bold">{percentOccupied.toFixed(1)}%</span>
            </p>
            <button
                onClick={handleOpenMaps}
                className="px-4 py-2 cursor-pointer border-2 border-primary text-primary rounded-md flex items-center justify-center space-x-2 hover:bg-primary hover:text-white transition-colors duration-150"
            >
                <div className="flex items-center gap-2">
                    <Map fontSize="small" />
                    <span>Abrir en Google Maps</span>
                </div>
            </button>
        </div>
    );
}

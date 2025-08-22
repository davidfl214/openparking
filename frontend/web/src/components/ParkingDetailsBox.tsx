import type { JSX } from "react";
import { Map } from "@mui/icons-material";
import type { ParkingData } from "../types/parking";

export default function ParkingDetailsBox({
    parking,
}: {
    parking: ParkingData;
}): JSX.Element {
    const percentOccupied =
        parking.totalSlots > 0
            ? (parking.occupiedSlots / parking.totalSlots) * 100
            : 0;

    const getStatusStyle = () => {
        if (percentOccupied < 60) {
            return {
                indicator: "bg-green-500/20 text-green-400 border-green-500/30",
                text: "text-green-400",
                progress: "bg-green-500",
                label: "Disponible",
            };
        } else if (percentOccupied < 100) {
            return {
                indicator:
                    "bg-orange-500/20 text-orange-400 border-orange-500/30",
                text: "text-orange-400",
                progress: "bg-orange-500",
                label: "Casi Lleno",
            };
        } else {
            return {
                indicator: "bg-red-500/20 text-red-400 border-red-500/30",
                text: "text-red-400",
                progress: "bg-red-500",
                label: "Completo",
            };
        }
    };

    const statusStyle = getStatusStyle();

    const handleOpenMaps = () => {
        const { latitude, longitude } = parking;
        const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
        window.open(mapsUrl, "_blank");
    };

    return (
        <div
            key={parking.id}
            className="bg-[#34495e] rounded-xl p-6 shadow-lg border border-[#4a6572]/20 flex flex-col justify-between space-y-5 font-sans"
        >
            <div className="flex items-start justify-between">
                <h2 className="text-xl font-bold text-white flex-1 pr-2">
                    {parking.name}
                </h2>
                <div
                    className={`px-2.5 py-1 rounded-full text-xs font-medium border ${statusStyle.indicator}`}
                >
                    {statusStyle.label}
                </div>
            </div>

            <div className="space-y-3">
                <div className="flex justify-between items-end">
                    <span className="text-sm font-medium text-gray-300">
                        Ocupación
                    </span>
                    <span className={`text-lg font-bold ${statusStyle.text}`}>
                        {percentOccupied.toFixed(1)}%
                    </span>
                </div>
                <div className="w-full bg-[#2c3e50]/50 rounded-full h-2.5">
                    <div
                        className={`h-2.5 rounded-full transition-all duration-500 ${statusStyle.progress}`}
                        style={{ width: `${percentOccupied}%` }}
                    ></div>
                </div>
                <div className="text-right text-sm text-gray-400">
                    <span className="font-semibold text-white">
                        {parking.occupiedSlots}
                    </span>{" "}
                    / {parking.totalSlots} plazas
                </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-[#2c3e50]/30 rounded-lg border border-[#4a6572]/20">
                <div className="w-2 h-2 bg-blue-400 rounded-full mt-1.5 flex-shrink-0"></div>
                <div className="min-w-0">
                    <p className="text-sm text-gray-400 mb-0.5">Ubicación</p>
                    <p
                        className="text-white font-medium text-sm truncate"
                        title={parking.location}
                    >
                        {parking.location}
                    </p>
                </div>
            </div>

            <button
                onClick={handleOpenMaps}
                className="w-full mt-2 flex items-center justify-center gap-2 bg-[#5d6d7e] border-2 border-[#5d6d7e] cursor-pointer text-white py-2.5 px-4 rounded-lg hover:bg-[#34495e] hover:border-white transition-all duration-200 font-medium focus:ring-2 focus:ring-blue-400 focus:outline-none"
            >
                <Map fontSize="small" />
                <span>Abrir en Google Maps</span>
            </button>
        </div>
    );
}

import L from "leaflet"
import type { ParkingData } from "../types/parking";

export function createStyledMarker(colorClass: string): L.DivIcon {
    return L.divIcon({
        className: "custom-marker",
        html: `<div class="
            ${colorClass} 
            w-6 h-6 
            rounded-full 
            border-2 border-white 
            shadow-md
        "></div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
        popupAnchor: [0, -12],
    });
}

export const getMarkerColorClass = (parking: ParkingData): string => {
    const percentOccupied = (parking.occupiedSlots / parking.totalSlots) * 100;

    if (percentOccupied <= 60) {
        return "bg-green-500";
    } else if (percentOccupied < 100) {
        return "bg-orange-500";
    } else {
        return "bg-red-500";
    }
};
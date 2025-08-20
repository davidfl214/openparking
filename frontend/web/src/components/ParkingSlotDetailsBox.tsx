import type { JSX } from "react";
import type { ParkingSlotData } from "../types/parkingSlotData";

export default function ParkingSlotDetailsBox({
    parking,
}: {
    parking: ParkingSlotData;
}): JSX.Element {
    return (
        <div
            key={parking.id}
            className={`p-4 rounded-lg shadow-md ${
                parking.occupied
                    ? "bg-red-100 border border-red-400"
                    : "bg-green-100 border border-green-400"
            }`}
        >
            <p className="text-lg font-medium">Planta: {parking.floor}</p>
            <p className="text-lg font-medium">Plaza: {parking.slot}</p>
            <p className="text-md">
                Estado:{" "}
                <span
                    className={`font-semibold ${
                        parking.occupied ? "text-red-700" : "text-green-700"
                    }`}
                >
                    {parking.occupied ? "Ocupada" : "Libre"}
                </span>
            </p>
            <p className="text-sm text-gray-500">
                Última actualización:{" "}
                {new Date(parking.lastUpdated).toLocaleString()}
            </p>
        </div>
    );
}

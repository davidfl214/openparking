import type { JSX } from "react";
import type { ParkingData } from "../../types/parking";

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

    return (
        <div
            key={parking.id}
            className={`p-4 rounded-lg shadow-md border-2 ${getColorClasses()}`}
        >
            <h2 className="font-bold text-lg">{parking.name}</h2>
            <p className="text-gray-600">{parking.location}</p>
            <p className="text-md">
                Total de plazas:{" "}
                <span className="font-bold">{parking.totalSlots}</span>
            </p>
            <p className="text-md">
                Porcentaje de ocupación:{" "}
                <span className="font-bold">{percentOccupied.toFixed(1)}%</span>
            </p>
        </div>
    );
}

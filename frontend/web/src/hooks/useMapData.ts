import { useEffect, useState } from "react";
import type { ParkingData } from "../types/parking";
import { useWebSocket } from "./useWebSocket";
import { PARKINGS_MICROSERVICE_BASE_URL } from "../constants/constants";
import Swal from "sweetalert2";
import { fetchParkings } from "../utils/getParkingData";

export const useMapData = (
    setParkingData: React.Dispatch<React.SetStateAction<ParkingData[]>>,
    isMobile: boolean
) => {
    const [loading, setLoading] = useState<boolean>(true);

    useWebSocket(setParkingData, isMobile);

    useEffect(() => {
        const loadInitialParkings = async (): Promise<void> => {
            try {
                const data = await fetchParkings(
                    PARKINGS_MICROSERVICE_BASE_URL
                );
                setParkingData(data);
            } catch (error) {
                Swal.fire({
                    toast: true,
                    position: isMobile ? "top" : "top-end",
                    icon: "error",
                    title: "<strong>Failed to load initial parking data</strong>",
                    showConfirmButton: false,
                    timer: 2000,
                    background: "#fef2f2",
                    color: "#991b1b",
                    timerProgressBar: true,
                });
            } finally {
                setLoading(false);
            }
        };

        loadInitialParkings();
    }, [setParkingData, isMobile]);

    return { loading };
};

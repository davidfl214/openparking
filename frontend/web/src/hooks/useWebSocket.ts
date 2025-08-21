import { useEffect, useRef } from "react";
import type { ParkingData } from "../types/parking";
import { Client, Stomp } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { PARKINGS_MICROSERVICE_BASE_URL } from "../constants/constants";
import Swal from "sweetalert2";

export const useWebSocket = (
    setParkingData: React.Dispatch<React.SetStateAction<ParkingData[]>>,
    isMobile: boolean
) => {
    const stompClientRef = useRef<Client | null>(null);

    useEffect(() => {
        const connectWebSocket = () => {
            const socket = () =>
                new SockJS(`${PARKINGS_MICROSERVICE_BASE_URL}/ws`);
            const stompClient = Stomp.over(socket);

            stompClientRef.current = stompClient;

            stompClient.debug = () => {};

            stompClient.onConnect = () => {
                stompClient.subscribe("/topic/parkingStatus", (message) => {
                    const updatedParking: ParkingData = JSON.parse(
                        message.body
                    );
                    setParkingData((prevParkings) => {
                        const existingIndex = prevParkings.findIndex(
                            (p) => p.id === updatedParking.id
                        );
                        if (existingIndex > -1) {
                            const newParkings = [...prevParkings];
                            newParkings[existingIndex] = updatedParking;
                            return newParkings;
                        } else {
                            return [...prevParkings, updatedParking];
                        }
                    });
                });
                stompClient.subscribe("/topic/deletedParking", (message) => {
                    const parkingId: string = message.body;
                    setParkingData((prevParkings) =>
                        prevParkings.filter((p) => p.id !== parkingId)
                    );
                });
            };

            stompClient.onStompError = () => {
                Swal.fire({
                    toast: true,
                    position: isMobile ? "top" : "top-end",
                    icon: "error",
                    title: "<strong>WebSocket Error</strong>",
                    html: "Could not connect to real-time updates. Please refresh.",
                    showConfirmButton: false,
                    timer: 2000,
                    background: "#fef2f2",
                    color: "#991b1b",
                    timerProgressBar: true,
                });
            };

            stompClient.activate();
        };

        connectWebSocket();

        return () => {
            if (stompClientRef.current?.connected) {
                stompClientRef.current.deactivate();
            }
        };
    }, [setParkingData, isMobile]);
};

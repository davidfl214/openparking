import { useContext, useEffect, useState, type JSX } from "react";
import { LocationContext } from "../context/LocationContext";
import type { ParkingSlotData } from "../types/parkingSlotData";
import Swal from "sweetalert2";
import ParkingDetailsBox from "../components/parking-details/ParkingDetailsBox";
import { useNavigate } from "react-router-dom";

export default function Profile(): JSX.Element | null {
    const PARKINGS_MICROSERVICE_BASE_URL =
        import.meta.env.VITE_PARKINGS_MICROSERVICE_URL ||
        "http://localhost:8080";
    const { authResponse, isMobile } = useContext(LocationContext);
    const [favoriteParkingsData, setFavoriteParkingsData] = useState<
        ParkingSlotData[]
    >([]);
    const navigate = useNavigate();

    const checkAuth = (): void => {
        if (!authResponse) {
            Swal.fire({
                toast: true,
                position: isMobile ? "top" : "top-end",
                icon: "error",
                title: "<strong>Error de autenticación</strong>",
                text: "Por favor, inicia sesión para ver tu perfil",
                showConfirmButton: false,
                timer: 3000,
                background: "#fef2f2",
                color: "#991b1b",
                timerProgressBar: true,
            });

            navigate("/login");
        }
    };

    const getFavoriteParkings = async (): Promise<void> => {
        if (
            authResponse?.parkingFavorites &&
            authResponse.parkingFavorites.length > 0
        )
            authResponse.parkingFavorites.forEach(async (parking) => {
                try {
                    const response = await fetch(`${PARKINGS_MICROSERVICE_BASE_URL}/parkings/${parking}/status`);
                    const statusData: ParkingSlotData = await response.json();
                    setFavoriteParkingsData((prevData) => [
                        ...prevData,
                        {
                            ...statusData,
                        },
                    ]);
                } catch (error: any) {
                    Swal.fire({
                        toast: true,
                        position: isMobile ? "top" : "top-end",
                        icon: "error",
                        title: "<strong>Error al cargar datos</strong>",
                        text:
                            error.message ||
                            "Error al obtener información del parking",
                        showConfirmButton: false,
                        timer: 3000,
                        background: "#fef2f2",
                        color: "#991b1b",
                        timerProgressBar: true,
                    });
                }
            });
    };

    useEffect(() => {
        checkAuth();

        getFavoriteParkings();
    }, [authResponse, isMobile, navigate]);

    if (authResponse) {
        return (
            <div className="w-screen h-screen flex flex-col items-center p-10 gap-6 bg-primary">
                <h1 className="text-4xl font-bold text-white mx-auto">
                    Perfil de usuario
                </h1>
                {authResponse && (
                    <div className="text-white items-start flex flex-col gap-2 mx-auto">
                        <p>
                            <strong>Nombre:</strong> {authResponse.name}
                        </p>
                        <p>
                            <strong>Email:</strong> {authResponse.email}
                        </p>
                    </div>
                )}
                <h2 className="text-3xl font-bold text-white">
                    Parkings favoritos
                </h2>
                <div className="flex flex-col items-center gap-4">
                    {favoriteParkingsData.length > 0 ? (
                        favoriteParkingsData.map((parking) => (
                            <ParkingDetailsBox
                                key={parking.id}
                                parking={parking}
                            />
                        ))
                    ) : (
                        <p className="text-white">
                            No tienes parkings favoritos.
                        </p>
                    )}
                </div>
            </div>
        );
    } else {
        return null;
    }
}

import { useContext, useEffect, useState, type JSX } from "react";
import { LocationContext } from "../context/LocationContext";
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";
import { AccountCircle, ArrowBack, Email, Refresh } from "@mui/icons-material";
import ParkingDetailsBox from "../components/ParkingDetailsBox";
import type { ParkingData } from "../types/parking";
import { Button } from "@mui/material";
import { PARKINGS_MICROSERVICE_BASE_URL } from "../constants/constants";
import { getUserFavoritesParkings } from "../utils/getUserFavoritesParkings";

const removeLocalStorageItems = (): void => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
    localStorage.removeItem("expiration");
};

export default function Profile(): JSX.Element | null {
    const { authResponse, setAuthResponse, isMobile } =
        useContext(LocationContext);
    const [favoriteParkingsData, setFavoriteParkingsData] = useState<
        ParkingData[]
    >([]);
    const [loggingOut, setLoggingOut] = useState<boolean>(false);
    const [parkingFavorites, setParkingFavorites] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const navigate = useNavigate();

    const checkAuth = (): void => {
        if (!authResponse && !loggingOut) {
            Swal.fire({
                toast: true,
                position: isMobile ? "top" : "top-end",
                icon: "error",
                title: "<strong>Error de autenticación</strong>",
                text: "Por favor, inicia sesión para ver tu perfil",
                showConfirmButton: false,
                timer: 2000,
                background: "#fef2f2",
                color: "#991b1b",
                timerProgressBar: true,
            });
            navigate("/login");
        }
    };

    useEffect(() => {
        const fetchFavorites = async () => {
            setLoading(true);
            const favorites = await getUserFavoritesParkings();
            setParkingFavorites(favorites);
            setLoading(false);
        };

        if (authResponse) {
            fetchFavorites();
        }
    }, [authResponse]);

    const getFavoriteParkings = async (): Promise<void> => {
        if (parkingFavorites && parkingFavorites.length > 0) {
            try {
                const parkingStatuses = parkingFavorites.map(
                    async (parkingId) => {
                        const response = await fetch(
                            `${PARKINGS_MICROSERVICE_BASE_URL}/parkings/${parkingId}/status`
                        );
                        if (!response.ok) {
                            throw new Error(
                                `Error al obtener el estado del parking: ${parkingId}`
                            );
                        }
                        return response.json();
                    }
                );

                const results = await Promise.all(parkingStatuses);
                setFavoriteParkingsData(results);
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
                    timer: 2000,
                    background: "#fef2f2",
                    color: "#991b1b",
                    timerProgressBar: true,
                });
            }
        }
    };

    const handleLogout = async (): Promise<void> => {
        const result = await Swal.fire({
            title: "<strong>Confirmar cierre de sesión</strong>",
            text: "¿Estás seguro de que deseas cerrar sesión?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, cerrar sesión",
            cancelButtonText: "Cancelar",
            background: "#ffffff",
            color: "#000000",
            timerProgressBar: true,
            confirmButtonColor: "#1e2939",
            cancelButtonColor: "red",
            iconColor: "#f59e0b",
        });

        if (result.isConfirmed) {
            try {
                setLoggingOut(true);
                const response = await fetch(
                    `${
                        import.meta.env.VITE_AUTH_MICROSERVICE_URL
                    }/api/auth/logout`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        credentials: "include",
                    }
                );

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(
                        errorData?.message || "Error al cerrar sesión"
                    );
                }

                removeLocalStorageItems();
                setFavoriteParkingsData([]);
                setAuthResponse(null);

                Swal.fire({
                    toast: true,
                    position: isMobile ? "top" : "top-end",
                    icon: "success",
                    title: "<strong>Sesión cerrada</strong>",
                    text: "Has cerrado sesión correctamente",
                    showConfirmButton: false,
                    timer: 2000,
                    background: "#f0fdf4",
                    color: "#166534",
                    timerProgressBar: true,
                });

                navigate("/login");
            } catch (error: any) {
                Swal.fire({
                    toast: true,
                    position: isMobile ? "top" : "top-end",
                    icon: "error",
                    title: "<strong>Error al cerrar sesión</strong>",
                    text: "Error inesperado al cerrar sesión",
                    showConfirmButton: false,
                    timer: 2000,
                    background: "#fef2f2",
                    color: "#991b1b",
                    timerProgressBar: true,
                });
            }
        }
    };

    useEffect(() => {
        checkAuth();
        if (authResponse) {
            getFavoriteParkings();
        }
    }, [authResponse, isMobile, parkingFavorites]);

    if (!authResponse) {
        return null;
    }

    return (
        <div className="bg-primary flex flex-col min-h-screen">
            <div className="absolute top-4 left-4 laptop:top-6 laptop:left-8">
                <Link
                    to="/"
                    className="text-white text-lg font-bold mb-4 flex items-center hover:underline"
                >
                    <ArrowBack fontSize="small" className="mr-1" />
                    Volver al mapa
                </Link>
            </div>
            <div className="flex flex-col items-center py-10 px-5 mt-4 gap-6">
                <h1 className="text-4xl font-bold text-white mx-auto">
                    Perfil de usuario
                </h1>
                <div className="flex flex-col items-center gap-2 p-4 bg-white rounded-lg shadow-lg max-w-[90%] tablet:max-w-sm w-full">
                    <div className="text-center flex gap-2 flex-col items-center">
                        <div className="flex items-center justify-center gap-2">
                            <AccountCircle fontSize="large" />
                            <p className="text-2xl font-semibold text-black">
                                {authResponse.name}
                            </p>
                        </div>
                        <div className="flex items-center justify-center gap-2 mt-2">
                            <Email fontSize="small" />
                            <p className="text-md text-black">
                                {authResponse.email}
                            </p>
                        </div>
                    </div>
                    <div className="max-w-[70%] w-full flex">
                        <Button
                            onClick={handleLogout}
                            fullWidth
                            variant="contained"
                            sx={{
                                m: 1,
                                bgcolor: "var(--color-secondary)",
                                fontWeight: "bold",
                            }}
                        >
                            Cerrar sesión
                        </Button>
                    </div>
                </div>
                <h2 className="text-3xl font-bold text-white">
                    Parkings favoritos
                </h2>
                {loading ? (
                    <Refresh
                        fontSize="large"
                        className={
                            "text-white cursor-pointer transition-transform duration-500 animate-spin"
                        }
                        style={{ fontSize: 64 }}
                    />
                ) : (
                    <div className="grid grid-cols-1 tablet:grid-cols-2 laptop:grid-cols-3 gap-4 max-w-[90%] tablet:max-w-6xl w-full">
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
                )}
            </div>
        </div>
    );
}

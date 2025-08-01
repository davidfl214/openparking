import { useContext, useEffect, useState, type JSX } from "react";
import { LocationContext } from "../context/LocationContext";
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";
import { AccountCircle, ArrowBack, Email } from "@mui/icons-material";
import ParkingDetailsBox from "../components/parking-details/ParkingDetailsBox";
import type { ParkingData } from "../types/parking";
import { Button } from "@mui/material";

export default function Profile(): JSX.Element | null {
    const PARKINGS_MICROSERVICE_BASE_URL =
        import.meta.env.VITE_PARKINGS_MICROSERVICE_URL ||
        "http://localhost:8080";
    const { authResponse, isMobile } = useContext(LocationContext);
    const [favoriteParkingsData, setFavoriteParkingsData] = useState<
        ParkingData[]
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
                    const response = await fetch(
                        `${PARKINGS_MICROSERVICE_BASE_URL}/parkings/${parking}/status`
                    );
                    const statusData: ParkingData = await response.json();
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
                const response = await fetch(
                    `${import.meta.env.VITE_AUTH_MICROSERVICE_URL}/api/auth/logout`,
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
                    throw new Error(errorData?.message || "Error al cerrar sesión");
                }

                localStorage.removeItem("userRole");
                localStorage.removeItem("userEmail");
                localStorage.removeItem("userName");
                localStorage.removeItem("expiration");
                localStorage.removeItem("parkingFavorites");
                setFavoriteParkingsData([]);
                Swal.fire({
                    toast: true,
                    position: isMobile ? "top" : "top-end",
                    icon: "success",
                    title: "<strong>Sesión cerrada</strong>",
                    text: "Has cerrado sesión correctamente",
                    showConfirmButton: false,
                    timer: 3000,
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
                    timer: 3000,
                    background: "#fef2f2",
                    color: "#991b1b",
                    timerProgressBar: true,
                });
            }
        }
    };

    useEffect(() => {
        checkAuth();

        getFavoriteParkings();
    }, [authResponse, isMobile, navigate]);

    if (authResponse) {
        return (
            <div className="bg-primary flex flex-col min-h-screen">
                <div className="absolute top-4 left-4 laptop:top-6 laptop:left-8">
                    <Link
                        to="/"
                        className="text-white text-lg font-bold mb-4 flex items-center"
                    >
                        <ArrowBack fontSize="small" className="mr-1" />
                        Volver al mapa
                    </Link>
                </div>
                <div className="flex flex-col items-center py-10 px-5 mt-4 gap-6">
                    <h1 className="text-4xl font-bold text-white mx-auto">
                        Perfil de usuario
                    </h1>
                    {authResponse && (
                        <div className="flex flex-col items-center gap-4 p-6 bg-white rounded-lg shadow-lg max-w-sm w-full">
                            <div className="text-center">
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
                    )}
                    <h2 className="text-3xl font-bold text-white">
                        Parkings favoritos
                    </h2>
                    <div className="grid grid-cols-2 laptop:grid-cols-3 gap-4">
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
            </div>
        );
    } else {
        return null;
    }
}

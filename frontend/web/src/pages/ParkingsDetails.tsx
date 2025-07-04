import { useContext, useEffect, useState, type JSX } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import type { ParkingSlotData } from "../types/parkingSlotData";
import { LocationContext } from "../context/LocationContext";
import Swal from "sweetalert2";
import { fetchParkingsDetails } from "../utils/getParkingDetails";
import { ArrowBack, Refresh } from "@mui/icons-material";

export default function ParkingDetailsPage(): JSX.Element {
    const PARKINGS_MICROSERVICE_BASE_URL =
        import.meta.env.VITE_PARKINGS_MICROSERVICE_URL ||
        "http://localhost:8080";
    const { id } = useParams<{ id: string }>();
    const [parkingInfo, setParkingInfo] = useState<ParkingSlotData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const { isMobile } = useContext(LocationContext);
    const navigate = useNavigate();

    const handleRefresh = async () => {
        setLoading(true);
        const data = await fetchParkingsDetails(
            PARKINGS_MICROSERVICE_BASE_URL,
            id || ""
        );
        setParkingInfo(data);
        setLoading(false);
        Swal.fire({
            toast: true,
            position: isMobile ? "top" : "top-end",
            icon: "success",
            title: "<strong>Datos actualizados</strong>",
            text: "La información del parking se ha actualizado correctamente.",
            showConfirmButton: false,
            timer: 3000,
            background: "#f0fdf4",
            color: "#166534",
            timerProgressBar: true,
        });
    };

    useEffect(() => {
        if (!id) {
            navigate("/");
            return;
        }
        const fetchData = async () => {
            try {
                const data = await fetchParkingsDetails(
                    PARKINGS_MICROSERVICE_BASE_URL,
                    id
                );
                setParkingInfo(data);
            } catch (err: any) {
                Swal.fire({
                    toast: true,
                    position: isMobile ? "top" : "top-end",
                    icon: "error",
                    title: "<strong>Error al cargar los detalles del parking</strong>",
                    text: err.message || "Error de conexión con el servidor",
                    showConfirmButton: false,
                    timer: 3000,
                    background: "#fef2f2",
                    color: "#991b1b",
                    timerProgressBar: true,
                });
                setLoading(false);
                return;
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id, navigate, isMobile, PARKINGS_MICROSERVICE_BASE_URL]);

    if (parkingInfo.length === 0) {
        return (
            <div className="mx-auto p-4 bg-primary h-screen">
                <div className="flex items-center justify-between laptop:max-w-5xl laptop:mx-auto my-4">
                    <div>
                        <Link
                            to="/"
                            className="text-white text-lg font-bold flex items-center"
                        >
                            <ArrowBack fontSize="small" className="mr-1" />
                            Volver al mapa
                        </Link>
                    </div>
                    <div>
                        <Refresh
                            fontSize="large"
                            className={`text-white cursor-pointer transition-transform duration-500 ${
                                loading ? "animate-spin" : ""
                            }`}
                            onClick={handleRefresh}
                        />
                    </div>
                </div>
                <div>
                    <div className="flex flex-col items-center justify-center h-96">
                        <Refresh
                            fontSize="large"
                            className={`text-white animate-spin mb-4 ${
                                parkingInfo.length === 0 ? "animate-spin" : ""
                            }`}
                        />
                        <p className="text-white text-lg font-semibold">Cargando detalles del parking...</p>
                    </div>
                </div>
            </div>
        );
    }

    const parkingDetails = parkingInfo[0].parking;

    return (
        <div className="mx-auto p-4 bg-primary">
            <div className="flex items-center justify-between laptop:max-w-5xl laptop:mx-auto my-4">
                <div>
                    <Link
                        to="/"
                        className="text-white text-lg font-bold flex items-center"
                    >
                        <ArrowBack fontSize="small" className="mr-1" />
                        Volver al mapa
                    </Link>
                </div>
                <div>
                    <Refresh
                        fontSize="large"
                        className={`text-white cursor-pointer transition-transform duration-500 ${
                            loading ? "animate-spin" : ""
                        }`}
                        onClick={handleRefresh}
                    />
                </div>
            </div>
            <div className="max-w-5xl mx-auto ">
                <h1 className="text-3xl font-bold mb-6 text-white">
                    Detalles del Parking: {parkingDetails.name}
                </h1>
                <p className="text-lg text-white mb-4">
                    Ubicación: {parkingDetails.location}
                </p>

                <h2 className="text-2xl font-semibold mb-4 text-white">
                    Estado de las Plazas
                </h2>
                <div className="grid grid-cols-2 laptop:grid-cols-3 gap-4">
                    {parkingInfo.map((slotData) => (
                        <div
                            key={slotData.id}
                            className={`p-4 rounded-lg shadow-md ${
                                slotData.occupied
                                    ? "bg-red-100 border border-red-400"
                                    : "bg-green-100 border border-green-400"
                            }`}
                        >
                            <p className="text-lg font-medium">
                                Planta: {slotData.floor}
                            </p>
                            <p className="text-lg font-medium">
                                Plaza: {slotData.slot}
                            </p>
                            <p className="text-md">
                                Estado:{" "}
                                <span
                                    className={`font-semibold ${
                                        slotData.occupied
                                            ? "text-red-700"
                                            : "text-green-700"
                                    }`}
                                >
                                    {slotData.occupied ? "Ocupada" : "Libre"}
                                </span>
                            </p>
                            <p className="text-sm text-gray-500">
                                Última actualización:{" "}
                                {new Date(
                                    slotData.lastUpdated
                                ).toLocaleString()}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

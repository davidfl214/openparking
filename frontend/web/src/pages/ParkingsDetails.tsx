import { useContext, useEffect, useState, type JSX } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import type { ParkingSlotData } from "../types/parkingSlotData";
import { LocationContext } from "../context/LocationContext";
import Swal from "sweetalert2";
import { getParkingsDetails } from "../utils/getParkingDetails";
import { ArrowBack, Refresh } from "@mui/icons-material";
import ParkingSlotDetailsBox from "../components/ParkingSlotDetailsBox";
import { PARKINGS_MICROSERVICE_BASE_URL } from "../constants/constants";

export default function ParkingDetailsPage(): JSX.Element {
    const { id } = useParams<{ id: string }>();
    const [parkingInfo, setParkingInfo] = useState<ParkingSlotData[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const { isMobile } = useContext(LocationContext);
    const navigate = useNavigate();

    const fetchParkingData = async () => {
        setIsLoading(true);
        try {
            if (!id) {
                navigate("/");
                return;
            }

            const data = await getParkingsDetails(
                PARKINGS_MICROSERVICE_BASE_URL,
                id
            );

            setParkingInfo(data);

            Swal.fire({
                toast: true,
                position: isMobile ? "top" : "top-end",
                icon: "success",
                title: "<strong>Datos actualizados</strong>",
                text: "La información del parking se ha actualizado correctamente.",
                showConfirmButton: false,
                timer: 2000,
                background: "#f0fdf4",
                color: "#166534",
                timerProgressBar: true,
            });
        } catch (err: any) {
            Swal.fire({
                toast: true,
                position: isMobile ? "top" : "top-end",
                icon: "error",
                title: "<strong>Error al cargar los detalles del parking</strong>",
                text: err.message || "Error de conexión con el servidor",
                showConfirmButton: false,
                timer: 2000,
                background: "#fef2f2",
                color: "#991b1b",
                timerProgressBar: true,
            });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchParkingData();
    }, [id, navigate, isMobile]);

    if (isLoading && parkingInfo.length === 0) {
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
                                isLoading ? "animate-spin" : ""
                            }`}
                            onClick={fetchParkingData}
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
                        <p className="text-white text-lg font-semibold">
                            Cargando detalles del parking...
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    const parkingDetails = parkingInfo[0].parking;

    const sortedParkingInfo = [...parkingInfo].sort((a, b) => {
        if (a.floor !== b.floor) {
            return a.floor - b.floor;
        }
        return a.slot - b.slot;
    });

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
                            isLoading ? "animate-spin" : ""
                        }`}
                        onClick={fetchParkingData}
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
                    {sortedParkingInfo.map((slotData) => (
                        <ParkingSlotDetailsBox
                            key={slotData.id}
                            parking={slotData}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

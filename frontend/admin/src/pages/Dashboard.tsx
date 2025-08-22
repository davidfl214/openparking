import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useContext, useEffect, useState } from "react";
import { DataContext } from "../context/DataContext";
import { ClimbingBoxLoader } from "react-spinners";
import validateToken from "../utils/validateToken";
import type User from "../types/User";
import type Parking from "../types/Parking";
import getUsers from "../utils/getUsers";
import getParkings from "../utils/getParkings";
import { deleteUser, updateUser } from "../utils/userOperations";
import {
    createParking,
    deleteParking,
    updateParking,
} from "../utils/parkingOperations";
import { AUTH_MICROSERVICE_BASE_URL } from "../constants/constants";

export default function Dashboard() {
    const { isMobile } = useContext(DataContext);
    const navigate = useNavigate();
    const [checking, setChecking] = useState(true);
    const [users, setUsers] = useState<User[]>([]);
    const [parkings, setParkings] = useState<Parking[]>([]);
    const [editingParkingId, setEditingParkingId] = useState<string | null>(
        null
    );
    const [editedParkingData, setEditedParkingData] = useState<
        Partial<Parking>
    >({});
    const [showAddParkingModal, setShowAddParkingModal] = useState(false);
    const [creatingParkingData, setCreatingParkingData] = useState<
        Partial<Parking>
    >({});
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const checkAdmin = async () => {
            const isValid = await validateToken();
            if (!isValid) {
                Swal.fire({
                    toast: true,
                    position: isMobile ? "top" : "top-end",
                    icon: "error",
                    title: "<strong>Error de inicio de sesión</strong>",
                    text: "No tienes permisos para acceder al panel de administración",
                    showConfirmButton: false,
                    timer: 2000,
                    background: "#fef2f2",
                    color: "#991b1b",
                    timerProgressBar: true,
                });
                navigate("/login");
            } else {
                setChecking(false);
                try {
                    setUsers(await getUsers());
                } catch (error) {
                    Swal.fire({
                        toast: true,
                        position: isMobile ? "top" : "top-end",
                        icon: "error",
                        title: "<strong>Error al obtener los usuarios</strong>",
                        text: "No se pudieron cargar los usuarios. Inténtalo más tarde.",
                        showConfirmButton: false,
                        timer: 2000,
                        background: "#fef2f2",
                        color: "#991b1b",
                        timerProgressBar: true,
                    });
                }
                try {
                    setParkings(await getParkings());
                } catch (error) {
                    Swal.fire({
                        toast: true,
                        position: isMobile ? "top" : "top-end",
                        icon: "error",
                        title: "<strong>Error al obtener los parkings</strong>",
                        text: "No se pudieron cargar los parkings. Inténtalo más tarde.",
                        showConfirmButton: false,
                        timer: 2000,
                        background: "#fef2f2",
                        color: "#991b1b",
                        timerProgressBar: true,
                    });
                }
            }
        };
        checkAdmin();
    }, [isMobile, navigate]);

    const handleLogout = async () => {
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
                setLoading(true);
                const response = await fetch(
                    `${AUTH_MICROSERVICE_BASE_URL}/api/auth/logout`,
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
            } catch (err: any) {
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
            } finally {
                setLoading(false);
            }
        }
    };

    const handleUpdateUser = async (user: User) => {
        try {
            setLoading(true);
            await updateUser(user);
            setUsers(await getUsers());
            Swal.fire({
                toast: true,
                position: isMobile ? "top" : "top-end",
                icon: "success",
                title: "<strong>Usuario actualizado</strong>",
                text: "El usuario se ha actualizado correctamente.",
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
                title: "<strong>Error al actualizar el usuario</strong>",
                text:
                    err.message ||
                    "No se pudo actualizar el usuario. Inténtalo más tarde.",
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

    const handleDeleteUser = async (userId: string) => {
        try {
            setLoading(true);
            await deleteUser(userId);
            setUsers(await getUsers());
            Swal.fire({
                toast: true,
                position: isMobile ? "top" : "top-end",
                icon: "success",
                title: "<strong>Usuario borrado</strong>",
                text: "El usuario se ha borrado correctamente.",
                showConfirmButton: false,
                timer: 2000,
                background: "#f0fdf4",
                color: "#166534",
                timerProgressBar: true,
            });
        } catch {
            Swal.fire({
                toast: true,
                position: isMobile ? "top" : "top-end",
                icon: "error",
                title: "<strong>Error al borrar el usuario</strong>",
                text: "No se pudo borrar el usuario. Inténtalo más tarde.",
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

    const handleEditParking = (parking: Parking) => {
        setEditingParkingId(parking.id);
        setEditedParkingData(parking);
    };

    const handleCancelParking = () => {
        setEditingParkingId(null);
        setEditedParkingData({});
    };

    const handleCreateParking = async (parking: Parking) => {
        try {
            setLoading(true);
            await createParking(parking);
            setParkings(await getParkings());
            setShowAddParkingModal(false);
            setCreatingParkingData({});
            Swal.fire({
                toast: true,
                position: isMobile ? "top" : "top-end",
                icon: "success",
                title: "<strong>Parking creado</strong>",
                text: "El parking se ha creado correctamente.",
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
                title: "<strong>Error al crear el parking</strong>",
                text:
                    err.message ||
                    "No se pudo crear el parking. Inténtalo más tarde.",
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

    const handleUpdateParking = async (parking: Parking) => {
        try {
            setLoading(true);
            await updateParking(parking);
            setParkings(await getParkings());
            Swal.fire({
                toast: true,
                position: isMobile ? "top" : "top-end",
                icon: "success",
                title: "<strong>Parking actualizado</strong>",
                text: "El parking se ha actualizado correctamente.",
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
                title: "<strong>Error al actualizar el parking</strong>",
                text:
                    err.message ||
                    "No se pudo actualizar el parking. Inténtalo más tarde.",
                showConfirmButton: false,
                timer: 2000,
                background: "#fef2f2",
                color: "#991b1b",
                timerProgressBar: true,
            });
        } finally {
            setLoading(false);
            setEditingParkingId(null);
            setEditedParkingData({});
        }
    };

    const handleDeleteParking = async (parkingId: string) => {
        try {
            setLoading(true);
            await deleteParking(parkingId);
            setParkings(await getParkings());
            Swal.fire({
                toast: true,
                position: isMobile ? "top" : "top-end",
                icon: "success",
                title: "<strong>Parking borrado</strong>",
                text: "El parking se ha borrado correctamente.",
                showConfirmButton: false,
                timer: 2000,
                background: "#f0fdf4",
                color: "#166534",
                timerProgressBar: true,
            });
        } catch {
            Swal.fire({
                toast: true,
                position: isMobile ? "top" : "top-end",
                icon: "error",
                title: "<strong>Error al borrar el parking</strong>",
                text: "No se pudo borrar el parking. Inténtalo más tarde.",
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

    const handleCancelNewParking = () => {
        setCreatingParkingData({});
        setShowAddParkingModal(false);
    };

    if (checking) {
        return (
            <div className="flex items-center justify-center h-screen bg-primary">
                <ClimbingBoxLoader color="white" size={25} />
            </div>
        );
    }

    return (
        <div className="p-8 bg-primary min-h-screen text-white flex flex-col gap-8">
            <div className="flex flex-col justify-center items-center gap-4">
                <h1 className="text-4xl text-center font-semibold">
                    Dashboard de administración
                </h1>

                <button
                    className="bg-secondary border-2 border-secondary cursor-pointer text-white py-2 px-4 rounded-md hover:bg-primary hover:border-secondary transition-colors duration-200"
                    disabled={loading}
                    onClick={handleLogout}
                >
                    Cerrar sesión
                </button>
            </div>
            <div className="flex flex-col gap-4">
                <h2 className="text-2xl">Gestión de Usuarios</h2>
                <div className="grid grid-cols-1 tablet:grid-cols-3 laptop:grid-cols-5 gap-6">
                    {users.map((user) => (
                        <div
                            key={user.id}
                            className="bg-[#34495e] rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-[#4a6572]/20 backdrop-blur-sm"
                        >
                            <div className="space-y-4">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                                        <span className="text-white font-bold text-lg">
                                            {user.name.charAt(0).toUpperCase()}
                                        </span>
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-xl font-bold text-white truncate">
                                            {user.name}
                                        </h3>
                                        <p className="text-gray-300 text-sm truncate">
                                            {user.email}
                                        </p>

                                        <div className="mt-2">
                                            <span
                                                className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                                                    user.role === "ADMIN"
                                                        ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                                                        : "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                                                }`}
                                            >
                                                {user.role === "ADMIN"
                                                    ? "Admin"
                                                    : "Usuario"}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-4 bg-[#2c3e50]/40 rounded-lg border border-[#4a6572]/30">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                                Rol del usuario
                                            </label>
                                            <p className="text-xs text-gray-400">
                                                Define los permisos y accesos
                                                del usuario
                                            </p>
                                        </div>

                                        <div className="ml-4">
                                            <select
                                                value={user.role}
                                                onChange={(e) => {
                                                    setUsers(
                                                        users.map((u) =>
                                                            u.id === user.id
                                                                ? {
                                                                      ...u,
                                                                      role: e
                                                                          .target
                                                                          .value as
                                                                          | "USER"
                                                                          | "ADMIN",
                                                                  }
                                                                : u
                                                        )
                                                    );
                                                }}
                                                className="bg-[#2c3e50] text-white border border-[#4a6572] p-2.5 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 cursor-pointer min-w-[100px]"
                                            >
                                                <option value="USER">
                                                    Usuario
                                                </option>
                                                <option value="ADMIN">
                                                    Admin
                                                </option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="p-3 bg-[#2c3e50]/30 rounded-lg border border-[#4a6572]/20 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                            <span className="text-sm text-gray-300">
                                                Estado
                                            </span>
                                        </div>
                                        <p className="text-green-400 font-medium mt-1">
                                            Activo
                                        </p>
                                    </div>

                                    <div className="p-3 bg-[#2c3e50]/30 rounded-lg border border-[#4a6572]/20 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                                            <span className="text-sm text-gray-300">
                                                Tipo
                                            </span>
                                        </div>
                                        <p className="text-blue-400 font-medium mt-1">
                                            {user.role === "ADMIN"
                                                ? "Administrador"
                                                : "Usuario"}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-2">
                                    <button
                                        onClick={() => handleUpdateUser(user)}
                                        className="flex-1 bg-secondary border-2 border-secondary cursor-pointer text-white py-2.5 px-4 rounded-lg hover:bg-[#34495e] hover:border-secondary transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                        disabled={loading}
                                    >
                                        💾 Actualizar
                                    </button>
                                    <button
                                        onClick={() =>
                                            handleDeleteUser(user.id)
                                        }
                                        className="flex-1 bg-[#95a5a6] border-2 border-[#95a5a6] cursor-pointer text-white py-2.5 px-4 rounded-lg hover:bg-[#34495e] hover:border-[#95a5a6] transition-all duration-200 font-medium focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                                        disabled={loading}
                                    >
                                        🗑️ Borrar
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <hr className="border-t border-[#4a6572]" />

            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl">Gestión de parkings</h2>
                    <button
                        className="bg-secondary border-2 border-secondary cursor-pointer text-white py-2 px-4 rounded-md hover:bg-[#34495e] hover:border-secondary transition-colors duration-200"
                        onClick={() => setShowAddParkingModal(true)}
                    >
                        Añadir parking
                    </button>
                    {showAddParkingModal && (
                        <div className="fixed inset-0 bg-primary bg-opacity-60 backdrop-blur-sm flex flex-col items-center justify-center z-50 p-4 overflow-y-auto">
                            <div className="bg-[#34495e] p-6 rounded-2xl shadow-2xl w-full max-w-lg border border-[#4a6572]/30 transform transition-all duration-300 scale-100 my-4">
                                <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#4a6572]/30">
                                    <div className="flex items-center gap-2">
                                        <div>
                                            <h3 className="text-xl font-bold text-white">
                                                Añadir Parking
                                            </h3>
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={handleCancelNewParking}
                                        className="w-8 h-8 rounded-lg bg-[#2c3e50] hover:bg-red-500/20 border border-[#4a6572] hover:border-red-500/50 flex items-center justify-center text-gray-400 hover:text-red-400 transition-all duration-200"
                                    >
                                        ✕
                                    </button>
                                </div>

                                <form
                                    className="space-y-4"
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        handleCreateParking(
                                            creatingParkingData as Parking
                                        );
                                    }}
                                >
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                                            <h4 className="text-sm font-semibold text-white">
                                                Información Básica
                                            </h4>
                                        </div>

                                        <div className="space-y-2.5">
                                            <div className="space-y-1">
                                                <label className="block text-sm font-medium text-gray-300">
                                                    Nombre del Parking
                                                </label>
                                                <input
                                                    type="text"
                                                    value={
                                                        creatingParkingData.name ||
                                                        ""
                                                    }
                                                    onChange={(e) =>
                                                        setCreatingParkingData({
                                                            ...creatingParkingData,
                                                            name: e.target
                                                                .value,
                                                        })
                                                    }
                                                    className="w-full p-2.5 bg-[#2c3e50] border border-[#4a6572] text-white rounded-lg duration-200 placeholder-gray-500 text-sm"
                                                    placeholder="Ej: Parking Central"
                                                    required
                                                />
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                                <div className="space-y-1">
                                                    <label className="block text-sm font-medium text-gray-300">
                                                        Email Admin
                                                    </label>
                                                    <input
                                                        type="email"
                                                        value={
                                                            creatingParkingData.administratorEmail ||
                                                            ""
                                                        }
                                                        onChange={(e) =>
                                                            setCreatingParkingData(
                                                                {
                                                                    ...creatingParkingData,
                                                                    administratorEmail:
                                                                        e.target
                                                                            .value,
                                                                }
                                                            )
                                                        }
                                                        className="w-full p-2.5 bg-[#2c3e50] border border-[#4a6572] text-white rounded-lg placeholder-gray-500 text-sm"
                                                        placeholder="admin@ejemplo.com"
                                                        required
                                                    />
                                                </div>

                                                <div className="space-y-1">
                                                    <label className="block text-sm font-medium text-gray-300">
                                                        Ubicación
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={
                                                            creatingParkingData.location ||
                                                            ""
                                                        }
                                                        onChange={(e) =>
                                                            setCreatingParkingData(
                                                                {
                                                                    ...creatingParkingData,
                                                                    location:
                                                                        e.target
                                                                            .value,
                                                                }
                                                            )
                                                        }
                                                        className="w-full p-2.5 bg-[#2c3e50] border border-[#4a6572] text-white rounded-lg placeholder-gray-500 text-sm"
                                                        placeholder="Dirección"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                                            <h4 className="text-sm font-semibold text-white">
                                                Coordenadas GPS
                                            </h4>
                                        </div>

                                        <div className="grid grid-cols-2 gap-2.5">
                                            <div className="space-y-1">
                                                <label className="block text-xs font-medium text-gray-300">
                                                    Latitud
                                                </label>
                                                <input
                                                    type="number"
                                                    step="any"
                                                    value={
                                                        creatingParkingData.latitude ||
                                                        ""
                                                    }
                                                    onChange={(e) =>
                                                        setCreatingParkingData({
                                                            ...creatingParkingData,
                                                            latitude: Number(
                                                                e.target.value
                                                            ),
                                                        })
                                                    }
                                                    className="w-full p-2.5 bg-[#2c3e50] border border-[#4a6572] text-white rounded-lg placeholder-gray-500 text-sm"
                                                    placeholder="40.4168"
                                                    required
                                                />
                                            </div>

                                            <div className="space-y-1">
                                                <label className="block text-xs font-medium text-gray-300">
                                                    Longitud
                                                </label>
                                                <input
                                                    type="number"
                                                    step="any"
                                                    value={
                                                        creatingParkingData.longitude ||
                                                        ""
                                                    }
                                                    onChange={(e) =>
                                                        setCreatingParkingData({
                                                            ...creatingParkingData,
                                                            longitude: Number(
                                                                e.target.value
                                                            ),
                                                        })
                                                    }
                                                    className="w-full p-2.5 bg-[#2c3e50] border border-[#4a6572] text-white rounded-lg placeholder-gray-500 text-sm"
                                                    placeholder="-3.7038"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
                                            <h4 className="text-sm font-semibold text-white">
                                                Capacidad
                                            </h4>
                                        </div>

                                        <div className="grid grid-cols-2 gap-2.5">
                                            <div className="space-y-1">
                                                <label className="block text-xs font-medium text-gray-300">
                                                    Plantas
                                                </label>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    value={
                                                        creatingParkingData.numberOfFloors ||
                                                        ""
                                                    }
                                                    onChange={(e) =>
                                                        setCreatingParkingData({
                                                            ...creatingParkingData,
                                                            numberOfFloors:
                                                                Number(
                                                                    e.target
                                                                        .value
                                                                ),
                                                        })
                                                    }
                                                    className="w-full p-2.5 bg-[#2c3e50] border border-[#4a6572] text-white rounded-lg text-sm"
                                                    required
                                                />
                                            </div>

                                            <div className="space-y-1">
                                                <label className="block text-xs font-medium text-gray-300">
                                                    Plazas/Planta
                                                </label>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    value={
                                                        creatingParkingData.slotsPerFloor ||
                                                        ""
                                                    }
                                                    onChange={(e) =>
                                                        setCreatingParkingData({
                                                            ...creatingParkingData,
                                                            slotsPerFloor:
                                                                Number(
                                                                    e.target
                                                                        .value
                                                                ),
                                                        })
                                                    }
                                                    className="w-full p-2.5 bg-[#2c3e50] border border-[#4a6572] text-white rounded-lg text-sm"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        {creatingParkingData.numberOfFloors &&
                                            creatingParkingData.slotsPerFloor && (
                                                <div className="text-center p-2 bg-gradient-to-r from-[#2c3e50]/40 to-[#34495e]/40 rounded-lg border border-[#4a6572]/30">
                                                    <span className="text-lg font-bold text-blue-400">
                                                        {creatingParkingData.numberOfFloors *
                                                            creatingParkingData.slotsPerFloor}
                                                    </span>
                                                    <span className="text-xs text-gray-300 ml-1">
                                                        plazas totales
                                                    </span>
                                                </div>
                                            )}
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full"></div>
                                            <h4 className="text-sm font-semibold text-white">
                                                Estado
                                            </h4>
                                        </div>

                                        <div className="flex items-center justify-between p-2.5 bg-[#2c3e50]/50 rounded-lg border border-[#4a6572]/30">
                                            <span className="text-sm font-medium text-gray-300">
                                                Parking Habilitado
                                            </span>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={
                                                        creatingParkingData.enabled ===
                                                        undefined
                                                            ? false
                                                            : creatingParkingData.enabled
                                                    }
                                                    onChange={(e) =>
                                                        setCreatingParkingData({
                                                            ...creatingParkingData,
                                                            enabled:
                                                                e.target
                                                                    .checked,
                                                        })
                                                    }
                                                    className="sr-only peer"
                                                />
                                                <div className="relative w-11 h-6 bg-gray-600 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                            </label>
                                        </div>
                                    </div>

                                    <div className="flex gap-2.5 pt-3 border-t border-[#4a6572]/30">
                                        <button
                                            type="submit"
                                            className="flex-1 bg-secondary border-2 border-secondary cursor-pointer text-white py-2.5 px-4 rounded-lg hover:bg-[#34495e] hover:border-secondary transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                                            disabled={loading}
                                        >
                                            {loading
                                                ? "Guardando..."
                                                : "Crear Parking"}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleCancelNewParking}
                                            className="flex-1 bg-[#95a5a6] border-2 border-[#95a5a6] cursor-pointer text-white py-2.5 px-4 rounded-lg hover:bg-[#34495e] hover:border-[#95a5a6] transition-all duration-200 font-medium text-sm"
                                        >
                                            Cancelar
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
                <div className="grid grid-cols-1 tablet:grid-cols-2 laptop:grid-cols-3 gap-6">
                    {parkings.map((parking) => (
                        <div
                            key={parking.id}
                            className="bg-[#34495e] rounded-xl p-6 shadow-lg border border-[#4a6572]/20"
                        >
                            {editingParkingId === parking.id ? (
                                <div className="space-y-5">
                                    <div className="border-b border-[#4a6572]/30 pb-3 mb-4">
                                        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                                            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                                            Editando Parking
                                        </h3>
                                    </div>

                                    <div className="grid gap-4">
                                        <div className="space-y-1.5">
                                            <label className="block text-sm font-medium text-gray-300">
                                                Nombre
                                            </label>
                                            <input
                                                type="text"
                                                value={
                                                    editedParkingData.name || ""
                                                }
                                                onChange={(e) =>
                                                    setEditedParkingData({
                                                        ...editedParkingData,
                                                        name: e.target.value,
                                                    })
                                                }
                                                className="w-full p-3 bg-[#2c3e50] border border-[#4a6572] text-white rounded-lg placeholder-gray-400 outline-1"
                                                placeholder="Nombre del parking"
                                            />
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="block text-sm font-medium text-gray-300">
                                                Admin email
                                            </label>
                                            <input
                                                type="email"
                                                value={
                                                    editedParkingData.administratorEmail ||
                                                    ""
                                                }
                                                onChange={(e) =>
                                                    setEditedParkingData({
                                                        ...editedParkingData,
                                                        administratorEmail:
                                                            e.target.value,
                                                    })
                                                }
                                                className="w-full p-3 bg-[#2c3e50] border border-[#4a6572] text-white rounded-lg placeholder-gray-400 outline-1"
                                                placeholder="admin@ejemplo.com"
                                            />
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="block text-sm font-medium text-gray-300">
                                                Ubicación
                                            </label>
                                            <input
                                                type="text"
                                                value={
                                                    editedParkingData.location ||
                                                    ""
                                                }
                                                onChange={(e) =>
                                                    setEditedParkingData({
                                                        ...editedParkingData,
                                                        location:
                                                            e.target.value,
                                                    })
                                                }
                                                className="w-full p-3 bg-[#2c3e50] border border-[#4a6572] text-white rounded-lg placeholder-gray-400 outline-1"
                                                placeholder="Dirección del parking"
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1.5">
                                                <label className="block text-sm font-medium text-gray-300">
                                                    Plantas
                                                </label>
                                                <input
                                                    type="number"
                                                    value={
                                                        editedParkingData.numberOfFloors ||
                                                        ""
                                                    }
                                                    onChange={(e) =>
                                                        setEditedParkingData({
                                                            ...editedParkingData,
                                                            numberOfFloors:
                                                                Number(
                                                                    e.target
                                                                        .value
                                                                ),
                                                        })
                                                    }
                                                    className="w-full p-3 bg-[#2c3e50] border border-[#4a6572] text-white rounded-lg transition-all duration-200 outline-1"
                                                    placeholder="0"
                                                />
                                            </div>

                                            <div className="space-y-1.5">
                                                <label className="block text-sm font-medium text-gray-300">
                                                    Plazas por planta
                                                </label>
                                                <input
                                                    type="number"
                                                    value={
                                                        editedParkingData.slotsPerFloor ||
                                                        ""
                                                    }
                                                    onChange={(e) =>
                                                        setEditedParkingData({
                                                            ...editedParkingData,
                                                            slotsPerFloor:
                                                                Number(
                                                                    e.target
                                                                        .value
                                                                ),
                                                        })
                                                    }
                                                    className="w-full p-3 bg-[#2c3e50] border border-[#4a6572] text-white rounded-lg transition-all duration-200 outline-1"
                                                    placeholder="0"
                                                />
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between p-3 bg-[#2c3e50]/50 rounded-lg border border-[#4a6572]/30">
                                            <label className="text-sm font-medium text-gray-300">
                                                Estado del parking
                                            </label>
                                            <div className="flex items-center gap-3">
                                                <span className="text-sm text-gray-400">
                                                    {editedParkingData.enabled
                                                        ? "Habilitado"
                                                        : "Deshabilitado"}
                                                </span>
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={
                                                            editedParkingData.enabled
                                                        }
                                                        onChange={(e) =>
                                                            setEditedParkingData(
                                                                {
                                                                    ...editedParkingData,
                                                                    enabled:
                                                                        e.target
                                                                            .checked,
                                                                }
                                                            )
                                                        }
                                                        className="sr-only peer"
                                                    />
                                                    <div className="relative w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-3">
                                        <button
                                            onClick={() =>
                                                handleUpdateParking(
                                                    editedParkingData as Parking
                                                )
                                            }
                                            className="flex-1 bg-secondary border-2 border-secondary cursor-pointer text-white py-2.5 px-4 rounded-lg hover:bg-[#34495e] hover:border-secondary transition-all duration-200 font-medium"
                                        >
                                            Guardar Cambios
                                        </button>
                                        <button
                                            onClick={handleCancelParking}
                                            className="flex-1 bg-[#95a5a6] border-2 border-[#95a5a6] cursor-pointer text-white py-2.5 px-4 rounded-lg hover:bg-[#34495e] hover:border-[#95a5a6] transition-all duration-200 font-medium"
                                        >
                                            Cancelar
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-xl font-bold text-white">
                                                    {parking.name}
                                                </h3>
                                                <div
                                                    className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                                                        parking.enabled
                                                            ? "bg-green-500/20 text-green-400 border border-green-500/30"
                                                            : "bg-red-500/20 text-red-400 border border-red-500/30"
                                                    }`}
                                                >
                                                    {parking.enabled
                                                        ? "Activo"
                                                        : "Inactivo"}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid gap-3">
                                        <div className="flex items-start gap-3 p-3 bg-[#2c3e50]/30 rounded-lg border border-[#4a6572]/20">
                                            <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                                            <div>
                                                <p className="text-sm text-gray-400 mb-1">
                                                    Ubicación
                                                </p>
                                                <p className="text-white font-medium">
                                                    {parking.location}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3 p-3 bg-[#2c3e50]/30 rounded-lg border border-[#4a6572]/20">
                                            <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                                            <div>
                                                <p className="text-sm text-gray-400 mb-1">
                                                    Email Administrador
                                                </p>
                                                <p className="text-white font-medium break-all">
                                                    {parking.administratorEmail}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="p-3 bg-[#2c3e50]/30 rounded-lg border border-[#4a6572]/20 text-center">
                                                <p className="text-2xl font-bold text-white">
                                                    {parking.numberOfFloors}
                                                </p>
                                                <p className="text-sm text-gray-400">
                                                    Plantas
                                                </p>
                                            </div>
                                            <div className="p-3 bg-[#2c3e50]/30 rounded-lg border border-[#4a6572]/20 text-center">
                                                <p className="text-2xl font-bold text-white">
                                                    {parking.slotsPerFloor}
                                                </p>
                                                <p className="text-sm text-gray-400">
                                                    Plazas/Planta
                                                </p>
                                            </div>
                                        </div>

                                        <div className="p-3 bg-gradient-to-r from-[#2c3e50]/40 to-[#34495e]/40 rounded-lg border border-[#4a6572]/30">
                                            <div className="text-center">
                                                <p className="text-3xl font-bold text-blue-400">
                                                    {parking.numberOfFloors *
                                                        parking.slotsPerFloor}
                                                </p>
                                                <p className="text-sm text-gray-300">
                                                    Capacidad Total
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-3 pt-2">
                                        <button
                                            onClick={() =>
                                                handleEditParking(parking)
                                            }
                                            className="flex-1 bg-secondary border-2 border-secondary cursor-pointer text-white py-2.5 px-4 rounded-lg hover:bg-[#34495e] hover:border-secondary transition-all duration-200 font-medium focus:ring-2 focus:ring-blue-400 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                                            disabled={loading}
                                        >
                                            Modificar
                                        </button>
                                        <button
                                            onClick={() =>
                                                handleDeleteParking(parking.id)
                                            }
                                            className="flex-1 bg-[#95a5a6] border-2 border-[#95a5a6] cursor-pointer text-white py-2.5 px-4 rounded-lg hover:bg-[#34495e] hover:border-[#95a5a6] transition-all duration-200 font-medium focus:ring-2 focus:ring-gray-400 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                                            disabled={loading}
                                        >
                                            Borrar
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

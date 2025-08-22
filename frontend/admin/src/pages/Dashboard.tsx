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
                            className="bg-[#34495e] rounded-lg px-6 py-4 flex flex-col gap-2"
                        >
                            <div className="flex flex-col gap-2">
                                <p className="text-xl font-semibold">
                                    {user.name}
                                </p>
                                <p className="text-gray-300">{user.email}</p>
                                <div className="flex items-center gap-4">
                                    <label>Rol:</label>
                                    <select
                                        value={user.role}
                                        onChange={(e) => {
                                            setUsers(
                                                users.map((u) =>
                                                    u.id === user.id
                                                        ? {
                                                              ...u,
                                                              role: e.target
                                                                  .value as
                                                                  | "USER"
                                                                  | "ADMIN",
                                                          }
                                                        : u
                                                )
                                            );
                                        }}
                                        className="bg-[#2c3e50] text-white border border-[#4a6572] p-2 rounded-md focus:outline-none"
                                    >
                                        <option value="USER">USER</option>
                                        <option value="ADMIN">ADMIN</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleUpdateUser(user)}
                                    className="bg-secondary border-2 border-secondary cursor-pointer text-white py-2 px-4 rounded-md hover:bg-[#34495e] hover:border-secondary transition-colors duration-200"
                                    disabled={loading}
                                >
                                    Actualizar
                                </button>
                                <button
                                    onClick={() => handleDeleteUser(user.id)}
                                    className="bg-[#95a5a6] border-2 border-[#95a5a6] cursor-pointer text-white py-2 px-4 rounded-md hover:bg-[#34495e] hover:border-[#95a5a6] transition-colors duration-200"
                                    disabled={loading}
                                >
                                    Borrar
                                </button>
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
                        <div className="fixed inset-0 bg-primary bg-opacity-50 flex flex-col items-center justify-center z-50">
                            <h3 className="text-2xl font-semibold mb-4 text-white">
                                Añadir Parking
                            </h3>
                            <div className="bg-[#34495e] p-8 rounded-lg shadow-lg w-[85%] laptop:max-w-md">
                                <form
                                    className="flex flex-col gap-2"
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        handleCreateParking(
                                            creatingParkingData as Parking
                                        );
                                    }}
                                >
                                    <label className="block">Nombre:</label>
                                    <input
                                        type="text"
                                        value={creatingParkingData.name || ""}
                                        onChange={(e) =>
                                            setCreatingParkingData({
                                                ...creatingParkingData,
                                                name: e.target.value,
                                            })
                                        }
                                        className="w-full p-2 bg-[#2c3e50] border border-[#4a6572] text-white rounded"
                                        required
                                    />
                                    <label className="block">
                                        Admin email:
                                    </label>
                                    <input
                                        type="email"
                                        value={
                                            creatingParkingData.administratorEmail ||
                                            ""
                                        }
                                        onChange={(e) =>
                                            setCreatingParkingData({
                                                ...creatingParkingData,
                                                administratorEmail:
                                                    e.target.value,
                                            })
                                        }
                                        className="w-full p-2 bg-[#2c3e50] border border-[#4a6572] text-white rounded"
                                        required
                                    />
                                    <label className="block">Ubicación:</label>
                                    <input
                                        type="text"
                                        value={
                                            creatingParkingData.location || ""
                                        }
                                        onChange={(e) =>
                                            setCreatingParkingData({
                                                ...creatingParkingData,
                                                location: e.target.value,
                                            })
                                        }
                                        className="w-full p-2 bg-[#2c3e50] border border-[#4a6572] text-white rounded"
                                        required
                                    />
                                    <label className="block">Latitud:</label>
                                    <input
                                        type="text"
                                        value={
                                            creatingParkingData.latitude || ""
                                        }
                                        onChange={(e) =>
                                            setCreatingParkingData({
                                                ...creatingParkingData,
                                                latitude: Number(
                                                    e.target.value
                                                ),
                                            })
                                        }
                                        className="w-full p-2 bg-[#2c3e50] border border-[#4a6572] text-white rounded"
                                        required
                                    />
                                    <label className="block">Longitud:</label>
                                    <input
                                        type="text"
                                        value={
                                            creatingParkingData.longitude || ""
                                        }
                                        onChange={(e) =>
                                            setCreatingParkingData({
                                                ...creatingParkingData,
                                                longitude: Number(
                                                    e.target.value
                                                ),
                                            })
                                        }
                                        className="w-full p-2 bg-[#2c3e50] border border-[#4a6572] text-white rounded"
                                        required
                                    />
                                    <label className="block">Plantas:</label>
                                    <input
                                        type="number"
                                        value={
                                            creatingParkingData.numberOfFloors ||
                                            ""
                                        }
                                        onChange={(e) =>
                                            setCreatingParkingData({
                                                ...creatingParkingData,
                                                numberOfFloors: Number(
                                                    e.target.value
                                                ),
                                            })
                                        }
                                        className="w-full p-2 bg-[#2c3e50] border border-[#4a6572] text-white rounded"
                                        required
                                    />
                                    <label className="block">
                                        Plazas por planta:
                                    </label>
                                    <input
                                        type="number"
                                        value={
                                            creatingParkingData.slotsPerFloor ||
                                            ""
                                        }
                                        onChange={(e) =>
                                            setCreatingParkingData({
                                                ...creatingParkingData,
                                                slotsPerFloor: Number(
                                                    e.target.value
                                                ),
                                            })
                                        }
                                        className="w-full p-2 bg-[#2c3e50] border border-[#4a6572] text-white rounded"
                                        required
                                    />
                                    <div className="flex items-center">
                                        <label className="mr-2">
                                            Habilitado:
                                        </label>
                                        <input
                                            type="checkbox"
                                            checked={
                                                creatingParkingData.enabled ==
                                                undefined
                                                    ? false
                                                    : creatingParkingData.enabled
                                            }
                                            onChange={(e) =>
                                                setCreatingParkingData({
                                                    ...creatingParkingData,
                                                    enabled: e.target.checked,
                                                })
                                            }
                                            className="form-checkbox h-5 w-5 text-red-600"
                                        />
                                    </div>
                                    <div className="flex mt-2 gap-2">
                                        <button
                                            type="submit"
                                            className="bg-secondary border-2 border-secondary cursor-pointer text-white py-2 px-4 rounded-md hover:bg-[#34495e] hover:border-secondary transition-colors duration-200"
                                            disabled={loading}
                                        >
                                            Guardar
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleCancelNewParking}
                                            className="bg-[#95a5a6] border-2 border-[#95a5a6] cursor-pointer text-white py-2 px-4 rounded-md hover:bg-[#34495e] hover:border-[#95a5a6] transition-colors duration-200"
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
                            className="bg-[#34495e] rounded-lg p-6 shadow-md"
                        >
                            {editingParkingId === parking.id ? (
                                <div className="flex flex-col gap-2">
                                    <label className="block">Nombre:</label>
                                    <input
                                        type="text"
                                        value={editedParkingData.name || ""}
                                        onChange={(e) =>
                                            setEditedParkingData({
                                                ...editedParkingData,
                                                name: e.target.value,
                                            })
                                        }
                                        className="w-full p-2 bg-[#2c3e50] border border-[#4a6572] text-white rounded"
                                    />
                                    <label className="block">
                                        Admin email:
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
                                        className="w-full p-2 bg-[#2c3e50] border border-[#4a6572] text-white rounded"
                                    />
                                    <label className="block">Ubicación:</label>
                                    <input
                                        type="text"
                                        value={editedParkingData.location || ""}
                                        onChange={(e) =>
                                            setEditedParkingData({
                                                ...editedParkingData,
                                                location: e.target.value,
                                            })
                                        }
                                        className="w-full p-2 bg-[#2c3e50] border border-[#4a6572] text-white rounded"
                                    />
                                    <label className="block">Plantas:</label>
                                    <input
                                        type="number"
                                        value={
                                            editedParkingData.numberOfFloors ||
                                            ""
                                        }
                                        onChange={(e) =>
                                            setEditedParkingData({
                                                ...editedParkingData,
                                                numberOfFloors: Number(
                                                    e.target.value
                                                ),
                                            })
                                        }
                                        className="w-full p-2 bg-[#2c3e50] border border-[#4a6572] text-white rounded"
                                    />
                                    <label className="block">
                                        Plazas por planta:
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
                                                slotsPerFloor: Number(
                                                    e.target.value
                                                ),
                                            })
                                        }
                                        className="w-full p-2 bg-[#2c3e50] border border-[#4a6572] text-white rounded"
                                    />
                                    <div className="flex items-center">
                                        <label className="mr-2">
                                            Habilitado:
                                        </label>
                                        <input
                                            type="checkbox"
                                            checked={editedParkingData.enabled}
                                            onChange={(e) =>
                                                setEditedParkingData({
                                                    ...editedParkingData,
                                                    enabled: e.target.checked,
                                                })
                                            }
                                            className="form-checkbox h-5 w-5 text-red-600"
                                        />
                                    </div>
                                    <div className="flex mt-2 gap-2">
                                        <button
                                            onClick={() =>
                                                handleUpdateParking(
                                                    editedParkingData as Parking
                                                )
                                            }
                                            className="bg-secondary border-2 border-secondary cursor-pointer text-white py-2 px-4 rounded-md hover:bg-[#34495e] hover:border-secondary transition-colors duration-200"
                                        >
                                            Guardar
                                        </button>
                                        <button
                                            onClick={handleCancelParking}
                                            className="bg-[#95a5a6] border-2 border-[#95a5a6] cursor-pointer text-white py-2 px-4 rounded-md hover:bg-[#34495e] hover:border-[#95a5a6] transition-colors duration-200"
                                        >
                                            Cancelar
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-2">
                                    <h3 className="text-xl font-semibold text-white">
                                        {parking.name}
                                    </h3>
                                    <p className="text-gray-300">
                                        Ubicación: {parking.location}
                                    </p>
                                    <p className="text-gray-300">
                                        Email Admin:{" "}
                                        {parking.administratorEmail}
                                    </p>
                                    <p className="text-gray-300">
                                        Plantas: {parking.numberOfFloors}
                                    </p>
                                    <p className="text-gray-300">
                                        Plazas por planta:{" "}
                                        {parking.slotsPerFloor}
                                    </p>
                                    <p className="text-gray-300">
                                        Estado:{" "}
                                        <span
                                            className={
                                                parking.enabled
                                                    ? "text-green-500"
                                                    : "text-red-500"
                                            }
                                        >
                                            {parking.enabled
                                                ? "Habilitado"
                                                : "Deshabilitado"}
                                        </span>
                                    </p>
                                    <div className="flex mt-2 gap-2">
                                        <button
                                            onClick={() =>
                                                handleEditParking(parking)
                                            }
                                            className="bg-secondary border-2 border-secondary cursor-pointer text-white py-2 px-4 rounded-md hover:bg-[#34495e] hover:border-secondary transition-colors duration-200"
                                            disabled={loading}
                                        >
                                            Modificar
                                        </button>
                                        <button
                                            onClick={() =>
                                                handleDeleteParking(parking.id)
                                            }
                                            className="bg-[#95a5a6] border-2 border-[#95a5a6] cursor-pointer text-white py-2 px-4 rounded-md hover:bg-[#34495e] hover:border-[#95a5a6] transition-colors duration-200"
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

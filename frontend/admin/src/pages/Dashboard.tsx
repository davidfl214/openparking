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

export default function Dashboard() {
    const { isMobile } = useContext(DataContext);
    const navigate = useNavigate();
    const [checking, setChecking] = useState(true);
    const [users, setUsers] = useState<User[]>([]);
    const [parkings, setParkings] = useState<Parking[]>([]);
    const [editingParkingId, setEditingParkingId] = useState<string | null>(null);
    const [editedParkingData, setEditedParkingData] = useState<Partial<Parking>>({});

    useEffect(() => {
        const checkAdmin = async () => {
            const isValid = true //await validateToken();
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

    const handleUpdateUser = (userId: string) => {
        console.log(`Actualizar usuario con ID: ${userId}`);
    };

    const handleDeleteUser = (userId: string) => {
        console.log(`Borrar usuario con ID: ${userId}`);
        setUsers(users.filter(user => user.id !== userId));
    };

    const handleEditParking = (parking: Parking) => {
        setEditingParkingId(parking.id);
        setEditedParkingData(parking);
    };

    const handleSaveParking = (parkingId: string) => {
        console.log(`Guardar cambios del parking con ID: ${parkingId}`, editedParkingData);
        setEditingParkingId(null);
        setEditedParkingData({});
    };

    const handleCancelParking = () => {
        setEditingParkingId(null);
        setEditedParkingData({});
    };

    const handleDeleteParking = (parkingId: string) => {
        console.log(`Borrar parking con ID: ${parkingId}`);
        setParkings(parkings.filter(p => p.id !== parkingId));
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
            <h1 className="text-4xl text-center font-semibold">Dashboard</h1>
            <div className="flex flex-col gap-4">
                <h2 className="text-2xl">Gestión de Usuarios</h2>
                <div className="grid grid-cols-1 tablet:grid-cols-3 laptop:grid-cols-5 gap-6">
                    {users.map(user => (
                        <div key={user.id} className="bg-[#34495e] rounded-lg px-6 py-4 flex flex-col gap-2">
                            <div className="flex flex-col gap-2">
                                <p className="text-xl font-semibold">{user.name}</p>
                                <p className="text-gray-300">{user.email}</p>
                                <div className="flex items-center gap-4">
                                    <label>Rol:</label>
                                    <select
                                        value={user.role}
                                        onChange={(e) => {
                                            setUsers(users.map(u => u.id === user.id ? { ...u, role: e.target.value as 'USER' | 'ADMIN' } : u));
                                        }}
                                        className="bg-[#2c3e50] text-white border border-[#4a6572] p-2 rounded-md focus:outline-none"
                                    >
                                        <option value="USER">User</option>
                                        <option value="ADMIN">Admin</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => handleUpdateUser(user.id)} className="bg-secondary border-2 border-secondary cursor-pointer text-white py-2 px-4 rounded-md hover:bg-[#34495e] hover:border-secondary transition-colors duration-200">
                                    Actualizar
                                </button>
                                <button onClick={() => handleDeleteUser(user.id)} className="bg-[#95a5a6] border-2 border-[#95a5a6] cursor-pointer text-white py-2 px-4 rounded-md hover:bg-[#34495e] hover:border-[#95a5a6] transition-colors duration-200">
                                    Borrar
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <hr className="border-t border-[#4a6572]" />

            <div className="flex flex-col gap-4">
                <h2 className="text-2xl">Gestión de Parkings</h2>
                <div className="grid grid-cols-1 tablet:grid-cols-2 laptop:grid-cols-3 gap-6">
                    {parkings.map(parking => (
                        <div key={parking.id} className="bg-[#34495e] rounded-lg p-6 shadow-md">
                            {editingParkingId === parking.id ? (
                                <div className="flex flex-col gap-2">
                                    <label className="block">Nombre:</label>
                                    <input
                                        type="text"
                                        value={editedParkingData.name || ''}
                                        onChange={(e) => setEditedParkingData({ ...editedParkingData, name: e.target.value })}
                                        className="w-full p-2 bg-[#2c3e50] border border-[#4a6572] text-white rounded"
                                    />
                                    <label className="block">Admin email:</label>
                                    <input
                                        type="email"
                                        value={editedParkingData.administratorEmail || ''}
                                        onChange={(e) => setEditedParkingData({ ...editedParkingData, administratorEmail: e.target.value })}
                                        className="w-full p-2 bg-[#2c3e50] border border-[#4a6572] text-white rounded"
                                    />
                                    <label className="block">Ubicación:</label>
                                    <input
                                        type="text"
                                        value={editedParkingData.location || ''}
                                        onChange={(e) => setEditedParkingData({ ...editedParkingData, location: e.target.value })}
                                        className="w-full p-2 bg-[#2c3e50] border border-[#4a6572] text-white rounded"
                                    />
                                    <label className="block">Plantas:</label>
                                    <input
                                        type="number"
                                        value={editedParkingData.numberOfFloors || ''}
                                        onChange={(e) => setEditedParkingData({ ...editedParkingData, numberOfFloors: Number(e.target.value) })}
                                        className="w-full p-2 bg-[#2c3e50] border border-[#4a6572] text-white rounded"
                                    />
                                    <label className="block">Plazas por planta:</label>
                                    <input
                                        type="number"
                                        value={editedParkingData.slotsPerFloor || ''}
                                        onChange={(e) => setEditedParkingData({ ...editedParkingData, slotsPerFloor: Number(e.target.value) })}
                                        className="w-full p-2 bg-[#2c3e50] border border-[#4a6572] text-white rounded"
                                    />
                                    <div className="flex items-center">
                                        <label className="mr-2">Habilitado:</label>
                                        <input
                                            type="checkbox"
                                            checked={editedParkingData.enabled}
                                            onChange={(e) => setEditedParkingData({ ...editedParkingData, enabled: e.target.checked })}
                                            className="form-checkbox h-5 w-5 text-red-600"
                                        />
                                    </div>
                                    <div className="flex mt-2 gap-2">
                                        <button onClick={() => handleSaveParking(parking.id)} className="bg-secondary border-2 border-secondary cursor-pointer text-white py-2 px-4 rounded-md hover:bg-[#34495e] hover:border-secondary transition-colors duration-200">Guardar</button>
                                        <button onClick={handleCancelParking} className="bg-[#95a5a6] border-2 border-[#95a5a6] cursor-pointer text-white py-2 px-4 rounded-md hover:bg-[#34495e] hover:border-[#95a5a6] transition-colors duration-200">Cancelar</button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-2">
                                    <h3 className="text-xl font-semibold text-white">{parking.name}</h3>
                                    <p className="text-gray-300">Ubicación: {parking.location}</p>
                                    <p className="text-gray-300">Email Admin: {parking.administratorEmail}</p>
                                    <p className="text-gray-300">Plantas: {parking.numberOfFloors}</p>
                                    <p className="text-gray-300">Plazas por planta: {parking.slotsPerFloor}</p>
                                    <p className="text-gray-300">Estado: <span className={parking.enabled ? 'text-green-500' : 'text-red-500'}>{parking.enabled ? 'Habilitado' : 'Deshabilitado'}</span></p>
                                    <div className="flex mt-2 gap-2">
                                        <button onClick={() => handleEditParking(parking)} className="bg-secondary border-2 border-secondary cursor-pointer text-white py-2 px-4 rounded-md hover:bg-[#34495e] hover:border-secondary transition-colors duration-200">Modificar</button>
                                        <button onClick={() => handleDeleteParking(parking.id)} className="bg-[#95a5a6] border-2 border-[#95a5a6] cursor-pointer text-white py-2 px-4 rounded-md hover:bg-[#34495e] hover:border-[#95a5a6] transition-colors duration-200">Borrar</button>
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
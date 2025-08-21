import { AUTH_MICROSERVICE_BASE_URL } from "../constants/constants";
import type User from "../types/User";

export const updateUser = async (user: User) => {
    try {
        const response = await fetch(`${AUTH_MICROSERVICE_BASE_URL}/api/admin/users/${user.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(user),
            credentials: "include",
        });
        
        if (!response.ok) {
            throw new Error(`Error al actualizar el usuario: ${user.name}`);
        }
        
    } catch (err) {
        throw new Error(`Error al actualizar el usuario: ${user.name}`);
    }
};

export const deleteUser = async (userId: string) => {
    try {
        const response = await fetch(`${AUTH_MICROSERVICE_BASE_URL}/api/admin/users/${userId}`, {
            method: "DELETE",
            credentials: "include",
        });

        if (!response.ok) {
            throw new Error(`Error al borrar el usuario con ID: ${userId}`);
        }

    } catch (err) {
        throw new Error(`Error al borrar el usuario con ID: ${userId}`);
    }
};

import type User from "../types/User";

export default async function getUsers(): Promise<User[]> {
    const AUTH_MICROSERVICE_BASE_URL =
        import.meta.env.VITE_AUTH_MICROSERVICE_URL || "http://localhost:8080";

    const response = await fetch(
        `${AUTH_MICROSERVICE_BASE_URL}/api/admin/users`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        }
    );
    if (!response.ok) {
        console.error("Error al obtener los usuarios:", response.statusText);
        throw new Error("Error al obtener los usuarios");
    }
    const data: User[] = await response.json();
    return data;
}

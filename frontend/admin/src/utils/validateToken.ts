import type ValidateResponse from "../types/ValidateResponse";

export default async function validateToken(): Promise<boolean> {
    const AUTH_MICROSERVICE_BASE_URL =
        import.meta.env.VITE_AUTH_MICROSERVICE_URL || "http://localhost:8080";

    try {
        const res = await fetch(`${AUTH_MICROSERVICE_BASE_URL}/api/auth/validate`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        });

        if (!res.ok) {
            throw new Error("Token inválido o expirado");
        }

        const data: ValidateResponse = await res.json();

        return data.isValid && data.role === "ADMIN";
    } catch (error) {
        console.error("Error al validar el token:", error);
        return false;
    }
}
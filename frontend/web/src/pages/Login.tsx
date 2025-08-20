import { useContext, useState } from "react";
import { TextField, Button } from "@mui/material";
import Swal from "sweetalert2";
import { LocationContext } from "../context/LocationContext";
import { ArrowBack, LocationOn } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import type { AuthResponse } from "../types/authResponse";
import { AUTH_MICROSERVICE_BASE_URL } from "../constants/constants";

const setLocalStorageItems = (response: AuthResponse) => {
    localStorage.setItem("userRole", response.role || "");
    localStorage.setItem("userEmail", response.email || "");
    localStorage.setItem("userName", response.name || "");
    localStorage.setItem(
        "parkingFavorites",
        JSON.stringify(
            response.parkingFavorites
                ? Array.from(response.parkingFavorites)
                : []
        )
    );

    const expirationTime = 24 * 60 * 60 * 1000;
    localStorage.setItem(
        "expiration",
        (Date.now() + expirationTime).toString()
    );
};

export default function Login() {
    const { isMobile, setAuthResponse } = useContext(LocationContext);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const res = await fetch(
                `${AUTH_MICROSERVICE_BASE_URL}/api/auth/login`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email, password }),
                    credentials: "include"
                }
            );

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(
                    errorData?.message || "Error de conexión con el servidor"
                );
            }

            const response: AuthResponse = await res.json();

            setLocalStorageItems(response);
            setAuthResponse(response);

            Swal.fire({
                toast: true,
                position: isMobile ? "top" : "top-end",
                icon: "success",
                title: "<strong>Inicio de sesión exitoso</strong>",
                text: `Bienvenido de nuevo, ${response.name}`,
                showConfirmButton: false,
                timer: 2000,
                background: "#f0fdf4",
                color: "#166534",
                timerProgressBar: true,
            });

            navigate("/");
        } catch (err: any) {
            Swal.fire({
                toast: true,
                position: isMobile ? "top" : "top-end",
                icon: "error",
                title: "<strong>Error de inicio de sesión</strong>",
                text: err.message || "Error de conexión con el servidor",
                showConfirmButton: false,
                timer: 2000,
                background: "#fef2f2",
                color: "#991b1b",
                timerProgressBar: true,
            });
        }
    };

    return (
        <div className="w-screen h-screen flex flex-col items-center justify-center p-8 bg-primary">
            <div className="absolute top-4 left-4 laptop:top-6 laptop:left-8">
                <Link
                    to="/"
                    className="text-white text-lg font-bold mb-4 flex items-center hover:underline"
                >
                    <ArrowBack fontSize="small" className="mr-1" />
                    Volver al mapa
                </Link>
            </div>
            <div className="flex items-center mb-8 gap-2">
                <LocationOn
                    className="text-secondary"
                    sx={{ fontSize: { xs: 50, sm: 60 } }}
                />
                <h1 className="font-bold text-white text-4xl laptop:text-5xl">
                    OpenParking
                </h1>
            </div>

            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded-md w-full max-w-xl flex flex-col items-center"
            >
                <TextField
                    label="Correo electrónico"
                    type="email"
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    value={email}
                    sx={{ m: 1 }}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <TextField
                    label="Contraseña"
                    type="password"
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    value={password}
                    sx={{ m: 1 }}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{
                        m: 1,
                        bgcolor: "var(--color-secondary)",
                        fontWeight: "bold",
                    }}
                >
                    Entrar
                </Button>

                <p className="text-center text-gray-600 m-1">
                    ¿No tienes cuenta?{" "}
                    <Link
                        to="/register"
                        className="text-secondary hover:underline"
                    >
                        Regístrate aquí
                    </Link>
                </p>
            </form>
        </div>
    );
}

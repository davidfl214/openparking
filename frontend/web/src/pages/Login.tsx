import { useContext, useState } from "react";
import { TextField, Button } from "@mui/material";
import Swal from "sweetalert2";
import { LocationContext } from "../context/LocationContext";
import { ArrowBack, LocationOn } from "@mui/icons-material";
import { Link } from "react-router-dom";

export default function Login() {
    const AUTH_MICROSERVICE_BASE_URL =
        import.meta.env.VITE_AUTH_MICROSERVICE_URL || "http://localhost:8080";

    const { isMobile } = useContext(LocationContext);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

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
                }
            );

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(
                    errorData?.message || "Error de conexión con el servidor"
                );
            }

            const { token } = await res.json();

            localStorage.setItem("jwt", token);
        } catch (err: any) {
            Swal.fire({
                toast: true,
                position: isMobile ? "top" : "top-end",
                icon: "error",
                title: "<strong>Error de inicio de sesión</strong>",
                text: err.message || "Error de conexión con el servidor",
                showConfirmButton: false,
                timer: 3000,
                background: "#fef2f2",
                color: "#991b1b",
                timerProgressBar: true,
            });
        }
    };

    return (
        <div className="w-screen h-screen flex flex-col items-center justify-center p-8 bg-primary">
            <div className="absolute top-6 left-8">
                <Link
                    to="/"
                    className="text-white text-lg font-bold mb-4 flex items-center"
                >
                    <ArrowBack fontSize="small" className="mr-1"/>
                    Volver al mapa
                </Link>
            </div>
            <div className="flex items-center mb-8 gap-2">
                <LocationOn className="text-secondary" sx={{ fontSize: { xs: 50, sm: 60 } }} />
                <h1 className="font-bold text-white text-4xl laptop:text-5xl">OpenParking</h1>
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

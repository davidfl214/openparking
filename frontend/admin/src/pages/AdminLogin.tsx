import { useContext, useState } from "react";
import Swal from "sweetalert2";
import { DataContext } from "../context/DataContext";
import { useNavigate } from "react-router-dom";
import { LocationOn } from "@mui/icons-material";
import { TextField, Button } from "@mui/material";

export default function AdminLogin() {
    const AUTH_MICROSERVICE_BASE_URL =
        import.meta.env.VITE_AUTH_MICROSERVICE_URL || "http://localhost:8080";

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { isMobile } = useContext(DataContext);

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
                }
            );

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Error en el login");
            }

            if (data.role === "ADMIN") {
                document.cookie = `jwt=${data.token}; path=/; max-age=86400; secure; samesite=Strict`;

                Swal.fire({
                    toast: true,
                    position: isMobile ? "top" : "top-end",
                    icon: "success",
                    title: "<strong>Inicio de sesión exitoso</strong>",
                    text: "Bienvenido al panel de administración",
                    showConfirmButton: false,
                    timer: 3000,
                    background: "#f0fdf4",
                    color: "#166534",
                    timerProgressBar: true,
                });
                navigate("/admin/dashboard");
            } else {
                throw new Error(
                    "No tienes permisos para acceder al panel de administración"
                );
            }
        } catch (err: any) {
            Swal.fire({
                toast: true,
                position: isMobile ? "top" : "top-end",
                icon: "error",
                title: "<strong>Error de inicio de sesión</strong>",
                text: err.message || null,
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
            <div className="flex items-center mb-8 gap-2">
                <LocationOn
                    className="text-secondary"
                    sx={{ fontSize: { xs: 50, sm: 60 } }}
                />
                <h1 className="font-bold text-white text-4xl laptop:text-5xl">
                    OpenParking - Admin
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
            </form>
        </div>
    );
}

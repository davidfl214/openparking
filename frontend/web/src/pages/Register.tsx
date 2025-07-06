import { useContext, useState } from "react";
import { TextField, Button } from "@mui/material";
import Swal from "sweetalert2";
import { LocationContext } from "../context/LocationContext";
import { Link, useNavigate} from "react-router-dom";
import { ArrowBack, LocationOn } from "@mui/icons-material";

export default function Register() {
    const { isMobile } = useContext(LocationContext);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();


    const AUTH_MICROSERVICE_BASE_URL =
        import.meta.env.VITE_AUTH_MICROSERVICE_URL || "http://localhost:8080";

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            console.log("Enviando datos de registro:", {
                name,
                email,
                password,
            });
            const response = await fetch(
                `${AUTH_MICROSERVICE_BASE_URL}/api/auth/register`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ name, email, password, }),
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(
                    errorData?.message ||
                        "Error intentando registrar el usuario"
                );
            }
            const data = await response.json();

            // ✅ Si hay token, lo guardamos y redirigimos
            if (data.token) {
                localStorage.setItem("jwt", data.token);
                console.log("Token guardado:", data.token);
                Swal.fire({
                    toast: true,
                    position: isMobile ? "top" : "top-end",
                    icon: "success",
                    title: "<strong>Registro exitoso</strong>",
                    text: "Usuario registrado correctamente. Ahora puedes iniciar sesión.",
                    showConfirmButton: false,
                    timer: 3000,
                    background: "#f0fdf4",
                    color: "#166534",
                    timerProgressBar: true,
                });console.log("Registro exitoso:", data);
                console.log("Redirigiendo a la página de inicio de sesión...")
                // Redirigir a la página de inicio de sesión
                navigate("/");
            } else {
                Swal.fire({
                    toast: true,
                    position: isMobile ? "top" : "top-end",
                    icon: "info",
                    title: "<strong>Registro exitoso</strong>",
                    text: "Usuario registrado correctamente. Ahora puedes iniciar sesión.",
                    showConfirmButton: false,
                    timer: 3000,
                    background: "#f0fdf4",
                    color: "#166534",
                    timerProgressBar: true,
                });
                console.log("Registro exitoso, pero no se recibió token:", data);
            }
        } catch (err: any) {
            Swal.fire({
                toast: true,
                position: isMobile ? "top" : "top-end",
                icon: "error",
                title: "<strong>Error de inicio de sesión</strong>",
                text: err.message || "Error intentando registrar el usuario",
                showConfirmButton: false,
                timer: 3000,
                background: "#fef2f2",
                color: "#991b1b",
                timerProgressBar: true,
            });
            console.error("Error al registrar el usuario:", err);
        }
    };

    return (
        <div className="w-screen h-screen flex flex-col items-center justify-center p-8 bg-primary">
            <div className="absolute top-4 left-4 laptop:top-6 laptop:left-8">
                <Link
                    to="/"
                    className="text-white text-lg font-bold mb-4 flex items-center"
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
                    label="Nombre"
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    value={name}
                    sx={{ m: 1 }}
                    onChange={(e) => setName(e.target.value)}
                />
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
                    Registrarse
                </Button>

                <p className="text-center text-gray-600 m-1">
                    ¿Ya tienes cuenta?{" "}
                    <Link
                        to="/login"
                        className="text-secondary hover:underline"
                    >
                        Inicia sesión
                    </Link>
                </p>
            </form>
        </div>
    );
}

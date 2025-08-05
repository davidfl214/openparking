import { useNavigate } from "react-router";
import validateToken from "../utils/validateToken";
import Swal from "sweetalert2";
import { useContext, useEffect, useState } from "react";
import { DataContext } from "../context/DataContext";
import { ClimbingBoxLoader } from "react-spinners";

export default function Dashboard() {
    const { isMobile } = useContext(DataContext);
    const navigate = useNavigate();
    const [checking, setChecking] = useState(true);

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
            }
        }
        checkAdmin();
    }, []);

    
    if (checking) {
        return (
            <div className="flex items-center justify-center h-screen bg-primary">
                <ClimbingBoxLoader color="white" size={25} />
            </div>
        )
    }

    return (
        <div>
            <h1>Dashboard</h1>
        </div>
    );
}

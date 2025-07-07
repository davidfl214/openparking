import { useState } from 'react';

export default function LoginAdmin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const res = await fetch('http://localhost:8080/api/admin/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Error en el login");
            }

            if (data.role === 'ADMIN') {
                // Guardar el token en cookie
                document.cookie = `jwt=${data.token}; path=/; max-age=86400; secure; samesite=Strict`;

                alert("Bienvenido administrador");
                window.location.href = "/admin/dashboard"; // Redirección
            } else {
                alert("No tienes permisos de administrador");
            }

        } catch (err) {
            if (err instanceof Error) {
                alert("Error: " + err.message);
            } else {
                alert("Error desconocido");
            }
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Login Administrador</h2>
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Correo"
                required
            />
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Contraseña"
                required
            />
            <button type="submit">Iniciar sesión</button>
        </form>
    );
}
